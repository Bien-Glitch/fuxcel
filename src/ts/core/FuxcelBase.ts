import type {IterableElement} from '../types';
import {isString} from '../utils';

/**
 * Base class for the Fuxcel selector engine.
 * Handles element selection, array conversion, and static device helpers.
 */
export class FuxcelBase {
	length: number = 0;
	protected prev: { length: number } = {length: 0};
	
	constructor(selector: string | IterableElement | any, context?: string | IterableElement | any) {
		const INSTANCE: FuxcelBase = this;
		const selectedElements: IterableElement | NodeListOf<HTMLElement> | undefined =
			<HTMLElement[] | NodeListOf<HTMLElement>>init();
		const documentDOMArray: IterableElement = <Document[]>INSTANCE.#_toArray(document);
		
		documentDOMArray.forEach((value: any, key: number) => {
			(<any>INSTANCE.prev)[key] = value;
			INSTANCE.prev.length++;
		});
		
		selectedElements && selectedElements.forEach((value: HTMLElement, key: number) => {
			(<any>INSTANCE)[key] = value;
			INSTANCE.length++;
		});
		
		function init(): IterableElement | NodeListOf<HTMLElement> | undefined {
			let selected: NodeListOf<HTMLElement>;
			try {
				const _context: HTMLElement = <HTMLElement>(
					context && ((isString(context)
						? INSTANCE.#_toArray(document.querySelector(context))
						: INSTANCE.#_toArray(context)))[0]
				);
				
				if (INSTANCE.#_isHTMLElement(selector) || INSTANCE.#_isIterable(selector)) {
					const target: IterableElement = <HTMLElement[]>INSTANCE.#_toArray(selector);
					if (context) {
						if (target.length) {
							target.forEach((value: HTMLElement) => (value.dataset.fuxcelTempId = 'fuxcel-temp-selector'));
							selected = _context.querySelectorAll('[data-fuxcel-temp-id="fuxcel-temp-selector"]');
							target.forEach((value: HTMLElement) => delete value.dataset.fuxcelTempId);
							return selected;
						}
					}
					return target;
				}
				return context && _context
					? _context.querySelectorAll(selector)
					: document.querySelectorAll(selector);
			} catch (e) {
				console.trace(e);
			}
		}
		
		return INSTANCE;
	}
	
	// ─── Private Static Helpers ───────────────────────────────────────────────
	
	static get #_getCurrentScriptFilename(): string | null {
		try {
			throw new Error();
		} catch (e) {
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
	
	static get #_getCurrentScriptSrc(): string | undefined {
		const scripts: IterableElement = <HTMLElement[]>Array.from(document.scripts);
		for (const script of scripts) {
			const src = script.getAttribute('src');
			const srcSplit = src?.split(/[\\/]/gi);
			const name = srcSplit?.length ? srcSplit[srcSplit.length - 1] : null;
			if (FuxcelBase.#_getCurrentScriptFilename && name)
				if (FuxcelBase.#_getCurrentScriptFilename.toLowerCase() === name.toLowerCase())
					return src?.toLocaleLowerCase();
		}
	}
	
	static get #_constructors(): { iterable: any[]; html: any[] } {
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
	
	#_isIterable(element: any): boolean {
		return (
			!!FuxcelBase.#_constructors.iterable.filter(
				v => element.constructor.name.toLowerCase().includes('collection') ||
					v === element.constructor.name.toLowerCase()
			).length || Array.isArray(element)
		);
	}
	
	#_isHTMLElement(element: HTMLElement | any): boolean {
		return !!FuxcelBase.#_constructors.html.filter(
			v => element.constructor.name.toLowerCase().includes(v)
		).length;
	}
	
	#_toArray(element: any): IterableElement {
		return this.#_isIterable(element) ? <IterableElement>Array.from(element) : [element];
	}
	
	// ─── Public Getters ───────────────────────────────────────────────────────
	
	/** Guesses the directory path of the current script file. */
	static get guessPath(): string | null {
		const fullPath = FuxcelBase.#_getCurrentScriptSrc;
		const parts = fullPath?.split(/[\\/]/gi);
		parts?.splice(parts.length - 1);
		return parts?.join('/') ?? null;
	}
	
	/** Returns previous object context. */
	get prevObj(): { length: number } {
		return this.prev;
	}
	
	/** Returns the selected element(s) as a plain array. */
	get toArray(): IterableElement {
		return this.#_toArray(this);
	}
	
	/** Returns the `FieldAttributes` of the first selected element. */
	get fieldAttributes() {
		const selected = <HTMLInputElement[]>this.toArray;
		const field = selected[0];
		const fieldId = field.getAttribute('id')?.toLowerCase();
		const dataId = field.dataset.id;
		const fxName = field.dataset.fxName ??
			(dataId?.length && fieldId?.endsWith(dataId)
				? fieldId.replace(`_${dataId}`, '')
				: fieldId);
		return {
			id: fieldId,
			fxName,
			type: selected[0].getAttribute('type')?.toLowerCase() ?? null,
			fxId: selected[0].getAttribute('type')?.toLowerCase() ?? null,
			fxRole: selected[0].getAttribute('type')?.toLowerCase() ?? null,
			formId: (selected[0] as any).form?.id?.toLowerCase() ?? null,
		};
	}
	
	// ─── Static Device Helpers ────────────────────────────────────────────────
	
	/** `true` if the current device is a mobile device. **/
	static get isMobileDevice(): boolean {
		return navigator.userAgent.toLowerCase().includes('mobile');
	}
	
	/** `true` if the pointer is coarse (touch). **/
	static get pointerIsTouch(): boolean {
		return window.matchMedia('(pointer: coarse)').matches;
	}
}
