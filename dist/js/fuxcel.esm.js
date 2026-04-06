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
 * Handles: true, 'true', 1, '1', 'on', 'yes' → true; everything else → false.
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
 */
function pushPropsToWindow(prop, value) {
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
    /** `true` if the current device is a mobile device. */
    static get isMobileDevice() {
        return navigator.userAgent.toLowerCase().includes('mobile');
    }
    /** `true` if the pointer is coarse (touch). */
    static get pointerIsTouch() {
        return window.matchMedia('(pointer: coarse)').matches;
    }
}

/**
 * Returns a map of all supported Web Animations API keyframe definitions,
 * parametrised by duration, iteration count, and display value.
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
     * @param animation
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
     * @param timeout {number} Animation duration.
     * @param iteration
     * @param display
     * @return {Promise<Fuxcel>}
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
     * @param timeout {number|string} Animation duration.
     * @param iteration {number|string}
     * @param display {string}
     * @return {Promise<Fuxcel>}
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
     * Perform a Slidein-down animation on selected element.
     *
     * @param timeout {number|string} Animation duration.
     * @param iteration {number|string}
     * @param display {string}
     * @return {Promise<Fuxcel>}
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
     * Perform a Slidein-up animation on selected element.
     *
     * @param timeout {number|string} Animation duration.
     * @param iteration {number|string}
     * @param display {string}
     * @return {Promise<Fuxcel>}
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
     * Perform a Slideout-down animation on selected element.
     *
     * @param timeout {number|string} Animation duration.
     * @param iteration {number|string}
     * @param display {string}
     * @return {Promise<Fuxcel>}
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
     *
     * Perform a Slideout-up animation on selected element.
     *
     * @param timeout {number|string} Animation duration.
     * @param iteration {number|string}
     * @param display {string}
     * @return {Promise<Fuxcel>}
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
     * Perform a Slidein-left animation on selected element.
     *
     * @param timeout {number|string} Animation duration.
     * @param iteration {number|string}
     * @param display {string}
     * @return {Promise<Fuxcel>}
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
     * Perform a Slideout-left animation on selected element.
     *
     * @param timeout {number|string} Animation duration.
     * @param iteration {number|string}
     * @param display {string}
     * @return {Promise<Fuxcel>}
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
     * Perform a Slidein-right animation on selected element.
     *
     * @param timeout {number|string} Animation duration.
     * @param iteration {number|string}
     * @param display {string}
     * @return {Promise<Fuxcel>}
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
     * Perform a Slideout-right animation on selected element.
     *
     * @param timeout {number|string} Animation duration.
     * @param iteration {number|string}
     * @param display {string}
     * @return {Promise<Fuxcel>}
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
     * Perform a blink animation on selected element.
     *
     * @param timeout {number|string} Animation duration.
     * @param iteration {number|string}
     * @param display {string}
     * @return {Promise<Fuxcel>}
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
     * Perform a Zoom-in animation on selected element.
     *
     * @param timeout {number|string} Animation duration.
     * @param iteration {number|string}
     * @param display {string}
     * @return {Promise<Fuxcel>}
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
     * Perform callback on each selected item
     *
     * @param callback {((element: Fuxcel, index: number) => void)}
     */
    each(callback) {
        this.toArray.forEach((el, i) => callback(fx(el), i));
    }
    /**
     * Get or Set the given attribute(s) for the selected element (If a String is passed to the name param).
     *
     * _Gets the attribute if only the name is given as a String._
     *
     * _Sets the attribute if name and value is given as a String._
     *
     * _Sets the given attributes if name is given as an Object (Key-Value Pair)._
     *
     * @param name {string|Object} Name of the attribute or a Key-Value pair Object.
     * @param value {string|null = null} Value to set for the attribute; Not required if an Object is passed as an argument to the name parameter.
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
     * @param name {string|Object} Name of the [data-*] attribute or a Key-Value pair Object.
     * @param value {string|null = null} Value to set for the [data-*] attribute; Not required if an Object is passed as an argument to the name parameter.
     * @return {Fuxcel|string}
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
     * @param name {string|Object} Name of the property or a Key-Value pair Object.
     * @param value {boolean|string|null = null} Value to set for the property; Not required if an Object is passed as an argument to the name parameter.
     * @return {Fuxcel|string}
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
     * @param name {string|Object} Name of the style or a Key-Value pair Object.
     * @param value {boolean|string|null = null} Value to set for the style; Not required if an Object is passed as an argument to the name parameter.
     * @return {Fuxcel|string}
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
     * @return {Object} An object containing the attributes of the selected element.
     */
    listAttrib() {
        const selected = this.toArray;
        const list = {};
        Array.from(selected[0].attributes).forEach((a) => (list[a.name] = a.value));
        return list;
    }
    /**
     * Returns the properties of the selected element as on Object.
     *
     * @return {Object} An object containing the properties of the selected element.
     */
    listProp() {
        const selected = this.toArray;
        const list = {};
        Object.keys(selected[0])
            .filter(p => Number.isNaN(parseInt(p)) && selected[0][p])
            .forEach(p => (list[p] = selected[0][p]));
        return list;
    }
    // ─── DOM Mutation ─────────────────────────────────────────────────────────
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
     * @param name {...string} Comma separated strings of [data-*] attribute(s) to remove.
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
     * Inserts the given HTML string to the given position of the selected element.
     *
     * _Inserts the HTML string as inner HTML if no position is given._
     *
     * @param value {string} HTML string to insert
     * @param position {('affix'|'prefix'|'postfix'|'suffix'|null)} Position to place given HTML string.
     * @return {Fuxcel} Fuxcel Object of the selected element
     */
    insertHTML(value, position = null) {
        const selected = this.toArray;
        const positions = {
            affix: 'beforebegin', prefix: 'afterbegin',
            postfix: 'afterend', suffix: 'beforeend',
        };
        if (isString(position) && !positions[position])
            throw `Invalid position option. Valid: 'affix', 'prefix', 'postfix', 'suffix'`;
        selected.forEach((el) => isString(position)
            ? el.insertAdjacentHTML(positions[position], value)
            : (el.innerHTML = value));
        return this;
    }
    // ─── Traversal ────────────────────────────────────────────────────────────
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
     * @param tagName {string|HTMLElementTagNameMap} HTML tag name to check for.
     * @return {boolean} true if the selected elements' tag name matches the given tag name; false otherwise.
     */
    isElement(tagName) {
        const selected = this.toArray;
        if (isString(tagName))
            return selected[0].tagName.toLowerCase() === tagName.toString().toLowerCase();
        throw `\`isElement()\` expects 1 string argument.`;
    }
    /**
     * Checks to see if the selected element would be selected by the provided selectorString _-- in other words --_ checks if the selected element "is" the selector.
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
     * @param direction {('vertical'|'horizontal'|null)} Specific direction to check _[horizontal or vertical]_.
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
     *
     * @param uri {string|null=''} Request URL.
     * @param method {('get'|'post'|'put'|'patch'|'delete'|null)} Form Request method.
     * @param data {object|null=null} Additional form request data.
     * @param dataType {('html'|'json'|'jsonp'|'script'|'text'|'xml'|null)} Expected return data type.
     * @param headers {Object|Headers} Additional Headers to be sent along the request.
     * @param beforeSend {Function|null = null} Before request is sent.
     * @param timeout
     * @param handleError
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
                                    // const {fxModal} = require('../modal/fxModal');
                                    // const fxModal = Fuxcel._fxModal;
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
                                    resolve({ text: xhr.responseText, form });
                                else
                                    reject({ response: xhr, status, form });
                            }
                        },
                    }) : form.renderValidationErrors(form.errorBag);
            }
        }));
    }
    // ─── Events ───────────────────────────────────────────────────────────────
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
     * @param events {string} Event as a string.
     * @param listener {((e: EventInterfaces) => any)} Listener function to handle given event.
     * @param {boolean} [option] Optional boolean parameter to set CAPTURING_PHASE of the event listener to either true or false.
     * @return {Fuxcel} Fuxcel Object of the selected element
     *
     * @param events {Object} Events passed as a Key-Value pair with each event as the key and the listener functions as the values
     * @param  {boolean} [listener] Optional boolean parameter to set CAPTURING_PHASE of the event listener to either true or false.
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
        const match = { mouse: MouseEvent, custom: CustomEvent, keyboard: KeyboardEvent };
        const InitEvent = !type ? Event : match[type.toLowerCase()];
        const newEvent = new InitEvent(event, { bubbles: true, cancelable: true });
        selected.forEach((el) => el.dispatchEvent(newEvent));
        return this;
    }
    /**
     * Get or set the value of the selected element.
     *
     * @param value {string|null=null} Value to set for the given element (If available).
     * @return {Fuxcel|string|null} The value of the selected element if no parameter is passed for value; Fuxcel object of the selected element otherwise.
     */
    value(value = null) {
        const selected = this.toArray;
        if (isString(value) || isDefined(value)) {
            selected.forEach((el) => parseBool(el.contentEditable)
                ? (el.innerText = value.toString())
                : (el.value = value.toString()));
            return this;
        }
        return parseBool(selected[0].contentEditable)
            ? selected[0].innerText
            : selected[0].value;
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

/**
 * Form validation engine.
 * Extends `Fuxcel` with rich real-time validation, error-bag tracking,
 * field-type detection, and step-form support.
 */
class FuxcelValidator extends Fuxcel {
    #_fxValidatorConfig = FuxcelValidator.defaultValidatorConfig;
    static #_defaultConfig = {
        regExp: {
            cardCVV: /[0-9]{3,4}$/gi,
            cardNumber: /^[0-9]+$/gi,
            email: /^(((\w)+(\+?[.-]?\w+)?)*@(\w+[.-]?)*(\.\w{2,63})){1,320}$/gi,
            name: /^([a-zA-Z]{2,255})(\s[a-zA-Z]{2,255}){1,2}$/gi,
            phone: /^(\+\d{1,3}?\s)(\(\d{3}\)\s)?(\d+\s)*(\d{2,3}-?\d+)+$/g,
            username: /^[a-zA-Z]+(_?[a-zA-Z]){2,255}$/gi,
            password: /^([\w._-]){8,32}$/gi,
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
            capslock: 'Capslock active',
            emailFormat: null,
            nameFormat: null,
            passwordFormat: 'Password requires between 8-32 characters',
            phoneFormat: null,
            usernameFormat: null,
        },
    };
    static #_initSteps = {};
    static #_stepsClass = '.fx-step';
    static #_registry = {};
    /**
     * Per-instance error bag: { [formId]: { [fieldId]: errorMessage } }
     * Instance-level so multiple FuxcelValidator instances on different
     * forms (or the same form) never share or overwrite each other's state.
     */
    // #_validatorErrorBag: { [key: string]: any } = {};
    /**
     * Per-instance error count: { [formId]: number }
     */
    // #_validatorErrorCount: { [key: string]: any } = {};
    // #_validatorFormConfigBag: { [key: string]: any } = {};
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
     * Returns the registry slot for a given formId, creating it if absent.
     * Never resets an existing slot — use #_clearFormRegistry to do that explicitly.
     */
    static #_getFormRegistry(formId) {
        if (!FuxcelValidator.#_registry[formId])
            FuxcelValidator.#_registry[formId] = { configObject: FuxcelValidator.defaultValidatorConfig, bag: {}, count: 0, steps: {} };
        return FuxcelValidator.#_registry[formId];
    }
    /**
     * Resets the registry slot for a given formId.
     * Called only on explicit re-init, not on every instance creation.
     */
    static #_clearFormRegistry(formId) {
        FuxcelValidator.#_registry[formId] = { configObject: FuxcelValidator.defaultValidatorConfig, bag: {}, count: 0, steps: {} };
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
     * properly initialized — Object.assign cannot copy private fields
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
    /**
     * Replace the current selected element(s) with the given one(s) in the Fuxcel Validator Object.
     *
     * @param elements {Fuxcel | FuxcelBase | FuxcelValidator}
     * @private
     * @return {FuxcelValidator} Fuxcel Validator Object of the selected element.
     */
    /*#_resetFuxcelObject(elements: Fuxcel | FuxcelBase | FuxcelValidator): FuxcelValidator {
        /!*const documentDOMArray: IterableElement = <Document[]>fx(document).toArray;
        
        // @ts-ignore
        Object.keys(this).forEach(key => delete this[key]);
        this.length = 0;
        this.prev = {length: 0};
        
        documentDOMArray.forEach((value: Document, key: number) => {
            // @ts-ignore
            this.prev[key] = value;
            this.prev.length++;
        });
        
        (<HTMLElement[]>elements.toArray).forEach((value: HTMLElement, index: number) => {
            // @ts-ignore
            this[index] = value;
            this.length++;
        });
        return this;*!/
    }*/
    #_touchConfig(config) {
        const defaults = FuxcelValidator.defaultValidatorConfig;
        this.#_fxValidatorConfig = {
            regExp: { ...defaults.regExp, ...(config.regExp ?? {}) },
            config: { ...defaults.config, ...(config.config ?? {}) },
            stepForm: { ...defaults.stepForm, ...(config.stepForm ?? {}), config: { ...defaults.stepForm?.config, ...(config.stepForm?.config ?? {}) } },
            texts: { ...defaults.texts, ...(config.texts ?? {}) },
        };
    }
    // ─── Initialisation ───────────────────────────────────────────────────────
    validateFromGroup(formGroup) {
        return this.#_validate(this, formGroup);
    }
    #_initValidateForms(forms) {
        forms.forEach((form, index) => {
            const that = this;
            const configObject = this.validatorConfig;
            const _currentForm = fx(form).formValidator;
            if (!_currentForm.attrib('id'))
                _currentForm.attrib({ id: `current-form-${index}` });
            let formId = _currentForm.attrib('id');
            let formGroups = fx(`#${formId} .form-group`).formValidator;
            // Clear this form's registry slot on every explicit .init() call
            // so stale field errors from a previous init don't linger.
            FuxcelValidator.#_clearFormRegistry(formId);
            FuxcelValidator.#_getFormRegistry(formId).configObject = configObject;
            configObject.config?.nativeValidation ?
                _currentForm.prop({ noValidate: false }) :
                _currentForm.prop({ noValidate: true });
            if (formGroups.length) {
                formGroups.toArray.forEach((formGroup) => {
                    const _field = fx('.form-field', formGroup).formValidator;
                    const _label = fx('label', formGroup).formValidator;
                    if (_field.length && _label.length && _field.length < 2 && _label.length < 2) {
                        if (!_field.attrib('id'))
                            if (_field.attrib('name'))
                                _field.attrib({ id: _field.attrib('name').toString().replaceAll('-', '_') });
                            else {
                                // @ts-ignore
                                console.error(`${_field[0].tagName} has no id or name attribute`, _field);
                                throw `Field element does not have an \`id\` or \`name\` attribute`;
                            }
                        const fieldId = _field.attrib('id');
                        if (_field.prop('tagName').toString().toLowerCase() === 'input' && !_field.attrib('placeholder'))
                            _field.attrib({ placeholder: _field.fieldAttributes.fxName?.toTitleCase() });
                        if (!_label.attrib('for') || _label.attrib('for').toLowerCase() !== fieldId.toLowerCase())
                            _label.attrib('for', fieldId);
                        // @ts-ignore
                        formGroup = this.#_placeElements(that, form, formGroup, _field[0], _label[0]);
                        this.#_validate(that, formGroup);
                    }
                });
            }
            else
                console.error(`init-wrapper element not found in form: #${formId}`);
        });
        return this.#_resetFuxcelObject(fx(forms));
    }
    #_initValidateStepForms(forms) {
        forms.forEach((form, index) => {
            const configObject = this.validatorConfig;
            const _currentForm = fx(form).formValidator;
            if (!_currentForm.attrib('id'))
                _currentForm.attrib({ id: `current-form-${index}` });
            const formId = _currentForm.attrib('id');
            const formSteps = fx(`#${formId} ${FuxcelValidator.stepsClass}`).formValidator;
            if (formSteps.length) {
                // @ts-ignore
                FuxcelValidator.#_initSteps[index] = formId;
                FuxcelValidator.#_clearFormRegistry(formId);
                FuxcelValidator.#_getFormRegistry(formId).configObject = configObject;
                configObject.config?.nativeValidation ?
                    _currentForm.prop({ noValidate: false }) :
                    _currentForm.prop({ noValidate: true });
                formSteps.toArray.forEach((stepDiv) => {
                    const step = stepDiv.dataset.fxStep ?? '0';
                    const formRegistry = FuxcelValidator.#_getFormRegistry(formId);
                    if (!formRegistry.steps[step])
                        formRegistry.steps[step] = { bag: {}, count: 0 };
                    const formGroups = fx('.form-group', stepDiv).formValidator;
                    formGroups.length && formGroups.toArray.forEach((formGroup) => {
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
                                // @ts-ignore
                                _field.attrib({ placeholder: _field.fieldAttributes.fxName?.toTitleCase() });
                            if (!_label.attrib('for') || _label.attrib('for').toLowerCase() !== fieldId.toLowerCase())
                                _label.attrib('for', fieldId);
                            // @ts-ignore
                            formGroup = this.#_placeElements(this, form, formGroup, _field[0], _label[0]);
                            this.#_validate(this, formGroup);
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
    #_placeElements(that, form, formGroup, fieldEl, labelEl) {
        const formField = fx(fieldEl);
        const configObject = that.validatorConfig;
        const formFieldGroupId = `${fieldEl.id}_group`;
        const validationText = document.createElement('div');
        validationText.classList.add('validation-text');
        validationText.innerHTML = '<small>&nbsp;</small>';
        formGroup.setAttribute('id', formFieldGroupId);
        if (configObject.config?.useDefaultStyling) {
            const newInputGroup = document.createElement('div');
            const newFormGroupWrapper = document.createElement('div');
            const validationIcons = document.createElement('div');
            const togglePasswordIcons = document.createElement('div');
            const newInputGroupWrapper = document.createElement('div');
            const newFieldGroup = document.createElement('div');
            newFormGroupWrapper.classList.add('form-group-wrapper');
            newInputGroup.classList.add('input-group');
            formGroup.classList.add('fx-default-style');
            newInputGroupWrapper.classList.add('input-group-wrapper', 'fx-floating-label');
            newFieldGroup.classList.add('field-group');
            if (configObject.config?.showIcons) {
                const imageCheck = new Image();
                const imageClose = new Image();
                imageCheck.src = `${Fuxcel.path}/images/ok-24.svg`;
                imageClose.src = `${Fuxcel.path}/images/cancel-24.svg`;
                imageCheck.setAttribute('alt', '✅');
                imageClose.setAttribute('alt', '❌');
                imageCheck.setAttribute('width', '22px');
                imageClose.setAttribute('width', '22px');
                imageCheck.classList.add('fx-valid-icon');
                imageClose.classList.add('fx-invalid-icon');
                validationIcons.classList.add('validation-icons');
                validationIcons.append(imageCheck, imageClose);
            }
            if (configObject.config?.showPassword) {
                if (formField.attrib('type') && formField.attrib('type').toString().toLowerCase() === 'password') {
                    const showPassword = new Image();
                    const hidePassword = new Image();
                    showPassword.src = `${Fuxcel.path}/images/eye-24.png`;
                    hidePassword.src = `${Fuxcel.path}/images/invisible-24.png`;
                    showPassword.setAttribute('alt', '🔒');
                    hidePassword.setAttribute('alt', '🔓');
                    showPassword.setAttribute('width', '22px');
                    hidePassword.setAttribute('width', '22px');
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
            newFieldGroup.append(/*expectedFieldElement, */ labelEl);
            if (configObject.config?.showPassword && configObject.config?.showIcons)
                if (formField.attrib('type') && formField.attrib('type').toString().toLowerCase() === 'password')
                    newInputGroupWrapper.append(newFieldGroup, togglePasswordIcons, validationIcons);
                else
                    newInputGroupWrapper.append(newFieldGroup, validationIcons);
            else {
                if (formField.attrib('type') && formField.attrib('type').toString().toLowerCase() === 'password' && configObject.config?.showPassword)
                    newInputGroupWrapper.append(newFieldGroup, togglePasswordIcons);
                else if (configObject.config?.showIcons)
                    newInputGroupWrapper.append(newFieldGroup, validationIcons);
                else
                    newInputGroupWrapper.append(newFieldGroup);
            }
            newInputGroup.append(newInputGroupWrapper);
            newFormGroupWrapper.append(newInputGroup, validationText);
            formGroup.append(newFormGroupWrapper);
            newFieldGroup.style.height = `${fieldEl.getBoundingClientRect().height * 2}px`;
            fx(labelEl, form).style({
                height: '100%',
                /*display: 'flex',
                alignItems: 'center'*/
            });
        }
        else {
            if (!labelEl.innerText.length)
                labelEl.innerHTML = fieldEl.getAttribute('placeholder');
            formGroup.append(validationText);
        }
        validationText.setAttribute('id', `${fieldEl.id}Valid`);
        return formGroup;
    }
    #_validate(that, formGroup) {
        let refillRequired;
        const configObject = that.validatorConfig;
        const inputElement = 'input.form-field';
        const selectElement = 'select.form-field';
        const textAreaElement = 'textarea.form-field';
        const passwordToggle = FuxcelValidator.passwordTogglerIconClass;
        const _inputElement = fx(inputElement, formGroup);
        const _selectElement = fx(selectElement, formGroup);
        const _textAreaElement = fx(textAreaElement, formGroup);
        const _element = that.#_resetFuxcelObject(_inputElement.length ? _inputElement : (_selectElement.length ? _selectElement : _textAreaElement));
        const _passwordToggle = fx(passwordToggle, formGroup);
        const showPasswordToggle = `#${formGroup.id} ${passwordToggle} > .fx-show-password-icon`;
        const hidePasswordToggle = `#${formGroup.id} ${passwordToggle} > .fx-hide-password-icon`;
        const inputGroupWrapper = fx('.input-group-wrapper', formGroup);
        const labelElement = fx('label', inputGroupWrapper);
        // Input events
        _inputElement.length && _inputElement.attrib('id')?.length && _inputElement.upon({
            blur: function () {
                const _input = that.#_resetFuxcelObject(fx(this));
                if (inputGroupWrapper.length && labelElement.length) {
                    labelElement.style({ color: 'var(--fx-dark)' });
                    inputGroupWrapper.style({ borderColor: 'var(--fx-border-light)' });
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
            },
            focus: function () {
                const _input = that.#_resetFuxcelObject(fx(this));
                if (inputGroupWrapper.length && labelElement.length) {
                    labelElement.style({ color: 'var(--fx-purple)' });
                    inputGroupWrapper.style({ borderColor: 'var(--fx-purple)' });
                }
                if (configObject.config?.showPassword && _passwordToggle.length)
                    if (_input.isPasswordField)
                        _passwordToggle.hasFocus.then((focused) => {
                            if (!focused && _input.value()?.length) {
                                _input.attrib('type')?.toLowerCase() === 'password' && _passwordToggle.dataAttrib('require-refill', 'true');
                                refillRequired = parseBool(_passwordToggle.dataAttrib('require-refill'));
                            }
                        });
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
                if (inputGroupWrapper.length && labelElement.length) {
                    labelElement.style({ color: 'var(--fx-dark)' });
                    inputGroupWrapper.style({ borderColor: 'var(--fx-border-light)' });
                }
            },
            focus: function () {
                if (inputGroupWrapper.length && labelElement.length) {
                    labelElement.style({ color: 'var(--fx-purple)' });
                    inputGroupWrapper.style({ borderColor: 'var(--fx-purple)' });
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
                if (inputGroupWrapper.length && labelElement.length) {
                    labelElement.style({ color: 'var(--fx-dark)' });
                    inputGroupWrapper.style({ borderColor: 'var(--fx-border-light)' });
                }
            },
            focus: function () {
                if (inputGroupWrapper.length && labelElement.length) {
                    labelElement.style({ color: 'var(--fx-purple)' });
                    inputGroupWrapper.style({ borderColor: 'var(--fx-purple)' });
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
                    if (configObject.config?.showPassword && _passwordToggle.length)
                        _passwordToggle.off('touchstart', 'click').upon(['touchstart', 'click'], (e) => {
                            const _clicked = fx(e.target);
                            const _formGroup = _passwordToggle.parents('.form-group');
                            const _passwordField = fx(_element, _formGroup);
                            // @ts-ignore
                            if (_clicked[0] === fx(showPasswordToggle)[0]) {
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
                        cpwdField.validateField('Check Password.');
                    }
                    else {
                        if (!cpwdField.value()?.length)
                            cpwdField.validateField(`The ${cpwdFieldName} field is required.`);
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
                                    cpwdField.validateField('Check Password.');
                                }
                                // @ts-ignore
                                else if (pwdField.value()?.length !== maxLength) {
                                    pwdField.validateField(`The ${pwdFieldName} field requires ${maxLength} characters.`);
                                    if (!cpwdField.value()?.length)
                                        cpwdField.validateField(`The ${cpwdFieldName} field is required.`);
                                    else
                                        cpwdField.validateField('Check Password.');
                                }
                                else {
                                    if (!cpwdField.value()?.length)
                                        cpwdField.validateField(`The ${cpwdFieldName} field is required.`);
                                    else
                                        cpwdField.validateField();
                                    pwdField.validateField();
                                }
                            }
                            else {
                                // @ts-ignore
                                if (pwdField.value()?.length < minLength || pwdField.value()?.length > maxLength) {
                                    pwdField.validateField(`The ${pwdFieldName} field must be between ${minLength} and ${maxLength} characters.`);
                                    cpwdField.validateField('Check Password.');
                                }
                                else {
                                    if (!cpwdField.value()?.length)
                                        cpwdField.validateField(`The ${cpwdFieldName} field is required.`);
                                    else
                                        cpwdField.validateField();
                                    pwdField.validateField();
                                }
                            }
                        }
                        else if (minLength) {
                            // @ts-ignore
                            if (pwdField.value()?.length < minLength) {
                                pwdField.validateField(`The ${pwdFieldName} field requires ${minLength} characters.`);
                                cpwdField.validateField('Check Password.');
                            }
                            else {
                                pwdField.validateField();
                                cpwdField.validateField();
                            }
                        }
                        else {
                            if (!cpwdField.value()?.length)
                                cpwdField.validateField(`The ${cpwdFieldName} field is required.`);
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
                            pwdField.validateField(`The ${pwdFieldName} field must be between ${minLength} and ${maxLength} characters.`);
                        else
                            pwdField.validateField();
                    else
                        pwdField.validateField();
                }
            }
        }
        else
            this.validateField();
    }
    // ─── Public Getters ───────────────────────────────────────────────────────
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
    get errorBag() {
        if (!this.length || !this.isElement('form'))
            return null;
        const registry = FuxcelValidator.#_registry[this.attrib('id')];
        return registry && Object.keys(registry.bag).length ? registry.bag : null;
        /*return (this.length && this.isElement('form')) && Object.keys(this.#_validatorErrorBag[this.attrib('id')] ?? {}).length ?
            this.#_validatorErrorBag[this.attrib('id')] :
            null;*/
    }
    get errorCount() {
        if (!this.length || !this.isElement('form'))
            return 0;
        return FuxcelValidator.#_registry[this.attrib('id')]?.count ?? 0;
        /*return (this.length && this.isElement('form')) && Object.keys(this.#_validatorErrorCount).length ?
            this.#_validatorErrorCount[this.attrib('id')] : 0;*/
    }
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
    get isEmailField() {
        const a = this.fieldAttributes;
        return !!(a.type?.includes('email') || a.id?.includes('email') || a.fxId?.includes('email') || a.fxRole?.includes('email'));
    }
    get isNameField() {
        const a = this.fieldAttributes;
        return !this.isUsernameField && (a.id === 'name' || a.fxId === 'name' || a.fxRole === 'name');
    }
    get isPasswordField() {
        const registry = FuxcelValidator.#_registry[this.isElement('form') ? this.fieldAttributes?.id : this.fieldAttributes?.formId];
        const passwordId = registry.configObject.config?.passwordId;
        const a = this.fieldAttributes;
        return (a.type === 'password' || a.id?.includes(passwordId.toLowerCase()) ||
            a.fxId?.includes(passwordId.toLowerCase()) ||
            a.fxRole?.includes(passwordId.toLowerCase()));
    }
    get isPhoneField() {
        const a = this.fieldAttributes;
        return !!(a.type?.includes('tel') || a.type?.includes('phone') || a.id?.includes('phone') || a.fxId?.includes('phone') || a.fxRole?.includes('phone'));
    }
    get isUsernameField() {
        const a = this.fieldAttributes;
        return !!(a.id?.includes('username') || a.fxId?.includes('username') || a.fxRole?.includes('username'));
    }
    get stepFromField() {
        const stepDiv = this.parents(FuxcelValidator.stepsClass);
        return stepDiv.length ? parseInt(stepDiv.dataAttrib('fx-step') ?? '0') : -1;
    }
    get validationProps() {
        const configObject = this.#_fxValidatorConfig;
        const formGroup = configObject.config?.initWrapper;
        const formId = `#${this.fieldAttributes.formId}`;
        const elementId = `#${this.fieldAttributes.id}`;
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
    get validatorConfig() {
        return this.#_fxValidatorConfig;
    }
    // ─── Static Getters / Setters ─────────────────────────────────────────────
    static get defaultValidatorConfig() {
        return FuxcelValidator.#_defaultConfig;
    }
    static get passwordCapslockAlertClass() {
        return '.capslock-alert';
    }
    static get passwordTogglerIconClass() {
        return '.toggle-password-icons';
    }
    static get stepsClass() {
        return FuxcelValidator.#_stepsClass;
    }
    static set stepsClass(v) {
        FuxcelValidator.#_stepsClass = v;
    }
    // ─── Public Methods ───────────────────────────────────────────────────────
    init(config = null) {
        const selected = this.toArray;
        const forms = selected.filter((el) => fx(el).isElement('form'));
        const nonForms = selected.filter((el) => !fx(el).isElement('form'));
        if (forms.length) {
            if (nonForms.length)
                console.error(`${nonForms.length} non-form element(s) passed to validator:`, nonForms);
            config && isObject(config) && this.#_touchConfig(config);
            return this.validatorConfig.stepForm?.use ?
                this.#_initValidateStepForms(forms) :
                this.#_initValidateForms(forms);
        }
        else {
            console.error(`Non form-elements passed to validator`, nonForms);
            throw `${nonForms.length} non-form element(s) passed to validator.`;
        }
    }
    renderMessage(message = null, renderType = null) {
        this.insertHTML(`<small ${renderType ? `class="${renderType}"` : ''}>${message ?? '&nbsp;'}</small>`);
        return this;
    }
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
    showError(message = null) {
        const fieldAttribs = this.fieldAttributes;
        const validationProps = this.validationProps;
        const finalMessage = message ?? `The ${fieldAttribs.fxName?.toTitleCase()} field is required`;
        const registry = FuxcelValidator.#_registry[this.isElement('form') ? fieldAttribs?.id : fieldAttribs?.formId];
        this.#_manipulateErrorBag(finalMessage);
        registry.configObject.config?.showIcons && FuxcelValidator.#_toggleValidationIcons(validationProps.validIcon, validationProps.invalidIcon);
        fx(validationProps.validationField).length && fx(validationProps.validationField).formValidator.renderMessage(finalMessage);
        if (!!(registry.configObject.config?.useDefaultStyling))
            fx(`${validationProps.formGroup} .form-group-wrapper`).replaceClass('fx-valid-success', 'fx-valid-error');
        else
            fx(validationProps.formGroup).replaceClass('fx-valid-success', 'fx-valid-error');
    }
    showSuccess(message = null) {
        const validationProps = this.validationProps;
        const fieldAttribs = this.fieldAttributes;
        const registry = FuxcelValidator.#_registry[this.isElement('form') ? fieldAttribs?.id : fieldAttribs?.formId];
        this.#_manipulateErrorBag(true);
        registry.configObject.config?.showIcons && FuxcelValidator.#_toggleValidationIcons(validationProps.invalidIcon, validationProps.validIcon);
        fx(validationProps.validationField).length &&
            fx(validationProps.validationField).formValidator.renderMessage(message ?? null);
        if (registry.configObject.config?.useDefaultStyling)
            fx(`${validationProps.formGroup} .form-group-wrapper`).replaceClass('fx-valid-error', 'fx-valid-success');
        else
            fx(validationProps.formGroup).replaceClass('fx-valid-error', 'fx-valid-success');
    }
    toggleValidation() {
        return this.canBeValidated ? this.validateField() : this.undoValidation();
    }
    undoValidation(destroyValidation = false) {
        const fieldAttribs = this.fieldAttributes;
        const validationProps = this.validationProps;
        const registry = FuxcelValidator.#_registry[this.isFormElement ? validationProps?.id : fieldAttribs?.formId];
        if (registry) {
            if (destroyValidation && fieldAttribs.id) {
                delete registry.bag[fieldAttribs.id];
                registry.count = Object.keys(registry.bag).length;
            }
            /*if (destroyValidation) {
                delete this.#_validatorErrorBag[fieldAttribs.formId][<string>fieldAttribs.id];
                this.#_validatorErrorCount[fieldAttribs.formId] = Object.keys(this.#_validatorErrorCount[fieldAttribs.formId]).length;
            }*/
            if (registry.configObject.config?.useDefaultStyling)
                fx(`${validationProps.formGroup} .form-group-wrapper`).removeClass('fx-valid-error', 'fx-valid-success');
            else
                fx(validationProps.formGroup).removeClass('fx-valid-error', 'fx-valid-success');
            !fx(`${validationProps.validationIconField} > *`)?.length ?
                fx(validationProps.validationField).formValidator.renderMessage(null) :
                fx(`${validationProps.validationIconField} > *`).fadeout().then(() => fx(validationProps.validationField).formValidator.renderMessage(null));
        }
        return this;
    }
    stepErrorBag(step) {
        if (!this.length || !this.isElement('form'))
            return null;
        const stepReg = FuxcelValidator.#_registry[this.attrib('id')]?.steps[step];
        return stepReg && Object.keys(stepReg.bag).length ? stepReg.bag : null;
        /*// @ts-ignore
        return (this.length && this.isElement('form')) && Object.keys(FuxcelValidator.#_validatorErrorBag[this.attrib('id')][step] ?? {}).length ?
            // @ts-ignore
            FuxcelValidator.#_validatorErrorBag[this.attrib('id')][step] :
            null;*/
    }
    stepErrorCount(step) {
        if (!this.length || !this.isElement('form'))
            return 0;
        return FuxcelValidator.#_registry[this.attrib('id')]?.steps[step]?.count ?? 0;
        /*// @ts-ignore
        return (this.length && this.isElement('form')) && Object.keys(FuxcelValidator.#_validatorErrorCount).length ?
            // @ts-ignore
            FuxcelValidator.#_validatorErrorCount[this.attrib('id')][step] : 0;*/
    }
    validateCardCVV(regExp, customFormatEx = null) {
        return this.validateRegex(regExp, `${customFormatEx ?? 'Invalid CVV.'}`);
    }
    validateCardNumber(regExp, customFormatEx = null) {
        const selected = this.toArray;
        // @ts-ignore
        const value = selected[0].value;
        return this.validateRegex(() => 
        // @ts-ignore
        value.length ?
            (value.match(regExp) ? (passLuhnAlgo(selected[0]) ? this.validateField() : this.validateField('Check Card Number and try again.', true)) : this.validateField(`${customFormatEx ?? 'Only numbers are allowed.'}`)) :
            this.toggleValidation());
    }
    /**
     * Validate Email field using Regular Expression.
     *
     * @param regExp {RegExp} Regular expression to use.
     * @param customFormatEx {string|null=null} Custom format example to show user.
     * @return {FuxcelValidator} Fuxcel Validator Object of the selected element.
     **/
    validateEmail(regExp, customFormatEx = null) {
        return this.validateRegex(regExp, `Invalid E-Mail format: (eg. ${customFormatEx ?? 'johndoe@email.com'})`);
    }
    validateField(message = null, isError = false) {
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
    validateName(regExp, customFormatEx = null) {
        return this.validateRegex(regExp, `Invalid Name format: (eg. ${customFormatEx ?? 'john doe, john doe woods'})`);
    }
    validatePassword(regExp, customFormatEx = null) {
        return this.validateRegex(regExp, `Invalid Password format: (${customFormatEx ?? 'Password requires a minimum of 8 characters and must contain at least 1 uppercase and 1 special character'})`);
    }
    validatePhone(regExp, customFormatEx = null) {
        return this.validateRegex(regExp, `Invalid Phone format: (eg. ${customFormatEx ?? '+234 8156547099, +1 104 2198'})`);
    }
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
    static fxModalCancelButtonClick = new Event('click');
    static fxModalShowEvent = new CustomEvent('fx.modal.show', {
        bubbles: true,
        detail: { plugins: 'Fuxcel', interface: 'FuxcelModalInterface' },
    });
    static fxModalHideEvent = new CustomEvent('fx.modal.hide', {
        bubbles: true,
        detail: { plugins: 'Fuxcel', interface: 'FuxcelModalInterface' },
    });
    constructor(selector, context, autoActions = true) {
        super(selector, context);
        if (FuxcelModal.modalTriggers.length) {
            FuxcelModal.modalTriggers.off('click').upon('click', function (e) {
                e.preventDefault();
                const currentTrigger = fx(e.currentTarget);
                const modalAction = currentTrigger.dataAttrib('fx-action')?.toLowerCase() ?? 'open';
                const modalTarget = currentTrigger.dataAttrib('fx-action')?.length
                    ? (currentTrigger.parents('.fx-modal').length ? currentTrigger.parents('.fx-modal') : null)
                    : fx(`#${currentTrigger.dataAttrib('fx-modal')}`);
                const triggerModal = () => {
                    if (modalTarget) {
                        FuxcelModal.#_modalTarget = modalTarget;
                        if (autoActions) {
                            if (modalAction === 'close')
                                FuxcelModal.#_modalTarget.modal.hide();
                            else
                                FuxcelModal.#_modalTarget.modal.toggle();
                        }
                    }
                };
                (currentTrigger.parents('.fx-modal').length &&
                    !currentTrigger.parents('.fx-modal').attrib('id')?.includes('init'))
                    ? triggerModal()
                    : (!currentTrigger.parents('.fx-modal').length && triggerModal());
            });
        }
        else
            console.error('Target modal action triggers not found.');
    }
    // ─── Static Getters ───────────────────────────────────────────────────────
    /** The most recently opened modal, or `null` if none is open. */
    static get currentModal() {
        return FuxcelModal.hasOpenModals
            ? FuxcelModal.#_openModals[FuxcelModal.#_openModals.length - 1]
            : null;
    }
    /** `true` if any modals are currently open. */
    static get hasOpenModals() {
        return !!FuxcelModal.#_openModals.length;
    }
    /** All elements with `[data-fx-target="modal"]`. */
    static get modalTriggers() {
        return fx('*[data-fx-target="modal"]');
    }
    // ─── Static Factory ───────────────────────────────────────────────────────
    /**
     * Builds a modal DOM structure and returns the root element.
     */
    static init({ title = null, html = true, isStatic = false, content, id, hasFooter }) {
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
        title && (modalTitle.innerHTML = title);
        html ? (modalBody.innerHTML = content) : (modalBody.innerText = content);
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
    /** Remove the modal element from the DOM entirely. */
    destroy() {
        // @ts-ignore
        this[0].remove();
    }
    /**
     * Hide (and optionally destroy) the modal.
     *
     * @param destroy {boolean=false} Whether to remove the element from the DOM after hiding.
     */
    hide(destroy = false) {
        const modalContent = fx('.fx-modal-content', this);
        if (!this.#_isHiding) {
            this.#_isHiding = true;
            modalContent.fadeout(500).then(() => this.fadeout(500).then(() => {
                const index = FuxcelModal.#_openModals.indexOf(this);
                if (index !== -1)
                    FuxcelModal.#_openModals.splice(index, 1);
                // @ts-ignore
                this[0].dispatchEvent(FuxcelModal.fxModalHideEvent);
                destroy && this.destroy();
                this.#_isHiding = false;
            }));
        }
    }
    /**
     * Show the modal.
     *
     * @param escKey {boolean=true} Allow closing via the Escape key.
     */
    show(escKey = true) {
        const modalContent = fx('.fx-modal-content', this);
        this.style({ pointerEvents: 'none' }).fadein(0).then(() => modalContent.fadein(0, 'flex').then(() => {
            FuxcelModal.#_openModals.push(this);
            this.style({ pointerEvents: 'unset' });
            if (!parseBool(this.dataAttrib('fx-static'))) {
                this.upon('click', () => modalContent.hasFocus.then((focused) => !focused ? this.hide() : null));
                if (escKey)
                    fx(document).upon('keyup', (e) => {
                        const key = e.key.toLowerCase();
                        if ((key === 'escape' || key === 'esc') && FuxcelModal.hasOpenModals)
                            FuxcelModal.currentModal?.hide();
                    });
            }
            // @ts-ignore
            this[0].dispatchEvent(FuxcelModal.fxModalShowEvent);
        }));
    }
    /** Toggle between open and closed state. */
    toggle() {
        this.style('display') === 'none' ? this.show() : this.hide();
    }
}

/**
 * Create a quick alert/confirm modal with callbacks.
 *
 * @param title               Modal title.
 * @param type                Visual type: 'success' | 'warning' | 'error'.
 * @param content             Body content (HTML or text).
 * @param confirmButtonText   Label for the confirm button.
 * @param cancelButtonText    Label for the cancel button.
 * @param html                Render body as HTML (default true).
 * @param isStatic            Prevent closing on outside click.
 * @param closeOnConfirm      Auto-close on confirm when no `onConfirm` callback.
 * @param onConfirm           Callback fired when confirm button is clicked.
 * @param onCancel            Callback fired when cancel button is clicked.
 * @param onEsc               Callback fired on Escape (only when no cancel button).
 */
function fxModal({ title = null, type = 'success', content = 'Alert Content', confirmButtonText = null, cancelButtonText = null, html = true, isStatic = false, closeOnConfirm = false, onConfirm = null, onCancel = null, onEsc = null, } = {}) {
    const initialModal = FuxcelModal.init({ title: title, html: html, isStatic: isStatic, content: content, id: 'init', hasFooter: false });
    const modalBody = fx('.fx-modal-body', initialModal);
    const body = document.querySelector('body');
    // Alert icon
    const alertIconPath = type === 'success' ?
        `${Fuxcel.path}/images/ok-24.svg` :
        (type === 'error' ? `${Fuxcel.path}/images/cancel-24.svg` : `${Fuxcel.path}/images/warning-24.svg`);
    const altAlertIcon = type === 'success' ? '✅' : (type === 'error' ? '❌' : '⚠️');
    const alertIcon = `<img src="${alertIconPath}" alt="${altAlertIcon}" class="fx-modal-alert-icon">`;
    // Buttons
    const buttonsWrapper = (btns) => `<div class="fx-modal-alert-buttons">${btns}</div>`;
    const cancelButton = (label) => `<button type="button" id="fx-modal-cancel" class="fx-btn fx-btn-error" data-fx-action="close" data-fx-target="modal">${label}</button>`;
    const confirmButton = (label) => `<button type="button" id="fx-modal-confirm" class="fx-btn fx-btn-primary" data-fx-target="modal" data-fx-modal="init">${label}</button>`;
    const buttons = confirmButtonText && cancelButtonText ?
        cancelButton(cancelButtonText) + confirmButton(confirmButtonText) :
        (confirmButtonText ? confirmButton(confirmButtonText) : (cancelButtonText && cancelButton(cancelButtonText)));
    modalBody.style({ display: 'flex', flexDirection: 'column', alignItems: 'center' }).insertHTML(alertIcon, 'prefix');
    buttons && modalBody.insertHTML(buttonsWrapper(buttons), 'suffix');
    body?.append(initialModal);
    fx('.fx-modal-alert-icon', initialModal).style({ visibility: 'visible' }).fadein(2000).then();
    const modal = new FuxcelModal(initialModal);
    modal.show(!cancelButtonText);
    if (cancelButtonText || confirmButtonText) {
        if (!cancelButtonText)
            modal.off().upon('fx.modal.hide', (e) => typeof onEsc === 'function' ? onEsc(e, modal) : null);
        modal.off('click').upon('click', function (e) {
            const clickedTarget = fx(e.target);
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
 * @param uri          Request URL.
 * @param method       HTTP method (default: 'get').
 * @param data         Request body data.
 * @param dataType     Expected response type (default: 'json').
 * @param headers      Additional request headers.
 * @param beforeSend   Callback fired before the request is sent.
 * @param timeout      Timeout in seconds before the request is aborted (default: 10).
 * @param onComplete   Callback fired when the request completes (success or error).
 * @param onError      Callback fired on network/timeout errors.
 * @param onSuccess    Callback fired on HTTP 2xx responses.
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
    })
        .then(response => {
        responseData = response;
        status = responseData.status;
        statusText = responseData.statusText;
        try {
            // @ts-ignore
            const consumed = response[dataType]();
            return (consumed && (responseData.ok || (status > 199 && status < 300) || allowedErrorStatuses.has(status)))
                ? consumed
                : Promise.reject(response);
        }
        catch (e) {
            return Promise.reject(e);
        }
    })
        .then(parsedData => {
        responseData.responseJSON = dataType === 'json' && parsedData;
        responseData.responseText = dataType === 'json'
            ? JSON.stringify(parsedData)
            : (dataType === 'text' && parsedData);
        onComplete && isFunction(onComplete) && onComplete(responseData, status, statusText);
        status > 199 && status < 300 && onSuccess && isFunction(onSuccess) && onSuccess(responseData, status, statusText);
    })
        .catch(error => {
        isFunction(onError) && (error.name === 'AbortError'
            ? onError(new TimeoutError(`⏰ Request timed out\r\nSet Timeout:${timeout / 1000}s`), 408, 'timeout')
            : onError(error, status, statusText));
    })
        .finally(() => clearTimeout(timeoutID));
};

/**
 * Check if the given input passes the Luhn Algorithm test.
 * Commonly used to validate credit card numbers.
 *
 * @param input {string | number} The number to validate.
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
// ─── Bootstrap imports ────────────────────────────────────────────────────────
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
    fx,
    fuxcel,
    // Classes — usable as `new FuxcelValidator(...)` etc. in plain scripts
    FuxcelBase,
    Fuxcel,
    FuxcelValidator,
    FuxcelSteps,
    FuxcelModal,
    // Standalone functions
    fxFetch,
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

export { fx as default, fuxcel };
//# sourceMappingURL=fuxcel.esm.js.map
