import {CustomEventType, FxFetchPage, FxPageLoader, FxPageNavigate, Selector} from '../types';

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
 * Fetch Page data
 *
 * @param {string} url
 * @param {"json" | "text"} dataType
 * @param {Function | null} beforeSend
 * @returns {Promise<string>}
 */
export const fxFetchPage: FxFetchPage = function (url: string, dataType: 'json' | 'text', beforeSend?: Function | null): Promise<string> {
	if (fx.fetch) {
		return new Promise((resolve, reject) => {
			fx.fetch({
				uri: url,
				method: 'get',
				dataType: dataType,
				timeout: 30,
				beforeSend: () => typeof beforeSend === 'function' && beforeSend(),
				onSuccess: res => resolve(res.responseText as string),
				onError: err => reject(err)
			});
		}) as Promise<string>;
	}
	
	return fetch(url, {
		headers: {'X-Requested-With': 'XMLHttpRequest'}
	}).then(r => r.text()).catch(err => Promise.reject(err));
};

/**
 * Asynchronously
 *
 * @param {{url?: string | null, dataType?: "json" | "text", replace?: boolean}} options
 * @returns {Promise<string>}
 */
export const fxPageNavigate: FxPageNavigate = function (options: { url?: string | null, dataType?: 'json' | 'text', replace?: boolean }): Promise<string> {
	return new Promise((resolve, reject) => {
		if (!options.url || options.url === location.href) reject('');
		
		fxFetchPage(options.url ?? '', options.dataType ?? 'json', fxPageLoader.start).then(html => {
			document.documentElement.classList.add('fx-leaving');
			
			if (options.replace) {
				history.replaceState({}, '', options.url);
			} else {
				history.pushState({}, '', options.url);
			}
			injectHTML('#root', html).then(() => {
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

export const fxPageLoader: FxPageLoader = {
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
	finish() {
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
