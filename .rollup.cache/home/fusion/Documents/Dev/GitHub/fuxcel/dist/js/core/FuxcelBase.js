import { isString } from '../utils';
/**
 * Base class for the Fuxcel selector engine.
 * Handles element selection, array conversion, and static device helpers.
 */
export class FuxcelBase {
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
                const _context = (context && ((isString(context)
                    ? INSTANCE.#_toArray(document.querySelector(context))
                    : INSTANCE.#_toArray(context)))[0]);
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
                return context && _context
                    ? _context.querySelectorAll(selector)
                    : document.querySelectorAll(selector);
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
    /** Returns the `FieldAttributes` of the first selected element. */
    get fieldAttributes() {
        const selected = this.toArray;
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
            formId: selected[0].form?.id?.toLowerCase() ?? null,
        };
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
//# sourceMappingURL=FuxcelBase.js.map