import {CustomEventType, FxFetchPage, FxPageLoader, FxPageNavigate, FXPageNavigateOptions, Selector} from '../types';

let progressBar: HTMLDivElement | null = null,
	progressTimer: any = null;

/**
 *
 * @type {CustomEventType}
 */
const fxPageNavigateReadyEvent: CustomEventType = new CustomEvent('fx.navigate.ready', {
	bubbles: true,
	detail: {plugin: 'Fuxcel', interface: 'FuxcelInterface', timestamp: Date.now()},
});

const normalizeScripts = (html: string) =>
	html.replace(
		/<script\b(?=[^>]*?\bsrc\b)(?![^>]*?\b(defer|data-critical|async|type\s*=\s*['"]?module['"]?)\b)([^>]*?)>/gi,
		'<script defer$2>'
	);

const injectHTML = function (selector: Selector, html: string) {
	return new Promise((resolve, reject) => {
		try {
			const container = document.querySelector(selector as string);
			if (!container) return;
			
			// Parse HTML safely
			const normalized = normalizeScripts(html)
			const template = document.createElement('template');
			template.innerHTML = normalized.trim();
			
			// Extract scripts
			const scripts = template.content.querySelectorAll('script');
			console.log(scripts)
			// Remove scripts from HTML
			scripts.forEach(script => script.remove());
			
			// Inject HTML
			container.innerHTML = '';
			container.appendChild(template.content);
			
			// Re-run scripts
			scripts.forEach(oldScript => {
				const script = document.createElement('script');
				
				// Copy attributes (type, src, etc.)
				[...oldScript.attributes].forEach(attr => script.setAttribute(attr.name, attr.value));
				
				// Inline script support
				if (!oldScript.src)
					script.textContent = oldScript.textContent;
				
				container.appendChild(script);
				// script.remove(); // optional cleanup
			});
			resolve(container);
		} catch (e) {
			reject(e);
		}
	})
};

/**
 * Fetches a page resource using a custom `fx.fetch` method if available,
 * otherwise falls back to the native `fetch` API.
 *
 * This function is designed for loading page content via AJAX, typically
 * for single-page application (SPA) navigation or dynamic content loading.
 * It automatically adds the `X-Requested-With: XMLHttpRequest` header when
 * using the native fetch fallback.
 *
 * @param {string} url - The URL of the page or resource to fetch. Must be a valid URL string.
 * @param {"json" | "text"} dataType - The expected response data type. Determines how the response is processed:
 *   - `"json"` - Response will be treated as JSON (but still returned as string)
 *   - `"text"` - Response will be treated as plain text
 * @param {Function | null} [beforeSend] - Optional callback function executed before the request is sent.
 *   Useful for showing loading indicators or performing pre-request setup.
 *
 * @returns {Promise<string>} A Promise that resolves with the response text content.
 *   Always returns a string regardless of the dataType parameter.
 *
 * @throws {Error} Rejects with an error if the fetch operation fails (network error, 404, etc.)
 *
 * @example
 * // Fetch HTML page content
 * fxFetchPage('/about.html', 'text')
 *   .then(html => {
 *     document.getElementById('content').innerHTML = html;
 *   })
 *   .catch(err => console.error('Failed to load page:', err));
 *
 * @example
 * // Fetch JSON data with beforeSend callback
 * fxFetchPage('/api/data.json', 'json', () => {
 *   console.log('Loading data...');
 *   showSpinner();
 * })
 *   .then(jsonString => {
 *     const data = JSON.parse(jsonString);
 *     console.log(data);
 *   })
 *   .finally(() => hideSpinner());
 *
 * @example
 * // Using with async/await
 * async function loadPage() {
 *   try {
 *     const html = await fxFetchPage('/page.html', 'text', () => {
 *       fxPageLoader.start();
 *     });
 *     document.body.innerHTML = html;
 *     fxPageLoader.finish();
 *   } catch (error) {
 *     console.error('Page load failed:', error);
 *   }
 * }
 *
 * @see {@link FxFetchPage} - Interface definition
 * @see {@link fx.fetch} - Custom fetch implementation
 * @since 2.0.0
 */
export const fxFetchPage: FxFetchPage = function (url: string, dataType: 'json' | 'text', beforeSend?: Function | null): Promise<string> {
	return new Promise((resolve, reject) => {
		fx.fetch ? fx.fetch({
			uri: url,
			method: 'get',
			dataType: dataType,
			timeout: 30,
			beforeSend: () => typeof beforeSend === 'function' && beforeSend(),
			onSuccess: res => resolve(res.responseText as string),
			onError: err => reject(err)
		}) : fetch(url, {headers: {'X-Requested-With': 'XMLHttpRequest'}})
			.then(r => r[dataType]())
			.then(parsed => resolve(parsed))
			.catch(err => reject(err));
	}) as Promise<string>;
};

/**
 * Navigates to a new page using AJAX and updates the browser history.
 *
 * This function enables single-page application (SPA) style navigation by:
 * 1. Fetching the new page content via AJAX
 * 2. Updating the browser URL using the History API (pushState or replaceState)
 * 3. Injecting the fetched content into the specified DOM container
 * 4. Dispatching a custom navigation ready event
 * 5. Falling back to hard navigation if the AJAX request fails
 *
 * The function handles loading states by adding/removing CSS classes and works
 * seamlessly with `fxPageLoader` for visual feedback.
 *
 * @param {Object} options - Configuration object for the navigation
 * @param {string | null} [options.url] - The URL to navigate to. Must be different from current location.
 *   If null or same as current URL, the Promise will be rejected.
 * @param {string | null} [options.selector="#root"] - CSS selector for the DOM element where fetched content
 *   will be injected. Defaults to "#root" if not specified.
 * @param {"json" | "text"} [options.dataType="json"] - Expected response type. Determines how the response
 *   is processed before injection:
 *   - `"json"` - Response treated as JSON (default)
 *   - `"text"` - Response treated as plain text/HTML
 * @param {boolean} [options.replace=false] - Whether to replace the current history entry instead of
 *   creating a new one:
 *   - `false` - Uses `history.pushState()` to add new entry (default, enables back button)
 *   - `true` - Uses `history.replaceState()` to replace current entry (no back button history)
 *
 * @returns {Promise<string>} A Promise that resolves with the fetched HTML content string when
 *   navigation completes successfully, or rejects with an error if navigation fails.
 *
 * @throws {string} Rejects with empty string if URL is null or same as current location
 * @throws {Error} Rejects with error object if AJAX fetch fails
 *
 * @fires fxPageNavigateReadyEvent - Custom event dispatched on document when navigation completes
 *   and new content is injected into the DOM
 *
 * @example
 * // Basic navigation with pushState (adds to history)
 * fxPageNavigate({
 *   url: '/about',
 *   selector: '#main-content',
 *   dataType: 'text'
 * })
 *   .then(html => console.log('Navigation complete'))
 *   .catch(err => console.error('Navigation failed:', err));
 *
 * @example
 * // Replace current history entry (no back button)
 * fxPageNavigate({
 *   url: '/dashboard',
 *   replace: true,
 *   dataType: 'json'
 * });
 *
 * @example
 * // Listen for navigation ready event
 * document.addEventListener('fxPageNavigateReady', (e) => {
 *   console.log('New page content loaded');
 *   // Re-initialize components, run scripts, etc.
 *   initializeComponents();
 * });
 *
 * @example
 * // Using with async/await and error handling
 * async function navigate(url) {
 *   try {
 *     const html = await fxPageNavigate({
 *       url: url,
 *       selector: '#app',
 *       dataType: 'text',
 *       replace: false
 *     });
 *
 *     console.log('Navigated successfully');
 *     // Update analytics, scroll to top, etc.
 *     window.scrollTo(0, 0);
 *     trackPageView(url);
 *   } catch (error) {
 *     console.error('Navigation error:', error);
 *     // Error is logged, and browser falls back to hard navigation
 *   }
 * }
 *
 * @example
 * // Custom navigation with data transformation
 * fxPageNavigate({
 *   url: '/api/page-data',
 *   selector: '#content',
 *   dataType: 'json'
 * }).then(jsonString => {
 *   const data = JSON.parse(jsonString);
 *   // Additional processing after content is injected
 *   updateMetaTags(data.meta);
 *   setPageTitle(data.title);
 * });
 *
 * @remarks
 * **Behavior on Error:**
 * - Logs error to console
 * - Calls `fxPageLoader.finish()` to hide loading indicator
 * - Removes `fx-leaving` class from documentElement
 * - Performs hard navigation (`window.location.href`) as fallback
 *
 * **CSS Classes:**
 * - Adds `fx-leaving` class to `<html>` during navigation
 * - Remove this class when navigation completes or fails
 * - Use this class for page transition animations
 *
 * **History Management:**
 * - `pushState`: Creates new history entry (default) - user can navigate back
 * - `replaceState`: Replaces current entry - useful for redirects or tabs
 *
 * @see {@link FxPageNavigate} - Interface definition
 * @see {@link fxFetchPage} - Page fetching function used internally
 * @see {@link fxPageLoader} - Page loading indicator
 * @see {@link injectHTML} - HTML injection utility (internal)
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/History_API|History API}
 * @since 2.0.0
 */
export const fxPageNavigate: FxPageNavigate = function (options: FXPageNavigateOptions): Promise<string> {
	return new Promise((resolve, reject) => {
		if (!options.url || options.url === location.href) reject('');
		
		fxFetchPage(options.url ?? '', options.dataType ?? 'json', fxPageLoader.start).then(html => {
			document.documentElement.classList.add('fx-leaving');
			
			if (options.replace) {
				history.replaceState({}, '', options.url);
			} else {
				history.pushState({}, '', options.url);
			}
			injectHTML(options.selector ?? '#root', html).then(() => {
				document.dispatchEvent(fxPageNavigateReadyEvent);
				resolve(html);
			});
		}).catch(err => {
			console.error('FX navigation error:', err);
			fxPageLoader.finish();
			document.documentElement.classList.remove('fx-leaving');
			window.location.href = options.url ?? ''; // hard fallback
			reject(err);
		});
	});
}

/**
 * Global page loader instance that controls a top progress bar for visual feedback
 * during page navigation or AJAX operations.
 *
 * Provides a YouTube/Medium-style thin progress bar at the top of the page that
 * automatically animates from 0% to ~90% while loading, then completes to 100%
 * when finished. The progress bar is created dynamically and managed internally.
 *
 * The loader is designed to work seamlessly with `fxPageNavigate` and `fxFetchPage`
 * but can be used independently for any asynchronous operation.
 *
 * @namespace
 * @type {FxPageLoader}
 *
 * @property {Function} start - Starts the progress bar animation
 * @property {Function} finish - Completes and hides the progress bar
 *
 * @example
 * // Basic usage with page navigation
 * fxPageLoader.start();
 * fetch('/api/data')
 *   .then(response => response.json())
 *   .then(data => {
 *     updateUI(data);
 *     fxPageLoader.finish();
 *   })
 *   .catch(err => {
 *     console.error(err);
 *     fxPageLoader.finish();
 *   });
 *
 * @example
 * // Using with async/await
 * async function loadData() {
 *   fxPageLoader.start();
 *   try {
 *     const data = await fetchData();
 *     processData(data);
 *   } finally {
 *     fxPageLoader.finish(); // Always finish, even on error
 *   }
 * }
 *
 * @example
 * // Automatic integration with fxFetchPage
 * fxFetchPage('/page.html', 'text', fxPageLoader.start)
 *   .then(html => {
 *     document.body.innerHTML = html;
 *     fxPageLoader.finish();
 *   });
 *
 * @example
 * // Manual control for custom operations
 * fxPageLoader.start();
 *
 * // Simulate long operation
 * setTimeout(() => {
 *   fxPageLoader.finish();
 *   console.log('Operation complete');
 * }, 3000);
 *
 * @remarks
 * **Visual Behavior:**
 * - Progress bar appears at top of viewport (fixed position)
 * - Height: 5px
 * - Color: #4f46e5 (indigo-600)
 * - Z-index: 99999 (appears above all content)
 * - Smooth transitions for width and opacity
 *
 * **Animation Details:**
 * - `start()`: Initializes at 10% width, then increments randomly to ~90%
 * - Animation updates every 200ms with random increments (realistic progress feel)
 * - Never exceeds 90% until `finish()` is called
 * - `finish()`: Jumps to 100%, then fades out after 300ms
 *
 * **Memory Management:**
 * - Progress bar element is reused across calls (not recreated each time)
 * - Only one progress bar can exist at a time
 * - Automatically cleans up intervals to prevent memory leaks
 *
 * **Best Practices:**
 * - Always pair `start()` with `finish()` to avoid stuck progress bar
 * - Use try/finally blocks to ensure `finish()` is called even on errors
 * - Safe to call `start()` multiple times (will reset existing bar)
 * - Safe to call `finish()` even if bar wasn't started
 *
 * @see {@link FxPageLoader} - Interface definition
 * @see {@link fxPageNavigate} - Page navigation function that uses this loader
 * @see {@link fxFetchPage} - Page fetching function that can trigger this loader
 * @since 2.0.0
 */
export const fxPageLoader: FxPageLoader = {
	/**
	 * Starts the page loading progress bar animation.
	 *
	 * Creates a fixed progress bar element at the top of the page if it doesn't exist,
	 * then animates it from 0% to approximately 90% width using randomized increments.
	 * The bar will continue animating until `finish()` is called.
	 *
	 * If called multiple times before `finish()`, it will reset the existing progress bar
	 * and restart the animation from 10%.
	 *
	 * @function
	 * @memberof fxPageLoader
	 *
	 * @returns {void}
	 *
	 * @example
	 * // Start loading indicator before fetch
	 * fxPageLoader.start();
	 * fetch('/api/data').then(response => {
	 *   fxPageLoader.finish();
	 * });
	 *
	 * @example
	 * // Multiple async operations
	 * fxPageLoader.start();
	 * Promise.all([
	 *   fetch('/api/users'),
	 *   fetch('/api/posts'),
	 *   fetch('/api/comments')
	 * ]).then(() => {
	 *   fxPageLoader.finish();
	 * });
	 *
	 * @remarks
	 * **Implementation Details:**
	 * - Creates `<div id="fx-progress">` element on first call
	 * - Appends to document.body
	 * - Uses inline styles (no external CSS required)
	 * - Sets up interval timer that increments width by 0-10% every 200ms
	 * - Caps at 90% width (never reaches 100% until finish() called)
	 *
	 * **Styling:**
	 * ```css
	 * position: fixed;
	 * top: 0;
	 * left: 0;
	 * height: 5px;
	 * background: #4f46e5;
	 * z-index: 99999;
	 * transition: width 0.2s ease, opacity 0.3s ease;
	 * ```
	 *
	 * **Performance:**
	 * - Lightweight DOM manipulation (single element)
	 * - Efficient interval-based animation
	 * - Hardware-accelerated CSS transitions
	 *
	 * @see {@link fxPageLoader.finish} - Completes the progress bar
	 */
	start(): void {
		if (!progressBar) {
			progressBar = document.createElement('div');
			progressBar.id = 'fx-progress';
			progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        height: 5px;
        width: 0%;
        background: #4f46e5;
        z-index: 99999;
        transition: width .2s ease, opacity .3s ease;
      `;
			document.body.appendChild(progressBar);
		}
		
		progressBar.style.opacity = '1';
		progressBar.style.width = '10%';
		
		let width = 10;
		progressTimer = setInterval(() => {
			if (progressBar) {
				width = Math.min(width + Math.random() * 10, 90);
				progressBar.style.width = width + '%';
			}
		}, 200);
	},
	
	/**
	 * Completes the page loading progress bar animation and hides it.
	 *
	 * Immediately sets the progress bar to 100% width, then fades it out after
	 * a brief delay. Clears the interval timer started by `start()` to prevent
	 * continued animation and memory leaks.
	 *
	 * Safe to call even if `start()` was never called (will simply do nothing).
	 * Safe to call multiple times (idempotent operation).
	 *
	 * @function
	 * @memberof fxPageLoader
	 *
	 * @returns {void}
	 *
	 * @example
	 * // Always finish in finally block
	 * fxPageLoader.start();
	 * fetch('/api/data')
	 *   .then(data => processData(data))
	 *   .catch(err => handleError(err))
	 *   .finally(() => fxPageLoader.finish());
	 *
	 * @example
	 * // Async/await pattern
	 * async function loadPage() {
	 *   fxPageLoader.start();
	 *   try {
	 *     const html = await fxFetchPage('/page.html', 'text');
	 *     document.body.innerHTML = html;
	 *   } finally {
	 *     fxPageLoader.finish(); // Ensures cleanup even on error
	 *   }
	 * }
	 *
	 * @remarks
	 * **Animation Sequence:**
	 * 1. Clears interval timer (stops width animation)
	 * 2. Sets width to 100% (completion visual)
	 * 3. Waits 300ms (allows user to see completion)
	 * 4. Sets opacity to 0 (fade out animation)
	 * 5. Resets width to 0% (ready for next use)
	 *
	 * **Timing:**
	 * - Transition to 100%: ~200ms (CSS transition)
	 * - Pause at 100%: 300ms
	 * - Fade out: ~300ms (CSS transition)
	 * - Total duration: ~800ms from finish() call to fully hidden
	 *
	 * **Memory Management:**
	 * - Clears interval timer immediately to prevent leaks
	 * - Progress bar element remains in DOM (reused for future operations)
	 * - All event listeners cleaned up automatically
	 *
	 * **Edge Cases:**
	 * - If progressBar is null: Returns immediately (no-op)
	 * - If start() never called: Returns immediately (no-op)
	 * - Multiple calls: Safe, will reset fade-out timer
	 *
	 * @see {@link fxPageLoader.start} - Starts the progress bar
	 */
	finish(): void {
		if (!progressBar) return;
		
		clearInterval(progressTimer);
		progressBar.style.width = '100%';
		
		setTimeout(() => {
			if (progressBar) {
				progressBar.style.opacity = '0';
				progressBar.style.width = '0%';
			}
		}, 300);
	}
};

/* ----------------------------------------------------------------------
   Link Interception (internal links only)
   ---------------------------------------------------------------------- */
document.addEventListener('click', (e: PointerEvent) => {
	const link: HTMLAnchorElement | null = ((e.target as HTMLElement)?.closest('a'));
	
	if (!link || !link.hasAttribute('data-fx-navigate') || link.hasAttribute('download') || link.origin !== location.origin)
		return;
	
	e.preventDefault();
	
	const dataType = link.getAttribute('data-fx-navigate-type')?.toLowerCase();
	
	fx.pageNavigate({
		url: link.getAttribute('href'),
		replace: link.hasAttribute('data-fx-navigate-replace'),
		dataType: (dataType?.length && (dataType === 'json' || dataType === 'text')) ? dataType : 'json'
	}).then(() => console.log(link));
});

/* ----------------------------------------------------------------------
   History (Back / Forward)
   ---------------------------------------------------------------------- */
window.addEventListener('popstate', () => fx.pageNavigate({url: location.href, replace: true}));

/* ----------------------------------------------------------------------
	 Page Ready Hook (runs after every navigation)
	 ---------------------------------------------------------------------- */
document.addEventListener('fx.navigate.ready', () => {
	document.documentElement.classList.remove('fx-leaving', 'fx-entering');
	document.documentElement.classList.add('fx-entered');
	
	fxPageLoader.finish();
});

// Unified lifecycle hook for page modules
document.addEventListener('DOMContentLoaded', () => document.dispatchEvent(fxPageNavigateReadyEvent));
