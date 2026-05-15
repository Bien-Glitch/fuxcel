'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

let progressBar = null, progressTimer = null;
/**
 *
 * @type {CustomEventType}
 */
const fxPageNavigateReadyEvent = new CustomEvent('fx.navigate.ready', {
    bubbles: true,
    detail: { plugin: 'Fuxcel', interface: 'FuxcelInterface', timestamp: Date.now() },
});
const normalizeScripts = (html) => html.replace(/<script\b(?=[^>]*?\bsrc\b)(?![^>]*?\b(defer|data-critical|async|type\s*=\s*['"]?module['"]?)\b)([^>]*?)>/gi, '<script defer$2>');
const injectHTML = function (selector, html) {
    return new Promise((resolve, reject) => {
        try {
            const container = document.querySelector(selector);
            if (!container)
                return;
            // Parse HTML safely
            const normalized = normalizeScripts(html);
            const template = document.createElement('template');
            template.innerHTML = normalized.trim();
            // Extract scripts
            const scripts = template.content.querySelectorAll('script');
            console.log(scripts);
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
        }
        catch (e) {
            reject(e);
        }
    });
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
const fxFetchPage = function (url, dataType, beforeSend) {
    return new Promise((resolve, reject) => {
        fx.fetch ? fx.fetch({
            uri: url,
            method: 'get',
            dataType: dataType,
            timeout: 30,
            beforeSend: () => typeof beforeSend === 'function' && beforeSend(),
            onSuccess: res => resolve(res.responseText),
            onError: err => reject(err)
        }) : fetch(url, { headers: { 'X-Requested-With': 'XMLHttpRequest' } })
            .then(r => r[dataType]())
            .then(parsed => resolve(parsed))
            .catch(err => reject(err));
    });
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
const fxPageNavigate = function (options) {
    return new Promise((resolve, reject) => {
        if (!options.url || options.url === location.href)
            reject('');
        fxFetchPage(options.url ?? '', options.dataType ?? 'json', fxPageLoader.start).then(html => {
            document.documentElement.classList.add('fx-leaving');
            if (options.replace) {
                history.replaceState({}, '', options.url);
            }
            else {
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
};
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
const fxPageLoader = {
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
    start() {
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
    finish() {
        if (!progressBar)
            return;
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
document.addEventListener('click', (e) => {
    const link = (e.target?.closest('a'));
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
window.addEventListener('popstate', () => fx.pageNavigate({ url: location.href, replace: true }));
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

// ─── Type Guards & Helpers ────────────────────────────────────────────────────
/**
 * Checks if the given value is of type boolean.
 */
const isBool = (value) => typeof value === 'boolean';
/**
 * Checks if the given value is defined (not null, not undefined, not empty string).
 */
const isDefined = (value) => value !== undefined && value !== null && value !== '';
/**
 * Checks if the given value is of type function.
 */
const isFunction = (value) => typeof value === 'function';
/**
 * Checks if the given value is of type object.
 */
const isObject = (value) => typeof value === 'object';
/**
 * Checks if the given value is of type string.
 */
const isString = (value) => typeof value === 'string';
/**
 * Parse the given value and get its boolean equivalent.
 *
 * Handles: `true, 'true', 1, '1', 'on', 'yes'` → `true`
 *
 * Everything else → `false.`
 */
const parseBool = (value) => {
    switch (isString(value) ? value.toString().toLowerCase() : value) {
        case true:
        case 'true':
        case 1:
        case '1':
        case 'on':
        case 'yes':
            return true;
        default:
            return false;
    }
};
/**
 * Expose one or more properties onto the global `window` object.
 *
 * @param prop {string | Record<string, any>} Property to expose.
 * @param value {any = null} Value of the property.
 */
function pushPropsToWindow(prop, value = null) {
    if (typeof window !== 'undefined') {
        if (typeof prop === 'object' && prop !== null)
            Object.assign(window, prop);
        else
            window[prop] = value;
    }
}
String.prototype.toTitleCase = function (separators = false) {
    const value = this;
    let titleCased = '';
    const valueSplit = value.split(separators ? /([ _-])/gi : /[ _-]/gi);
    valueSplit.forEach((word, key) => {
        const wordSplit = word.toLowerCase().split('');
        const firstChar = wordSplit[0];
        wordSplit[0] = wordSplit[0] ? firstChar.toUpperCase() : '';
        titleCased += separators
            ? wordSplit.join('')
            : (wordSplit.join('') + (key <= valueSplit.length - 1 ? ' ' : ''));
    });
    return String(titleCased.trim());
};
// ─── Custom Error ─────────────────────────────────────────────────────────────
class TimeoutError extends Error {
    status;
    code;
    constructor(message = 'Request timed out', status = 408, code = 'ETIMEDOUT') {
        super(message);
        this.name = 'TimeoutError';
        this.status = status;
        this.code = code;
    }
}

/**
 * Base class for the Fuxcel selector engine.
 * Handles element selection, array conversion, and static device helpers.
 */
class FuxcelBase {
    length = 0;
    prev = { length: 0 };
    constructor(selector, context) {
        const INSTANCE = this;
        const selectedElements = init();
        const documentDOMArray = INSTANCE.#_toArray(document);
        documentDOMArray.forEach((value, key) => {
            INSTANCE.prev[key] = value;
            INSTANCE.prev.length++;
        });
        selectedElements && selectedElements.forEach((value, key) => {
            INSTANCE[key] = value;
            INSTANCE.length++;
        });
        function init() {
            let selected;
            try {
                const _context = (context && (isString(context)
                    ? INSTANCE.#_toArray(document.querySelector(context))
                    : INSTANCE.#_toArray(context))[0]);
                if (INSTANCE.#_isHTMLElement(selector) || INSTANCE.#_isIterable(selector)) {
                    const target = INSTANCE.#_toArray(selector);
                    if (context) {
                        if (target.length) {
                            target.forEach((value) => (value.dataset.fuxcelTempId = 'fuxcel-temp-selector'));
                            selected = _context.querySelectorAll('[data-fuxcel-temp-id="fuxcel-temp-selector"]');
                            target.forEach((value) => delete value.dataset.fuxcelTempId);
                            return selected;
                        }
                    }
                    return target;
                }
                return context && _context ?
                    _context.querySelectorAll(selector) :
                    document.querySelectorAll(selector);
            }
            catch (e) {
                console.trace(e);
            }
        }
        return INSTANCE;
    }
    // ─── Private Static Helpers ───────────────────────────────────────────────
    static get #_getCurrentScriptFilename() {
        try {
            throw new Error();
        }
        catch (e) {
            if (e instanceof Error) {
                const stackLines = e.stack?.split('\n');
                if (stackLines?.length) {
                    const filtered = stackLines.filter(l => l.includes('#_getCurrentScriptFilename'));
                    const split = filtered?.length ? filtered[0].split('/') : [];
                    if (split.length) {
                        const nameParts = (split[split.length - 1]).split(':');
                        return nameParts.length ? nameParts[0] : null;
                    }
                }
            }
        }
        return null;
    }
    static get #_getCurrentScriptSrc() {
        const scripts = Array.from(document.scripts);
        for (const script of scripts) {
            const src = script.getAttribute('src');
            const srcSplit = src?.split(/[\\/]/gi);
            const name = srcSplit?.length ? srcSplit[srcSplit.length - 1] : null;
            if (FuxcelBase.#_getCurrentScriptFilename && name)
                if (FuxcelBase.#_getCurrentScriptFilename.toLowerCase() === name.toLowerCase())
                    return src?.toLocaleLowerCase();
        }
    }
    static get #_constructors() {
        return {
            html: ['html'],
            iterable: [
                'bsutilities', 'fuxcel', 'fuxcelbase', 'fuxcelmodal',
                'fuxcelsteps', 'fuxcelvalidator', 'jquery',
                'nodelist', 'object', 's', 'collection',
            ],
        };
    }
    // ─── Private Instance Helpers ─────────────────────────────────────────────
    #_isIterable(element) {
        return (!!FuxcelBase.#_constructors.iterable.filter(v => element.constructor.name.toLowerCase().includes('collection') ||
            v === element.constructor.name.toLowerCase()).length || Array.isArray(element));
    }
    #_isHTMLElement(element) {
        return !!FuxcelBase.#_constructors.html.filter(v => element.constructor.name.toLowerCase().includes(v)).length;
    }
    #_toArray(element) {
        return this.#_isIterable(element) ? Array.from(element) : [element];
    }
    // ─── Public Getters ───────────────────────────────────────────────────────
    /** Guesses the directory path of the current script file. */
    static get guessPath() {
        const fullPath = FuxcelBase.#_getCurrentScriptSrc;
        const parts = fullPath?.split(/[\\/]/gi);
        parts?.splice(parts.length - 1);
        return parts?.join('/') ?? null;
    }
    /** Returns previous object context. */
    get prevObj() {
        return this.prev;
    }
    /** Returns the selected element(s) as a plain array. */
    get toArray() {
        return this.#_toArray(this);
    }
    // ─── Static Device Helpers ────────────────────────────────────────────────
    /** `true` if the current device is a mobile device. **/
    static get isMobileDevice() {
        return navigator.userAgent.toLowerCase().includes('mobile');
    }
    /** `true` if the pointer is coarse (touch). **/
    static get pointerIsTouch() {
        return window.matchMedia('(pointer: coarse)').matches;
    }
}

/**
 * Returns a map of all supported Web Animations API keyframe definitions,
 * parametrized by duration, iteration count, and display value.
 */
const animations = ({ timeout = 300, iterations = 1, display = 'unset', }) => ({
    blink: {
        name: 'blink',
        onBegin: {},
        onFinished: {},
        options: {
            keyFrames: [
                { opacity: 1 }, { opacity: 0.8 }, { opacity: 0.5 },
                { opacity: 0.3 }, { opacity: 0.1 }, { opacity: 0.3 },
                { opacity: 0.5 }, { opacity: 0.8 }, { opacity: 1 },
            ],
            timing: { duration: timeout, iterations },
        },
    },
    fadeIn: {
        name: 'fadein',
        onBegin: { display },
        onFinished: {},
        options: {
            keyFrames: [{ opacity: 0 }, { opacity: 1 }],
            timing: { duration: timeout, iterations },
        },
    },
    fadeOut: {
        name: 'fadeout',
        onBegin: { display },
        onFinished: { display: 'none' },
        options: {
            keyFrames: [{ opacity: 1 }, { opacity: 0 }],
            timing: { duration: timeout, iterations },
        },
    },
    slideInDown: {
        name: 'slideindown',
        onBegin: { display },
        onFinished: {},
        options: {
            keyFrames: [
                { transform: 'translate3d(0, 100%, 0)', visibility: 'hidden' },
                { transform: 'translate3d(0, 0, 0)', visibility: 'visible' },
            ],
            timing: { duration: timeout, iterations },
        },
    },
    slideInUp: {
        name: 'slideinup',
        onBegin: { display },
        onFinished: {},
        options: {
            keyFrames: [
                { transform: 'translate3d(0, -100%, 0)', visibility: 'hidden' },
                { transform: 'translate3d(0, 0, 0)', visibility: 'visible' },
            ],
            timing: { duration: timeout, iterations },
        },
    },
    slideOutDown: {
        name: 'slideoutdown',
        onBegin: { display },
        onFinished: { display: 'none' },
        options: {
            keyFrames: [
                { transform: 'translate3d(0, 0, 0)', visibility: 'visible' },
                { transform: 'translate3d(0, 100%, 0)', visibility: 'hidden' },
            ],
            timing: { duration: timeout, iterations },
        },
    },
    slideOutUp: {
        name: 'slideoutup',
        onBegin: { display },
        onFinished: { display: 'none' },
        options: {
            keyFrames: [
                { transform: 'translate3d(0, 0, 0)', visibility: 'visible' },
                { transform: 'translate3d(0, -100%, 0)', visibility: 'hidden' },
            ],
            timing: { duration: timeout, iterations },
        },
    },
    slideInLeft: {
        name: 'slideinleft',
        onBegin: { display },
        onFinished: {},
        options: {
            keyFrames: [
                { transform: 'translate3d(-100%, 0, 0)', visibility: 'visible' },
                { transform: 'translate3d(0, 0, 0)' },
            ],
            timing: { duration: timeout, iterations },
        },
    },
    slideInRight: {
        name: 'slideinright',
        onBegin: { display },
        onFinished: {},
        options: {
            keyFrames: [
                { transform: 'translate3d(100%, 0, 0)', visibility: 'visible' },
                { transform: 'translate3d(0, 0, 0)' },
            ],
            timing: { duration: timeout, iterations },
        },
    },
    slideOutLeft: {
        name: 'slideoutleft',
        onBegin: { display },
        onFinished: { display: 'none' },
        options: {
            keyFrames: [
                { transform: 'translate3d(0, 0, 0)' },
                { visibility: 'hidden', transform: 'translate3d(-100%, 0, 0)' },
            ],
            timing: { duration: timeout, iterations },
        },
    },
    slideOutRight: {
        name: 'slideoutright',
        onBegin: { display },
        onFinished: { display: 'none' },
        options: {
            keyFrames: [
                { transform: 'translate3d(0, 0, 0)' },
                { visibility: 'hidden', transform: 'translate3d(100%, 0, 0)' },
            ],
            timing: { duration: timeout, iterations },
        },
    },
    spaceLettersBig: {
        name: 'spacelettersbig',
        onBegin: {},
        onFinished: { marginRight: '50px' },
        options: {
            keyFrames: [{ marginRight: 0 }, { marginRight: '50px' }],
            timing: { duration: timeout, iterations },
        },
    },
    spaceLettersSmall: {
        name: 'spaceletterssmall',
        onBegin: {},
        onFinished: { marginRight: '3px' },
        options: {
            keyFrames: [{ marginRight: '3px' }, { marginRight: '3px' }],
            timing: { duration: timeout, iterations },
        },
    },
    staticShake: {
        name: 'staticshake',
        onBegin: {},
        onFinished: { transform: 'scale(1)' },
        options: {
            keyFrames: [
                { transform: 'scale(1)' },
                { transform: 'scale(1.02)' },
                { transform: 'scale(1.04)' },
                { transform: 'scale(1.02)' },
                { transform: 'scale(1)' },
                { transform: 'scale(1.02)' },
                { transform: 'scale(1.04)' },
                { transform: 'scale(1.02)' },
                { transform: 'scale(1)' }
            ],
            timing: { duration: timeout, iterations },
        },
    },
    unspaceLetters: {
        name: 'unspaceletters',
        onBegin: {},
        onFinished: { marginRight: 0 },
        options: {
            keyFrames: [{ marginRight: 0 }],
            timing: { duration: timeout, iterations },
        },
    },
    zoomIn: {
        name: 'zoomin',
        onBegin: {},
        onFinished: { width: 'inherit', height: 'inherit' },
        options: {
            keyFrames: [
                { width: '500px', height: '500px' },
                { width: '150px', height: '150px' },
            ],
            timing: { duration: timeout, iterations },
        },
    },
});

/**
 * Core Fuxcel class.
 * Wraps one or more DOM elements and exposes a fluent, chainable API for
 * DOM manipulation, traversal, event handling, and animations.
 */
class Fuxcel extends FuxcelBase {
    static #_buttonLoaderClass = '.btn-loader';
    static #_pluginPath = FuxcelBase.guessPath;
    /**
     * Injectable factory for FuxcelValidator.
     * Populated by index.ts after all modules are loaded, avoiding circular imports.
     * @internal
     */
    static _validatorFactory = null;
    /**
     * Injectable factory for FuxcelModal.
     * Populated by index.ts after all modules are loaded, avoiding circular imports.
     * @internal
     */
    static _modalFactory = null;
    /**
     * Injectable fxFetch function.
     * Populated by index.ts — avoids circular imports between Fuxcel and http/fxFetch.
     * @internal
     */
    static _fxFetch = null;
    constructor(selector, context) {
        super(selector, context);
    }
    // ─── Private Helpers ──────────────────────────────────────────────────────
    #_formatDataAttrib(name) {
        let replaced = '';
        const nameSplit = name.toString().split('-');
        nameSplit.forEach((split, idx) => {
            if (idx) {
                const chars = split.split('');
                chars[0] = chars[0].toUpperCase();
                replaced += chars.join('');
            }
        });
        return `${nameSplit[0]}${replaced}`;
    }
    #_setAttrib(name, value) {
        const selected = this.toArray;
        if (isString(name) && (isString(value) || isDefined(value))) {
            selected.forEach((el) => el.setAttribute(name, value));
        }
        else if (isObject(name)) {
            Object.keys(name).forEach(k => selected.forEach((el) => el.setAttribute(k, name[k])));
        }
        else {
            throw (isString(name)
                ? `Argument for \`name\` expects a String or an Object in \`attrib()\`. ${typeof name} given.`
                : `\`attrib()\` expects 1-2 arguments. None given.`);
        }
        return this;
    }
    #_setDataAttrib(name, value) {
        const selected = this.toArray;
        if (isString(name) && (isString(value) || isDefined(value))) {
            selected.forEach((el) => (el.dataset[name] = value));
        }
        else if (isObject(name)) {
            Object.keys(name).forEach(k => selected.forEach((el) => (el.dataset[k] = name[k])));
        }
        else {
            throw (isString(name)
                ? `Argument for \`name\` expects a String or an Object in \`dataAttrib()\`. ${typeof name} given.`
                : `\`dataAttrib()\` expects 1-2 arguments. None given.`);
        }
        return this;
    }
    #_setPrev(prevObj) {
        this.prev = new Fuxcel(prevObj);
        return this;
    }
    #_setProp(name, value) {
        const selected = this.toArray;
        if (isString(name) && (isString(value) || isBool(value) || isDefined(value))) {
            selected.forEach((el) => (el[name] = value));
        }
        else if (isObject(name)) {
            Object.keys(name).forEach(k => selected.forEach((el) => (el[k] = name[k])));
        }
        else {
            throw (isString(name)
                ? `Argument for \`name\` expects a String or an Object in \`prop()\`. ${typeof name} given.`
                : `\`prop()\` expects 1-2 arguments. None given.`);
        }
        return this;
    }
    #_setStyle(name, value) {
        const selected = this.toArray;
        if (isString(name) && (isString(value) || isBool(value) || isDefined(value))) {
            selected.forEach((el) => (el.style[name] = value));
        }
        else if (isObject(name)) {
            Object.keys(name).forEach(k => selected.forEach((el) => (el.style[k] = name[k])));
        }
        else {
            throw (isString(name)
                ? `Argument for \`name\` expects a String or an Object in \`prop()\`. ${typeof name} given.`
                : `\`prop()\` expects 1-2 arguments. None given.`);
        }
        return this;
    }
    // ─── Animation Engine ─────────────────────────────────────────────────────
    /**
     * Perform given animation.
     *
     * @param animation {FXAnimationOptions}
     * @private
     * @return {Promise<Fuxcel>}
     */
    #_animate(animation) {
        const selected = this.toArray;
        return new Promise(resolve => selected.forEach((element) => {
            Object.keys(animation.onBegin).length && fx(element).style(animation.onBegin);
            element.animate(animation.options.keyFrames, animation.options.timing).finished.then(() => {
                Object.keys(animation.onFinished).length && fx(element).style(animation.onFinished);
                resolve(this);
            });
        }));
    }
    /**
     * Perform Fadeout animation on selected element.
     *
     * @param {string | number} timeout Animation duration.
     * @param {string | number} iteration Animation iteration count
     * @param {string} display Initial CSS display
     * @returns {Promise<Fuxcel>}
     */
    fadeout(timeout, iteration, display) {
        if (typeof timeout === 'string') {
            display = timeout;
            timeout = 300;
        }
        else if (timeout && typeof iteration === 'string') {
            display = iteration;
            iteration = 1;
        }
        return this.#_animate(animations({ timeout, iterations: iteration, display }).fadeOut);
    }
    /**
     * Perform Fadein animation on selected element.
     *
     * @param {string | number} timeout Animation duration.
     * @param {string | number} iteration Animation iteration count.
     * @param {string} display Initial CSS display.
     * @returns {Promise<Fuxcel>}
     */
    fadein(timeout, iteration, display) {
        if (typeof timeout === 'string') {
            display = timeout;
            timeout = 300;
        }
        else if (isDefined(timeout) && typeof iteration === 'string') {
            display = iteration;
            iteration = 1;
        }
        return this.#_animate(animations({ timeout, iterations: iteration, display }).fadeIn);
    }
    /**
     * Perform _Slidein-down_ animation on selected element.
     *
     * @param {string | number} timeout Animation duration.
     * @param {string | number} iteration Animation iteration count.
     * @param {string} display Initial CSS display.
     * @returns {Promise<Fuxcel>}
     */
    slideindown(timeout, iteration, display) {
        if (typeof timeout === 'string') {
            display = timeout;
            timeout = 300;
        }
        else if (timeout && typeof iteration === 'string') {
            display = iteration;
            iteration = 1;
        }
        return this.#_animate(animations({ timeout, iterations: iteration, display }).slideInDown);
    }
    /**
     * Perform _Slidein-up_ animation on selected element.
     *
     * @param {number | string} timeout Animation duration.
     * @param {number | string} iteration Animation iteration count.
     * @param {string} display Initial CSS display.
     * @returns {Promise<Fuxcel>}
     */
    slideinup(timeout, iteration, display) {
        if (typeof timeout === 'string') {
            display = timeout;
            timeout = 300;
        }
        else if (timeout && typeof iteration === 'string') {
            display = iteration;
            iteration = 1;
        }
        return this.#_animate(animations({ timeout, iterations: iteration, display }).slideInUp);
    }
    /**
     * Perform _Slideout-down_ animation on selected element.
     *
     * @param {number | string} timeout Animation duration.
     * @param {number | string} iteration Animation iteration count.
     * @param {string} display Initial CSS display.
     * @returns {Promise<Fuxcel>}
     */
    slideoutdown(timeout, iteration, display) {
        if (typeof timeout === 'string') {
            display = timeout;
            timeout = 300;
        }
        else if (timeout && typeof iteration === 'string') {
            display = iteration;
            iteration = 1;
        }
        return this.#_animate(animations({ timeout, iterations: iteration, display }).slideOutDown);
    }
    /**
     * Perform _Slideout-up_ animation on selected element.
     *
     * @param {string | number} timeout Animation duration.
     * @param {string | number} iteration Animation iteration count.
     * @param {string} display Initial CSS display.
     * @returns {Promise<Fuxcel>}
     */
    slideoutup(timeout, iteration, display) {
        if (typeof timeout === 'string') {
            display = timeout;
            timeout = 300;
        }
        else if (timeout && typeof iteration === 'string') {
            display = iteration;
            iteration = 1;
        }
        return this.#_animate(animations({ timeout, iterations: iteration, display }).slideOutUp);
    }
    /**
     * Perform _Slidein-left_ animation on selected element.
     *
     * @param {string | number} timeout Animation duration.
     * @param {string | number} iteration Animation iteration count.
     * @param {string} display Initial CSS display.
     * @returns {Promise<Fuxcel>}
     */
    slideinleft(timeout, iteration, display) {
        if (typeof timeout === 'string') {
            display = timeout;
            timeout = 300;
        }
        else if (timeout && typeof iteration === 'string') {
            display = iteration;
            iteration = 1;
        }
        return this.#_animate(animations({ timeout, iterations: iteration, display }).slideInLeft);
    }
    /**
     * Perform _Slideout-left_ animation on selected element.
     *
     * @param {string | number} timeout Animation duration.
     * @param {string | number} iteration Animation iteration count.
     * @param {string} display Initial CSS display.
     * @returns {Promise<Fuxcel>}
     */
    slideoutleft(timeout, iteration, display) {
        if (typeof timeout === 'string') {
            display = timeout;
            timeout = 300;
        }
        else if (timeout && typeof iteration === 'string') {
            display = iteration;
            iteration = 1;
        }
        return this.#_animate(animations({ timeout, iterations: iteration, display }).slideOutLeft);
    }
    /**
     * Perform _Slidein-right_ animation on selected element.
     *
     * @param {string | number} timeout Animation duration.
     * @param {string | number} iteration Animation iteration count.
     * @param {string} display Initial CSS display.
     * @returns {Promise<Fuxcel>}
     */
    slideinright(timeout, iteration, display) {
        if (typeof timeout === 'string') {
            display = timeout;
            timeout = 300;
        }
        else if (timeout && typeof iteration === 'string') {
            display = iteration;
            iteration = 1;
        }
        return this.#_animate(animations({ timeout, iterations: iteration, display }).slideInRight);
    }
    /**
     * Perform _Slideout-right_ animation on selected element.
     *
     * @param {string | number} timeout Animation duration.
     * @param {string | number} iteration Animation iteration count.
     * @param {string} display Initial CSS display.
     * @returns {Promise<Fuxcel>}
     */
    slideoutright(timeout, iteration, display) {
        if (typeof timeout === 'string') {
            display = timeout;
            timeout = 300;
        }
        else if (timeout && typeof iteration === 'string') {
            display = iteration;
            iteration = 1;
        }
        return this.#_animate(animations({ timeout, iterations: iteration, display }).slideOutRight);
    }
    /**
     * Perform _Blink_ animation on selected element.
     *
     * @param {string | number} timeout Animation duration.
     * @param {string | number} iteration Animation iteration count.
     * @param {string} display Initial CSS display.
     * @returns {Promise<Fuxcel>}
     */
    blink(timeout, iteration, display) {
        if (typeof timeout === 'string') {
            display = timeout;
            timeout = 300;
        }
        else if (timeout && typeof iteration === 'string') {
            display = iteration;
            iteration = 1;
        }
        return this.#_animate(animations({ timeout, iterations: iteration, display }).blink);
    }
    /**
     * Perform _Shake_ animation on selected element.
     *
     * @param {string | number} timeout Animation duration.
     * @param {string | number} iteration Animation iteration count.
     * @param {string} scale Initial CSS display.
     * @returns {Promise<Fuxcel>}
     */
    shake(timeout, iteration, scale) {
        if (typeof timeout === 'string') {
            scale = timeout;
            timeout = 500;
        }
        else if (timeout && typeof iteration === 'string') {
            scale = iteration;
            iteration = 1;
        }
        const shake = animations({ timeout, iterations: iteration }).staticShake;
        shake.onBegin = { ...shake.onBegin, ...(scale?.length ? { transform: `scale(${scale})` } : {}) };
        return this.#_animate(shake);
    }
    /**
     * Perform _Zoom-in_ animation on selected element.
     *
     * @param {string | number} timeout Animation duration.
     * @param {string | number} iteration Animation iteration count.
     * @param {string} display Initial CSS display.
     * @returns {Promise<Fuxcel>}
     */
    zoomin(timeout, iteration, display) {
        if (typeof timeout === 'string') {
            display = timeout;
            timeout = 300;
        }
        else if (timeout && typeof iteration === 'string') {
            display = iteration;
            iteration = 1;
        }
        return this.#_animate(animations({ timeout, iterations: iteration, display }).zoomIn);
    }
    // ─── Getters ──────────────────────────────────────────────────────────────
    /**
     * @return {DOMTokenList} The class list of an element.
     */
    get classes() {
        return this.toArray[0].classList;
    }
    /** Returns the `FieldAttributes` of the first selected element. */
    get fieldAttributes() {
        const selected = this.toArray;
        const field = selected[0];
        const fieldId = field.getAttribute('id')?.toLowerCase();
        const dataId = field.dataset.id;
        const fxName = field.dataset.fxName ?? (dataId?.length && fieldId?.endsWith(dataId) ?
            fieldId.replace(`_${dataId}`, '') :
            fieldId);
        return {
            id: fieldId,
            fxName,
            type: selected[0].getAttribute('type')?.toLowerCase() ?? null,
            fxId: selected[0].getAttribute('type')?.toLowerCase() ?? null,
            fxRole: selected[0].getAttribute('type')?.toLowerCase() ?? null,
            formId: selected[0].form?.id?.toLowerCase() ?? null,
        };
    }
    /**
     *  @return {Promise<boolean>} A promise with a boolean argument; true if the given element has the mouse focus; false otherwise.
     */
    get hasFocus() {
        const selected = this.toArray;
        const selector = FuxcelBase.pointerIsTouch ? ':focus' : ':hover';
        return new Promise(resolve => selected.forEach((el) => resolve(fx(el).matchSelector(selector))));
    }
    /**
     * @return {string} The Inner Text value of the given element.
     */
    get innerText() {
        return this.toArray[0].innerText;
    }
    /**
     * Set The Inner Text value of the given element.
     *
     * @param text {string} Text to set
     */
    set innerText(text) {
        this.toArray[0].innerText = text;
    }
    /**
     * @return {string} The Outer Text value of the given element.
     */
    get outerText() {
        return this.toArray[0].outerText;
    }
    /**
     * Set The Outer Text value of the given element.
     *
     * @param text {string} Text to set
     */
    set outerText(text) {
        this.toArray[0].outerText = text;
    }
    /**
     * @return {string} The Inner HTML value of the given element.
     */
    get innerHTML() {
        return this.toArray[0].innerHTML;
    }
    /**
     * @return {string} The Outer HTML value of the given element.
     */
    get outerHTML() {
        return this.toArray[0].outerHTML;
    }
    /**
     * @return {boolean} Returns true if the selected element has the disabled property; false otherwise.
     */
    get isDisabled() {
        return !!this.prop('disabled') || this.hasClass('disabled');
    }
    /**
     * @return {boolean} Returns true if the selected element is a form element.
     */
    get isFormElement() {
        const selected = this.toArray;
        if (typeof selected[0].cloneNode !== 'function')
            return false;
        try {
            const form = document.createElement('form');
            form.style.display = 'none';
            form.appendChild(selected[0].cloneNode(true));
            return form.elements.length > 0;
        }
        catch {
            return false;
        }
    }
    /**
     * Injectable fxModal function.
     * Populated by index.ts — avoids circular imports between Fuxcel and modal/fxModal.
     * @internal
     */
    static _fxModal = null;
    /** Returns a new `FuxcelValidator` bound to this element. */
    get formValidator() {
        /*const {FuxcelValidator} = require('../validator/FuxcelValidator');
        return new FuxcelValidator(this);*/
        if (!Fuxcel._validatorFactory)
            throw new Error('[Fuxcel] formValidator is not available yet. Ensure fuxcel/src/index.ts has been loaded.');
        return Fuxcel._validatorFactory(this);
    }
    /** Returns a new `FuxcelModal` bound to this element. */
    get modal() {
        /*const {FuxcelModal} = require('../modal/FuxcelModal');
        return new FuxcelModal(this);*/
        if (!Fuxcel._modalFactory)
            throw new Error('[Fuxcel] modal is not available yet. Ensure fuxcel/src/index.ts has been loaded.');
        return Fuxcel._modalFactory(this);
    }
    // ─── Static Config ────────────────────────────────────────────────────────
    /**
     * @return {string} The global Button Loader class.
     */
    static get buttonLoaderClass() {
        return Fuxcel.#_buttonLoaderClass;
    }
    /**
     * Set the Button Loader class globally.
     *
     * @param token {string} Class selector of button loader.
     */
    static set buttonLoaderClass(token) {
        Fuxcel.#_buttonLoaderClass = token;
    }
    /**
     * @return {string|null} The Plugin path.
     */
    static get path() {
        return `${Fuxcel.#_pluginPath?.replace(/\/$/, '')}/..`;
    }
    /**
     * Set the Plugin path globally.
     *
     * @param path {string} the relative path.
     */
    static set path(path) {
        Fuxcel.#_pluginPath = path;
    }
    // ─── Class Manipulation ───────────────────────────────────────────────────
    /**
     * Checks if selected element contains given class.
     *
     * @param {string} token
     * @return {boolean} true if element contains given class; false otherwise.
     */
    hasClass(token) {
        return this.toArray[0].classList.contains(token);
    }
    /**
     * Add class(es) to the classlist of the selected element.
     *
     * @param tokenList {...string} Comma separated strings of class(es) to add.
     */
    putClass(...tokenList) {
        this.toArray.forEach(el => tokenList.forEach(t => el.classList.add(t)));
        return this;
    }
    /**
     * Replace an existing class with the given class.
     *
     * _Add the new class old class if not found._
     *
     * @param oldToken {string} Old class token.
     * @param newToken {string} New class token.
     */
    replaceClass(oldToken, newToken) {
        this.toArray.forEach(el => el.classList.contains(oldToken) ?
            el.classList.replace(oldToken, newToken) :
            el.classList.add(newToken));
        return this;
    }
    /**
     * Removes the given class(es) from the classlist of the given elements.
     *
     * @param tokenList {...string} Comma separated strings of class(es) to remove.
     */
    removeClass(...tokenList) {
        this.toArray.forEach(el => tokenList.forEach(t => el.classList.remove(t)));
        return this;
    }
    /**
     * Toggle the given classin the classlist of the given element.
     *
     * @param token {string} Class to toggle.
     */
    toggleClass(token) {
        this.toArray.forEach(el => el.classList.toggle(token));
        return this;
    }
    // ─── Iteration ────────────────────────────────────────────────────────────
    /**
     * Perform a callback once for each selected element.
     *
     * @param callback {((element: this, index: number, elements: HTMLElement[]) => void)}
     */
    each(callback) {
        // (<[]>this.toArray).forEach((el, i) => callback(fx(el), i));
        for (let i = 0; i < this.length; i++) {
            // Wrap each element in the current class type (Fuxcel or FuxcelValidator)
            const wrapped = new this.constructor([this[i]]);
            callback(wrapped, i, wrapped.toArray);
        }
    }
    /**
     * Creates a [shallow copy](https://developer.mozilla.org/en-us/docs/Glossary/Shallow_copy) of a portion of a given set of selected elements, filtered down to just the elements from the given array that pass the test implemented by the provided function.
     *
     * @param callback {((element: this, index: number, elements: HTMLElement[]) => boolean)}
     */
    filter(callback) {
        const filtered = [];
        for (let i = 0; i < this.length; i++) {
            // Wrap each element in the current class type
            const wrapped = new this.constructor([this[i]]);
            if (callback(wrapped, i, wrapped.toArray)) {
                filtered.push(this[i]);
            }
        }
        return new this.constructor(filtered);
    }
    /**
     * Get or Set the given attribute(s) for the selected element (If a string is passed to the name param).
     *
     * _Gets the attribute if only the name is given as a string._
     *
     * _Sets the attribute if name and value is given as a string._
     *
     * _Sets the given attributes if name is given as an Object (Key-Value Pair)._
     *
     * @param name {string | object} Name of the attribute.
     * @param value {boolean | string | null = null} Value to set for the attribute(s).
     * @return {Fuxcel|string}
     */
    attrib(name, value) {
        const selected = this.toArray;
        return selected.length ? (name && !value && isString(name) ?
            selected[0].getAttribute(name) :
            (isObject(name) ?
                this.#_setAttrib(name) :
                this.#_setAttrib(name, value))) : null;
    }
    /**
     * Get or Set the given [data-*] attribute(s) for the selected element (If a String is passed to the name param).
     *
     * _Gets the [data-*] attribute if only the name is given as a String._
     *
     * _Sets the [data-*] attribute if name and value is given as a String._
     *
     * _Sets the given [data-*] attributes if name is given as an Object (Key-Value Pair)._
     *
     * @param name {string | object} Name of the [data-*] attribute or a Key-Value pair Object.
     * @param value {boolean | string | null = null} Value to set for the [data-*] attribute; Not required if an Object is passed as an argument to the name parameter.
     * @return {Fuxcel | string}
     */
    dataAttrib(name, value) {
        const selected = this.toArray;
        const formatted = this.#_formatDataAttrib(name);
        return (name && !value && isString(name)
            ? selected[0].dataset[formatted]
            : (isObject(name) ? this.#_setDataAttrib(name) : this.#_setDataAttrib(formatted, value)));
    }
    /**
     * Get or Set the given property / properties for the selected element (If a String is passed to the name param).
     *
     * _Gets the property if only the name is given as a String._
     *
     * _Sets the property if name and value is given as a String or name is a String and value is a Boolean._
     *
     * _Sets the given property / properties if name is given as an Object (Key-Value Pair)._
     *
     * @param name {string | object} Name of the property or a Key-Value pair Object.
     * @param value {boolean | string | null = null} Value to set for the property; Not required if an Object is passed as an argument to the name parameter.
     * @return {Fuxcel | string}
     */
    prop(name, value) {
        const selected = this.toArray;
        return (name && !value && isString(name)
            ? selected[0][name]
            : (isObject(name) ? this.#_setProp(name) : this.#_setProp(name, value)));
    }
    /**
     * Get or set the given CSS style(s) value of the selected element (If a String is passed to the name param).
     *
     * _Gets the given style if only the name is given as a String._
     *
     * _Sets the given style if name and value is given as a String._
     *
     * _Sets the given styles if name is given as a plain Object (Key-Value Pair)._
     *
     * @param name {string | object} Name of the style or a Key-Value pair Object.
     * @param value {boolean | string | null = null} Value to set for the style; Not required if an Object is passed as an argument to the name parameter.
     * @return {Fuxcel | string}
     */
    style(name, value) {
        const selected = this.toArray;
        return (name && !value && isString(name)
            ? window.getComputedStyle(selected[0]).getPropertyValue(name)
            : (isObject(name) ? this.#_setStyle(name) : this.#_setStyle(name, value)));
    }
    /**
     * Returns the attributes of the selected element as on Object.
     *
     * @return {Object} A Key-value-pair object containing the attributes of the selected element.
     */
    listAttrib() {
        const selected = this.toArray;
        const list = {};
        Array.from(selected[0].attributes).forEach((a) => (list[a.name] = a.value));
        return list;
    }
    /**
     * Returns the properties of the selected element as on key-value pair Object.
     *
     * @return {Object} A Key-value-pair object containing the properties of the selected element.
     */
    listProp() {
        const selected = this.toArray;
        const list = {};
        Object.keys(selected[0])
            .filter(p => Number.isNaN(parseInt(p)) && selected[0][p])
            .forEach(p => (list[p] = selected[0][p]));
        return list;
    }
    /**
     * Insert an HTML string relative to each selected element at the given position.
     *
     * | Position    | Description                               |
     * |-------------|-------------------------------------------|
     * | `'before'`  | Insert before the element itself          |
     * | `'prepend'` | Insert as the first child                 |
     * | `'append'`  | Insert as the last child                  |
     * | `'after'`   | Insert after the element itself           |
     *
     * @param value {string} HTML string to insert.
     * @param position {InsertPositions | null = null} Where to insert relative to the selected element.
     * @returns {Fuxcel} The current `Fuxcel` instance for chaining.
     *
     * @example
     * // Insert before the element
     * fx('#container').insertHTML('<hr>', 'before');
     *
     * @example
     * // Prepend as first child
     * fx('#container').insertHTML('<p>First</p>', 'prepend');
     *
     * @example
     * // Append as last child
     * fx('#container').insertHTML('<p>Last</p>', 'append');
     *
     * @example
     * // Insert after the element
     * fx('#container').insertHTML('<hr>', 'after');
     *
     * @example
     * // Chainable
     * fx('#container').insertHTML('<p>Hello</p>', 'prepend').addClass('loaded');
     *
     * @breaking v2.0.0 - The `position` options has changed.
     *
     * @migration
     * **Before (v1.x.x):**
     * | Position    | Description                               |
     * |-------------|-------------------------------------------|
     * | `'affix'`   | Insert before the element itself          |
     * | `'prefix'`  | Insert as the first child                 |
     * | `'suffix'`  | Insert as the last child                  |
     * | `'postfix'` | Insert after the element itself           |
     *
     * -----------------------------------------------------------
     *
     * **After (v2.x.x):**
     * | Position    | Description                               |
     * |-------------|-------------------------------------------|
     * | `'before'`  | Insert before the element itself          |
     * | `'prepend'` | Insert as the first child                 |
     * | `'append'`  | Insert as the last child                  |
     * | `'after'`   | Insert after the element itself           |
     *
     * @see {@link InsertPositions}
     */
    insertHTML(value, position = null) {
        const selected = this.toArray;
        const positions = {
            before: 'beforebegin',
            prepend: 'afterbegin',
            append: 'beforeend',
            after: 'afterend',
        };
        if (position !== null && !positions[position])
            throw new Error(`Invalid position "${position}". Valid options: 'before', 'prepend', 'append', 'after'.`);
        selected.forEach((el) => position !== null ?
            el.insertAdjacentHTML(positions[position], value) :
            (el.innerHTML = value));
        return this;
    }
    /**
     * Insert one or more nodes relative to each selected element at the given position.
     *
     * | Position   | Description                                      |
     * |------------|--------------------------------------------------|
     * | `'append'` | Insert as the last child _(default)_             |
     * | `'prepend'` | Insert as the first child                       |
     * | `'before'` | Insert before the element itself in the DOM      |
     * | `'after'`  | Insert after the element itself in the DOM       |
     *
     * Accepts a single node or an array of nodes. Each node can be a raw `HTMLElement`,
     * a plain string, or a `Fuxcel` instance. When inserting a `Fuxcel` instance into
     * multiple targets, each child is cloned automatically.
     *
     * @param nodes {HTMLElement | FuxcelBase | string | (HTMLElement | FuxcelBase | string)[]} Node(s) to insert.
     * @param position {InsertPosition = 'append'} Where to insert relative to the selected element. Defaults to `'append'`.
     * @returns {Fuxcel} The current `Fuxcel` instance for chaining.
     *
     * @example
     * // Append (default)
     * fx('#container').insertNode('<p>Hello</p>', 'append');
     *
     * @example
     * // Prepend
     * fx('#container').insertNode(fx('#header'), 'prepend');
     *
     * @example
     * // Insert before
     * fx('#container').insertNode(document.createElement('hr'), 'before');
     *
     * @example
     * // Insert after
     * fx('#container').insertNode('<p>Footer</p>', 'after');
     *
     * @example
     * // Multiple nodes as array
     * fx('#container').insertNode([fx('#header'), '<hr>', document.createElement('p')], 'prepend');
     *
     * @example
     * // Chainable
     * fx('#container').insertNode('<p>Hello</p>', 'prepend').addClass('loaded').fadein(300);
     */
    insertNode(nodes, position = 'append') {
        const selected = this.toArray;
        const positions = {
            before: 'beforebegin',
            prepend: 'afterbegin',
            append: 'beforeend',
            after: 'afterend',
        };
        const multiTarget = selected.length > 1;
        const nodeArray = Array.isArray(nodes) ? nodes : [nodes];
        // Pre-resolve Fuxcel instances to raw HTMLElement arrays once
        const resolved = nodeArray.map(node => node instanceof Fuxcel ? node.toArray : [node]);
        selected.forEach((el) => resolved.forEach((items) => items.forEach((child) => {
            const item = multiTarget && typeof child !== 'string' ? child.cloneNode(true) : child;
            typeof item === 'string' ?
                el.insertAdjacentHTML(positions[position], item) :
                el.insertAdjacentElement(positions[position], item);
        })));
        return this;
    }
    /**
     * Remove selected element(s) from DOM.
     *
     * @return void
     */
    remove() {
        this.toArray.forEach(el => el.remove());
    }
    /**
     * Disables or enables the selected element(s).
     *
     * @param disabled {boolean} Switch between disabling and enabling the selected element(s).
     * @return {Fuxcel} Fuxcel Object of the selected element.
     */
    disable(disabled = true) {
        this.each(el => {
            if (!el.isFormElement)
                disabled ? el.putClass('disabled') : el.removeClass('disabled');
            else
                disabled ? el.prop({ disabled: true }) : el.removeProp('disabled');
        });
        return this;
    }
    /**
     * Removes the given attribute(s) from the selected element.
     *
     * @param name {...string} Comma separated strings of attribute(s) to remove.
     * @return {Fuxcel} Fuxcel Object of the selected element
     */
    removeAttrib(...name) {
        const selected = this.toArray;
        selected.length && name.length &&
            selected.forEach((el) => name.forEach(a => el.removeAttribute(a)));
        return this;
    }
    /**
     * Removes the given [data-*] attribute(s) from the selected element.
     *
     * @param name {...string} Comma separated strings of [data-*] attribute(s) to remove.
     * @return {Fuxcel} Fuxcel Object of the selected element
     */
    removeDataAttrib(...name) {
        const selected = this.toArray;
        selected.length && name.length &&
            selected.forEach((el) => name.forEach(n => {
                const k = this.#_formatDataAttrib(n);
                delete el.dataset[k];
            }));
        return this;
    }
    /**
     * Removes the given property / properties from the selected element.
     *
     * @param name {...string} Comma separated strings of property / properties to remove.
     * @return {Fuxcel} Fuxcel Object of the selected element
     */
    removeProp(...name) {
        const selected = this.toArray;
        selected.length && name.length &&
            selected.forEach((el) => name.forEach(p => (el[p] = null)));
        return this;
    }
    /**
     * Returns the direct descendants (Children) of the selected element.
     *
     * _Returns the child that matches the selector if the selector parameter is passed._
     *
     * @param selector {Selector} Selectable string.
     * @return {Fuxcel} Fuxcel Object of the selected child(ren)
     */
    children(selector = null) {
        const selected = this.toArray;
        const result = [];
        Array.from(selected[0].children).forEach((child) => {
            if (isString(selector)) {
                if (fx(child).matchSelector(selector))
                    result.push(child);
            }
            else
                result.push(child);
        });
        return fx(result).#_setPrev(this);
    }
    /**
     * Returns all the descendants of the selected element.
     *
     * _Returns the descendant that matches the selector if the selector parameter is passed._
     *
     * @param selector {Selector} Selectable string.
     * @return {Fuxcel} Fuxcel Object of the selected descendant(s)
     */
    descendants(selector = null) {
        const selected = this.toArray;
        const result = [];
        fx('*', selected[0]).toArray.forEach((d) => {
            if (isString(selector)) {
                if (fx(d).matchSelector(selector))
                    result.push(d);
            }
            else
                result.push(d);
        });
        return fx(result).#_setPrev(this);
    }
    /**
     * Returns the parents of the selected element.
     *
     * _Returns the parent that matches the selector if the selector parameter is passed._
     *
     * @param selector {Selector} Selectable string.
     * @return {Fuxcel} Fuxcel Object of the selected parent(s)
     */
    parents(selector = null) {
        const selected = this.toArray;
        const result = [];
        let parentNode = selected[0].parentNode;
        while (parentNode) {
            if (isString(selector)) {
                if (parentNode.constructor.name.toLowerCase().includes('element')) {
                    if (fx(parentNode).matchSelector(selector)) {
                        result.push(parentNode);
                        break;
                    }
                }
                else
                    break;
            }
            else {
                if (parentNode !== selected[0])
                    result.push(parentNode);
            }
            parentNode = parentNode.parentNode;
        }
        return fx(result).#_setPrev(this);
    }
    /**
     * Returns the previous siblings of the selected element.
     *
     * _Returns the previous sibling that matches the selector if the selector parameter is passed._
     *
     * @param selector {Selector} Selectable string.
     * @return {Fuxcel} Fuxcel Object of the selected previous sibling(s)
     */
    prevSiblings(selector = null) {
        const selected = this.toArray;
        const result = [];
        let prev = selected[0].previousElementSibling;
        while (prev) {
            if (isString(selector)) {
                if (fx(prev).matchSelector(selector)) {
                    result.push(prev);
                    break;
                }
            }
            else {
                if (prev !== selected[0])
                    result.push(prev);
            }
            prev = prev.previousElementSibling;
        }
        return fx(result).#_setPrev(this);
    }
    /**
     * Returns the siblings of the selected element.
     *
     * _Returns the siblings that matches the selector if the selector parameter is passed._
     *
     * @param selector {Selector} Selectable string.
     * @return {Fuxcel} Fuxcel Object of the selected sibling(s)
     */
    siblings(selector = null) {
        const selected = this.toArray;
        const result = [];
        Array.from(selected[0].parentNode?.children).forEach((sib) => {
            if (isString(selector)) {
                if (fx(sib).matchSelector(selector) && sib !== selected[0])
                    result.push(sib);
            }
            else {
                if (sib !== selected[0])
                    result.push(sib);
            }
        });
        return fx(result).#_setPrev(this);
    }
    // ─── Element Checks ───────────────────────────────────────────────────────
    /**
     * Checks if the selected element matches the given tag name.
     *
     * @param tagName {string | HTMLElementTagNameMap} HTML tag name to check for.
     * @return {boolean} true if the selected elements' tag name matches the given tag name; false otherwise.
     */
    isElement(tagName) {
        const selected = this.toArray;
        if (isString(tagName))
            return selected[0].tagName.toLowerCase() === tagName.toString().toLowerCase();
        throw `\`isElement()\` expects 1 string argument.`;
    }
    /**
     * Checks to see if the selected element would be selected by the provided selector-string _(i.e. checks if the selector is unique to the selected element)_.
     *
     * @param selector {Selector} Selector to check element against.
     * @return {boolean} true if the selected element would be selected; false otherwise.
     */
    matchSelector(selector) {
        const selected = this.toArray;
        if (isString(selector))
            return (selected[0].matches).call(selected[0], selector);
        throw `\`matchSelector()\` expects 1 argument. 0 given`;
    }
    /**
     * Check if the selected element has a scrollbar in the given direction.
     *
     * @param direction {Direction | null} Specific direction to check _[horizontal or vertical]_.
     * @return {boolean} true if the selected element has a scrollbar in the specified direction; false otherwise.
     */
    hasScrollBar(direction = 'vertical') {
        const selected = this.toArray;
        const scroll = { vertical: 'scrollHeight', horizontal: 'scrollWidth' };
        const client = { vertical: 'clientHeight', horizontal: 'clientWidth' };
        if (isString(direction) && scroll[direction])
            return (selected[0][scroll[direction]]) > (selected[0][client[direction]]);
        throw `\`hasScrollBar()\` expects 1 argument. 0 given.`;
    }
    // ─── Form Helpers ─────────────────────────────────────────────────────────
    /**
     * A convenient wrapper for the `fx.fetch(options)` function to automatically parse form-data and submit the form using the [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API).
     *
     * @param uri {StringOrNull=''} Submission URL.
     * @param method {HTTPRequestMethod | null} HTTP method.
     * @param data {object|null=null} Additional form data.
     * @param dataType {('html'|'json'|'jsonp'|'script'|'text'|'xml'|null)} Expected response type.
     * @param headers {Object|Headers} Additional request Headers.
     * @param beforeSend {Function|null = null} Called before request is sent.
     * @param timeout {number} Timeout in milliseconds.
     * @param handleError {boolean} Auto-handle 422 errors.
     * @return {Promise<{JSON?: any, text?: string, status: number, form: FuxcelValidator}>}
     */
    handleFormSubmit({ uri = '', method = null, data = null, dataType = 'json', headers = null, beforeSend = null, timeout = 10000, handleError = false, } = {}) {
        const selected = this.toArray;
        return new Promise((resolve, reject) => selected.forEach((element) => {
            if (fx(element).isElement('form')) {
                const form = fx(element).formValidator;
                const formData = new FormData(element);
                // @ts-ignore
                data && Object.keys(data).length && Object.keys(data).forEach(k => Array.isArray(data[k]) ?
                    formData.append(data[k][0], data[k][1], data[k][2]) :
                    formData.append(k, data[k]));
                if (!uri?.length && form.attrib('action'))
                    uri = form.attrib('action');
                if (!method && form.attrib('method'))
                    method = form.attrib('method');
                !form.errorCount ?
                    isFunction(fx.fetch) && fx.fetch({
                        uri: uri,
                        method: method,
                        headers: headers,
                        data: formData,
                        dataType: dataType,
                        timeout: timeout,
                        beforeSend() {
                            isFunction(beforeSend) && beforeSend(form);
                        },
                        onError(err, status) {
                            reject({ response: err, status, form });
                        },
                        onComplete(xhr, status) {
                            if (dataType === 'json') {
                                const response = xhr.responseJSON;
                                if ((status > 199 && status < 300) || status === 308) {
                                    resolve({ JSON: response, text: xhr.responseText, status, form });
                                }
                                else {
                                    if (status === 401)
                                        fx.modal({ type: 'error', content: response.message ?? 'Unauthorized Request', cancelButtonText: 'Cancel', onCancel: () => form.toggleFormSubmitButtonState(false) });
                                    if (status === 419)
                                        setTimeout(() => response.redirect ? (location.href = response.redirect) : location.reload(), 2000);
                                    else if (status === 422 || status === 500)
                                        form.toggleFormSubmitButtonState(false).then(() => {
                                            if (handleError && status === 422)
                                                response.errors ?
                                                    (response.message ? form.renderValidationErrors(response.errors, response.message) : form.renderValidationErrors(response.errors)) :
                                                    (response.message && form.renderValidationErrors({}, response.message));
                                            else
                                                resolve({ JSON: response, status, form });
                                        });
                                    else {
                                        console.error('Server Failure', xhr);
                                        reject({ response: xhr, status, form });
                                    }
                                }
                            }
                            else {
                                if ((status > 199 && status < 300) || status === 308)
                                    resolve({ text: xhr.responseText, status, form });
                                else
                                    reject({ response: xhr, status, form });
                            }
                        },
                    }) : form.renderValidationErrors(form.errorBag);
            }
        }));
    }
    /**
     * Toggle the disabled state (property) of the selected element [a button preferably].
     *
     * @param isLoading {boolean} Determines the state of the button.
     * @return {Promise<Fuxcel>} Promise of Fuxcel Object of the selected element.
     */
    toggleButtonLoadState(isLoading = true) {
        return new Promise(resolve => {
            const selected = this.toArray;
            const button = fx(selected[0]);
            const loaderElement = fx(Fuxcel.buttonLoaderClass, button);
            const resolveDisable = (disabled = true) => {
                button.disable(disabled);
                resolve(button);
            };
            if (isLoading) {
                if (!button.prop('disabled') || !button.attrib('disabled'))
                    if (loaderElement.length && loaderElement.style('display') === 'none')
                        loaderElement.fadein().then(() => resolveDisable());
                    else
                        resolveDisable();
            }
            else {
                if (loaderElement.length && loaderElement.style('display') !== 'none')
                    loaderElement.fadeout().then(() => resolveDisable(false));
                else
                    resolveDisable(false);
            }
        });
    }
    /**
     * Toggles the submit button state of the selected form.
     *
     * @param isLoading {boolean} Determines the state of the button.
     * @return {Promise<Fuxcel>} Promise of Fuxcel Object of the selected element.
     */
    toggleFormSubmitButtonState(isLoading = true) {
        return new Promise(resolve => {
            const selected = this.toArray;
            if (this.isElement('form')) {
                const submitButton = fx('button[type="submit"]', selected[0]).length
                    ? fx('button[type="submit"]', selected[0])
                    : fx(`button[form="${selected[0].id}"]`);
                submitButton.toggleButtonLoadState(isLoading).then(btn => resolve(btn));
            }
            else
                console.warn('Non form element given.');
        });
    }
    /**
     * _Remove the given Event Listener(s) from the selected element._
     *
     * _Removes all previous Event Listeners from the selected element if no event is given._
     *
     * @param events {...string} Particular event to remove.
     * @return {Fuxcel} Fuxcel Object of the selected element.
     */
    off(...events) {
        const selected = this.toArray;
        selected.forEach((element) => {
            element.listeners && element.listeners.forEach((listener, index) => {
                if (events?.length) {
                    events.forEach(event => {
                        if (listener.event.toLowerCase() === event?.toLowerCase()) {
                            element.removeEventListener(listener.event, listener.listener, listener.option);
                            element.listeners.splice(index, 1);
                        }
                    });
                }
                else {
                    element.removeEventListener(listener.event, listener.listener, listener.option);
                    delete element.listeners;
                }
            });
        });
        return this;
    }
    /**
     * Add Event Listener(s) to the selected element.
     *
     * _Add a single Event Listener to the element if the events parameter is given as a string._
     *
     * _Add multiple Event Listeners by passing them as a Key-Value pair._
     *
     * _If the events parameter is a string; the listener parameter is required as a function to handle the event with an optional third parameter of boolean._
     *
     * _If the events parameter is a Key-Value pair; then the second parameter is required as a boolean._
     *
     * @param events {object | string[] | string} Event(s) to listen.
     * @param listener {EventListener | boolean | null = null} Listener function to handle given event.
     * @param option {boolean} Optional boolean parameter to set CAPTURING_PHASE of the event listener to either true or false.
     * @return {Fuxcel} Fuxcel Object of the selected element
     */
    upon(events, listener, option = true) {
        const selected = this.toArray;
        if (isObject(events) && listener === undefined)
            listener = true;
        selected.forEach((element) => {
            if (!element.listeners)
                element.listeners = [];
            if (Array.isArray(events) && events.length) {
                events.forEach((event) => {
                    element.addEventListener(event, listener, option);
                    element.listeners.push({ element, listener, event, option });
                });
            }
            else if (isObject(events)) {
                Object.keys(events).forEach(event => {
                    element.addEventListener(event, events[event], listener);
                    element.listeners.push({ element, listener: events[event], event, option: listener });
                });
            }
            else {
                const event = events;
                element.addEventListener(event, listener, option);
                element.listeners.push({ element, listener: listener, event, option });
            }
        });
        return this;
    }
    /**
     * Trigger a new event on the selected element(s).
     *
     * @param {string} event
     * @param {"mouse" | "keyboard" | "custom" | null} type
     * @returns {Fuxcel}
     */
    trigger(event, type = null) {
        const selected = this.toArray;
        let newEvent;
        if (event instanceof Event) {
            newEvent = event;
        }
        else {
            const match = { mouse: MouseEvent, custom: CustomEvent, keyboard: KeyboardEvent };
            const InitEvent = !type ? Event : match[type.toLowerCase()];
            newEvent = new InitEvent(event, { bubbles: true, cancelable: true });
        }
        selected.forEach((el) => el.dispatchEvent(newEvent));
        return this;
    }
    /**
     * Get or set the value of the selected element.
     *
     * @param value {StringOrNull = null} Value to set for the given element (If available).
     * @return {StringOrNull | string[] | Fuxcel} The value of the selected element if no parameter is passed for value; Fuxcel object of the selected element otherwise.
     */
    value(value = null) {
        const selected = this.toArray;
        if (isString(value) || isDefined(value)) {
            selected.forEach((el) => parseBool(el.contentEditable) ?
                (el.innerText = value.toString()) :
                (el.value = value.toString()));
            return this;
        }
        switch (selected[0].tagName.toLowerCase()) {
            case 'select':
                const el = selected[0];
                if (el.attributes.getNamedItem('multiple')) {
                    const values = [];
                    Array.from(el.selectedOptions).forEach((option) => values.push(option.value));
                    return values.length ? values : null;
                }
                else
                    return el.value;
            default:
                return parseBool(selected[0].contentEditable) ?
                    selected[0].innerText :
                    selected[0].value;
        }
    }
    testValidateAfter(formGroup) {
        const form = this.formValidator;
        const group = fx(formGroup).toArray;
        return form.validateFromGroup(group[0]);
    }
}
// ─── fx() Factory Function ────────────────────────────────────────────────────
/**
 * Creates a new `Fuxcel` object wrapping the selected element(s).
 *
 * Equivalent to `$(selector)` in jQuery. Also available as `fuxcel()`.
 *
 * Static helpers (`.fetch`, `.modal`, `.onDocumentLoad`, `.passLuhnAlgo`)
 * are attached in `src/index.ts` during bootstrap.
 *
 * @param selector {string | IterableElement | SingleElement} CSS selector or element(s).
 * @param context  {string | IterableElement | SingleElement | null} Optional scoping context.
 * @returns {Fuxcel}
 *
 * @example
 * fx('#btn').upon('click', fn);
 * fx('#btn').fadein(300);
 * fx.fetch({ uri: '/api', method: 'post' });
 * fx.modal({ type: 'success', content: 'Done!' });
 */
const fx = function (selector, context = null) {
    return new Fuxcel(selector, context);
};

/*! @author Toru Nagashima <https://github.com/mysticatea> */


let largeIdStartRanges = undefined;
let largeIdContinueRanges = undefined;
function isIdStart(cp) {
    if (cp < 0x41)
        return false;
    if (cp < 0x5b)
        return true;
    if (cp < 0x61)
        return false;
    if (cp < 0x7b)
        return true;
    return isLargeIdStart(cp);
}
function isIdContinue(cp) {
    if (cp < 0x30)
        return false;
    if (cp < 0x3a)
        return true;
    if (cp < 0x41)
        return false;
    if (cp < 0x5b)
        return true;
    if (cp === 0x5f)
        return true;
    if (cp < 0x61)
        return false;
    if (cp < 0x7b)
        return true;
    return isLargeIdStart(cp) || isLargeIdContinue(cp);
}
function isLargeIdStart(cp) {
    return isInRange(cp, largeIdStartRanges || (largeIdStartRanges = initLargeIdStartRanges()));
}
function isLargeIdContinue(cp) {
    return isInRange(cp, largeIdContinueRanges ||
        (largeIdContinueRanges = initLargeIdContinueRanges()));
}
function initLargeIdStartRanges() {
    return restoreRanges("4q 0 b 0 5 0 6 m 2 u 2 cp 5 b f 4 8 0 2 0 3m 4 2 1 3 3 2 0 7 0 2 2 2 0 2 j 2 2a 2 3u 9 4l 2 11 3 0 7 14 20 q 5 3 1a 16 10 1 2 2q 2 0 g 1 8 1 b 2 3 0 h 0 2 t u 2g c 0 p w a 1 5 0 6 l 5 0 a 0 4 0 o o 8 a 1i k 2 h 1p 1h 4 0 j 0 8 9 g f 5 7 3 1 3 l 2 6 2 0 4 3 4 0 h 0 e 1 2 2 f 1 b 0 9 5 5 1 3 l 2 6 2 1 2 1 2 1 w 3 2 0 k 2 h 8 2 2 2 l 2 6 2 1 2 4 4 0 j 0 g 1 o 0 c 7 3 1 3 l 2 6 2 1 2 4 4 0 v 1 2 2 g 0 i 0 2 5 4 2 2 3 4 1 2 0 2 1 4 1 4 2 4 b n 0 1h 7 2 2 2 m 2 f 4 0 r 2 6 1 v 0 5 7 2 2 2 m 2 9 2 4 4 0 x 0 2 1 g 1 i 8 2 2 2 14 3 0 h 0 6 2 9 2 p 5 6 h 4 n 2 8 2 0 3 6 1n 1b 2 1 d 6 1n 1 2 0 2 4 2 n 2 0 2 9 2 1 a 0 3 4 2 0 m 3 x 0 1s 7 2 z s 4 38 16 l 0 h 5 5 3 4 0 4 1 8 2 5 c d 0 i 11 2 0 6 0 3 16 2 98 2 3 3 6 2 0 2 3 3 14 2 3 3 w 2 3 3 6 2 0 2 3 3 e 2 1k 2 3 3 1u 12 f h 2d 3 5 4 h7 3 g 2 p 6 22 4 a 8 c 2 3 f h f h f c 2 2 g 1f 10 0 5 0 1w 2g 8 14 2 0 6 1x b u 1e t 3 4 c 17 5 p 1j m a 1g 2b 0 2m 1a i 6 1k t e 1 b 17 r z 16 2 b z 3 8 8 16 3 2 16 3 2 5 2 1 4 0 6 5b 1t 7p 3 5 3 11 3 5 3 7 2 0 2 0 2 0 2 u 3 1g 2 6 2 0 4 2 2 6 4 3 3 5 5 c 6 2 2 6 39 0 e 0 h c 2u 0 5 0 3 9 2 0 3 5 7 0 2 0 2 0 2 f 3 3 6 4 5 0 i 14 22g 1a 2 1a 2 3o 7 3 4 1 d 11 2 0 6 0 3 1j 8 0 h m a 6 2 6 2 6 2 6 2 6 2 6 2 6 2 6 fb 2 q 8 8 4 3 4 5 2d 5 4 2 2h 2 3 6 16 2 2l i v 1d f e9 533 1t g70 4 wc 1w 19 3 7g 4 f b 1 l 1a h u 3 27 14 8 3 2u 3 1g 3 8 17 c 2 2 2 3 2 m u 1f f 1d 1r 5 4 0 2 1 c r b m q s 8 1a t 0 h 4 2 9 b 4 2 14 o 2 2 7 l m 4 0 4 1d 2 0 4 1 3 4 3 0 2 0 p 2 3 a 8 2 d 5 3 5 3 5 a 6 2 6 2 16 2 d 7 36 u 8mb d m 5 1c 6it a5 3 2x 13 6 d 4 6 0 2 9 2 c 2 4 2 0 2 1 2 1 2 2z y a2 j 1r 3 1h 15 b 39 4 2 3q 11 p 7 p c 2g 4 5 3 5 3 5 3 2 10 b 2 p 2 i 2 1 2 e 3 d z 3e 1y 1g 7g s 4 1c 1c v e t 6 11 b t 3 z 5 7 2 4 17 4d j z 5 z 5 13 9 1f 4d 8m a l b 7 49 5 3 0 2 17 2 1 4 0 3 m b m a u 1u i 2 1 b l b p 1z 1j 7 1 1t 0 g 3 2 2 2 s 17 s 4 s 10 7 2 r s 1h b l b i e h 33 20 1k 1e e 1e e z 9p 15 7 1 27 s b 0 9 l 2z k s m d 1g 24 18 x o r z u 0 3 0 9 y 4 0 d 1b f 3 m 0 2 0 10 h 2 o 2d 6 2 0 2 3 2 e 2 9 8 1a 13 7 3 1 3 l 2 6 2 1 2 4 4 0 j 0 d 4 4f 1g j 3 l 2 v 1b l 1 2 0 55 1a 16 3 11 1b l 0 1o 16 e 0 20 q 6e 17 39 1r w 7 3 0 3 7 2 1 2 n g 0 2 0 2n 7 3 12 h 0 2 0 t 0 b 13 8 0 m 0 c 19 k 0 z 1k 7c 8 2 10 i 0 1e t 35 6 2 1 2 11 m 0 q 5 2 1 2 v f 0 94 i 5a 0 28 pl 2v 32 i 5f 24d tq 34i g6 6nu fs 8 u 36 t j 1b h 3 w k 6 i j5 1r 3l 22 6 0 1v c 1t 1 2 0 t 4qf 9 yd 17 8 6wo 7y 1e 2 i 3 9 az 1s5 2y 6 c 4 8 8 9 4mf 2c 2 1y 2 1 3 0 3 1 3 3 2 b 2 0 2 6 2 1s 2 3 3 7 2 6 2 r 2 3 2 4 2 0 4 6 2 9f 3 o 2 o 2 u 2 o 2 u 2 o 2 u 2 o 2 u 2 o 2 7 1th 18 b 6 h 0 aa 17 105 5g 1o 1v 8 0 xh 3 2 q 2 1 2 0 3 0 2 9 2 3 2 0 2 0 7 0 5 0 2 0 2 0 2 2 2 1 2 0 3 0 2 0 2 0 2 0 2 0 2 1 2 0 3 3 2 6 2 3 2 3 2 0 2 9 2 g 6 2 2 4 2 g 3et wyl z 378 c 65 3 4g1 f 5rk 2e8 f1 15v 3t6");
}
function initLargeIdContinueRanges() {
    return restoreRanges("53 0 g9 33 o 0 70 4 7e 18 2 0 2 1 2 1 2 0 21 a 1d u 7 0 2u 6 3 5 3 1 2 3 3 9 o 0 v q 2k a g 9 y 8 a 0 p 3 2 8 2 2 2 4 18 2 3c e 2 w 1j 2 2 h 2 6 b 1 3 9 i 2 1l 0 2 6 3 1 3 2 a 0 b 1 3 9 f 0 3 2 1l 0 2 4 5 1 3 2 4 0 l b 4 0 c 2 1l 0 2 7 2 2 2 2 l 1 3 9 b 5 2 2 1l 0 2 6 3 1 3 2 8 2 b 1 3 9 j 0 1o 4 4 2 2 3 a 0 f 9 h 4 1m 6 2 2 2 3 8 1 c 1 3 9 i 2 1l 0 2 6 2 2 2 3 8 1 c 1 3 9 h 3 1k 1 2 6 2 2 2 3 a 0 b 1 3 9 i 2 1z 0 5 5 2 0 2 7 7 9 3 1 1q 0 3 6 d 7 2 9 2g 0 3 8 c 5 3 9 1r 1 7 9 c 0 2 0 2 0 5 1 1e j 2 1 6 a 2 z a 0 2t j 2 9 d 3 5 2 2 2 3 6 4 3 e b 2 e jk 2 a 8 pt 2 u 2 u 1 v 1 1t v a 0 3 9 y 2 3 9 40 0 3b b 5 b b 9 3l a 1p 4 1m 9 2 s 3 a 7 9 n d 2 1 1s 4 1c g c 9 i 8 d 2 v c 3 9 19 d 1d j 9 9 7 9 3b 2 2 k 5 0 7 0 3 2 5j 1l 2 4 g0 1 k 0 3g c 5 0 4 b 2db 2 3y 0 2p v ff 5 2y 1 n7q 9 1y 0 5 9 x 1 29 1 7l 0 4 0 5 0 o 4 5 0 2c 1 1f h b 9 7 h e a t 7 q c 19 3 1c d g 9 c 0 b 9 1c d d 0 9 1 3 9 y 2 1f 0 2 2 3 1 6 1 2 0 16 4 6 1 6l 7 2 1 3 9 fmt 0 ki f h f 4 1 p 2 5d 9 12 0 ji 0 6b 0 46 4 86 9 120 2 2 1 6 3 15 2 5 0 4m 1 fy 3 9 9 aa 1 4a a 4w 2 1i e w 9 g 3 1a a 1i 9 7 2 11 d 2 9 6 1 19 0 d 2 1d d 9 3 2 b 2b b 7 0 4h b 6 9 7 3 1k 1 2 6 3 1 3 2 a 0 b 1 3 6 4 4 5d h a 9 5 0 2a j d 9 5y 6 3 8 s 1 2b g g 9 2a c 9 9 2c e 5 9 6r e 4m 9 1z 5 2 1 3 3 2 0 2 1 d 9 3c 6 3 6 4 0 t 9 15 6 2 3 9 0 a a 1b f ba 7 2 7 h 9 1l l 2 d 3f 5 4 0 2 1 2 6 2 0 9 9 1d 4 2 1 2 4 9 9 96 3 ewa 9 3r 4 1o 6 q 9 s6 0 2 1i 8 3 2a 0 c 1 f58 1 43r 4 4 5 9 7 3 6 v 3 45 2 13e 1d e9 1i 5 1d 9 0 f 0 n 4 2 e 11t 6 2 g 3 6 2 1 2 4 7a 6 a 9 bn d 15j 6 32 6 6 9 3o7 9 gvt3 6n");
}
function isInRange(cp, ranges) {
    let l = 0, r = (ranges.length / 2) | 0, i = 0, min = 0, max = 0;
    while (l < r) {
        i = ((l + r) / 2) | 0;
        min = ranges[2 * i];
        max = ranges[2 * i + 1];
        if (cp < min) {
            r = i;
        }
        else if (cp > max) {
            l = i + 1;
        }
        else {
            return true;
        }
    }
    return false;
}
function restoreRanges(data) {
    let last = 0;
    return data.split(" ").map(s => (last += parseInt(s, 36) | 0));
}

class DataSet {
    constructor(raw2018, raw2019, raw2020, raw2021) {
        this._raw2018 = raw2018;
        this._raw2019 = raw2019;
        this._raw2020 = raw2020;
        this._raw2021 = raw2021;
    }
    get es2018() {
        return (this._set2018 || (this._set2018 = new Set(this._raw2018.split(" "))));
    }
    get es2019() {
        return (this._set2019 || (this._set2019 = new Set(this._raw2019.split(" "))));
    }
    get es2020() {
        return (this._set2020 || (this._set2020 = new Set(this._raw2020.split(" "))));
    }
    get es2021() {
        return (this._set2021 || (this._set2021 = new Set(this._raw2021.split(" "))));
    }
}
const gcNameSet = new Set(["General_Category", "gc"]);
const scNameSet = new Set(["Script", "Script_Extensions", "sc", "scx"]);
const gcValueSets = new DataSet("C Cased_Letter Cc Cf Close_Punctuation Cn Co Combining_Mark Connector_Punctuation Control Cs Currency_Symbol Dash_Punctuation Decimal_Number Enclosing_Mark Final_Punctuation Format Initial_Punctuation L LC Letter Letter_Number Line_Separator Ll Lm Lo Lowercase_Letter Lt Lu M Mark Math_Symbol Mc Me Mn Modifier_Letter Modifier_Symbol N Nd Nl No Nonspacing_Mark Number Open_Punctuation Other Other_Letter Other_Number Other_Punctuation Other_Symbol P Paragraph_Separator Pc Pd Pe Pf Pi Po Private_Use Ps Punctuation S Sc Separator Sk Sm So Space_Separator Spacing_Mark Surrogate Symbol Titlecase_Letter Unassigned Uppercase_Letter Z Zl Zp Zs cntrl digit punct", "", "", "");
const scValueSets = new DataSet("Adlam Adlm Aghb Ahom Anatolian_Hieroglyphs Arab Arabic Armenian Armi Armn Avestan Avst Bali Balinese Bamu Bamum Bass Bassa_Vah Batak Batk Beng Bengali Bhaiksuki Bhks Bopo Bopomofo Brah Brahmi Brai Braille Bugi Buginese Buhd Buhid Cakm Canadian_Aboriginal Cans Cari Carian Caucasian_Albanian Chakma Cham Cher Cherokee Common Copt Coptic Cprt Cuneiform Cypriot Cyrillic Cyrl Deseret Deva Devanagari Dsrt Dupl Duployan Egyp Egyptian_Hieroglyphs Elba Elbasan Ethi Ethiopic Geor Georgian Glag Glagolitic Gonm Goth Gothic Gran Grantha Greek Grek Gujarati Gujr Gurmukhi Guru Han Hang Hangul Hani Hano Hanunoo Hatr Hatran Hebr Hebrew Hira Hiragana Hluw Hmng Hung Imperial_Aramaic Inherited Inscriptional_Pahlavi Inscriptional_Parthian Ital Java Javanese Kaithi Kali Kana Kannada Katakana Kayah_Li Khar Kharoshthi Khmer Khmr Khoj Khojki Khudawadi Knda Kthi Lana Lao Laoo Latin Latn Lepc Lepcha Limb Limbu Lina Linb Linear_A Linear_B Lisu Lyci Lycian Lydi Lydian Mahajani Mahj Malayalam Mand Mandaic Mani Manichaean Marc Marchen Masaram_Gondi Meetei_Mayek Mend Mende_Kikakui Merc Mero Meroitic_Cursive Meroitic_Hieroglyphs Miao Mlym Modi Mong Mongolian Mro Mroo Mtei Mult Multani Myanmar Mymr Nabataean Narb Nbat New_Tai_Lue Newa Nko Nkoo Nshu Nushu Ogam Ogham Ol_Chiki Olck Old_Hungarian Old_Italic Old_North_Arabian Old_Permic Old_Persian Old_South_Arabian Old_Turkic Oriya Orkh Orya Osage Osge Osma Osmanya Pahawh_Hmong Palm Palmyrene Pau_Cin_Hau Pauc Perm Phag Phags_Pa Phli Phlp Phnx Phoenician Plrd Prti Psalter_Pahlavi Qaac Qaai Rejang Rjng Runic Runr Samaritan Samr Sarb Saur Saurashtra Sgnw Sharada Shavian Shaw Shrd Sidd Siddham SignWriting Sind Sinh Sinhala Sora Sora_Sompeng Soyo Soyombo Sund Sundanese Sylo Syloti_Nagri Syrc Syriac Tagalog Tagb Tagbanwa Tai_Le Tai_Tham Tai_Viet Takr Takri Tale Talu Tamil Taml Tang Tangut Tavt Telu Telugu Tfng Tglg Thaa Thaana Thai Tibetan Tibt Tifinagh Tirh Tirhuta Ugar Ugaritic Vai Vaii Wara Warang_Citi Xpeo Xsux Yi Yiii Zanabazar_Square Zanb Zinh Zyyy", "Dogr Dogra Gong Gunjala_Gondi Hanifi_Rohingya Maka Makasar Medefaidrin Medf Old_Sogdian Rohg Sogd Sogdian Sogo", "Elym Elymaic Hmnp Nand Nandinagari Nyiakeng_Puachue_Hmong Wancho Wcho", "Chorasmian Chrs Diak Dives_Akuru Khitan_Small_Script Kits Yezi Yezidi");
const binPropertySets = new DataSet("AHex ASCII ASCII_Hex_Digit Alpha Alphabetic Any Assigned Bidi_C Bidi_Control Bidi_M Bidi_Mirrored CI CWCF CWCM CWKCF CWL CWT CWU Case_Ignorable Cased Changes_When_Casefolded Changes_When_Casemapped Changes_When_Lowercased Changes_When_NFKC_Casefolded Changes_When_Titlecased Changes_When_Uppercased DI Dash Default_Ignorable_Code_Point Dep Deprecated Dia Diacritic Emoji Emoji_Component Emoji_Modifier Emoji_Modifier_Base Emoji_Presentation Ext Extender Gr_Base Gr_Ext Grapheme_Base Grapheme_Extend Hex Hex_Digit IDC IDS IDSB IDST IDS_Binary_Operator IDS_Trinary_Operator ID_Continue ID_Start Ideo Ideographic Join_C Join_Control LOE Logical_Order_Exception Lower Lowercase Math NChar Noncharacter_Code_Point Pat_Syn Pat_WS Pattern_Syntax Pattern_White_Space QMark Quotation_Mark RI Radical Regional_Indicator SD STerm Sentence_Terminal Soft_Dotted Term Terminal_Punctuation UIdeo Unified_Ideograph Upper Uppercase VS Variation_Selector White_Space XIDC XIDS XID_Continue XID_Start space", "Extended_Pictographic", "", "EBase EComp EMod EPres ExtPict");
function isValidUnicodeProperty(version, name, value) {
    if (gcNameSet.has(name)) {
        return version >= 2018 && gcValueSets.es2018.has(value);
    }
    if (scNameSet.has(name)) {
        return ((version >= 2018 && scValueSets.es2018.has(value)) ||
            (version >= 2019 && scValueSets.es2019.has(value)) ||
            (version >= 2020 && scValueSets.es2020.has(value)) ||
            (version >= 2021 && scValueSets.es2021.has(value)));
    }
    return false;
}
function isValidLoneUnicodeProperty(version, value) {
    return ((version >= 2018 && binPropertySets.es2018.has(value)) ||
        (version >= 2019 && binPropertySets.es2019.has(value)) ||
        (version >= 2021 && binPropertySets.es2021.has(value)));
}

const Backspace = 0x08;
const CharacterTabulation = 0x09;
const LineFeed = 0x0a;
const LineTabulation = 0x0b;
const FormFeed = 0x0c;
const CarriageReturn = 0x0d;
const ExclamationMark = 0x21;
const DollarSign = 0x24;
const LeftParenthesis = 0x28;
const RightParenthesis = 0x29;
const Asterisk = 0x2a;
const PlusSign = 0x2b;
const Comma = 0x2c;
const HyphenMinus = 0x2d;
const FullStop = 0x2e;
const Solidus = 0x2f;
const DigitZero = 0x30;
const DigitOne = 0x31;
const DigitSeven = 0x37;
const DigitNine = 0x39;
const Colon = 0x3a;
const LessThanSign = 0x3c;
const EqualsSign = 0x3d;
const GreaterThanSign = 0x3e;
const QuestionMark = 0x3f;
const LatinCapitalLetterA = 0x41;
const LatinCapitalLetterB = 0x42;
const LatinCapitalLetterD = 0x44;
const LatinCapitalLetterF = 0x46;
const LatinCapitalLetterP = 0x50;
const LatinCapitalLetterS = 0x53;
const LatinCapitalLetterW = 0x57;
const LatinCapitalLetterZ = 0x5a;
const LowLine = 0x5f;
const LatinSmallLetterA = 0x61;
const LatinSmallLetterB = 0x62;
const LatinSmallLetterC = 0x63;
const LatinSmallLetterD = 0x64;
const LatinSmallLetterF = 0x66;
const LatinSmallLetterG = 0x67;
const LatinSmallLetterI = 0x69;
const LatinSmallLetterK = 0x6b;
const LatinSmallLetterM = 0x6d;
const LatinSmallLetterN = 0x6e;
const LatinSmallLetterP = 0x70;
const LatinSmallLetterR = 0x72;
const LatinSmallLetterS = 0x73;
const LatinSmallLetterT = 0x74;
const LatinSmallLetterU = 0x75;
const LatinSmallLetterV = 0x76;
const LatinSmallLetterW = 0x77;
const LatinSmallLetterX = 0x78;
const LatinSmallLetterY = 0x79;
const LatinSmallLetterZ = 0x7a;
const LeftSquareBracket = 0x5b;
const ReverseSolidus = 0x5c;
const RightSquareBracket = 0x5d;
const CircumflexAccent = 0x5e;
const LeftCurlyBracket = 0x7b;
const VerticalLine = 0x7c;
const RightCurlyBracket = 0x7d;
const ZeroWidthNonJoiner = 0x200c;
const ZeroWidthJoiner = 0x200d;
const LineSeparator = 0x2028;
const ParagraphSeparator = 0x2029;
const MinCodePoint = 0x00;
const MaxCodePoint = 0x10ffff;
function isLatinLetter(code) {
    return ((code >= LatinCapitalLetterA && code <= LatinCapitalLetterZ) ||
        (code >= LatinSmallLetterA && code <= LatinSmallLetterZ));
}
function isDecimalDigit(code) {
    return code >= DigitZero && code <= DigitNine;
}
function isOctalDigit(code) {
    return code >= DigitZero && code <= DigitSeven;
}
function isHexDigit(code) {
    return ((code >= DigitZero && code <= DigitNine) ||
        (code >= LatinCapitalLetterA && code <= LatinCapitalLetterF) ||
        (code >= LatinSmallLetterA && code <= LatinSmallLetterF));
}
function isLineTerminator(code) {
    return (code === LineFeed ||
        code === CarriageReturn ||
        code === LineSeparator ||
        code === ParagraphSeparator);
}
function isValidUnicode(code) {
    return code >= MinCodePoint && code <= MaxCodePoint;
}
function digitToInt(code) {
    if (code >= LatinSmallLetterA && code <= LatinSmallLetterF) {
        return code - LatinSmallLetterA + 10;
    }
    if (code >= LatinCapitalLetterA && code <= LatinCapitalLetterF) {
        return code - LatinCapitalLetterA + 10;
    }
    return code - DigitZero;
}
function isLeadSurrogate(code) {
    return code >= 0xd800 && code <= 0xdbff;
}
function isTrailSurrogate(code) {
    return code >= 0xdc00 && code <= 0xdfff;
}
function combineSurrogatePair(lead, trail) {
    return (lead - 0xd800) * 0x400 + (trail - 0xdc00) + 0x10000;
}

const legacyImpl = {
    at(s, end, i) {
        return i < end ? s.charCodeAt(i) : -1;
    },
    width(c) {
        return 1;
    },
};
const unicodeImpl = {
    at(s, end, i) {
        return i < end ? s.codePointAt(i) : -1;
    },
    width(c) {
        return c > 0xffff ? 2 : 1;
    },
};
class Reader {
    constructor() {
        this._impl = legacyImpl;
        this._s = "";
        this._i = 0;
        this._end = 0;
        this._cp1 = -1;
        this._w1 = 1;
        this._cp2 = -1;
        this._w2 = 1;
        this._cp3 = -1;
        this._w3 = 1;
        this._cp4 = -1;
    }
    get source() {
        return this._s;
    }
    get index() {
        return this._i;
    }
    get currentCodePoint() {
        return this._cp1;
    }
    get nextCodePoint() {
        return this._cp2;
    }
    get nextCodePoint2() {
        return this._cp3;
    }
    get nextCodePoint3() {
        return this._cp4;
    }
    reset(source, start, end, uFlag) {
        this._impl = uFlag ? unicodeImpl : legacyImpl;
        this._s = source;
        this._end = end;
        this.rewind(start);
    }
    rewind(index) {
        const impl = this._impl;
        this._i = index;
        this._cp1 = impl.at(this._s, this._end, index);
        this._w1 = impl.width(this._cp1);
        this._cp2 = impl.at(this._s, this._end, index + this._w1);
        this._w2 = impl.width(this._cp2);
        this._cp3 = impl.at(this._s, this._end, index + this._w1 + this._w2);
        this._w3 = impl.width(this._cp3);
        this._cp4 = impl.at(this._s, this._end, index + this._w1 + this._w2 + this._w3);
    }
    advance() {
        if (this._cp1 !== -1) {
            const impl = this._impl;
            this._i += this._w1;
            this._cp1 = this._cp2;
            this._w1 = this._w2;
            this._cp2 = this._cp3;
            this._w2 = impl.width(this._cp2);
            this._cp3 = this._cp4;
            this._w3 = impl.width(this._cp3);
            this._cp4 = impl.at(this._s, this._end, this._i + this._w1 + this._w2 + this._w3);
        }
    }
    eat(cp) {
        if (this._cp1 === cp) {
            this.advance();
            return true;
        }
        return false;
    }
    eat2(cp1, cp2) {
        if (this._cp1 === cp1 && this._cp2 === cp2) {
            this.advance();
            this.advance();
            return true;
        }
        return false;
    }
    eat3(cp1, cp2, cp3) {
        if (this._cp1 === cp1 && this._cp2 === cp2 && this._cp3 === cp3) {
            this.advance();
            this.advance();
            this.advance();
            return true;
        }
        return false;
    }
}

class RegExpSyntaxError extends SyntaxError {
    constructor(source, uFlag, index, message) {
        if (source) {
            if (!source.startsWith("/")) {
                source = `/${source}/${uFlag ? "u" : ""}`;
            }
            source = `: ${source}`;
        }
        super(`Invalid regular expression${source}: ${message}`);
        this.index = index;
    }
}

function isSyntaxCharacter(cp) {
    return (cp === CircumflexAccent ||
        cp === DollarSign ||
        cp === ReverseSolidus ||
        cp === FullStop ||
        cp === Asterisk ||
        cp === PlusSign ||
        cp === QuestionMark ||
        cp === LeftParenthesis ||
        cp === RightParenthesis ||
        cp === LeftSquareBracket ||
        cp === RightSquareBracket ||
        cp === LeftCurlyBracket ||
        cp === RightCurlyBracket ||
        cp === VerticalLine);
}
function isRegExpIdentifierStart(cp) {
    return isIdStart(cp) || cp === DollarSign || cp === LowLine;
}
function isRegExpIdentifierPart(cp) {
    return (isIdContinue(cp) ||
        cp === DollarSign ||
        cp === LowLine ||
        cp === ZeroWidthNonJoiner ||
        cp === ZeroWidthJoiner);
}
function isUnicodePropertyNameCharacter(cp) {
    return isLatinLetter(cp) || cp === LowLine;
}
function isUnicodePropertyValueCharacter(cp) {
    return isUnicodePropertyNameCharacter(cp) || isDecimalDigit(cp);
}
class RegExpValidator {
    constructor(options) {
        this._reader = new Reader();
        this._uFlag = false;
        this._nFlag = false;
        this._lastIntValue = 0;
        this._lastMinValue = 0;
        this._lastMaxValue = 0;
        this._lastStrValue = "";
        this._lastKeyValue = "";
        this._lastValValue = "";
        this._lastAssertionIsQuantifiable = false;
        this._numCapturingParens = 0;
        this._groupNames = new Set();
        this._backreferenceNames = new Set();
        this._options = options || {};
    }
    validateLiteral(source, start = 0, end = source.length) {
        this._uFlag = this._nFlag = false;
        this.reset(source, start, end);
        this.onLiteralEnter(start);
        if (this.eat(Solidus) && this.eatRegExpBody() && this.eat(Solidus)) {
            const flagStart = this.index;
            const uFlag = source.includes("u", flagStart);
            this.validateFlags(source, flagStart, end);
            this.validatePattern(source, start + 1, flagStart - 1, uFlag);
        }
        else if (start >= end) {
            this.raise("Empty");
        }
        else {
            const c = String.fromCodePoint(this.currentCodePoint);
            this.raise(`Unexpected character '${c}'`);
        }
        this.onLiteralLeave(start, end);
    }
    validateFlags(source, start = 0, end = source.length) {
        const existingFlags = new Set();
        let global = false;
        let ignoreCase = false;
        let multiline = false;
        let sticky = false;
        let unicode = false;
        let dotAll = false;
        let hasIndices = false;
        for (let i = start; i < end; ++i) {
            const flag = source.charCodeAt(i);
            if (existingFlags.has(flag)) {
                this.raise(`Duplicated flag '${source[i]}'`);
            }
            existingFlags.add(flag);
            if (flag === LatinSmallLetterG) {
                global = true;
            }
            else if (flag === LatinSmallLetterI) {
                ignoreCase = true;
            }
            else if (flag === LatinSmallLetterM) {
                multiline = true;
            }
            else if (flag === LatinSmallLetterU && this.ecmaVersion >= 2015) {
                unicode = true;
            }
            else if (flag === LatinSmallLetterY && this.ecmaVersion >= 2015) {
                sticky = true;
            }
            else if (flag === LatinSmallLetterS && this.ecmaVersion >= 2018) {
                dotAll = true;
            }
            else if (flag === LatinSmallLetterD && this.ecmaVersion >= 2022) {
                hasIndices = true;
            }
            else {
                this.raise(`Invalid flag '${source[i]}'`);
            }
        }
        this.onFlags(start, end, global, ignoreCase, multiline, unicode, sticky, dotAll, hasIndices);
    }
    validatePattern(source, start = 0, end = source.length, uFlag = false) {
        this._uFlag = uFlag && this.ecmaVersion >= 2015;
        this._nFlag = uFlag && this.ecmaVersion >= 2018;
        this.reset(source, start, end);
        this.consumePattern();
        if (!this._nFlag &&
            this.ecmaVersion >= 2018 &&
            this._groupNames.size > 0) {
            this._nFlag = true;
            this.rewind(start);
            this.consumePattern();
        }
    }
    get strict() {
        return Boolean(this._options.strict || this._uFlag);
    }
    get ecmaVersion() {
        return this._options.ecmaVersion || 2022;
    }
    onLiteralEnter(start) {
        if (this._options.onLiteralEnter) {
            this._options.onLiteralEnter(start);
        }
    }
    onLiteralLeave(start, end) {
        if (this._options.onLiteralLeave) {
            this._options.onLiteralLeave(start, end);
        }
    }
    onFlags(start, end, global, ignoreCase, multiline, unicode, sticky, dotAll, hasIndices) {
        if (this._options.onFlags) {
            this._options.onFlags(start, end, global, ignoreCase, multiline, unicode, sticky, dotAll, hasIndices);
        }
    }
    onPatternEnter(start) {
        if (this._options.onPatternEnter) {
            this._options.onPatternEnter(start);
        }
    }
    onPatternLeave(start, end) {
        if (this._options.onPatternLeave) {
            this._options.onPatternLeave(start, end);
        }
    }
    onDisjunctionEnter(start) {
        if (this._options.onDisjunctionEnter) {
            this._options.onDisjunctionEnter(start);
        }
    }
    onDisjunctionLeave(start, end) {
        if (this._options.onDisjunctionLeave) {
            this._options.onDisjunctionLeave(start, end);
        }
    }
    onAlternativeEnter(start, index) {
        if (this._options.onAlternativeEnter) {
            this._options.onAlternativeEnter(start, index);
        }
    }
    onAlternativeLeave(start, end, index) {
        if (this._options.onAlternativeLeave) {
            this._options.onAlternativeLeave(start, end, index);
        }
    }
    onGroupEnter(start) {
        if (this._options.onGroupEnter) {
            this._options.onGroupEnter(start);
        }
    }
    onGroupLeave(start, end) {
        if (this._options.onGroupLeave) {
            this._options.onGroupLeave(start, end);
        }
    }
    onCapturingGroupEnter(start, name) {
        if (this._options.onCapturingGroupEnter) {
            this._options.onCapturingGroupEnter(start, name);
        }
    }
    onCapturingGroupLeave(start, end, name) {
        if (this._options.onCapturingGroupLeave) {
            this._options.onCapturingGroupLeave(start, end, name);
        }
    }
    onQuantifier(start, end, min, max, greedy) {
        if (this._options.onQuantifier) {
            this._options.onQuantifier(start, end, min, max, greedy);
        }
    }
    onLookaroundAssertionEnter(start, kind, negate) {
        if (this._options.onLookaroundAssertionEnter) {
            this._options.onLookaroundAssertionEnter(start, kind, negate);
        }
    }
    onLookaroundAssertionLeave(start, end, kind, negate) {
        if (this._options.onLookaroundAssertionLeave) {
            this._options.onLookaroundAssertionLeave(start, end, kind, negate);
        }
    }
    onEdgeAssertion(start, end, kind) {
        if (this._options.onEdgeAssertion) {
            this._options.onEdgeAssertion(start, end, kind);
        }
    }
    onWordBoundaryAssertion(start, end, kind, negate) {
        if (this._options.onWordBoundaryAssertion) {
            this._options.onWordBoundaryAssertion(start, end, kind, negate);
        }
    }
    onAnyCharacterSet(start, end, kind) {
        if (this._options.onAnyCharacterSet) {
            this._options.onAnyCharacterSet(start, end, kind);
        }
    }
    onEscapeCharacterSet(start, end, kind, negate) {
        if (this._options.onEscapeCharacterSet) {
            this._options.onEscapeCharacterSet(start, end, kind, negate);
        }
    }
    onUnicodePropertyCharacterSet(start, end, kind, key, value, negate) {
        if (this._options.onUnicodePropertyCharacterSet) {
            this._options.onUnicodePropertyCharacterSet(start, end, kind, key, value, negate);
        }
    }
    onCharacter(start, end, value) {
        if (this._options.onCharacter) {
            this._options.onCharacter(start, end, value);
        }
    }
    onBackreference(start, end, ref) {
        if (this._options.onBackreference) {
            this._options.onBackreference(start, end, ref);
        }
    }
    onCharacterClassEnter(start, negate) {
        if (this._options.onCharacterClassEnter) {
            this._options.onCharacterClassEnter(start, negate);
        }
    }
    onCharacterClassLeave(start, end, negate) {
        if (this._options.onCharacterClassLeave) {
            this._options.onCharacterClassLeave(start, end, negate);
        }
    }
    onCharacterClassRange(start, end, min, max) {
        if (this._options.onCharacterClassRange) {
            this._options.onCharacterClassRange(start, end, min, max);
        }
    }
    get source() {
        return this._reader.source;
    }
    get index() {
        return this._reader.index;
    }
    get currentCodePoint() {
        return this._reader.currentCodePoint;
    }
    get nextCodePoint() {
        return this._reader.nextCodePoint;
    }
    get nextCodePoint2() {
        return this._reader.nextCodePoint2;
    }
    get nextCodePoint3() {
        return this._reader.nextCodePoint3;
    }
    reset(source, start, end) {
        this._reader.reset(source, start, end, this._uFlag);
    }
    rewind(index) {
        this._reader.rewind(index);
    }
    advance() {
        this._reader.advance();
    }
    eat(cp) {
        return this._reader.eat(cp);
    }
    eat2(cp1, cp2) {
        return this._reader.eat2(cp1, cp2);
    }
    eat3(cp1, cp2, cp3) {
        return this._reader.eat3(cp1, cp2, cp3);
    }
    raise(message) {
        throw new RegExpSyntaxError(this.source, this._uFlag, this.index, message);
    }
    eatRegExpBody() {
        const start = this.index;
        let inClass = false;
        let escaped = false;
        for (;;) {
            const cp = this.currentCodePoint;
            if (cp === -1 || isLineTerminator(cp)) {
                const kind = inClass ? "character class" : "regular expression";
                this.raise(`Unterminated ${kind}`);
            }
            if (escaped) {
                escaped = false;
            }
            else if (cp === ReverseSolidus) {
                escaped = true;
            }
            else if (cp === LeftSquareBracket) {
                inClass = true;
            }
            else if (cp === RightSquareBracket) {
                inClass = false;
            }
            else if ((cp === Solidus && !inClass) ||
                (cp === Asterisk && this.index === start)) {
                break;
            }
            this.advance();
        }
        return this.index !== start;
    }
    consumePattern() {
        const start = this.index;
        this._numCapturingParens = this.countCapturingParens();
        this._groupNames.clear();
        this._backreferenceNames.clear();
        this.onPatternEnter(start);
        this.consumeDisjunction();
        const cp = this.currentCodePoint;
        if (this.currentCodePoint !== -1) {
            if (cp === RightParenthesis) {
                this.raise("Unmatched ')'");
            }
            if (cp === ReverseSolidus) {
                this.raise("\\ at end of pattern");
            }
            if (cp === RightSquareBracket || cp === RightCurlyBracket) {
                this.raise("Lone quantifier brackets");
            }
            const c = String.fromCodePoint(cp);
            this.raise(`Unexpected character '${c}'`);
        }
        for (const name of this._backreferenceNames) {
            if (!this._groupNames.has(name)) {
                this.raise("Invalid named capture referenced");
            }
        }
        this.onPatternLeave(start, this.index);
    }
    countCapturingParens() {
        const start = this.index;
        let inClass = false;
        let escaped = false;
        let count = 0;
        let cp = 0;
        while ((cp = this.currentCodePoint) !== -1) {
            if (escaped) {
                escaped = false;
            }
            else if (cp === ReverseSolidus) {
                escaped = true;
            }
            else if (cp === LeftSquareBracket) {
                inClass = true;
            }
            else if (cp === RightSquareBracket) {
                inClass = false;
            }
            else if (cp === LeftParenthesis &&
                !inClass &&
                (this.nextCodePoint !== QuestionMark ||
                    (this.nextCodePoint2 === LessThanSign &&
                        this.nextCodePoint3 !== EqualsSign &&
                        this.nextCodePoint3 !== ExclamationMark))) {
                count += 1;
            }
            this.advance();
        }
        this.rewind(start);
        return count;
    }
    consumeDisjunction() {
        const start = this.index;
        let i = 0;
        this.onDisjunctionEnter(start);
        do {
            this.consumeAlternative(i++);
        } while (this.eat(VerticalLine));
        if (this.consumeQuantifier(true)) {
            this.raise("Nothing to repeat");
        }
        if (this.eat(LeftCurlyBracket)) {
            this.raise("Lone quantifier brackets");
        }
        this.onDisjunctionLeave(start, this.index);
    }
    consumeAlternative(i) {
        const start = this.index;
        this.onAlternativeEnter(start, i);
        while (this.currentCodePoint !== -1 && this.consumeTerm()) {
        }
        this.onAlternativeLeave(start, this.index, i);
    }
    consumeTerm() {
        if (this._uFlag || this.strict) {
            return (this.consumeAssertion() ||
                (this.consumeAtom() && this.consumeOptionalQuantifier()));
        }
        return ((this.consumeAssertion() &&
            (!this._lastAssertionIsQuantifiable ||
                this.consumeOptionalQuantifier())) ||
            (this.consumeExtendedAtom() && this.consumeOptionalQuantifier()));
    }
    consumeOptionalQuantifier() {
        this.consumeQuantifier();
        return true;
    }
    consumeAssertion() {
        const start = this.index;
        this._lastAssertionIsQuantifiable = false;
        if (this.eat(CircumflexAccent)) {
            this.onEdgeAssertion(start, this.index, "start");
            return true;
        }
        if (this.eat(DollarSign)) {
            this.onEdgeAssertion(start, this.index, "end");
            return true;
        }
        if (this.eat2(ReverseSolidus, LatinCapitalLetterB)) {
            this.onWordBoundaryAssertion(start, this.index, "word", true);
            return true;
        }
        if (this.eat2(ReverseSolidus, LatinSmallLetterB)) {
            this.onWordBoundaryAssertion(start, this.index, "word", false);
            return true;
        }
        if (this.eat2(LeftParenthesis, QuestionMark)) {
            const lookbehind = this.ecmaVersion >= 2018 && this.eat(LessThanSign);
            let negate = false;
            if (this.eat(EqualsSign) || (negate = this.eat(ExclamationMark))) {
                const kind = lookbehind ? "lookbehind" : "lookahead";
                this.onLookaroundAssertionEnter(start, kind, negate);
                this.consumeDisjunction();
                if (!this.eat(RightParenthesis)) {
                    this.raise("Unterminated group");
                }
                this._lastAssertionIsQuantifiable = !lookbehind && !this.strict;
                this.onLookaroundAssertionLeave(start, this.index, kind, negate);
                return true;
            }
            this.rewind(start);
        }
        return false;
    }
    consumeQuantifier(noConsume = false) {
        const start = this.index;
        let min = 0;
        let max = 0;
        let greedy = false;
        if (this.eat(Asterisk)) {
            min = 0;
            max = Number.POSITIVE_INFINITY;
        }
        else if (this.eat(PlusSign)) {
            min = 1;
            max = Number.POSITIVE_INFINITY;
        }
        else if (this.eat(QuestionMark)) {
            min = 0;
            max = 1;
        }
        else if (this.eatBracedQuantifier(noConsume)) {
            min = this._lastMinValue;
            max = this._lastMaxValue;
        }
        else {
            return false;
        }
        greedy = !this.eat(QuestionMark);
        if (!noConsume) {
            this.onQuantifier(start, this.index, min, max, greedy);
        }
        return true;
    }
    eatBracedQuantifier(noError) {
        const start = this.index;
        if (this.eat(LeftCurlyBracket)) {
            this._lastMinValue = 0;
            this._lastMaxValue = Number.POSITIVE_INFINITY;
            if (this.eatDecimalDigits()) {
                this._lastMinValue = this._lastMaxValue = this._lastIntValue;
                if (this.eat(Comma)) {
                    this._lastMaxValue = this.eatDecimalDigits()
                        ? this._lastIntValue
                        : Number.POSITIVE_INFINITY;
                }
                if (this.eat(RightCurlyBracket)) {
                    if (!noError && this._lastMaxValue < this._lastMinValue) {
                        this.raise("numbers out of order in {} quantifier");
                    }
                    return true;
                }
            }
            if (!noError && (this._uFlag || this.strict)) {
                this.raise("Incomplete quantifier");
            }
            this.rewind(start);
        }
        return false;
    }
    consumeAtom() {
        return (this.consumePatternCharacter() ||
            this.consumeDot() ||
            this.consumeReverseSolidusAtomEscape() ||
            this.consumeCharacterClass() ||
            this.consumeUncapturingGroup() ||
            this.consumeCapturingGroup());
    }
    consumeDot() {
        if (this.eat(FullStop)) {
            this.onAnyCharacterSet(this.index - 1, this.index, "any");
            return true;
        }
        return false;
    }
    consumeReverseSolidusAtomEscape() {
        const start = this.index;
        if (this.eat(ReverseSolidus)) {
            if (this.consumeAtomEscape()) {
                return true;
            }
            this.rewind(start);
        }
        return false;
    }
    consumeUncapturingGroup() {
        const start = this.index;
        if (this.eat3(LeftParenthesis, QuestionMark, Colon)) {
            this.onGroupEnter(start);
            this.consumeDisjunction();
            if (!this.eat(RightParenthesis)) {
                this.raise("Unterminated group");
            }
            this.onGroupLeave(start, this.index);
            return true;
        }
        return false;
    }
    consumeCapturingGroup() {
        const start = this.index;
        if (this.eat(LeftParenthesis)) {
            let name = null;
            if (this.ecmaVersion >= 2018) {
                if (this.consumeGroupSpecifier()) {
                    name = this._lastStrValue;
                }
            }
            else if (this.currentCodePoint === QuestionMark) {
                this.raise("Invalid group");
            }
            this.onCapturingGroupEnter(start, name);
            this.consumeDisjunction();
            if (!this.eat(RightParenthesis)) {
                this.raise("Unterminated group");
            }
            this.onCapturingGroupLeave(start, this.index, name);
            return true;
        }
        return false;
    }
    consumeExtendedAtom() {
        return (this.consumeDot() ||
            this.consumeReverseSolidusAtomEscape() ||
            this.consumeReverseSolidusFollowedByC() ||
            this.consumeCharacterClass() ||
            this.consumeUncapturingGroup() ||
            this.consumeCapturingGroup() ||
            this.consumeInvalidBracedQuantifier() ||
            this.consumeExtendedPatternCharacter());
    }
    consumeReverseSolidusFollowedByC() {
        const start = this.index;
        if (this.currentCodePoint === ReverseSolidus &&
            this.nextCodePoint === LatinSmallLetterC) {
            this._lastIntValue = this.currentCodePoint;
            this.advance();
            this.onCharacter(start, this.index, ReverseSolidus);
            return true;
        }
        return false;
    }
    consumeInvalidBracedQuantifier() {
        if (this.eatBracedQuantifier(true)) {
            this.raise("Nothing to repeat");
        }
        return false;
    }
    consumePatternCharacter() {
        const start = this.index;
        const cp = this.currentCodePoint;
        if (cp !== -1 && !isSyntaxCharacter(cp)) {
            this.advance();
            this.onCharacter(start, this.index, cp);
            return true;
        }
        return false;
    }
    consumeExtendedPatternCharacter() {
        const start = this.index;
        const cp = this.currentCodePoint;
        if (cp !== -1 &&
            cp !== CircumflexAccent &&
            cp !== DollarSign &&
            cp !== ReverseSolidus &&
            cp !== FullStop &&
            cp !== Asterisk &&
            cp !== PlusSign &&
            cp !== QuestionMark &&
            cp !== LeftParenthesis &&
            cp !== RightParenthesis &&
            cp !== LeftSquareBracket &&
            cp !== VerticalLine) {
            this.advance();
            this.onCharacter(start, this.index, cp);
            return true;
        }
        return false;
    }
    consumeGroupSpecifier() {
        if (this.eat(QuestionMark)) {
            if (this.eatGroupName()) {
                if (!this._groupNames.has(this._lastStrValue)) {
                    this._groupNames.add(this._lastStrValue);
                    return true;
                }
                this.raise("Duplicate capture group name");
            }
            this.raise("Invalid group");
        }
        return false;
    }
    consumeAtomEscape() {
        if (this.consumeBackreference() ||
            this.consumeCharacterClassEscape() ||
            this.consumeCharacterEscape() ||
            (this._nFlag && this.consumeKGroupName())) {
            return true;
        }
        if (this.strict || this._uFlag) {
            this.raise("Invalid escape");
        }
        return false;
    }
    consumeBackreference() {
        const start = this.index;
        if (this.eatDecimalEscape()) {
            const n = this._lastIntValue;
            if (n <= this._numCapturingParens) {
                this.onBackreference(start - 1, this.index, n);
                return true;
            }
            if (this.strict || this._uFlag) {
                this.raise("Invalid escape");
            }
            this.rewind(start);
        }
        return false;
    }
    consumeCharacterClassEscape() {
        const start = this.index;
        if (this.eat(LatinSmallLetterD)) {
            this._lastIntValue = -1;
            this.onEscapeCharacterSet(start - 1, this.index, "digit", false);
            return true;
        }
        if (this.eat(LatinCapitalLetterD)) {
            this._lastIntValue = -1;
            this.onEscapeCharacterSet(start - 1, this.index, "digit", true);
            return true;
        }
        if (this.eat(LatinSmallLetterS)) {
            this._lastIntValue = -1;
            this.onEscapeCharacterSet(start - 1, this.index, "space", false);
            return true;
        }
        if (this.eat(LatinCapitalLetterS)) {
            this._lastIntValue = -1;
            this.onEscapeCharacterSet(start - 1, this.index, "space", true);
            return true;
        }
        if (this.eat(LatinSmallLetterW)) {
            this._lastIntValue = -1;
            this.onEscapeCharacterSet(start - 1, this.index, "word", false);
            return true;
        }
        if (this.eat(LatinCapitalLetterW)) {
            this._lastIntValue = -1;
            this.onEscapeCharacterSet(start - 1, this.index, "word", true);
            return true;
        }
        let negate = false;
        if (this._uFlag &&
            this.ecmaVersion >= 2018 &&
            (this.eat(LatinSmallLetterP) ||
                (negate = this.eat(LatinCapitalLetterP)))) {
            this._lastIntValue = -1;
            if (this.eat(LeftCurlyBracket) &&
                this.eatUnicodePropertyValueExpression() &&
                this.eat(RightCurlyBracket)) {
                this.onUnicodePropertyCharacterSet(start - 1, this.index, "property", this._lastKeyValue, this._lastValValue || null, negate);
                return true;
            }
            this.raise("Invalid property name");
        }
        return false;
    }
    consumeCharacterEscape() {
        const start = this.index;
        if (this.eatControlEscape() ||
            this.eatCControlLetter() ||
            this.eatZero() ||
            this.eatHexEscapeSequence() ||
            this.eatRegExpUnicodeEscapeSequence() ||
            (!this.strict &&
                !this._uFlag &&
                this.eatLegacyOctalEscapeSequence()) ||
            this.eatIdentityEscape()) {
            this.onCharacter(start - 1, this.index, this._lastIntValue);
            return true;
        }
        return false;
    }
    consumeKGroupName() {
        const start = this.index;
        if (this.eat(LatinSmallLetterK)) {
            if (this.eatGroupName()) {
                const groupName = this._lastStrValue;
                this._backreferenceNames.add(groupName);
                this.onBackreference(start - 1, this.index, groupName);
                return true;
            }
            this.raise("Invalid named reference");
        }
        return false;
    }
    consumeCharacterClass() {
        const start = this.index;
        if (this.eat(LeftSquareBracket)) {
            const negate = this.eat(CircumflexAccent);
            this.onCharacterClassEnter(start, negate);
            this.consumeClassRanges();
            if (!this.eat(RightSquareBracket)) {
                this.raise("Unterminated character class");
            }
            this.onCharacterClassLeave(start, this.index, negate);
            return true;
        }
        return false;
    }
    consumeClassRanges() {
        const strict = this.strict || this._uFlag;
        for (;;) {
            const rangeStart = this.index;
            if (!this.consumeClassAtom()) {
                break;
            }
            const min = this._lastIntValue;
            if (!this.eat(HyphenMinus)) {
                continue;
            }
            this.onCharacter(this.index - 1, this.index, HyphenMinus);
            if (!this.consumeClassAtom()) {
                break;
            }
            const max = this._lastIntValue;
            if (min === -1 || max === -1) {
                if (strict) {
                    this.raise("Invalid character class");
                }
                continue;
            }
            if (min > max) {
                this.raise("Range out of order in character class");
            }
            this.onCharacterClassRange(rangeStart, this.index, min, max);
        }
    }
    consumeClassAtom() {
        const start = this.index;
        const cp = this.currentCodePoint;
        if (cp !== -1 && cp !== ReverseSolidus && cp !== RightSquareBracket) {
            this.advance();
            this._lastIntValue = cp;
            this.onCharacter(start, this.index, this._lastIntValue);
            return true;
        }
        if (this.eat(ReverseSolidus)) {
            if (this.consumeClassEscape()) {
                return true;
            }
            if (!this.strict && this.currentCodePoint === LatinSmallLetterC) {
                this._lastIntValue = ReverseSolidus;
                this.onCharacter(start, this.index, this._lastIntValue);
                return true;
            }
            if (this.strict || this._uFlag) {
                this.raise("Invalid escape");
            }
            this.rewind(start);
        }
        return false;
    }
    consumeClassEscape() {
        const start = this.index;
        if (this.eat(LatinSmallLetterB)) {
            this._lastIntValue = Backspace;
            this.onCharacter(start - 1, this.index, this._lastIntValue);
            return true;
        }
        if (this._uFlag && this.eat(HyphenMinus)) {
            this._lastIntValue = HyphenMinus;
            this.onCharacter(start - 1, this.index, this._lastIntValue);
            return true;
        }
        let cp = 0;
        if (!this.strict &&
            !this._uFlag &&
            this.currentCodePoint === LatinSmallLetterC &&
            (isDecimalDigit((cp = this.nextCodePoint)) || cp === LowLine)) {
            this.advance();
            this.advance();
            this._lastIntValue = cp % 0x20;
            this.onCharacter(start - 1, this.index, this._lastIntValue);
            return true;
        }
        return (this.consumeCharacterClassEscape() || this.consumeCharacterEscape());
    }
    eatGroupName() {
        if (this.eat(LessThanSign)) {
            if (this.eatRegExpIdentifierName() && this.eat(GreaterThanSign)) {
                return true;
            }
            this.raise("Invalid capture group name");
        }
        return false;
    }
    eatRegExpIdentifierName() {
        if (this.eatRegExpIdentifierStart()) {
            this._lastStrValue = String.fromCodePoint(this._lastIntValue);
            while (this.eatRegExpIdentifierPart()) {
                this._lastStrValue += String.fromCodePoint(this._lastIntValue);
            }
            return true;
        }
        return false;
    }
    eatRegExpIdentifierStart() {
        const start = this.index;
        const forceUFlag = !this._uFlag && this.ecmaVersion >= 2020;
        let cp = this.currentCodePoint;
        this.advance();
        if (cp === ReverseSolidus &&
            this.eatRegExpUnicodeEscapeSequence(forceUFlag)) {
            cp = this._lastIntValue;
        }
        else if (forceUFlag &&
            isLeadSurrogate(cp) &&
            isTrailSurrogate(this.currentCodePoint)) {
            cp = combineSurrogatePair(cp, this.currentCodePoint);
            this.advance();
        }
        if (isRegExpIdentifierStart(cp)) {
            this._lastIntValue = cp;
            return true;
        }
        if (this.index !== start) {
            this.rewind(start);
        }
        return false;
    }
    eatRegExpIdentifierPart() {
        const start = this.index;
        const forceUFlag = !this._uFlag && this.ecmaVersion >= 2020;
        let cp = this.currentCodePoint;
        this.advance();
        if (cp === ReverseSolidus &&
            this.eatRegExpUnicodeEscapeSequence(forceUFlag)) {
            cp = this._lastIntValue;
        }
        else if (forceUFlag &&
            isLeadSurrogate(cp) &&
            isTrailSurrogate(this.currentCodePoint)) {
            cp = combineSurrogatePair(cp, this.currentCodePoint);
            this.advance();
        }
        if (isRegExpIdentifierPart(cp)) {
            this._lastIntValue = cp;
            return true;
        }
        if (this.index !== start) {
            this.rewind(start);
        }
        return false;
    }
    eatCControlLetter() {
        const start = this.index;
        if (this.eat(LatinSmallLetterC)) {
            if (this.eatControlLetter()) {
                return true;
            }
            this.rewind(start);
        }
        return false;
    }
    eatZero() {
        if (this.currentCodePoint === DigitZero &&
            !isDecimalDigit(this.nextCodePoint)) {
            this._lastIntValue = 0;
            this.advance();
            return true;
        }
        return false;
    }
    eatControlEscape() {
        if (this.eat(LatinSmallLetterF)) {
            this._lastIntValue = FormFeed;
            return true;
        }
        if (this.eat(LatinSmallLetterN)) {
            this._lastIntValue = LineFeed;
            return true;
        }
        if (this.eat(LatinSmallLetterR)) {
            this._lastIntValue = CarriageReturn;
            return true;
        }
        if (this.eat(LatinSmallLetterT)) {
            this._lastIntValue = CharacterTabulation;
            return true;
        }
        if (this.eat(LatinSmallLetterV)) {
            this._lastIntValue = LineTabulation;
            return true;
        }
        return false;
    }
    eatControlLetter() {
        const cp = this.currentCodePoint;
        if (isLatinLetter(cp)) {
            this.advance();
            this._lastIntValue = cp % 0x20;
            return true;
        }
        return false;
    }
    eatRegExpUnicodeEscapeSequence(forceUFlag = false) {
        const start = this.index;
        const uFlag = forceUFlag || this._uFlag;
        if (this.eat(LatinSmallLetterU)) {
            if ((uFlag && this.eatRegExpUnicodeSurrogatePairEscape()) ||
                this.eatFixedHexDigits(4) ||
                (uFlag && this.eatRegExpUnicodeCodePointEscape())) {
                return true;
            }
            if (this.strict || uFlag) {
                this.raise("Invalid unicode escape");
            }
            this.rewind(start);
        }
        return false;
    }
    eatRegExpUnicodeSurrogatePairEscape() {
        const start = this.index;
        if (this.eatFixedHexDigits(4)) {
            const lead = this._lastIntValue;
            if (isLeadSurrogate(lead) &&
                this.eat(ReverseSolidus) &&
                this.eat(LatinSmallLetterU) &&
                this.eatFixedHexDigits(4)) {
                const trail = this._lastIntValue;
                if (isTrailSurrogate(trail)) {
                    this._lastIntValue = combineSurrogatePair(lead, trail);
                    return true;
                }
            }
            this.rewind(start);
        }
        return false;
    }
    eatRegExpUnicodeCodePointEscape() {
        const start = this.index;
        if (this.eat(LeftCurlyBracket) &&
            this.eatHexDigits() &&
            this.eat(RightCurlyBracket) &&
            isValidUnicode(this._lastIntValue)) {
            return true;
        }
        this.rewind(start);
        return false;
    }
    eatIdentityEscape() {
        const cp = this.currentCodePoint;
        if (this.isValidIdentityEscape(cp)) {
            this._lastIntValue = cp;
            this.advance();
            return true;
        }
        return false;
    }
    isValidIdentityEscape(cp) {
        if (cp === -1) {
            return false;
        }
        if (this._uFlag) {
            return isSyntaxCharacter(cp) || cp === Solidus;
        }
        if (this.strict) {
            return !isIdContinue(cp);
        }
        if (this._nFlag) {
            return !(cp === LatinSmallLetterC || cp === LatinSmallLetterK);
        }
        return cp !== LatinSmallLetterC;
    }
    eatDecimalEscape() {
        this._lastIntValue = 0;
        let cp = this.currentCodePoint;
        if (cp >= DigitOne && cp <= DigitNine) {
            do {
                this._lastIntValue = 10 * this._lastIntValue + (cp - DigitZero);
                this.advance();
            } while ((cp = this.currentCodePoint) >= DigitZero &&
                cp <= DigitNine);
            return true;
        }
        return false;
    }
    eatUnicodePropertyValueExpression() {
        const start = this.index;
        if (this.eatUnicodePropertyName() && this.eat(EqualsSign)) {
            this._lastKeyValue = this._lastStrValue;
            if (this.eatUnicodePropertyValue()) {
                this._lastValValue = this._lastStrValue;
                if (isValidUnicodeProperty(this.ecmaVersion, this._lastKeyValue, this._lastValValue)) {
                    return true;
                }
                this.raise("Invalid property name");
            }
        }
        this.rewind(start);
        if (this.eatLoneUnicodePropertyNameOrValue()) {
            const nameOrValue = this._lastStrValue;
            if (isValidUnicodeProperty(this.ecmaVersion, "General_Category", nameOrValue)) {
                this._lastKeyValue = "General_Category";
                this._lastValValue = nameOrValue;
                return true;
            }
            if (isValidLoneUnicodeProperty(this.ecmaVersion, nameOrValue)) {
                this._lastKeyValue = nameOrValue;
                this._lastValValue = "";
                return true;
            }
            this.raise("Invalid property name");
        }
        return false;
    }
    eatUnicodePropertyName() {
        this._lastStrValue = "";
        while (isUnicodePropertyNameCharacter(this.currentCodePoint)) {
            this._lastStrValue += String.fromCodePoint(this.currentCodePoint);
            this.advance();
        }
        return this._lastStrValue !== "";
    }
    eatUnicodePropertyValue() {
        this._lastStrValue = "";
        while (isUnicodePropertyValueCharacter(this.currentCodePoint)) {
            this._lastStrValue += String.fromCodePoint(this.currentCodePoint);
            this.advance();
        }
        return this._lastStrValue !== "";
    }
    eatLoneUnicodePropertyNameOrValue() {
        return this.eatUnicodePropertyValue();
    }
    eatHexEscapeSequence() {
        const start = this.index;
        if (this.eat(LatinSmallLetterX)) {
            if (this.eatFixedHexDigits(2)) {
                return true;
            }
            if (this._uFlag || this.strict) {
                this.raise("Invalid escape");
            }
            this.rewind(start);
        }
        return false;
    }
    eatDecimalDigits() {
        const start = this.index;
        this._lastIntValue = 0;
        while (isDecimalDigit(this.currentCodePoint)) {
            this._lastIntValue =
                10 * this._lastIntValue + digitToInt(this.currentCodePoint);
            this.advance();
        }
        return this.index !== start;
    }
    eatHexDigits() {
        const start = this.index;
        this._lastIntValue = 0;
        while (isHexDigit(this.currentCodePoint)) {
            this._lastIntValue =
                16 * this._lastIntValue + digitToInt(this.currentCodePoint);
            this.advance();
        }
        return this.index !== start;
    }
    eatLegacyOctalEscapeSequence() {
        if (this.eatOctalDigit()) {
            const n1 = this._lastIntValue;
            if (this.eatOctalDigit()) {
                const n2 = this._lastIntValue;
                if (n1 <= 3 && this.eatOctalDigit()) {
                    this._lastIntValue = n1 * 64 + n2 * 8 + this._lastIntValue;
                }
                else {
                    this._lastIntValue = n1 * 8 + n2;
                }
            }
            else {
                this._lastIntValue = n1;
            }
            return true;
        }
        return false;
    }
    eatOctalDigit() {
        const cp = this.currentCodePoint;
        if (isOctalDigit(cp)) {
            this.advance();
            this._lastIntValue = cp - DigitZero;
            return true;
        }
        this._lastIntValue = 0;
        return false;
    }
    eatFixedHexDigits(length) {
        const start = this.index;
        this._lastIntValue = 0;
        for (let i = 0; i < length; ++i) {
            const cp = this.currentCodePoint;
            if (!isHexDigit(cp)) {
                this.rewind(start);
                return false;
            }
            this._lastIntValue = 16 * this._lastIntValue + digitToInt(cp);
            this.advance();
        }
        return true;
    }
}

const DummyPattern = {};
const DummyFlags = {};
const DummyCapturingGroup = {};
class RegExpParserState {
    constructor(options) {
        this._node = DummyPattern;
        this._flags = DummyFlags;
        this._backreferences = [];
        this._capturingGroups = [];
        this.source = "";
        this.strict = Boolean(options && options.strict);
        this.ecmaVersion = (options && options.ecmaVersion) || 2022;
    }
    get pattern() {
        if (this._node.type !== "Pattern") {
            throw new Error("UnknownError");
        }
        return this._node;
    }
    get flags() {
        if (this._flags.type !== "Flags") {
            throw new Error("UnknownError");
        }
        return this._flags;
    }
    onFlags(start, end, global, ignoreCase, multiline, unicode, sticky, dotAll, hasIndices) {
        this._flags = {
            type: "Flags",
            parent: null,
            start,
            end,
            raw: this.source.slice(start, end),
            global,
            ignoreCase,
            multiline,
            unicode,
            sticky,
            dotAll,
            hasIndices,
        };
    }
    onPatternEnter(start) {
        this._node = {
            type: "Pattern",
            parent: null,
            start,
            end: start,
            raw: "",
            alternatives: [],
        };
        this._backreferences.length = 0;
        this._capturingGroups.length = 0;
    }
    onPatternLeave(start, end) {
        this._node.end = end;
        this._node.raw = this.source.slice(start, end);
        for (const reference of this._backreferences) {
            const ref = reference.ref;
            const group = typeof ref === "number"
                ? this._capturingGroups[ref - 1]
                : this._capturingGroups.find(g => g.name === ref);
            reference.resolved = group;
            group.references.push(reference);
        }
    }
    onAlternativeEnter(start) {
        const parent = this._node;
        if (parent.type !== "Assertion" &&
            parent.type !== "CapturingGroup" &&
            parent.type !== "Group" &&
            parent.type !== "Pattern") {
            throw new Error("UnknownError");
        }
        this._node = {
            type: "Alternative",
            parent,
            start,
            end: start,
            raw: "",
            elements: [],
        };
        parent.alternatives.push(this._node);
    }
    onAlternativeLeave(start, end) {
        const node = this._node;
        if (node.type !== "Alternative") {
            throw new Error("UnknownError");
        }
        node.end = end;
        node.raw = this.source.slice(start, end);
        this._node = node.parent;
    }
    onGroupEnter(start) {
        const parent = this._node;
        if (parent.type !== "Alternative") {
            throw new Error("UnknownError");
        }
        this._node = {
            type: "Group",
            parent,
            start,
            end: start,
            raw: "",
            alternatives: [],
        };
        parent.elements.push(this._node);
    }
    onGroupLeave(start, end) {
        const node = this._node;
        if (node.type !== "Group" || node.parent.type !== "Alternative") {
            throw new Error("UnknownError");
        }
        node.end = end;
        node.raw = this.source.slice(start, end);
        this._node = node.parent;
    }
    onCapturingGroupEnter(start, name) {
        const parent = this._node;
        if (parent.type !== "Alternative") {
            throw new Error("UnknownError");
        }
        this._node = {
            type: "CapturingGroup",
            parent,
            start,
            end: start,
            raw: "",
            name,
            alternatives: [],
            references: [],
        };
        parent.elements.push(this._node);
        this._capturingGroups.push(this._node);
    }
    onCapturingGroupLeave(start, end) {
        const node = this._node;
        if (node.type !== "CapturingGroup" ||
            node.parent.type !== "Alternative") {
            throw new Error("UnknownError");
        }
        node.end = end;
        node.raw = this.source.slice(start, end);
        this._node = node.parent;
    }
    onQuantifier(start, end, min, max, greedy) {
        const parent = this._node;
        if (parent.type !== "Alternative") {
            throw new Error("UnknownError");
        }
        const element = parent.elements.pop();
        if (element == null ||
            element.type === "Quantifier" ||
            (element.type === "Assertion" && element.kind !== "lookahead")) {
            throw new Error("UnknownError");
        }
        const node = {
            type: "Quantifier",
            parent,
            start: element.start,
            end,
            raw: this.source.slice(element.start, end),
            min,
            max,
            greedy,
            element,
        };
        parent.elements.push(node);
        element.parent = node;
    }
    onLookaroundAssertionEnter(start, kind, negate) {
        const parent = this._node;
        if (parent.type !== "Alternative") {
            throw new Error("UnknownError");
        }
        const node = (this._node = {
            type: "Assertion",
            parent,
            start,
            end: start,
            raw: "",
            kind,
            negate,
            alternatives: [],
        });
        parent.elements.push(node);
    }
    onLookaroundAssertionLeave(start, end) {
        const node = this._node;
        if (node.type !== "Assertion" || node.parent.type !== "Alternative") {
            throw new Error("UnknownError");
        }
        node.end = end;
        node.raw = this.source.slice(start, end);
        this._node = node.parent;
    }
    onEdgeAssertion(start, end, kind) {
        const parent = this._node;
        if (parent.type !== "Alternative") {
            throw new Error("UnknownError");
        }
        parent.elements.push({
            type: "Assertion",
            parent,
            start,
            end,
            raw: this.source.slice(start, end),
            kind,
        });
    }
    onWordBoundaryAssertion(start, end, kind, negate) {
        const parent = this._node;
        if (parent.type !== "Alternative") {
            throw new Error("UnknownError");
        }
        parent.elements.push({
            type: "Assertion",
            parent,
            start,
            end,
            raw: this.source.slice(start, end),
            kind,
            negate,
        });
    }
    onAnyCharacterSet(start, end, kind) {
        const parent = this._node;
        if (parent.type !== "Alternative") {
            throw new Error("UnknownError");
        }
        parent.elements.push({
            type: "CharacterSet",
            parent,
            start,
            end,
            raw: this.source.slice(start, end),
            kind,
        });
    }
    onEscapeCharacterSet(start, end, kind, negate) {
        const parent = this._node;
        if (parent.type !== "Alternative" && parent.type !== "CharacterClass") {
            throw new Error("UnknownError");
        }
        parent.elements.push({
            type: "CharacterSet",
            parent,
            start,
            end,
            raw: this.source.slice(start, end),
            kind,
            negate,
        });
    }
    onUnicodePropertyCharacterSet(start, end, kind, key, value, negate) {
        const parent = this._node;
        if (parent.type !== "Alternative" && parent.type !== "CharacterClass") {
            throw new Error("UnknownError");
        }
        parent.elements.push({
            type: "CharacterSet",
            parent,
            start,
            end,
            raw: this.source.slice(start, end),
            kind,
            key,
            value,
            negate,
        });
    }
    onCharacter(start, end, value) {
        const parent = this._node;
        if (parent.type !== "Alternative" && parent.type !== "CharacterClass") {
            throw new Error("UnknownError");
        }
        parent.elements.push({
            type: "Character",
            parent,
            start,
            end,
            raw: this.source.slice(start, end),
            value,
        });
    }
    onBackreference(start, end, ref) {
        const parent = this._node;
        if (parent.type !== "Alternative") {
            throw new Error("UnknownError");
        }
        const node = {
            type: "Backreference",
            parent,
            start,
            end,
            raw: this.source.slice(start, end),
            ref,
            resolved: DummyCapturingGroup,
        };
        parent.elements.push(node);
        this._backreferences.push(node);
    }
    onCharacterClassEnter(start, negate) {
        const parent = this._node;
        if (parent.type !== "Alternative") {
            throw new Error("UnknownError");
        }
        this._node = {
            type: "CharacterClass",
            parent,
            start,
            end: start,
            raw: "",
            negate,
            elements: [],
        };
        parent.elements.push(this._node);
    }
    onCharacterClassLeave(start, end) {
        const node = this._node;
        if (node.type !== "CharacterClass" ||
            node.parent.type !== "Alternative") {
            throw new Error("UnknownError");
        }
        node.end = end;
        node.raw = this.source.slice(start, end);
        this._node = node.parent;
    }
    onCharacterClassRange(start, end) {
        const parent = this._node;
        if (parent.type !== "CharacterClass") {
            throw new Error("UnknownError");
        }
        const elements = parent.elements;
        const max = elements.pop();
        const hyphen = elements.pop();
        const min = elements.pop();
        if (!min ||
            !max ||
            !hyphen ||
            min.type !== "Character" ||
            max.type !== "Character" ||
            hyphen.type !== "Character" ||
            hyphen.value !== HyphenMinus) {
            throw new Error("UnknownError");
        }
        const node = {
            type: "CharacterClassRange",
            parent,
            start,
            end,
            raw: this.source.slice(start, end),
            min,
            max,
        };
        min.parent = node;
        max.parent = node;
        elements.push(node);
    }
}
class RegExpParser {
    constructor(options) {
        this._state = new RegExpParserState(options);
        this._validator = new RegExpValidator(this._state);
    }
    parseLiteral(source, start = 0, end = source.length) {
        this._state.source = source;
        this._validator.validateLiteral(source, start, end);
        const pattern = this._state.pattern;
        const flags = this._state.flags;
        const literal = {
            type: "RegExpLiteral",
            parent: null,
            start,
            end,
            raw: source,
            pattern,
            flags,
        };
        pattern.parent = literal;
        flags.parent = literal;
        return literal;
    }
    parseFlags(source, start = 0, end = source.length) {
        this._state.source = source;
        this._validator.validateFlags(source, start, end);
        return this._state.flags;
    }
    parsePattern(source, start = 0, end = source.length, uFlag = false) {
        this._state.source = source;
        this._validator.validatePattern(source, start, end, uFlag);
        return this._state.pattern;
    }
}

class RegExpVisitor {
    constructor(handlers) {
        this._handlers = handlers;
    }
    visit(node) {
        switch (node.type) {
            case "Alternative":
                this.visitAlternative(node);
                break;
            case "Assertion":
                this.visitAssertion(node);
                break;
            case "Backreference":
                this.visitBackreference(node);
                break;
            case "CapturingGroup":
                this.visitCapturingGroup(node);
                break;
            case "Character":
                this.visitCharacter(node);
                break;
            case "CharacterClass":
                this.visitCharacterClass(node);
                break;
            case "CharacterClassRange":
                this.visitCharacterClassRange(node);
                break;
            case "CharacterSet":
                this.visitCharacterSet(node);
                break;
            case "Flags":
                this.visitFlags(node);
                break;
            case "Group":
                this.visitGroup(node);
                break;
            case "Pattern":
                this.visitPattern(node);
                break;
            case "Quantifier":
                this.visitQuantifier(node);
                break;
            case "RegExpLiteral":
                this.visitRegExpLiteral(node);
                break;
            default:
                throw new Error(`Unknown type: ${node.type}`);
        }
    }
    visitAlternative(node) {
        if (this._handlers.onAlternativeEnter) {
            this._handlers.onAlternativeEnter(node);
        }
        node.elements.forEach(this.visit, this);
        if (this._handlers.onAlternativeLeave) {
            this._handlers.onAlternativeLeave(node);
        }
    }
    visitAssertion(node) {
        if (this._handlers.onAssertionEnter) {
            this._handlers.onAssertionEnter(node);
        }
        if (node.kind === "lookahead" || node.kind === "lookbehind") {
            node.alternatives.forEach(this.visit, this);
        }
        if (this._handlers.onAssertionLeave) {
            this._handlers.onAssertionLeave(node);
        }
    }
    visitBackreference(node) {
        if (this._handlers.onBackreferenceEnter) {
            this._handlers.onBackreferenceEnter(node);
        }
        if (this._handlers.onBackreferenceLeave) {
            this._handlers.onBackreferenceLeave(node);
        }
    }
    visitCapturingGroup(node) {
        if (this._handlers.onCapturingGroupEnter) {
            this._handlers.onCapturingGroupEnter(node);
        }
        node.alternatives.forEach(this.visit, this);
        if (this._handlers.onCapturingGroupLeave) {
            this._handlers.onCapturingGroupLeave(node);
        }
    }
    visitCharacter(node) {
        if (this._handlers.onCharacterEnter) {
            this._handlers.onCharacterEnter(node);
        }
        if (this._handlers.onCharacterLeave) {
            this._handlers.onCharacterLeave(node);
        }
    }
    visitCharacterClass(node) {
        if (this._handlers.onCharacterClassEnter) {
            this._handlers.onCharacterClassEnter(node);
        }
        node.elements.forEach(this.visit, this);
        if (this._handlers.onCharacterClassLeave) {
            this._handlers.onCharacterClassLeave(node);
        }
    }
    visitCharacterClassRange(node) {
        if (this._handlers.onCharacterClassRangeEnter) {
            this._handlers.onCharacterClassRangeEnter(node);
        }
        this.visitCharacter(node.min);
        this.visitCharacter(node.max);
        if (this._handlers.onCharacterClassRangeLeave) {
            this._handlers.onCharacterClassRangeLeave(node);
        }
    }
    visitCharacterSet(node) {
        if (this._handlers.onCharacterSetEnter) {
            this._handlers.onCharacterSetEnter(node);
        }
        if (this._handlers.onCharacterSetLeave) {
            this._handlers.onCharacterSetLeave(node);
        }
    }
    visitFlags(node) {
        if (this._handlers.onFlagsEnter) {
            this._handlers.onFlagsEnter(node);
        }
        if (this._handlers.onFlagsLeave) {
            this._handlers.onFlagsLeave(node);
        }
    }
    visitGroup(node) {
        if (this._handlers.onGroupEnter) {
            this._handlers.onGroupEnter(node);
        }
        node.alternatives.forEach(this.visit, this);
        if (this._handlers.onGroupLeave) {
            this._handlers.onGroupLeave(node);
        }
    }
    visitPattern(node) {
        if (this._handlers.onPatternEnter) {
            this._handlers.onPatternEnter(node);
        }
        node.alternatives.forEach(this.visit, this);
        if (this._handlers.onPatternLeave) {
            this._handlers.onPatternLeave(node);
        }
    }
    visitQuantifier(node) {
        if (this._handlers.onQuantifierEnter) {
            this._handlers.onQuantifierEnter(node);
        }
        this.visit(node.element);
        if (this._handlers.onQuantifierLeave) {
            this._handlers.onQuantifierLeave(node);
        }
    }
    visitRegExpLiteral(node) {
        if (this._handlers.onRegExpLiteralEnter) {
            this._handlers.onRegExpLiteralEnter(node);
        }
        this.visitPattern(node.pattern);
        this.visitFlags(node.flags);
        if (this._handlers.onRegExpLiteralLeave) {
            this._handlers.onRegExpLiteralLeave(node);
        }
    }
}

function parseRegExpLiteral(source, options) {
    return new RegExpParser(options).parseLiteral(String(source));
}
function visitRegExpAST(node, handlers) {
    new RegExpVisitor(handlers).visit(node);
}

/**
 * Form validation engine.
 * Extends `Fuxcel` with rich real-time validation, error-bag tracking,
 * field-type detection, and step-form support.
 */
class FuxcelValidator extends Fuxcel {
    #_fxValidatorConfig = FuxcelValidator.defaultValidatorConfig;
    // ─── Custom Events ─────────────────────────────────────────────
    /**
     * On Validator Init
     *
     * @type {CustomEventType}
     */
    static fxValidatorInitEvent = new CustomEvent('fx.validator.init', {
        bubbles: true,
        cancelable: true,
        detail: { plugin: 'Fuxcel', interface: 'FuxcelValidatorInterface', timestamp: Date.now() },
    });
    /**
     * On Validator Loading
     *
     * @type {CustomEventType}
     */
    static fxValidatorLoadingEvent = new CustomEvent('fx.validator.loading', {
        bubbles: true,
        cancelable: true,
        detail: { plugin: 'Fuxcel', interface: 'FuxcelValidatorInterface', timestamp: Date.now() },
    });
    /**
     * On Validator Ready
     *
     * @type {CustomEventType}
     */
    static fxValidatorReadyEvent = new CustomEvent('fx.validator.ready', {
        bubbles: true,
        detail: { plugin: 'Fuxcel', interface: 'FuxcelValidatorInterface', timestamp: Date.now() },
    });
    /**
     * On Validator Init failed
     *
     * @type {CustomEventType}
     */
    static fxValidatorFailedEvent = new CustomEvent('fx.validator.failed', {
        bubbles: true,
        detail: { plugin: 'Fuxcel', interface: 'FuxcelValidatorInterface', timestamp: Date.now() },
    });
    /**
     * Default Validator configuration.
     *
     * @type {ValidatorConfigObject}
     * @private
     */
    static #_defaultConfig = {
        regExp: {
            cardCVV: /^\d{3,4}$/gi,
            cardNumber: /^(?=.{12,19}$)\d{12,19}$/gi,
            email: /^[a-zA-Z][a-zA-Z0-9._%+\-]{0,63}@[a-zA-Z][a-zA-Z0-9.\-]{0,253}\.[a-zA-Z]{2,}$/gi,
            name: /^([a-zA-Z]{2,255})(\s[a-zA-Z]{2,255}){1,2}$/gi,
            phone: /^\+?(\d{1,3})?[-.\s]?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/g,
            username: /^(?=.{2,255}$)[a-zA-Z][a-zA-Z0-9]*(_[a-zA-Z0-9]+)*[a-zA-Z0-9]?$/gi,
            password: /^(?=.*[a-z]).{8,32}$/gi,
        },
        config: {
            capslockAlert: true,
            showIcons: true,
            showPassword: true,
            validateCard: false,
            validateEmail: true,
            validateName: false,
            validatePassword: true,
            validatePhone: false,
            validateUsername: false,
            nativeValidation: false,
            useDefaultStyling: false,
            showPasswordStrength: false,
            passwordConfirmId: 'password_confirmation',
            passwordId: 'password',
            initWrapper: '.form-group',
        },
        stepForm: {
            use: false,
            plugin: false,
            config: { step: '.fx-step', slides: false, switch: '[data-step]' },
        },
        texts: {
            capslockFormat: '⚠ Caps Lock is on.',
            emailFormat: null,
            nameFormat: null,
            passwordFormat: 'Password requires between 8-32 characters.',
            phoneFormat: null,
            usernameFormat: null,
        },
    };
    static #_initSteps = {};
    static #_stepsClass = '.fx-step';
    /**
     * Form Validation Registry.
     *
     * @type {FormValidationRegistryBag}
     * @private
     */
    static #_registry = {};
    /**
     * Injectable FuxcelSteps constructor.
     * Populated by index.ts to break the FuxcelValidator → FuxcelSteps circular dependency.
     * @internal
     */
    static _stepsFactory = null;
    /**
     * Injectable fxModal function.
     * Populated by index.ts to break the FuxcelValidator → fxModal circular dependency.
     * @internal
     */
    static _fxModal = null;
    constructor(selector, context) {
        super(selector, context);
    }
    // ─── Private Static Helpers ───────────────────────────────────────────────
    /**
     * Resets the registry slot for a given formId.
     * Called only on explicit re-init, not on every instance creation.
     */
    static #_clearFormRegistry(formId) {
        FuxcelValidator.#_registry[formId] = { configObject: FuxcelValidator.defaultValidatorConfig, bag: {}, count: 0, steps: {} };
    }
    /**
     * Returns the registry slot for a given formId, creating it if absent.
     * Never resets an existing slot — use #_clearFormRegistry to do that explicitly.
     */
    static #_getFormRegistry(formId) {
        if (!FuxcelValidator.#_registry[formId])
            FuxcelValidator.#_registry[formId] = { configObject: FuxcelValidator.defaultValidatorConfig, bag: {}, count: 0, steps: {} };
        return FuxcelValidator.#_registry[formId];
    }
    static #_calcPasswordStrength(password, userRegex) {
        if (!userRegex)
            return null;
        const rules = FuxcelValidator.#_extractRulesFromRegex(userRegex);
        const passed = [];
        const failed = [];
        let score = 0;
        for (const rule of rules) {
            if (rule.regex.test(password)) {
                passed.push(rule.name);
                score += rule.weight;
            }
            else {
                failed.push(rule.name);
            }
        }
        // Length bonus — rewards going beyond the minimum
        const lengthRule = rules.find(r => r.name.includes('characters'));
        if (lengthRule) {
            const minMatch = lengthRule.name.match(/\d+/);
            const min = minMatch ? parseInt(minMatch[0]) : 8;
            const bonus = Math.min(Math.floor((password.length - min) / 4), 3) * 3;
            score = Math.min(score + (password.length >= min ? bonus : 0), 100);
        }
        const label = score >= 80 ? 'strong' : score >= 60 ? 'good' : score >= 35 ? 'fair' : 'weak';
        const color = label === 'strong' ? '#1D9E75' : label === 'good' ? '#185FA5' : label === 'fair' ? '#BA7517' : '#E24B4A';
        return {
            score,
            color,
            label,
            passed,
            failed,
            rules,
        };
    }
    static #_extractRulesFromRegex(userRegex, flags = 'u') {
        const ast = parseRegExpLiteral(userRegex.toString());
        const lookaheads = [];
        visitRegExpAST(ast, {
            onAssertionEnter(node) {
                if (node.kind === 'lookahead' && !node.negate) {
                    lookaheads.push(node);
                }
            }
        });
        // Distribute weight evenly across all lookaheads
        // Reserve 20 points for length, split the rest equally
        const lookaheadWeight = lookaheads.length ?
            Math.floor(80 / lookaheads.length) : 0;
        const rules = lookaheads.map(node => ({
            name: FuxcelValidator.#_inferRuleName(node.raw),
            // Reconstruct lookahead body as a standalone testable regex
            regex: new RegExp(node.alternatives.map(a => a.raw).join('|'), flags),
            weight: lookaheadWeight,
        }));
        // Always add length rule — extracted from the {min,max} quantifier on the dot
        const lengthRule = FuxcelValidator.#_extractLengthRule(ast);
        if (lengthRule)
            rules.push(lengthRule);
        return rules;
    }
    static #_extractLengthRule(ast) {
        let min = 8; // sensible fallback
        let max = Infinity;
        visitRegExpAST(ast, {
            onQuantifierEnter(node) {
                // Looking for the .{min,max} or .{min,} pattern
                if (node.element.type === 'CharacterSet' && node.element.kind === 'any') {
                    min = node.min;
                    max = node.max ?? Infinity;
                }
            }
        });
        return {
            name: max === Infinity ? `min ${min} characters` : `${min}–${max} characters`,
            regex: max === Infinity ? new RegExp(`^.{${min},}$`, 's') : new RegExp(`^.{${min},${max}}$`, 's'),
            weight: 20,
        };
    }
    static #_inferRuleName(raw) {
        if (/\[a-zA-Z]|\[A-Za-z]/.test(raw))
            return 'letter';
        if (/\[A-Z]/.test(raw))
            return 'uppercase';
        if (/\[a-z]/.test(raw))
            return 'lowercase';
        if (/\\d|\[0-9]/.test(raw))
            return 'number';
        if (/\\W|\[\^A-Za-z0-9]/.test(raw))
            return 'special character';
        if (/\\s/.test(raw))
            return 'whitespace';
        return `pattern(${raw.slice(0, 20)})`;
    }
    static #_toggleValidationIcons(oldIcon, newIcon) {
        const _old = fx(oldIcon);
        const _new = fx(newIcon);
        if (_old.length && _new.length) {
            if (_old.style('display') !== 'none')
                _old.style({ display: 'none' });
            if (_new.style('display') === 'none')
                _new.style({ display: 'inline-block' });
        }
    }
    // ─── Private Instance Helpers ─────────────────────────────────────────────
    /**
     *
     * @param {string | boolean} message
     * @param {string} step
     * @private
     */
    #_manipulateErrorBag(message, step) {
        const fieldAttribs = this.fieldAttributes;
        const formId = fieldAttribs.formId;
        const fieldId = fieldAttribs?.id;
        if (!formId || !fieldId)
            return;
        const formRegistry = FuxcelValidator.#_getFormRegistry(formId);
        if (step) {
            // Step-level bag
            if (!formRegistry.steps[step])
                formRegistry.steps[step] = { bag: {}, count: 0 };
            if (message === true)
                delete formRegistry.steps[step].bag[fieldId];
            else
                formRegistry.steps[step].bag[fieldId] = message;
            formRegistry.steps[step].count = Object.keys(formRegistry.steps[step].bag).length;
        }
        else {
            // Form-level bag
            if (message === true)
                delete formRegistry.bag[fieldId];
            else
                formRegistry.bag[fieldId] = message;
            formRegistry.count = Object.keys(formRegistry.bag).length;
        }
    }
    /**
     * Wraps a Fuxcel selector result as a FuxcelValidator instance,
     * carrying both the validator config and the error bags forward
     * so that sub-instances created during event handling share the
     * exact same validation state as the parent init instance.
     *
     * Uses `new FuxcelValidator()` so all private class fields are
     * properly initialized — `Object.assign()` cannot copy private fields
     * and causes "object is not the right class" errors at runtime.
     */
    #_resetFuxcelObject(fuxcelObj) {
        /*const instance = new FuxcelValidator(fuxcelObj);
        instance.#_fxValidatorConfig = this.#_fxValidatorConfig;
        instance.#_validatorErrorBag = this.#_validatorErrorBag;
        instance.#_validatorErrorCount = this.#_validatorErrorCount;
        return instance;*/
        const instance = new FuxcelValidator(fuxcelObj);
        instance.#_fxValidatorConfig = this.#_fxValidatorConfig;
        return instance;
    }
    #_touchConfig(config = null) {
        const defaults = FuxcelValidator.defaultValidatorConfig;
        if (config)
            this.#_fxValidatorConfig = {
                regExp: { ...defaults.regExp, ...(config.regExp ?? {}) },
                config: { ...defaults.config, ...(config.config ?? {}) },
                stepForm: { ...defaults.stepForm, ...(config.stepForm ?? {}), config: { ...defaults.stepForm?.config, ...(config.stepForm?.config ?? {}) } },
                texts: { ...defaults.texts, ...(config.texts ?? {}) },
            };
        this.each((form, index) => {
            // Programmatically add an id to the for if there is non.
            // Clear this form's registry slot on every explicit .init() call
            // so stale field errors from a previous init don't linger.
            !form.attrib('id') && form.attrib({ id: `fx-current-form-${index}` });
            FuxcelValidator.#_clearFormRegistry(form.attrib('id'));
            FuxcelValidator.#_getFormRegistry(form.attrib('id')).configObject = this.#_fxValidatorConfig;
        });
    }
    // ─── Initialisation ───────────────────────────────────────────────────────
    /**
     *
     * @param {HTMLElement} formGroup
     */
    validateFromGroup(formGroup) {
        return this.#_validate(formGroup);
    }
    #_initValidateForms() {
        let initialized = [];
        this.each(currentForm => {
            const form = currentForm[0];
            const configObject = currentForm.validatorConfig;
            let formId = currentForm.attrib('id');
            let formGroups = fx(`#${formId} .form-group`).formValidator;
            if (form.dispatchEvent(FuxcelValidator.fxValidatorInitEvent)) {
                configObject.config?.nativeValidation ?
                    currentForm.prop({ noValidate: false }) :
                    currentForm.prop({ noValidate: true });
                if (formGroups.length) {
                    if (form.dispatchEvent(FuxcelValidator.fxValidatorLoadingEvent)) {
                        formGroups.each(wrappedFormGroup => {
                            let formGroup = wrappedFormGroup[0];
                            const _field = fx('.form-field', formGroup).formValidator;
                            const _label = fx('label', formGroup).formValidator;
                            if (_field.length && _label.length && _field.length < 2 && _label.length < 2) {
                                if (!_field.attrib('id'))
                                    if (_field.attrib('name'))
                                        _field.attrib({ id: _field.attrib('name').toString().replaceAll('-', '_') });
                                    else {
                                        console.error(`${_field[0].tagName} has no id or name attribute`, _field);
                                        throw `Field element does not have an \`id\` or \`name\` attribute`;
                                    }
                                const fieldId = _field.attrib('id');
                                if (_field.prop('tagName').toString().toLowerCase() === 'input' && !_field.attrib('placeholder'))
                                    _field.attrib({ placeholder: _field.fieldAttributes.fxName?.toTitleCase() });
                                if (!_label.attrib('for') || _label.attrib('for').toLowerCase() !== fieldId.toLowerCase())
                                    _label.attrib('for', fieldId);
                                formGroup = currentForm.#_placeElements(formGroup, _field[0], _label[0]);
                                currentForm.#_validate(formGroup);
                            }
                        });
                        initialized.push(form);
                    }
                    else
                        console.warn(`Initialization interrupted while loading for form: #${formId}`);
                }
                else
                    console.error(`init-wrapper element not found in form: #${formId}`);
            }
            else
                console.warn(`Initialization cancelled for form: #${formId}`);
        });
        initialized.forEach(form => this.toArray.includes(form) ?
            form.dispatchEvent(FuxcelValidator.fxValidatorReadyEvent) :
            form.dispatchEvent(FuxcelValidator.fxValidatorFailedEvent));
        return this /*.#_resetFuxcelObject(this)*/;
    }
    #_initValidateStepForms() {
        this.each((currentForm, index) => {
            const configObject = currentForm.validatorConfig;
            const formId = currentForm.attrib('id');
            const formSteps = fx(`#${formId} ${FuxcelValidator.stepsClass}`).formValidator;
            if (formSteps.length) {
                FuxcelValidator.#_initSteps[index] = formId;
                configObject.config?.nativeValidation ?
                    currentForm.prop({ noValidate: false }) :
                    currentForm.prop({ noValidate: true });
                formSteps.each(wrappedStepDiv => {
                    const stepDiv = wrappedStepDiv[0];
                    const step = stepDiv.dataset.fxStep ?? '0';
                    const formRegistry = FuxcelValidator.#_getFormRegistry(formId);
                    if (!formRegistry.steps[step])
                        formRegistry.steps[step] = { bag: {}, count: 0 };
                    const formGroups = fx('.form-group', stepDiv).formValidator;
                    formGroups.length && formGroups.each(wrappedFormGroup => {
                        let formGroup = wrappedFormGroup[0];
                        const _field = fx('.form-field', formGroup).formValidator;
                        const _label = fx('label', formGroup).formValidator;
                        if (_field.length && _label.length && _field.length < 2 && _label.length < 2) {
                            if (!_field.attrib('id'))
                                if (_field.attrib('name'))
                                    _field.attrib({ id: _field.attrib('name').toString().replaceAll('-', '_') });
                                else
                                    throw `Field element does not have an \`id\` or \`name\` attribute`;
                            const fieldId = _field.attrib('id');
                            if (_field.prop('tagName').toString().toLowerCase() === 'input' && !_field.attrib('placeholder'))
                                _field.attrib({ placeholder: _field.fieldAttributes.fxName?.toTitleCase() });
                            if (!_label.attrib('for') || _label.attrib('for').toLowerCase() !== fieldId.toLowerCase())
                                _label.attrib('for', fieldId);
                            formGroup = currentForm.#_placeElements(formGroup, _field[0], _label[0]);
                            currentForm.#_validate(formGroup);
                        }
                    });
                });
            }
            else
                console.error(`Step elements not found in form: #${formId}`);
        });
        const FuxcelSteps = FuxcelValidator._stepsFactory;
        if (!FuxcelSteps)
            throw new Error('[FuxcelValidator] FuxcelSteps is not registered. Ensure fuxcel/src/index.ts has been loaded.');
        // @ts-ignore
        Object.keys(this).forEach(key => FuxcelSteps.currentlySelected[key] = this[key]);
        return new FuxcelSteps(this);
    }
    #_placeElements(formGroup, fieldEl, labelEl) {
        const SVG_NS = 'http://www.w3.org/2000/svg';
        const formField = fx(fieldEl).formValidator;
        const configObject = this.validatorConfig;
        const isPasswordField = formField.isPasswordField;
        const formFieldGroupId = `${fieldEl.id}_group`;
        const validationText = document.createElement('div');
        const passwordStrength = document.createElement('div');
        const capslockAlertText = document.createElement('div');
        validationText.classList.add('validation-text');
        validationText.innerHTML = '<small>&nbsp;</small>';
        capslockAlertText.classList.add(FuxcelValidator.passwordCapslockAlertClass.replace(/^\./, '') ?? 'capslock-alert');
        capslockAlertText.setAttribute('id', `${fieldEl.id}CapsAlert`);
        capslockAlertText.innerHTML = '<small>&nbsp;</small>';
        passwordStrength.setAttribute('id', `${fieldEl.id}Strength`);
        passwordStrength.classList.add('password-strength');
        passwordStrength.innerHTML = `
			<div class="strength-track">
				<div class="strength-bar"></div>
			</div>
			<small class="strength-label"></small>
		`;
        formGroup.setAttribute('id', formFieldGroupId);
        if (configObject.config?.useDefaultStyling) {
            const newInputGroup = document.createElement('div');
            // const newFormGroupWrapper: HTMLDivElement = document.createElement('div');
            const validationIcons = document.createElement('div');
            const togglePasswordIcons = document.createElement('div');
            newInputGroup.classList.add('input-group');
            formGroup.classList.add('fx-default-style');
            if (configObject.config?.showIcons) {
                const imageCheck = document.createElementNS(SVG_NS, 'svg');
                const imageClose = document.createElementNS(SVG_NS, 'svg');
                const sharedAttributes = {
                    width: '18px',
                    height: '18px',
                    viewBox: '0 0 24 24',
                };
                Object.keys(sharedAttributes).forEach((attr) => {
                    imageCheck.setAttribute(attr, sharedAttributes[attr]);
                    imageClose.setAttribute(attr, sharedAttributes[attr]);
                });
                imageCheck.innerHTML = `
					<path fill="#12B886" d="M 12 2 C 6.4889971 2 2 6.4889971 2 12 C 2 17.511003 6.4889971 22 12 22 C 17.511003 22 22 17.511003 22 12 C 22 6.4889971 17.511003 2 12 2 z M 12 4 C 16.430123 4 20 7.5698774 20 12 C 20 16.430123 16.430123 20 12 20 C 7.5698774 20 4 16.430123 4 12 C 4 7.5698774 7.5698774 4 12 4 z M 16.292969 8.2929688 L 10 14.585938 L 7.7070312 12.292969 L 6.2929688 13.707031 L 10 17.414062 L 17.707031 9.7070312 L 16.292969 8.2929688 z"></path>
				`;
                imageClose.innerHTML = `
					<path fill="#FA5252" d="M 12 2 C 6.4889971 2 2 6.4889971 2 12 C 2 17.511003 6.4889971 22 12 22 C 17.511003 22 22 17.511003 22 12 C 22 6.4889971 17.511003 2 12 2 z M 12 4 C 16.430123 4 20 7.5698774 20 12 C 20 16.430123 16.430123 20 12 20 C 7.5698774 20 4 16.430123 4 12 C 4 7.5698774 7.5698774 4 12 4 z M 8.7070312 7.2929688 L 7.2929688 8.7070312 L 10.585938 12 L 7.2929688 15.292969 L 8.7070312 16.707031 L 12 13.414062 L 15.292969 16.707031 L 16.707031 15.292969 L 13.414062 12 L 16.707031 8.7070312 L 15.292969 7.2929688 L 12 10.585938 L 8.7070312 7.2929688 z"></path>
				`;
                imageCheck.classList.add('fx-valid-icon');
                imageClose.classList.add('fx-invalid-icon');
                validationIcons.classList.add('validation-icons');
                validationIcons.append(imageCheck, imageClose);
            }
            if (configObject.config?.showPassword) {
                if (isPasswordField) {
                    const showPassword = document.createElementNS(SVG_NS, 'svg');
                    const hidePassword = document.createElementNS(SVG_NS, 'svg');
                    const sharedAttributes = {
                        width: '16px',
                        height: '16px',
                        fill: 'none',
                        viewBox: '0 0 24 24',
                        stroke: 'currentColor',
                        'stroke-width': '1.8',
                        'stoke-linecap': 'round',
                        'stoke-linejoin': 'round',
                    };
                    Object.keys(sharedAttributes).forEach((attr) => {
                        showPassword.setAttribute(attr, sharedAttributes[attr]);
                        hidePassword.setAttribute(attr, sharedAttributes[attr]);
                    });
                    showPassword.innerHTML = `
						<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
						<circle cx="12" cy="12" r="3"></circle>
					`;
                    hidePassword.innerHTML = `
						<path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"></path>
						<line x1="1" y1="1" x2="23" y2="23"/>
					`;
                    showPassword.classList.add('fx-show-password-icon');
                    hidePassword.classList.add('fx-hide-password-icon');
                    togglePasswordIcons.classList.add('toggle-password-icons');
                    togglePasswordIcons.append(showPassword, hidePassword);
                }
            }
            const label = document.createElement('span');
            label.innerHTML = (labelEl.innerText.length ? labelEl.innerHTML : fieldEl.getAttribute('placeholder'));
            labelEl.innerHTML = '';
            labelEl.append(fieldEl, label);
            newInputGroup.append(labelEl);
            if (configObject.config?.showPassword && configObject.config?.showIcons)
                if (isPasswordField)
                    newInputGroup.append(togglePasswordIcons, validationIcons);
                else
                    newInputGroup.append(validationIcons);
            else {
                if (isPasswordField && configObject.config?.showPassword)
                    newInputGroup.append(togglePasswordIcons);
                else if (configObject.config?.showIcons)
                    newInputGroup.append(validationIcons);
            }
            configObject.config?.capslockAlert && isPasswordField ?
                (configObject.config?.showPasswordStrength && fieldEl.id === configObject.config?.passwordId ?
                    formGroup.append(newInputGroup, passwordStrength, validationText, capslockAlertText) :
                    formGroup.append(newInputGroup, validationText, capslockAlertText)) :
                (configObject.config?.showPasswordStrength && fieldEl.id === configObject.config?.passwordId ?
                    formGroup.append(newInputGroup, passwordStrength, validationText) :
                    formGroup.append(newInputGroup, validationText));
        }
        else {
            if (!labelEl.innerText.length)
                labelEl.innerHTML = fieldEl.getAttribute('placeholder');
            configObject.config?.capslockAlert && formField.isPasswordField ?
                (configObject.config?.showPasswordStrength && fieldEl.id === configObject.config?.passwordId ?
                    formGroup.append(passwordStrength, validationText, capslockAlertText) :
                    formGroup.append(validationText, capslockAlertText)) :
                formGroup.append(validationText);
        }
        validationText.setAttribute('id', `${fieldEl.id}Valid`);
        return formGroup;
    }
    #_validate(formGroup) {
        let refillRequired, isCapsOn;
        const that = this;
        const inputElement = 'input.form-field';
        const selectElement = 'select.form-field';
        const textAreaElement = 'textarea.form-field';
        const configObject = that.validatorConfig;
        const passwordToggle = FuxcelValidator.passwordTogglerIconClass;
        const passwordCapsAlert = FuxcelValidator.passwordCapslockAlertClass;
        const _inputElement = fx(inputElement, formGroup);
        const _selectElement = fx(selectElement, formGroup);
        const _textAreaElement = fx(textAreaElement, formGroup);
        const _element = that.#_resetFuxcelObject(_inputElement.length ? _inputElement : (_selectElement.length ? _selectElement : _textAreaElement));
        const _passwordToggle = fx(passwordToggle, formGroup);
        const _passwordCapsAlert = fx(passwordCapsAlert, formGroup);
        const showPasswordToggle = `#${formGroup.id} ${passwordToggle} > .fx-show-password-icon`;
        const hidePasswordToggle = `#${formGroup.id} ${passwordToggle} > .fx-hide-password-icon`;
        const inputGroup = fx('.input-group', formGroup);
        const labelElement = fx('label', inputGroup);
        // Input events
        _inputElement.length && _inputElement.attrib('id')?.length && _inputElement.upon({
            blur: function () {
                const _input = that.#_resetFuxcelObject(fx(this));
                if (inputGroup.length && labelElement.length) {
                    labelElement.style({ color: 'var(--fx-dark)' });
                    inputGroup.style({ borderColor: 'var(--fx-border-light)' });
                }
                if (configObject.config?.showPassword && _passwordToggle.length)
                    if (_input.isPasswordField)
                        _passwordToggle.hasFocus.then((focused) => {
                            if (!focused && _input.value()?.length) {
                                _input.attrib('type')?.toLowerCase() === 'password' && _passwordToggle.dataAttrib('require-refill', 'true');
                                refillRequired = parseBool(_passwordToggle.dataAttrib('require-refill'));
                                _input.attrib('type')?.toLowerCase() === 'password' && fx(`${showPasswordToggle}, ${hidePasswordToggle}`).style({ display: 'none' });
                            }
                        });
                _passwordCapsAlert.insertHTML('<small>&nbsp</small>');
            },
            focus: function () {
                const _input = that.#_resetFuxcelObject(fx(this));
                if (inputGroup.length && labelElement.length) {
                    labelElement.style({ color: 'var(--fx-purple)' });
                    inputGroup.style({ borderColor: 'var(--fx-purple)' });
                }
                if (_input.isPasswordField) {
                    if (configObject.config?.showPassword && _passwordToggle.length)
                        _passwordToggle.hasFocus.then((focused) => {
                            if (!focused && _input.value()?.length) {
                                _input.attrib('type')?.toLowerCase() === 'password' && _passwordToggle.dataAttrib('require-refill', 'true');
                                refillRequired = parseBool(_passwordToggle.dataAttrib('require-refill'));
                            }
                        });
                }
            },
            input: function () {
                const _input = that.#_resetFuxcelObject(fx(this));
                const elementId = _input.attrib('id')?.toLowerCase();
                const elementType = _input.attrib('type')?.toLowerCase();
                const fxId = _input.dataAttrib('fx-id') && _input.dataAttrib('id').toLowerCase();
                const fxRole = _input.dataAttrib('fx-role') && _input.dataAttrib('role').toLowerCase();
                const filterField = new Set(['name', 'username', 'card_cvv', 'card_number']);
                const filterFieldType = new Set(['date', 'datetime', 'email', 'month']);
                if (_input.canBeValidated) {
                    if (!filterFieldType.has(elementType) && !filterFieldType.has(fxRole) && !filterField.has(elementId) && !filterField.has(fxRole) && !filterField.has(fxId))
                        _input.isPasswordField ? _input.#_validatePasswordFields() : _input.validateField();
                    if (_input.isEmailField)
                        configObject.config?.validateEmail ?
                            _input.validateEmail(configObject.regExp?.email, configObject.texts?.emailFormat ?? null) :
                            _input.toggleValidation();
                    if (_input.isNameField)
                        configObject.config?.validateName ?
                            _input.validateName(configObject.regExp?.name, configObject.texts?.nameFormat ?? null) :
                            _input.toggleValidation();
                    if (_input.isPhoneField)
                        configObject.config?.validatePhone ?
                            _input.validatePhone(configObject.regExp?.phone, configObject.texts?.phoneFormat ?? null) :
                            _input.toggleValidation();
                    if (_input.isUsernameField)
                        configObject.config?.validateUsername ?
                            _input.validateUsername(configObject.regExp?.username, configObject.texts?.usernameFormat ?? null) :
                            _input.toggleValidation();
                    if (configObject.config?.validateCard) {
                        if (elementId?.includes('card_cvv') || fxRole?.includes('card_cvv') || fxId?.includes('card_cvv'))
                            _input.validateCardCVV(configObject.regExp?.cardCVV);
                        if (elementId?.includes('card_number') || fxRole?.includes('card_number') || fxId?.includes('card_number'))
                            _input.validateCardNumber(configObject.regExp?.cardNumber);
                    }
                    else {
                        if ((elementId?.includes('card_cvv') || fxRole?.includes('card_cvv') || fxId?.includes('card_cvv')) ||
                            (elementId?.includes('card_number') || fxRole?.includes('card_number') || fxId?.includes('card_number')))
                            _input.toggleValidation();
                    }
                    filterFieldType.has(elementType) && elementType !== 'email' && _input.validateField();
                }
            },
            keydown: function (e) {
                const _input = that.#_resetFuxcelObject(fx(this));
                if (_input.isPasswordField && configObject.config?.capslockAlert) {
                    isCapsOn = e.getModifierState('CapsLock');
                    if (e.key.toLowerCase() === 'capslock')
                        isCapsOn = !isCapsOn;
                    isCapsOn ?
                        _passwordCapsAlert.insertHTML(`<small>${configObject.texts?.capslockFormat ?? '⚠ Caps Lock is on.'}</small>`) :
                        _passwordCapsAlert.insertHTML('<small>&nbsp;</small>');
                }
            },
            keyup: function () {
                const _input = that.#_resetFuxcelObject(fx(this));
                if (_input.isPasswordField && _input.length && configObject.config?.showPassword && _passwordToggle.length) {
                    if (refillRequired && !_input.value()?.length) {
                        _passwordToggle.dataAttrib('require-refill', 'false');
                        refillRequired = parseBool(_passwordToggle.dataAttrib('require-refill'));
                    }
                    else {
                        if (!refillRequired && _input.value()?.length)
                            _input.attrib('type').toLowerCase() === 'password' ?
                                FuxcelValidator.#_toggleValidationIcons(hidePasswordToggle, showPasswordToggle) :
                                FuxcelValidator.#_toggleValidationIcons(showPasswordToggle, hidePasswordToggle);
                        else {
                            refillRequired = parseBool(_passwordToggle.dataAttrib('require-refill'));
                            fx(`${showPasswordToggle}, ${hidePasswordToggle}`).style({ display: 'none' });
                        }
                    }
                }
            },
        });
        // Select events
        _selectElement.length && _selectElement.attrib('id')?.length && _selectElement.upon({
            blur: function () {
                if (inputGroup.length && labelElement.length) {
                    labelElement.style({ color: 'var(--fx-dark)' });
                    inputGroup.style({ borderColor: 'var(--fx-border-light)' });
                }
            },
            focus: function () {
                if (inputGroup.length && labelElement.length) {
                    labelElement.style({ color: 'var(--fx-purple)' });
                    inputGroup.style({ borderColor: 'var(--fx-purple)' });
                }
            },
            change: function () {
                const _el = that.#_resetFuxcelObject(fx(this));
                _el.canBeValidated && _el.validateField();
            },
        });
        // Textarea events
        _textAreaElement.length && _textAreaElement.attrib('id')?.length && _textAreaElement.upon({
            blur: function () {
                if (inputGroup.length && labelElement.length) {
                    labelElement.style({ color: 'var(--fx-dark)' });
                    inputGroup.style({ borderColor: 'var(--fx-border-light)' });
                }
            },
            focus: function () {
                if (inputGroup.length && labelElement.length) {
                    labelElement.style({ color: 'var(--fx-purple)' });
                    inputGroup.style({ borderColor: 'var(--fx-purple)' });
                }
            },
            input: function () {
                const _el = that.#_resetFuxcelObject(fx(this));
                _el.canBeValidated && _el.validateField();
            },
        });
        // Password toggle & initial required check
        if (_element.length && _element.attrib('id')?.length) {
            const fieldName = _element.fieldAttributes.fxName?.toTitleCase();
            if (_element.canBeValidated && (_element.isElement('input') || _element.isElement('select') || _element.isElement('textarea'))) {
                if (_element.isElement('input')) {
                    const elementType = _element.attrib('type')?.toLowerCase();
                    if (configObject.config?.showPassword && _passwordToggle.length) {
                        _passwordToggle.off('touchstart', 'click').upon(['touchstart', 'click'], (e) => {
                            const target = e.target;
                            // @ts-ignore
                            const _showPasswordToggle = fx(showPasswordToggle)[0];
                            const _formGroup = _passwordToggle.parents('.form-group');
                            const _passwordField = fx(_element, _formGroup);
                            const _clicked = (target.tagName.toLowerCase() !== 'svg' && target.tagName.toLowerCase() !== 'div') ? target.parentElement : target;
                            // @ts-ignore
                            if (_clicked === _passwordToggle[0])
                                if (window.getComputedStyle(_showPasswordToggle)?.display.toLowerCase() === 'none') {
                                    FuxcelValidator.#_toggleValidationIcons(hidePasswordToggle, showPasswordToggle);
                                    _passwordField.attrib({ type: 'password' });
                                }
                                else {
                                    FuxcelValidator.#_toggleValidationIcons(showPasswordToggle, hidePasswordToggle);
                                    _passwordField.attrib({ type: 'text' });
                                }
                            else if (_clicked === _showPasswordToggle) {
                                FuxcelValidator.#_toggleValidationIcons(showPasswordToggle, hidePasswordToggle);
                                _passwordField.attrib({ type: 'text' });
                            }
                            else {
                                FuxcelValidator.#_toggleValidationIcons(hidePasswordToggle, showPasswordToggle);
                                _passwordField.attrib({ type: 'password' });
                            }
                            // @ts-ignore
                            _passwordField[0].focus({ preventScroll: false });
                        });
                    }
                    if (elementType !== 'checkbox' && elementType !== 'radio' && !_element.value()?.length)
                        this.#_manipulateErrorBag(`The ${fieldName} field is required.`);
                }
                else {
                    if (!_element.value()?.length)
                        this.#_manipulateErrorBag(`The ${fieldName} field is required.`);
                }
                // @ts-ignore
                _element.#_resetFuxcelObject(fx(_element[0].form));
            }
        }
    }
    /**
     * Perform validation on password fields.
     *
     * @private
     * @return {void}
     */
    #_validatePasswordFields() {
        const selected = this.toArray;
        // @ts-ignore
        const form = selected[0].form;
        const configObject = this.validatorConfig;
        if (configObject.config?.validatePassword) {
            const pwdField = fx(`#${configObject.config?.passwordId}`, form).formValidator;
            const pwdFieldName = pwdField.fieldAttributes.fxName?.toTitleCase();
            const expectedCpwdField = fx(`#${configObject.config?.passwordConfirmId}`, form);
            if (configObject.regExp?.password) {
                if (expectedCpwdField.length) {
                    const cpwdField = expectedCpwdField.formValidator;
                    const cpwdFieldName = cpwdField.fieldAttributes.fxName?.toTitleCase();
                    if (!pwdField.value()?.length) {
                        pwdField.validateField();
                        cpwdField.validateField('Check Password.', true);
                    }
                    else {
                        if (!cpwdField.value()?.length)
                            cpwdField.validateField(`The ${cpwdFieldName} field is required.`, true);
                        else
                            cpwdField.validateField();
                        pwdField.validatePassword(configObject.regExp?.password, configObject.texts?.passwordFormat ?? null);
                    }
                }
                else
                    pwdField.validatePassword(configObject.regExp?.password, configObject.texts?.passwordFormat ?? null);
            }
            else {
                const minLength = parseInt(pwdField.attrib('minlength') ?? '0');
                const maxLength = parseInt(pwdField.attrib('maxlength') ?? '0');
                if (expectedCpwdField.length) {
                    const cpwdField = expectedCpwdField.formValidator;
                    const cpwdFieldName = cpwdField.fieldAttributes.fxName?.toTitleCase();
                    if (pwdField.value()?.length || cpwdField.value()?.length) {
                        if (minLength && maxLength) {
                            if (minLength === maxLength) {
                                if (!pwdField.value()?.length) {
                                    pwdField.validateField();
                                    cpwdField.validateField('Check Password.', true);
                                }
                                // @ts-ignore
                                else if (pwdField.value()?.length !== maxLength) {
                                    pwdField.validateField(`The ${pwdFieldName} field requires ${maxLength} characters.`, true);
                                    if (!cpwdField.value()?.length)
                                        cpwdField.validateField(`The ${cpwdFieldName} field is required.`, true);
                                    else
                                        cpwdField.validateField('Check Password.');
                                }
                                else {
                                    if (!cpwdField.value()?.length)
                                        cpwdField.validateField(`The ${cpwdFieldName} field is required.`, true);
                                    else
                                        cpwdField.validateField();
                                    pwdField.validateField();
                                }
                            }
                            else {
                                // @ts-ignore
                                if (pwdField.value()?.length < minLength || pwdField.value()?.length > maxLength) {
                                    pwdField.validateField(`The ${pwdFieldName} field must be between ${minLength} and ${maxLength} characters.`, true);
                                    cpwdField.validateField('Check Password.');
                                }
                                else {
                                    if (!cpwdField.value()?.length)
                                        cpwdField.validateField(`The ${cpwdFieldName} field is required.`, true);
                                    else
                                        cpwdField.validateField();
                                    pwdField.validateField();
                                }
                            }
                        }
                        else if (minLength) {
                            // @ts-ignore
                            if (pwdField.value()?.length < minLength) {
                                pwdField.validateField(`The ${pwdFieldName} field requires ${minLength} characters.`, true);
                                cpwdField.validateField('Check Password.', true);
                            }
                            else {
                                pwdField.validateField();
                                cpwdField.validateField();
                            }
                        }
                        else {
                            if (!cpwdField.value()?.length)
                                cpwdField.validateField(`The ${cpwdFieldName} field is required.`, true);
                            else
                                cpwdField.validateField();
                            pwdField.validateField();
                        }
                    }
                    else {
                        pwdField.validateField();
                        cpwdField.validateField();
                    }
                }
                else {
                    if (minLength && maxLength && pwdField.value()?.length)
                        // @ts-ignore
                        if (pwdField.value()?.length < minLength || pwdField.value()?.length > maxLength)
                            pwdField.validateField(`The ${pwdFieldName} field must be between ${minLength} and ${maxLength} characters.`, true);
                        else
                            pwdField.validateField();
                    else
                        pwdField.validateField();
                }
            }
            FuxcelValidator.#_registry[form.id].passwordStrength = FuxcelValidator.#_calcPasswordStrength(pwdField.value(), configObject.regExp?.password);
        }
        else
            this.validateField();
    }
    // ─── Public Getters ───────────────────────────────────────────────────────
    /** Checks if the selected field element can be validated by checking thw value of `[data-fx-validate]` data-attribute or the parent form-group is not hidden. **/
    get canBeValidated() {
        const selected = this.toArray;
        return selected.length ?
            (this.dataAttrib('fx-validate') ?
                parseBool(this.dataAttrib('fx-validate')) :
                (this.parents('.form-group').length ?
                    this.parents('.form-group').style('display') !== 'none' :
                    this.style('display') !== 'none')) :
            false;
    }
    /** Get the error bag for the current selected form. **/
    get errorBag() {
        if (!this.length || !this.isElement('form'))
            return null;
        const registry = FuxcelValidator.#_registry[this.attrib('id')];
        return registry && Object.keys(registry.bag).length ? registry.bag : null;
    }
    /** Get the error count for the current selected form. **/
    get errorCount() {
        if (!this.length || !this.isElement('form'))
            return 0;
        return FuxcelValidator.#_registry[this.attrib('id')]?.count ?? 0;
    }
    /** Get the password strength for the current selected form of password field. **/
    get passwordStrength() {
        if (!this.length && !this.isPasswordField && !this.isElement('form'))
            return null;
        if (!this.isElement('form'))
            // @ts-ignore
            return FuxcelValidator.#_registry[this[0].form.id]?.passwordStrength ?? null;
        return FuxcelValidator.#_registry[this.attrib('id')]?.passwordStrength ?? null;
    }
    /** An object containing the error bag and error count for the current selected form(s). Logs an error to the console if selected element(s) not form element(s). **/
    get getErrors() {
        const selected = this.toArray;
        let errors = {};
        if (selected.length > 1) {
            selected.forEach((el) => {
                const _el = fx(el).formValidator;
                if (el.tagName && _el.isElement('form'))
                    errors[el.id] = { count: _el.errorCount, errors: _el.errorBag };
            });
            return errors;
        }
        return this.isElement('form') ?
            { count: this.errorCount, errors: this.errorBag } :
            console.error('Non form element given.');
    }
    /** An object containing all form field elements for the current selected form(s). Logs an error to the console if selected element(s) not form element(s). **/
    get formFieldElements() {
        const selected = this.toArray;
        if (selected.length > 1) {
            const elements = {};
            selected.forEach((el) => {
                if (fx(el).isElement('form'))
                    elements[el.id] = el.elements;
            });
            return elements;
        }
        return this.isElement('form') ? selected[0].elements : console.error('Non form elements given', selected);
    }
    /** Checks if the selected form field element is an email field. **/
    get isEmailField() {
        const a = this.fieldAttributes;
        return !!(a.type?.includes('email') || a.id?.includes('email') || a.fxId?.includes('email') || a.fxRole?.includes('email'));
    }
    /** Checks if the selected form field element is a name field. **/
    get isNameField() {
        const a = this.fieldAttributes;
        return !this.isUsernameField && (a.id === 'name' || a.fxId === 'name' || a.fxRole === 'name');
    }
    /** Checks if the selected form field element is a password field. **/
    get isPasswordField() {
        const a = this.fieldAttributes;
        const registry = FuxcelValidator.#_registry[this.isElement('form') ? a?.id : a?.formId];
        const passwordId = registry.configObject.config?.passwordId;
        return (a.type === 'password' || a.id?.includes(passwordId.toLowerCase()) ||
            a.fxId?.includes(passwordId.toLowerCase()) ||
            a.fxRole?.includes(passwordId.toLowerCase()));
    }
    /** Checks if the selected form field element is a phone field. **/
    get isPhoneField() {
        const a = this.fieldAttributes;
        return !!(a.type?.includes('tel') || a.type?.includes('phone') || a.id?.includes('phone') || a.fxId?.includes('phone') || a.fxRole?.includes('phone'));
    }
    /** Checks if the selected form field element is a username field. **/
    get isUsernameField() {
        const a = this.fieldAttributes;
        return !!(a.id?.includes('username') || a.fxId?.includes('username') || a.fxRole?.includes('username'));
    }
    get stepFromField() {
        const stepDiv = this.parents(FuxcelValidator.stepsClass);
        return stepDiv.length ? parseInt(stepDiv.dataAttrib('fx-step') ?? '0') : -1;
    }
    /** Returns the `ValidationProps` of the selected form field element. **/
    get validationProps() {
        const configObject = this.validatorConfig;
        const a = this.fieldAttributes;
        const formGroup = configObject.config?.initWrapper;
        const formId = `#${a.formId}`;
        const elementId = `#${a.id}`;
        if (formId)
            return {
                id: elementId,
                formGroup: `${formId} ${formGroup + elementId}_group`,
                validationField: `${formId} ${elementId}Valid`,
                validIcon: `${formId} ${formGroup + elementId}_group .validation-icons > .fx-valid-icon`,
                invalidIcon: `${formId} ${formGroup + elementId}_group .validation-icons > .fx-invalid-icon`,
                validationIconField: `${formId} ${formGroup + elementId}_group .validation-icons`,
            };
        throw 'Non-Form field element given';
    }
    /** Returns the current `ValidatorConfigObject` options of the selected form. _If any element other than a form or its element (input, select, ...) is selected, the default `ValidatorConfigObject` is returned._ **/
    get validatorConfig() {
        if (this.length) {
            const getFormId = (element) => {
                const isForm = element.isElement('form');
                if (element.isFormElement || isForm) {
                    const fieldAttribs = element.fieldAttributes;
                    return isForm ? fieldAttribs?.id : fieldAttribs?.formId;
                }
                return null;
            };
            if (this.length > 1) {
                const configObjects = {};
                this.each(element => {
                    const formId = getFormId(element);
                    if (formId?.length)
                        configObjects[formId] = FuxcelValidator.#_registry[formId].configObject;
                });
                return Object.keys(configObjects).length ? configObjects : FuxcelValidator.defaultValidatorConfig;
            }
            else {
                const formId = getFormId(this);
                return formId?.length ?
                    FuxcelValidator.#_registry[formId].configObject :
                    FuxcelValidator.defaultValidatorConfig;
            }
        }
        return FuxcelValidator.defaultValidatorConfig;
    }
    // ─── Static Getters / Setters ─────────────────────────────────────────────
    /** Returns the default Form Validator Configuration Object. **/
    static get defaultValidatorConfig() {
        return FuxcelValidator.#_defaultConfig;
    }
    /** Returns the Password capslock alert class selector **/
    static get passwordCapslockAlertClass() {
        return '.capslock-alert';
    }
    /** Returns the Password toggler icon class selector **/
    static get passwordTogglerIconClass() {
        return '.toggle-password-icons';
    }
    static get stepsClass() {
        return FuxcelValidator.#_stepsClass;
    }
    static set stepsClass(selector) {
        FuxcelValidator.#_stepsClass = selector;
    }
    // ─── Public Methods ───────────────────────────────────────────────────────
    /**
     * Initialize validation on selected form(s) _[Must be an instance of FuxcelValidator]_.
     *
     * _Throws an error if non form elements are selected._
     *
     * @param config {ValidatorConfigObject} user config object.
     * @return {FuxcelSteps | FuxcelValidator} Fuxcel Validator Object of the forms.
     */
    init(config = null) {
        const forms = this.filter(el => el.isElement('form'));
        const nonForms = this.filter(el => !el.isElement('form'));
        if (forms.length) {
            if (nonForms.length)
                console.error(`${nonForms.length} non-form element(s) passed to validator:`, nonForms);
            forms.#_touchConfig(config);
            return this.validatorConfig.stepForm?.use ?
                forms.#_initValidateStepForms() :
                forms.#_initValidateForms();
        }
        else {
            console.error(`Non form-elements passed to validator`, nonForms);
            throw `${nonForms.length} non-form element(s) passed to validator.`;
        }
    }
    /**
     * Render validation message.
     *
     * @param message {StringOrNull = null} message to display [optional]
     * @param renderClass {StringOrNull} validation type
     * @return {FuxcelValidator} Fuxcel Validator Object of the current selected element.
     */
    renderMessage(message = null, renderClass = null) {
        this.insertHTML(`<small ${renderClass ? `class="${renderClass}"` : ''}>${message ?? '&nbsp;'}</small>`);
        return this;
    }
    /**
     * Display all validation errors for the selected form.
     *
     * @param errors {{ [key: string]: any } | null = null} An object containing the errors. The keys are the form field ids and their values are the errors for the fields respectively.
     * @param messageOrFn {((fx: FuxcelValidator, e?: CustomEvent) => any)|StringOrNull}
     * @param callbackFn {((fx: FuxcelValidator, e?: CustomEvent) => any)}
     * @return FuxcelValidator
     */
    renderValidationErrors(errors = null, messageOrFn = null, callbackFn = null) {
        if (this.isElement('form')) {
            if (isObject(errors) && Object.keys(errors).length) {
                const fieldElements = this.formFieldElements;
                const givenErrors = errors;
                Object.keys(givenErrors).forEach((elementId) => {
                    const fieldName = elementId.toString().toTitleCase();
                    const element = fx(`#${elementId}`, this).formValidator;
                    if (elementId in fieldElements && isDefined(givenErrors[elementId]))
                        element.validateField(givenErrors[elementId], true);
                    else if (isString(givenErrors[elementId]) && givenErrors[elementId] !== undefined)
                        element.validateField(`Verify ${fieldName} and try again.`, true);
                });
                fx('.fx-valid-error')[0]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
        else
            console.warn('Non form element given.');
        typeof messageOrFn === 'string' ?
            (typeof callbackFn === 'function' ?
                fx.modal({ type: 'error', content: messageOrFn, confirmButtonText: 'Ok', onConfirm: (e) => callbackFn(this, e) }) :
                fx.modal({ type: 'error', closeOnConfirm: true, content: messageOrFn, confirmButtonText: 'Ok' }))
            : (typeof messageOrFn === 'function' && messageOrFn(this));
        return this;
    }
    /**
     * Show validation error for the selected field.
     *
     * @param message {StringOrNull = null} Validation message.
     * @return {void}
     */
    showError(message = null) {
        const fieldAttribs = this.fieldAttributes;
        const validationProps = this.validationProps;
        const finalMessage = message ?? `The ${fieldAttribs.fxName?.toTitleCase()} field is required`;
        const registry = FuxcelValidator.#_registry[this.isElement('form') ? fieldAttribs?.id : fieldAttribs?.formId];
        this.#_manipulateErrorBag(finalMessage);
        registry.configObject.config?.showIcons && FuxcelValidator.#_toggleValidationIcons(validationProps.validIcon, validationProps.invalidIcon);
        fx(validationProps.validationField).length && fx(validationProps.validationField).formValidator.renderMessage(finalMessage);
        fx(validationProps.formGroup).replaceClass('fx-valid-success', 'fx-valid-error');
    }
    /**
     * Show validation success.
     *
     * @param message {StringOrNull = null} Validation message.
     * @return {void}
     */
    showSuccess(message = null) {
        const validationProps = this.validationProps;
        const fieldAttribs = this.fieldAttributes;
        const registry = FuxcelValidator.#_registry[this.isElement('form') ? fieldAttribs?.id : fieldAttribs?.formId];
        this.#_manipulateErrorBag(true);
        registry.configObject.config?.showIcons && FuxcelValidator.#_toggleValidationIcons(validationProps.invalidIcon, validationProps.validIcon);
        fx(validationProps.validationField).length && fx(validationProps.validationField).formValidator.renderMessage(message);
        fx(validationProps.formGroup).replaceClass('fx-valid-error', 'fx-valid-success');
    }
    /**
     * Toggle between validating and removing validation from the selected field.
     *
     * @return {FuxcelValidator} Fuxcel Validator Object of the forms.
     */
    toggleValidation() {
        return this.canBeValidated ? this.validateField() : this.undoValidation();
    }
    /**
     * Remove validation from the selected field element. Also remove the error from the error bag if destroyValidation parameter is set tot true.
     *
     * @param destroyValidation {boolean = false}
     * @return {FuxcelValidator} Fuxcel Validator Object of the forms.
     */
    undoValidation(destroyValidation = false) {
        const fieldAttribs = this.fieldAttributes;
        const validationProps = this.validationProps;
        const registry = FuxcelValidator.#_registry[this.isFormElement ? validationProps?.id : fieldAttribs?.formId];
        if (registry) {
            if (destroyValidation && fieldAttribs.id) {
                delete registry.bag[fieldAttribs.id];
                registry.count = Object.keys(registry.bag).length;
            }
            if (registry.configObject.config?.useDefaultStyling)
                fx(`${validationProps.formGroup} .form-group-wrapper`).removeClass('fx-valid-error', 'fx-valid-success');
            else
                fx(validationProps.formGroup).removeClass('fx-valid-error', 'fx-valid-success');
            !fx(`${validationProps.validationIconField} > *`)?.length ?
                fx(validationProps.validationField).formValidator.renderMessage() :
                fx(`${validationProps.validationIconField} > *`).fadeout().then(() => fx(validationProps.validationField).formValidator.renderMessage());
        }
        return this;
    }
    stepErrorBag(step) {
        if (!this.length || !this.isElement('form'))
            return null;
        const stepReg = FuxcelValidator.#_registry[this.attrib('id')]?.steps[step];
        return stepReg && Object.keys(stepReg.bag).length ? stepReg.bag : null;
    }
    stepErrorCount(step) {
        if (!this.length || !this.isElement('form'))
            return 0;
        return FuxcelValidator.#_registry[this.attrib('id')]?.steps[step]?.count ?? 0;
    }
    /**
     * Validate Card CVV field using Regular Expression
     *
     * @param regExp {RegExp} Regular expression to use.
     * @param customFormatEx {StringOrNull = null} Custom format example to show user.
     * @return {FuxcelValidator} Fuxcel Validator Object of the selected element.
     */
    validateCardCVV(regExp, customFormatEx = null) {
        return this.validateRegex(regExp, `${customFormatEx ?? 'Invalid CVV.'}`);
    }
    /**
     * Validate Card Number field using Regular Expression
     *
     * @param regExp {RegExp} Regular expression to use.
     * @param customFormatEx {StringOrNull = null} Custom format example to show user
     * @return {FuxcelValidator} Fuxcel Validator Object of the selected element.
     */
    validateCardNumber(regExp, customFormatEx = null) {
        const selected = this.toArray;
        const value = selected[0].value;
        return this.validateRegex(() => 
        // @ts-ignore
        value.length ?
            (value.match(regExp) ? (passLuhnAlgo(value) ? this.validateField() : this.validateField('Check Card Number and try again.', true)) : this.validateField(`${customFormatEx ?? 'Only numbers are allowed.'}`)) :
            this.toggleValidation());
    }
    /**
     * Validate Email field using Regular Expression
     *
     * @param regExp {RegExp} Regular expression to use.
     * @param customFormatEx {StringOrNull = null} Custom format example to show user.
     * @return {FuxcelValidator} Fuxcel Validator Object of the selected element.
     */
    validateEmail(regExp, customFormatEx = null) {
        return this.validateRegex(regExp, `Invalid E-Mail format: (eg. ${customFormatEx ?? 'johndoe@email.com'})`);
    }
    /**
     * Validate the selected field.
     *
     * _Displays an error message if the `message` parameter is null or if `isError` parameter is true._
     *
     * @param message {StringOrNull} Validation message to display.
     * @param isError {boolean=false} If true and the message parameter is null, an automatic error message is generated.
     * @returns {FuxcelValidator}
     */
    validateField(message = null, isError = false) {
        if (typeof message === 'boolean') {
            isError = message;
            message = null;
        }
        if (this.attrib('id')?.length) {
            let errorMessage = null, finalMessage = message;
            const fieldAttribs = this.fieldAttributes;
            const registry = FuxcelValidator.#_registry[this.isElement('form') ? fieldAttribs?.id : fieldAttribs?.formId];
            const configObject = registry.configObject.config;
            // @ts-ignore
            const target = this[0];
            const fieldValue = target.value;
            const fieldName = fieldAttribs.fxName?.toTitleCase();
            const minLength = parseInt(this.attrib('minlength'));
            const maxLength = parseInt(this.attrib('maxlength'));
            const min = parseInt(this.attrib('min'));
            const max = parseInt(this.attrib('max'));
            if (!isString(finalMessage))
                if (fieldValue?.length || (fieldAttribs.id === configObject?.passwordConfirmId && configObject?.validatePassword)) {
                    if (maxLength && fieldValue.length > maxLength)
                        errorMessage = `The ${fieldName} field requires a maximum of ${maxLength} characters.`;
                    else if (minLength && fieldValue.length < minLength)
                        errorMessage = `The ${fieldName} field requires a minimum of ${minLength} characters.`;
                    else
                        switch (fieldAttribs.type) {
                            case 'number':
                                errorMessage = ((max && min) && (parseInt(fieldValue) > max && parseInt(fieldValue) < min)) ?
                                    `The ${fieldName} field requires a value between ${min} and ${max}.` :
                                    ((max && parseInt(fieldValue) > max) ?
                                        `The maximum required value for ${fieldName} is ${max}.` :
                                        ((min && parseInt(fieldValue) < min) ? `The minimum required value for ${fieldName} is ${min}.` : message));
                                break;
                            default:
                                if (this.isPasswordField)
                                    errorMessage = (Array.isArray(message) ? message :
                                        ((fieldAttribs.id === configObject?.passwordConfirmId && configObject?.validatePassword) ?
                                            ((!fieldValue.length || fieldValue !== fx(`#${configObject.passwordId}`).value()) ?
                                                (fx(`#${configObject.passwordId}`).value()?.length ? 'Ensure passwords.' : `The ${fieldName} field is required.`) :
                                                message) : message));
                                break;
                        }
                }
                else
                    errorMessage = `The ${fieldName} field is required.`;
            (errorMessage || isError) ?
                this.showError(errorMessage ?? finalMessage) :
                this.showSuccess(finalMessage);
        }
        else
            console.warn('Selected element has no ID', this);
        return this;
    }
    /**
     * Validate Name field using Regular Expression
     *
     * @param regExp {RegExp} Regular expression to use.
     * @param customFormatEx {string|null=null} Custom format example to show user.
     * @return {FuxcelValidator} Fuxcel Validator Object of the selected element.
     */
    validateName(regExp, customFormatEx = null) {
        return this.validateRegex(regExp, `Invalid Name format: (eg. ${customFormatEx ?? 'john doe, john doe woods'})`);
    }
    /**
     * Validate Password field using Regular Expression
     *
     * @param regExp {RegExp} Regular expression to use
     * @param customFormatEx {string|null=null} Custom format example to show user.
     * @return {FuxcelValidator} Fuxcel Validator Object of the selected element.
     */
    validatePassword(regExp, customFormatEx = null) {
        return this.validateRegex(regExp, `Invalid Password format: (${customFormatEx ?? 'Password requires a minimum of 8 characters and must contain at least 1 uppercase and 1 special character'})`);
    }
    /**
     * Validate Phone field using Regular Expression
     *
     * @param regExp {RegExp} Regular expression to use
     * @param customFormatEx {string|null=null} Custom format example to show user.
     * @return {FuxcelValidator} Fuxcel Validator Object of the selected element.
     */
    validatePhone(regExp, customFormatEx = null) {
        return this.validateRegex(regExp, `Invalid Phone format: (eg. ${customFormatEx ?? '+234 8156547099, +1 104 2198'})`);
    }
    /**
     * Validate field using Regular Expression or a callback function.
     *
     * @param regExpOrFn {Function|RegExp} Regular Expression or callback function to use.
     * @param message {string|null=null} Validation message.
     * @return {FuxcelValidator} Fuxcel Validator Object of the selected element.
     */
    validateRegex(regExpOrFn, message) {
        const selected = this.toArray;
        // @ts-ignore
        const value = selected[0].value;
        typeof regExpOrFn === 'function' ?
            regExpOrFn(this) :
            (regExpOrFn && isString(message) ?
                (value.length ? (value.match(regExpOrFn) ? this.validateField() : this.validateField(message, true)) : this.validateField()) :
                console.error('`validateRegex()` expects 2 arguments.'));
        return this;
    }
    /**
     * Validate Username field using Regular Expression
     *
     * @param regExp {RegExp} Regular expression to use
     * @param customFormatEx {string|null=null} Custom format example to show user.
     * @return {FuxcelValidator} Fuxcel Validator Object of the selected element.
     */
    validateUsername(regExp, customFormatEx = null) {
        const selected = this.toArray;
        // @ts-ignore
        const value = selected[0].value;
        const minLength = parseInt(this.attrib('minlength') ?? '2');
        // @ts-ignore
        const fieldName = this.fieldAttributes.fxName?.toTitleCase();
        return this.validateRegex(() => value.length
            ? (value.length > minLength
                ? (value.match(regExp)
                    ? this.validateField()
                    : this.validateField(`Invalid Username format: (${customFormatEx ?? 'Username must start and end with an alphabet, and can only contain alphabets and underscores.'})`))
                : this.validateField(customFormatEx ?? `The ${fieldName} requires a minimum of 3 characters.`))
            : this.toggleValidation());
    }
}

/**
 * Extends `FuxcelValidator` with multi-step form support.
 * Tracks per-step error bags and exposes step-level error queries.
 */
class FuxcelSteps extends FuxcelValidator {
    static currentlySelected = {};
    constructor(selected) {
        super(selected);
        try {
            // @ts-ignore – optional external Steps plugin integration
            if (Steps.constructor.name.length && selected.validatorConfig.stepForm?.plugin)
                // @ts-ignore
                new Steps(selected[0]).init(selected.validatorConfig.stepForm.config);
        }
        catch (_) { /* Steps plugin not present — silently skip */
        }
        return this;
    }
    // ─── Getters ──────────────────────────────────────────────────────────────
    /** Re-instantiated context of the currently selected forms. */
    get context() {
        return new FuxcelSteps(FuxcelSteps.currentlySelected);
    }
    /**
     * Returns all step identifiers for the selected form(s).
     * - Single form → `(number | string)[]`
     * - Multiple forms → `{ [formId]: (number | string)[] }`
     */
    get formSteps() {
        const steps = [];
        if (this.length > 1) {
            const allSteps = {};
            this.toArray.forEach((form) => {
                if (fx(form).isElement('form')) {
                    allSteps[form.id] = [];
                    const stepDivs = fx(FuxcelValidator.stepsClass, form);
                    stepDivs.length && stepDivs.toArray.forEach((stepDiv) => {
                        const step = stepDiv.dataset.fxStep;
                        isString(step) && step !== undefined && allSteps[form.id].push(step);
                    });
                }
            });
            return allSteps;
        }
        if (this.isElement('form')) {
            const stepDivs = fx(FuxcelValidator.stepsClass, this);
            stepDivs.length && stepDivs.toArray.forEach((stepDiv) => {
                const step = stepDiv.dataset.fxStep;
                isString(step) && step !== undefined && steps.push(step);
            });
        }
        return steps;
    }
    // ─── Public Methods ───────────────────────────────────────────────────────
    /**
     * Returns the error bag and error count for the current selected step form(s).
     *
     * @param step {number|string|null=null} Specific step to query. If null, returns errors for all steps.
     */
    stepErrors(step = null) {
        const selected = this.context.toArray;
        let errors = {};
        if (step === null) {
            selected.forEach((element) => {
                const _element = new FuxcelSteps(element);
                if (element.tagName && _element.isElement('form')) {
                    errors[element.id] = {};
                    const steps = _element.formSteps;
                    steps.length && steps.forEach(s => {
                        errors[element.id][s] = {
                            count: _element.stepErrorCount(s),
                            errors: _element.stepErrorBag(s),
                        };
                    });
                }
            });
            return errors;
        }
        return this.context.isElement('form')
            ? {
                count: this.context.stepErrorCount(step),
                errors: this.context.stepErrorBag(step),
            }
            : console.error('Non form element given.');
    }
}

/**
 * Modal engine.
 * Handles showing, hiding, toggling, and constructing modals.
 * Auto-wires `[data-fx-target="modal"]` triggers on construction.
 */
class FuxcelModal extends Fuxcel {
    #_isHiding = false;
    static #_modalTarget;
    static #_openModals = [];
    // ─── Custom Events ─────────────────────────────────────────────
    /**
     * On Modal show
     *
     * @type {CustomEventType}
     */
    static fxModalShowEvent = new CustomEvent('fx.modal.show', {
        bubbles: true,
        detail: { plugin: 'Fuxcel', interface: 'FuxcelModalInterface', timestamp: Date.now() },
    });
    /**
     * On Modal hide
     *
     * @type {CustomEventType}
     */
    static fxModalHideEvent = new CustomEvent('fx.modal.hide', {
        bubbles: true,
        detail: { plugin: 'Fuxcel', interface: 'FuxcelModalInterface', timestamp: Date.now() },
    });
    constructor(selector, context, autoActions = true) {
        super(selector, context);
        if (FuxcelModal.modalTriggers.length) {
            FuxcelModal.modalTriggers.off('click').upon('click', function (e) {
                e.preventDefault();
                const currentTrigger = fx(e.currentTarget);
                const modalAction = currentTrigger.dataAttrib('fx-action')?.toLowerCase() ?? 'open';
                const modalTarget = currentTrigger.dataAttrib('fx-action')?.length ?
                    (currentTrigger.parents('.fx-modal').length ? currentTrigger.parents('.fx-modal') : null) :
                    fx(`#${currentTrigger.dataAttrib('fx-modal')}`);
                if (modalTarget) {
                    FuxcelModal.#_modalTarget = modalTarget;
                    if (autoActions) {
                        if (currentTrigger.parents('.fx-modal').attrib('id')?.includes('init')) {
                            if (modalAction === 'close')
                                FuxcelModal.#_modalTarget.modal.hide();
                        }
                        else if (modalAction === 'close')
                            FuxcelModal.#_modalTarget.modal.hide();
                        else
                            FuxcelModal.#_modalTarget.modal.toggle();
                    }
                }
            });
        }
        else
            console.error('Target modal action triggers not found.');
    }
    // ─── Static Getters ───────────────────────────────────────────────────────
    /** The most recently opened modal, or `null` if none is open. **/
    static get currentModal() {
        return FuxcelModal.hasOpenModals ?
            FuxcelModal.#_openModals[FuxcelModal.#_openModals.length - 1] : null;
    }
    /** `true` if any modals are currently open. **/
    static get hasOpenModals() {
        return !!FuxcelModal.#_openModals.length;
    }
    /** All elements with `[data-fx-target="modal"]`. **/
    static get modalTriggers() {
        return fx('*[data-fx-target="modal"]');
    }
    // ─── Static Factory ───────────────────────────────────────────────────────
    /**
     * Builds a modal DOM structure and returns the root element.
     *
     * @param {ModalInit} options
     * @returns {HTMLElement}
     */
    static init({ id, content, title = null, html = true, isStatic = false, hasFooter = false }) {
        const fxModal = document.createElement('div');
        const modalDialog = document.createElement('div');
        const modalContent = document.createElement('div');
        const modalHeader = document.createElement('div');
        const modalBody = document.createElement('div');
        const modalFooter = document.createElement('div');
        const modalTitle = document.createElement('div');
        const closeButton = document.createElement('div');
        fxModal.id = id;
        isStatic && (fxModal.dataset.fxStatic = 'true');
        fxModal.classList.add('fx-modal', 'filter');
        if (!content)
            content = html ? '<h2>This is a new FuxcelModal!</h2>' : 'This is a new FuxcelModal!';
        title && (modalTitle.innerHTML = title);
        html ? (modalBody.innerHTML = content) : (modalBody.innerText = content);
        closeButton.innerHTML = `
			<svg width="24px" height="24px" viewBox="0 0 24 24" style="display: inline-block;">
				<path fill="#FA5252" d="M 12 2 C 6.4889971 2 2 6.4889971 2 12 C 2 17.511003 6.4889971 22 12 22 C 17.511003 22 22 17.511003 22 12 C 22 6.4889971 17.511003 2 12 2 z M 12 4 C 16.430123 4 20 7.5698774 20 12 C 20 16.430123 16.430123 20 12 20 C 7.5698774 20 4 16.430123 4 12 C 4 7.5698774 7.5698774 4 12 4 z M 8.7070312 7.2929688 L 7.2929688 8.7070312 L 10.585938 12 L 7.2929688 15.292969 L 8.7070312 16.707031 L 12 13.414062 L 15.292969 16.707031 L 16.707031 15.292969 L 13.414062 12 L 16.707031 8.7070312 L 15.292969 7.2929688 L 12 10.585938 L 8.7070312 7.2929688 z"></path>
			</svg>
		`;
        closeButton.dataset.fxAction = 'close';
        closeButton.dataset.fxTarget = 'modal';
        modalTitle.classList.add('title');
        closeButton.classList.add('close');
        modalDialog.classList.add('fx-modal-dialog', 'fx-dialog-centered', 'fx-dialog-scrollable');
        modalContent.classList.add('fx-modal-content');
        modalHeader.classList.add('fx-modal-header');
        modalBody.classList.add('fx-modal-body');
        modalFooter.classList.add('fx-modal-footer');
        modalHeader.append(modalTitle, closeButton);
        modalContent.append(modalHeader, modalBody, modalFooter);
        modalDialog.append(modalContent);
        fxModal.append(modalDialog);
        !title && modalContent.removeChild(modalHeader);
        !hasFooter && modalContent.removeChild(modalFooter);
        return fxModal;
    }
    // ─── Instance Methods ─────────────────────────────────────────────────────
    /** Remove the selected modal element from the DOM entirely. **/
    destroy() {
        this[0].remove();
    }
    /**
     * Hide (and optionally destroy) the selected modal.
     *
     * @param destroy {boolean=false} Whether to remove the element from the DOM after hiding.
     */
    hide(destroy = false) {
        const modalContent = fx('.fx-modal-content', this);
        if (!this.#_isHiding) {
            this.#_isHiding = true;
            modalContent.fadeout(200).then(() => this.fadeout(200).then(() => {
                const index = FuxcelModal.#_openModals.indexOf(this);
                if (index !== -1)
                    FuxcelModal.#_openModals.splice(index, 1);
                this[0].dispatchEvent(FuxcelModal.fxModalHideEvent);
                destroy && this.destroy();
                this.#_isHiding = false;
            }));
        }
    }
    /**
     * Open selected modal.
     *
     * @param escKey {boolean=true} Allow closing the modal using the Escape on the KeyBoard if set to true. True by default.
     */
    show(escKey = true) {
        const modalContent = fx('.fx-modal-content', this);
        this.style({ pointerEvents: 'none' }).fadein(0).then(() => modalContent.fadein(0, 'flex').then(() => {
            FuxcelModal.#_openModals.push(this);
            this.style({ pointerEvents: 'unset' });
            this.upon('click', () => modalContent.hasFocus.then((focused) => {
                !focused ? (!parseBool(this.dataAttrib('fx-static')) ? this.hide() : modalContent.shake(500, 2)) : null;
            }));
            if (escKey)
                fx(document).upon('keyup', (e) => {
                    const key = e.key.toLowerCase();
                    if ((key === 'escape' || key === 'esc') && FuxcelModal.hasOpenModals)
                        !parseBool(this.dataAttrib('fx-static')) ?
                            FuxcelModal.currentModal?.hide() :
                            modalContent.shake(500, 2);
                });
            this[0].dispatchEvent(FuxcelModal.fxModalShowEvent);
        }));
    }
    /** Toggle between hide and show state of the selected modal. **/
    toggle() {
        this.style('display') === 'none' ? this.show() : this.hide();
    }
}

/**
 * Create a quick alert/confirm modal with callbacks.
 *
 * @param title {FXModalType.title = null} Modal title.
 * @param type {FXModalType.type = 'success'} Visual type: 'success' | 'warning' | 'error'.
 * @param content {FXModalType.content = 'Alert COntent'} Body content (HTML or text).
 * @param confirmButtonText {FXModalType.confirmButtonText} Label for the confirm button.
 * @param cancelButtonText {FXModalType.cancelButtonText = null} Label for the cancel button.
 * @param html {FXModalType.html = true} Render body as HTML (default true).
 * @param isStatic {FXModalType.isStatic = false} Prevent closing on outside click.
 * @param closeOnConfirm {FXModalType.closeOnConfirm = null} Auto-close on confirm when no `onConfirm` callback.
 * @param onConfirm {FXModalType.onConfirm = null} Callback fired when confirm button is clicked.
 * @param onCancel {FXModalType.onCancel = null} Callback fired when cancel button is clicked.
 * @param onEsc {FXModalType.onEsc = null} Callback fired on Escape (only when no cancel button).
 * @return {FuxcelModal}
 */
function fxModal({ title = null, type = 'success', content = 'Alert Content', confirmButtonText = null, cancelButtonText = null, html = true, isStatic = false, closeOnConfirm = false, onConfirm = null, onCancel = null, onEsc = null, } = {}) {
    const initialModal = FuxcelModal.init({ title: title, html: html, isStatic: isStatic, content: content, id: 'init', hasFooter: false });
    const modalBody = fx('.fx-modal-body', initialModal);
    const body = document.querySelector('body');
    const SVG_NS = 'http://www.w3.org/2000/svg';
    const imageSuccess = document.createElementNS(SVG_NS, 'svg');
    const imageError = document.createElementNS(SVG_NS, 'svg');
    const imageWarning = document.createElementNS(SVG_NS, 'svg');
    const sharedSVGAttributes = {
        width: '52px',
        height: '52px',
        viewBox: '0 0 24 24',
    };
    Object.keys(sharedSVGAttributes).forEach((attr) => {
        imageSuccess.setAttribute(attr, sharedSVGAttributes[attr]);
        imageError.setAttribute(attr, sharedSVGAttributes[attr]);
        imageWarning.setAttribute(attr, sharedSVGAttributes[attr]);
    });
    imageSuccess.innerHTML = `
		<path fill="#12B886" d="M 12 2 C 6.4889971 2 2 6.4889971 2 12 C 2 17.511003 6.4889971 22 12 22 C 17.511003 22 22 17.511003 22 12 C 22 6.4889971 17.511003 2 12 2 z M 12 4 C 16.430123 4 20 7.5698774 20 12 C 20 16.430123 16.430123 20 12 20 C 7.5698774 20 4 16.430123 4 12 C 4 7.5698774 7.5698774 4 12 4 z M 16.292969 8.2929688 L 10 14.585938 L 7.7070312 12.292969 L 6.2929688 13.707031 L 10 17.414062 L 17.707031 9.7070312 L 16.292969 8.2929688 z"></path>
	`;
    imageError.innerHTML = `
		<path fill="#FA5252" d="M 12 2 C 6.4889971 2 2 6.4889971 2 12 C 2 17.511003 6.4889971 22 12 22 C 17.511003 22 22 17.511003 22 12 C 22 6.4889971 17.511003 2 12 2 z M 12 4 C 16.430123 4 20 7.5698774 20 12 C 20 16.430123 16.430123 20 12 20 C 7.5698774 20 4 16.430123 4 12 C 4 7.5698774 7.5698774 4 12 4 z M 8.7070312 7.2929688 L 7.2929688 8.7070312 L 10.585938 12 L 7.2929688 15.292969 L 8.7070312 16.707031 L 12 13.414062 L 15.292969 16.707031 L 16.707031 15.292969 L 13.414062 12 L 16.707031 8.7070312 L 15.292969 7.2929688 L 12 10.585938 L 8.7070312 7.2929688 z"></path>
	`;
    imageWarning.innerHTML = `
		<path fill="#ff8503" d="M12 5.99L19.53 19H4.47L12 5.99M12 2L1 21h22L12 2zm1 14h-2v2h2v-2zm0-6h-2v4h2v-4z"></path>
	`;
    // Alert icon
    const alertIcon = type === 'success' ? imageSuccess : (type === 'error' ? imageError : imageWarning);
    modalBody[0].prepend(alertIcon);
    // Buttons
    const buttonsWrapper = (btns) => `<div class="fx-modal-alert-buttons">${btns}</div>`;
    const cancelButton = (label) => `<button type="button" id="fx-modal-cancel" class="fx-btn fx-btn-error" data-fx-action="close" data-fx-target="modal">${label}</button>`;
    const confirmButton = (label) => `<button type="button" id="fx-modal-confirm" class="fx-btn fx-btn-primary" data-fx-target="modal" data-fx-modal="init">${label}</button>`;
    const buttons = confirmButtonText && cancelButtonText ?
        cancelButton(cancelButtonText) + confirmButton(confirmButtonText) :
        (confirmButtonText ? confirmButton(confirmButtonText) : (cancelButtonText && cancelButton(cancelButtonText)));
    modalBody.style({ display: 'flex', flexDirection: 'column', alignItems: 'center' }) /*.insertHTML(alertIcon, 'prefix')*/;
    buttons && modalBody.insertHTML(buttonsWrapper(buttons), 'append');
    body?.append(initialModal);
    fx('.fx-modal-alert-icon', initialModal).style({ visibility: 'visible' }).fadein(2000).then();
    const modal = new FuxcelModal(initialModal);
    modal.show(!cancelButtonText);
    if (cancelButtonText || confirmButtonText) {
        if (!cancelButtonText)
            modal.off().upon('fx.modal.hide', (e) => typeof onEsc === 'function' ? onEsc(e, modal) : null);
        modal.off('click').upon('click', function (e) {
            const target = e.target;
            const _clicked = ((target.tagName.toLowerCase() !== 'button' && target.tagName.toLowerCase() !== 'div') ? (target.tagName.toLowerCase() !== 'svg' ? target.parentElement?.parentElement : target.parentElement) : target);
            const clickedTarget = fx(_clicked);
            const isCancel = clickedTarget.matchSelector('#fx-modal-cancel') || clickedTarget.matchSelector('#fx-modal-cancel *');
            const isConfirm = clickedTarget.matchSelector('#fx-modal-confirm') || clickedTarget.matchSelector('#fx-modal-confirm *');
            const isClose = clickedTarget.matchSelector(`.close[data-fx-action="close"]`) ||
                clickedTarget.matchSelector(`.close[data-fx-action="close"] *`);
            fx('.fx-modal-content', modal).hasFocus.then((focused) => {
                if (!focused && !parseBool(modal.dataAttrib('fx-static'))) {
                    modal.hide(true);
                    modal.off().upon('fx.modal.hide', (e) => cancelButtonText && typeof onCancel === 'function'
                        ? onCancel(e, modal)
                        : (!closeOnConfirm && typeof onConfirm === 'function' ? onConfirm(e, modal) : null));
                }
                else {
                    if (isConfirm && !closeOnConfirm && typeof onConfirm === 'function') {
                        onConfirm(e, modal);
                    }
                    else if (isCancel || isConfirm || isClose) {
                        modal.hide(true);
                        modal.off().upon('fx.modal.hide', (e) => (isCancel || isClose) && typeof onCancel === 'function'
                            ? onCancel(e, modal)
                            : (isConfirm && typeof onConfirm === 'function' ? onConfirm(e, modal) : null));
                    }
                }
            });
        });
    }
    else {
        if (!cancelButtonText)
            modal.off().upon('fx.modal.hide', (e) => typeof onEsc === 'function' ? onEsc(e, modal) : null);
    }
    return modal;
}

/**
 * Perform a fetch request using the [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API).
 *
 * Wraps `fetch` with timeout support (via `AbortController`), automatic
 * `FormData` coercion, and structured success / error callbacks.
 *
 * @param {FXRequestType.uri} uri Request URL.
 * @param {FXRequestType.method} method HTTP method (default: 'get').
 * @param {FXRequestType.data} data Request body data.
 * @param {FXRequestType.dataType} dataType Expected response type (default: 'json').
 * @param {FXRequestType.headers} headers Additional request headers.
 * @param {FXRequestType.beforeSend} beforeSend Callback fired before the request is sent.
 * @param {FXRequestType.timeout} timeout Timeout in seconds before the request is aborted (default: 10).
 * @param {FXRequestType.onComplete} onComplete Callback fired when the request completes (success or error).
 * @param {FXRequestType.onError} onError Callback fired on network/timeout errors.
 * @param {FXRequestType.onSuccess} onSuccess Callback fired on HTTP 2xx responses.
 */
const fxFetch = function ({ uri = '', method = 'get', data = null, dataType = 'json', headers = null, beforeSend = null, timeout = 10, onComplete = null, onError = null, onSuccess = null, }) {
    let status;
    let statusText;
    let responseData;
    timeout = timeout * 1000;
    const controller = new AbortController();
    const timeoutID = setTimeout(() => controller.abort(), timeout);
    const allowedErrorStatuses = new Set([301, 308, 401, 402, 419, 422, 423, 426, 451, 500, 511]);
    const defaultHeaders = { 'X-Requested-With': 'XMLHttpRequest' };
    isFunction(beforeSend) && beforeSend();
    // Coerce plain objects to FormData
    if (data?.constructor.name.toLowerCase() === 'object') {
        const formData = new FormData();
        // @ts-ignore
        Object.keys(data).forEach(key => formData.append(key, data[key]));
        data = formData;
    }
    // Merge custom headers
    if (headers?.constructor.name.toLowerCase() === 'object')
        // @ts-ignore
        Object.keys(headers).forEach(key => (defaultHeaders[key] = headers[key]));
    fetch(uri, {
        method: method,
        body: data,
        headers: defaultHeaders,
        signal: controller.signal,
    }).then(response => {
        responseData = response;
        status = responseData.status;
        statusText = responseData.statusText;
        try {
            // @ts-ignore
            const consumed = response[dataType]();
            return (consumed && (responseData.ok || (status > 199 && status < 300) || allowedErrorStatuses.has(status))) ? consumed : Promise.reject(response);
        }
        catch (e) {
            return Promise.reject(e);
        }
    }).then(parsedData => {
        responseData.responseJSON = dataType === 'json' && parsedData;
        responseData.responseText = dataType === 'json'
            ? JSON.stringify(parsedData)
            : (dataType === 'text' && parsedData);
        onComplete && isFunction(onComplete) && onComplete(responseData, status, statusText);
        status > 199 && status < 300 && onSuccess && isFunction(onSuccess) && onSuccess(responseData, status, statusText);
    }).catch(error => {
        isFunction(onError) && (error.name === 'AbortError'
            ? onError(new TimeoutError(`⏰ Request timed out\r\nSet Timeout:${timeout / 1000}s`), 408, 'timeout')
            : onError(error, status, statusText));
    }).finally(() => clearTimeout(timeoutID));
};

/**
 * Check if the given input passes the Luhn Algorithm test.
 * Commonly used to validate credit card numbers.
 *
 * @param input {string | number} The number to validate.
 * @example
 * fx.passLuhnAlgo('4532015112830366'); // true
 * @returns {boolean} `true` if the number passes the Luhn check; `false` otherwise.
 */
const passLuhnAlgo$1 = (input) => {
    const digitSum = (c) => c < 10 ? c : digitSum(Math.trunc(c / 10) + (c % 10));
    return String(input)
        .split('')
        .reverse()
        .map(Number)
        .map((value, index) => index % 2 !== 0 ? digitSum(value * 2) : value)
        .reduce((prev, curr) => prev + curr) % 10 === 0;
};

/**
 * Re-exports all types from the single source of truth: global.d.ts
 *
 * Import types from here in all source files:
 *   import type { FXRequestType, ValidatorConfigObject } from '../types';
 */
// ─── Resolve circular dependencies via static slot injection ──────────────────
// All modules are now fully loaded. We connect the inter-class references here
// rather than inside the classes themselves, which keeps every file free of
// require() and circular import statements.
// Fuxcel ← FuxcelValidator / FuxcelModal / fxFetch / fxModal
Fuxcel._validatorFactory = (el) => new FuxcelValidator(el);
Fuxcel._modalFactory = (el) => new FuxcelModal(el);
Fuxcel._fxFetch = fxFetch;
Fuxcel._fxModal = fxModal;
// FuxcelValidator ← FuxcelSteps / fxModal
FuxcelValidator._stepsFactory = FuxcelSteps;
FuxcelValidator._fxModal = fxModal;
// ─── Attach static helpers directly onto fx ───────────────────────────────────
// Using direct assignment (not Object.assign) preserves the fx() call signature
// so both `fx('#el').fadein()` and `fuxcel('#el').fadein()` work correctly,
// and IDEs surface the full interface including .fetch, .modal etc.
fx.fetch = fxFetch;
fx.fetchPage = fxFetchPage;
fx.pageLoader = fxPageLoader;
fx.pageNavigate = fxPageNavigate;
fx.modal = fxModal;
fx.onDocumentLoad = (listener) => fx(document).off().upon('DOMContentLoaded', listener);
fx.passLuhnAlgo = passLuhnAlgo$1;
/**
 * Alias of `fx`. Identical in every way — selector function + static helpers.
 *
 * @example
 * fuxcel('#btn').fadein();
 * fuxcel.fetch({ uri: '/api', method: 'post' });
 */
const fuxcel = fx;
// ─── Expose everything to window for script-tag / non-module usage ───────────
pushPropsToWindow({
    // Core selector — both names work identically
    fx: fx,
    fuxcel,
    // Classes — usable as `new FuxcelValidator(...)` etc. in plain scripts
    FuxcelBase,
    Fuxcel,
    FuxcelValidator,
    FuxcelSteps,
    FuxcelModal,
    // Standalone functions
    fxFetch,
    fxFetchPage,
    fxPageLoader,
    fxModal,
    passLuhnAlgo: passLuhnAlgo$1,
    // Type-guard / utility helpers
    isBool,
    isDefined,
    isFunction,
    isObject,
    isString,
    parseBool,
});
// Auto-init modals if triggers are present in the DOM
FuxcelModal.modalTriggers.length && new FuxcelModal('*');

exports.default = fx;
//# sourceMappingURL=fuxcel.cjs.js.map
