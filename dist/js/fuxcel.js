"use strict";
const fxModalCancelButtonClick = new Event('click');
const fxModalShowEvent = new CustomEvent('fx.modal.show', {
    bubbles: true,
    detail: {
        plugins: 'Fuxcel',
        interface: 'FuxcelModalInterface'
    },
});
const fxModalHideEvent = new CustomEvent('fx.modal.hide', {
    bubbles: true,
    detail: {
        plugins: 'Fuxcel',
        interface: 'FuxcelModalInterface'
    },
});
/**
 *
 * @param timeout
 * @param iteration
 * @param display
 */
const animations = ({ timeout = 300, iterations = 1, display = '' }) => {
    return {
        fadeIn: {
            name: 'fadein',
            onBegin: { display: display },
            onFinished: {},
            options: {
                keyFrames: [{ opacity: 0 }, { opacity: 1 }],
                timing: { duration: timeout, iterations: iterations }
            }
        },
        fadeOut: {
            name: 'fadeout',
            onBegin: { display: display },
            onFinished: { display: 'none' },
            options: {
                keyFrames: [{ opacity: 1 }, { opacity: 0 }],
                timing: { duration: timeout, iterations: iterations }
            }
        },
        slideInDown: {
            name: 'slideindown',
            onBegin: { display: display },
            onFinished: {},
            options: {
                keyFrames: [{ transform: 'translate3d(0, 100%, 0)', visibility: 'hidden' }, { transform: 'translate3d(0, 0, 0)', visibility: 'visible' }],
                timing: { duration: timeout, iterations: iterations }
            },
        },
        slideOutDown: {
            name: 'slideoutdown',
            onBegin: { display: display },
            onFinished: { display: 'none' },
            options: {
                keyFrames: [{ transform: 'translate3d(0, 0, 0)', visibility: 'visible' }, { transform: 'translate3d(0, 100%, 0)', visibility: 'hidden' }],
                timing: { duration: timeout, iterations: iterations }
            }
        },
        slideOutUp: {
            name: 'slideoutup',
            onBegin: { display: display },
            onFinished: { display: 'none' },
            options: {
                keyFrames: [{ transform: 'translate3d(0, 0, 0)', visibility: 'visible' }, { transform: 'translate3d(0, -100%, 0)', visibility: 'hidden' }],
                timing: { duration: timeout, iterations: iterations }
            }
        },
        slideInLeft: {
            name: 'slideinleft',
            onBegin: { display: display },
            onFinished: {},
            options: {
                keyFrames: [{ transform: 'translate3d(-100%, 0, 0)', visibility: 'visible' }, { transform: 'translate3d(0, 0, 0)' }],
                timing: { duration: timeout, iterations: iterations }
            }
        },
        slideInRight: {
            name: 'slideinright',
            onBegin: { display: display },
            onFinished: {},
            options: {
                keyFrames: [{ transform: 'translate3d(100%, 0, 0)', visibility: 'visible' }, { transform: 'translate3d(0, 0, 0)' }],
                timing: { duration: timeout, iterations: iterations }
            }
        },
        slideOutLeft: {
            name: 'slideoutleft',
            onBegin: { display: display },
            onFinished: { display: 'none' },
            options: {
                keyFrames: [{ transform: 'translate3d(0, 0, 0)' }, { visibility: 'hidden', transform: 'translate3d(-100%, 0, 0)' }],
                timing: { duration: timeout, iterations: iterations }
            }
        },
        slideOutRight: {
            name: 'slideoutright',
            onBegin: { display: display },
            onFinished: { display: 'none' },
            options: {
                keyFrames: [{ transform: 'translate3d(0, 0, 0)' }, { visibility: 'hidden', transform: 'translate3d(100%, 0, 0)' }],
                timing: { duration: timeout, iterations: iterations }
            }
        },
        blink: {
            name: 'blink',
            onBegin: {},
            onFinished: {},
            options: {
                keyFrames: [{ opacity: 1 }, { opacity: 0.8 }, { opacity: 0.5 }, { opacity: 0.3 }, { opacity: 0.1 }, { opacity: 0.3 }, { opacity: 0.5 }, { opacity: 0.8 }, { opacity: 1 }],
                timing: { duration: timeout, iterations: iterations }
            }
        },
        spaceLettersBig: {
            name: 'spacelettersbig',
            onBegin: {},
            onFinished: { marginRight: '50px' },
            options: {
                keyFrames: [{ marginRight: 0 }, { marginRight: '50px' }],
                timing: { duration: timeout, iterations: iterations }
            }
        },
        spaceLettersSmall: {
            name: 'spaceletterssmall',
            onBegin: {},
            onFinished: { marginRight: '3px' },
            options: {
                keyFrames: [{ marginRight: '3px' }, { marginRight: '3px' },],
                timing: { duration: timeout, iterations: iterations }
            }
        },
        unspaceLetters: {
            name: 'unspaceletters',
            onBegin: {},
            onFinished: { marginRight: 0 },
            options: {
                keyFrames: [{ marginRight: 0 }],
                timing: { duration: timeout, iterations: iterations }
            }
        },
        zoomIn: {
            name: 'zoomin',
            onBegin: {},
            onFinished: { width: 'inherit', height: 'inherit' },
            options: {
                keyFrames: [{ width: '500px', height: '500px' }, { width: '150px', height: '150px' }],
                timing: { duration: timeout, iterations: iterations }
            }
        },
    };
};
const pushPropToWindow = (prop, value) => {
    window[prop] = value;
};
/**
 * Creates new Fuxcel Object with selected element.
 *
 * @param selector {string|Iterable<any>|any} Selectable string or iterable.
 * @param context {string|Iterable<any>|any} Context to select from.
 * @return {Fuxcel} New Fuxcel Object.
 */
const fx = (selector, context = null) => new Fuxcel(selector, context);
/**
 * Checks if the given value is of type boolean.
 *
 * @param value {any} Value to check.
 * @return {boolean} true if the given value is of type boolean; false otherwise.
 */
const isBool = (value) => {
    return typeof value === 'boolean';
};
/**
 * Checks if the given value is defined (not null && not undefined && not an empty string).
 *
 * @param value {any} Value to check.
 * @return {boolean} true if the given value is set; false otherwise.
 */
const isDefined = (value) => {
    return value !== undefined && value !== null && value !== '';
};
/**
 * Checks if the given value is of type function.
 *
 * @param value {any} Value to check.
 * @return {boolean} true if the given value is of type function; false otherwise.
 */
const isFunction = (value) => {
    return typeof value === 'function';
};
/**
 * Checks if the given value is of type object.
 *
 * @param value {any} Value to check.
 * @return {boolean} true if the given value is of type boolean; false otherwise.
 */
const isObject = (value) => {
    return typeof value === 'object';
};
/**
 * Checks if the given value is of type string.
 *
 * @param value {any} Value to check.
 * @return {boolean} true if the given value is of type string; false otherwise.
 */
const isString = (value) => {
    return typeof value === 'string' && true;
};
/**
 * Parse the given value and get its boolean value.
 *
 * @param value {any} Value to parse.
 * @return {boolean} Its boolean value; true or false.
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
 * Convert string to title cased string.
 *
 * @param seperator {boolean}
 * @returns {String} Title cased string.
 */
String.prototype.toTitleCase = function (seperators = false) {
    const value = this;
    let titleCased = '', valueSplit = value.split(seperators ? /([ _-])/gi : /[ _-]/gi);
    valueSplit.forEach((word, key) => {
        let wordSplit = word.toLowerCase().split(''), firstChar = wordSplit[0];
        wordSplit[0] = wordSplit[0] ? firstChar.toUpperCase() : '';
        titleCased += seperators ? wordSplit.join('') : (wordSplit.join('') + ((key <= valueSplit.length - 1) ? ' ' : ''));
    });
    return String(titleCased);
};
class FuxcelBase {
    length = 0;
    prev = { length: 0 };
    /**
     * Initialize the plugin
     *
     * @param selector {string|Iterable<any>|any} Selectable string or iterable.
     * @param context {string|Iterable<any>|any} Context to select from.
     */
    constructor(selector, context) {
        const INSTANCE = this;
        const selectedElements = init();
        const documentDOMArray = INSTANCE.#_toArray(document);
        // INSTANCE.length = 0;
        // INSTANCE.prev = { length: 0 };
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
                const _context = (context && ((isString(context) ?
                    INSTANCE.#_toArray(document.querySelector(context)) :
                    INSTANCE.#_toArray(context)))[0]);
                if (INSTANCE.#_isHTMLElement(selector) || INSTANCE.#_isIterable(selector)) {
                    const target = INSTANCE.#_toArray(selector);
                    if (context) {
                        if (target.length) {
                            target.forEach((value) => value.dataset.fuxcelTempId = 'fuxcel-temp-selector');
                            selected = _context.querySelectorAll('[data-fuxcel-temp-id="fuxcel-temp-selector"]');
                            target.forEach((value) => delete value.dataset.fuxcelTempId);
                            return selected;
                        }
                    }
                    return target;
                }
                return context && _context ? _context.querySelectorAll(selector) : document.querySelectorAll(selector);
            }
            catch (e) {
                console.trace(e);
            }
        }
        return INSTANCE;
    }
    static get #_getCurrentScriptFilename() {
        try {
            throw new Error();
        }
        catch (e) {
            if (e instanceof Error) {
                const stackLines = e.stack?.split('\n');
                const stackLineSplit = stackLines ? stackLines[0].split('/') : [];
                if (stackLineSplit.length) {
                    const guessedNameArray = (stackLineSplit[stackLineSplit.length - 1]).split(':');
                    return guessedNameArray.length ? guessedNameArray[0] : null;
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
    /**
     * Checks if the given selected element is iterable.
     *
     * @param element {any}
     * @private
     * @return {boolean} Returns true if the element is iterable; false otherwise.
     */
    #_isIterable(element) {
        return !!FuxcelBase.#_constructors.iterable.filter(value => value === element.constructor.name.toLowerCase()).length || Array.isArray(element);
    }
    /**
     * Checks if the given selected element is an HTML Element.
     *
     * @param element {HTMLElement|any} Given Element
     * @private
     * @return {boolean} Returns true if the element is an HTMML Element; false otherwise.
     */
    #_isHTMLElement(element) {
        return !!FuxcelBase.#_constructors.html.filter(value => element.constructor.name.toLowerCase().includes(value)).length;
    }
    /**
     * Wraps given element(s) in an array.
     *
     * @param element {any}
     * @private
     * @return {IterableElement} Returns HTML Element(s) wrapped in an array.
     */
    #_toArray(element) {
        return this.#_isIterable(element) ? Array.from(element) : [element];
    }
    /**
     * Returns an Object containing {FieldAttributes} attributes of the element.
     * @return {FieldAttributes}
     */
    get fieldAttributes() {
        const selected = this.toArray;
        return {
            id: selected[0].getAttribute('id') && selected[0].getAttribute('id')?.toLowerCase(),
            type: selected[0].getAttribute('type') && selected[0].getAttribute('type')?.toLowerCase(),
            fxId: selected[0].getAttribute('type') && selected[0].getAttribute('type')?.toLowerCase(),
            fxRole: selected[0].getAttribute('type') && selected[0].getAttribute('type')?.toLowerCase(),
            formId: selected[0].form && selected[0].form.id && selected[0].form.id.toLowerCase()
        };
    }
    /**
     *
     */
    get prevObj() {
        return this.prev;
    }
    static get guessPath() {
        const fullPath = FuxcelBase.#_getCurrentScriptSrc;
        const fullPathArray = fullPath?.split(/[\\/]/gi);
        fullPathArray?.splice(fullPathArray?.length - 1);
        return fullPathArray?.join('/') ?? null;
    }
    /**
     * @return {Array}
     */
    get toArray() {
        if (!this.length)
            console.trace('No element selected');
        return this.#_toArray(this);
    }
    static get #_constructors() {
        const html = ['html'];
        const iterable = [
            'bsutilities',
            'fuxcel',
            'fuxcelbase',
            'fuxcelmodal',
            'fuxcelsteps',
            'fuxcelvalidator',
            'jquery',
            'nodelist',
            'object',
            's',
            'collection'
        ];
        return { iterable: iterable, html: html };
    }
    /**
     * Returns true if the device is mobile device; false otherwise.
     */
    static get isMobileDevice() {
        return navigator.userAgent.toLowerCase().includes('mobile');
    }
    /**
     * Returns true if the device supports touch; false otherwise.
     */
    static get pointerIsTouch() {
        return window.matchMedia("(pointer: coarse)").matches;
    }
}
class Fuxcel extends FuxcelBase {
    static #_buttonLoaderClass = '.btn-loader';
    static #_pluginPath = this.guessPath;
    constructor(selector, context) {
        super(selector, context);
    }
    #_formatDataAttrib(name) {
        let replaced = '', nameSplit = name.toString().split('-');
        nameSplit.forEach((split, idx) => {
            if (idx) {
                let splinted = split.split(''), firstWord = splinted[0];
                splinted[0] = firstWord.toUpperCase();
                replaced += splinted.join('');
            }
        });
        return `${nameSplit[0]}${replaced}`;
    }
    #_setAttrib(name, value) {
        const selected = this.toArray;
        if (isString(name) && isString(value)) {
            selected.forEach((element) => element.setAttribute(name, value));
        }
        else if (isObject(name)) {
            Object.keys(name).forEach(key => selected.forEach((element) => element.setAttribute(key, name[key])));
        }
        else {
            if (isString(name))
                throw (`Argument for \`name\` expects a String or an Object in function \`attrib()\`. ${typeof name} given.`);
            else
                throw (`Function \`attrib()\` expects 1-2 arguments. None given.`);
        }
        return this;
    }
    #_setDataAttrib(name, value) {
        const selected = this.toArray;
        if (isString(name) && isString(value)) {
            selected.forEach((element) => element.dataset[name] = value);
        }
        else if (isObject(name)) {
            Object.keys(name).forEach(key => {
                selected.forEach((element) => element.dataset[key] = name[key]);
            });
        }
        else {
            if (isString(name))
                throw (`Argument for \`name\` expects a String or an Object in function \`dataAttrib()\`. ${typeof name} given.`);
            else
                throw (`Function \`dataAttrib()\` expects 1-2 arguments. None given.`);
        }
        return this;
    }
    #_setPrev(prevObj) {
        this.prev = new Fuxcel(prevObj);
        return this;
    }
    #_setProp(name, value) {
        const selected = this.toArray;
        if (isString(name) && (isString(value) || isBool(value))) {
            selected.forEach((element) => element[name] = value);
        }
        else if (isObject(name)) {
            Object.keys(name).forEach(key => {
                selected.forEach((element) => element[key] = name[key]);
            });
        }
        else {
            if (isString(name))
                throw (`Argument for \`name\` expects a String or an Object in function \`prop()\`. ${typeof name} given.`);
            else
                throw (`Function \`prop()\` expects 1-2 arguments. None given.`);
        }
        return this;
    }
    #_setStyle(name, value) {
        const selected = this.toArray;
        if (isString(name) && (isString(value) || isBool(value))) {
            selected.forEach((element) => element.style[name] = value);
        }
        else if (isObject(name)) {
            Object.keys(name).forEach(key => {
                selected.forEach((element) => element.style[key] = name[key]);
            });
        }
        else {
            if (isString(name))
                throw (`Argument for \`name\` expects a String or an Object in function \`prop()\`. ${typeof name} given.`);
            else
                throw (`Function \`prop()\` expects 1-2 arguments. None given.`);
        }
        return this;
    }
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
        const animation = animations({ timeout: timeout, iterations: iteration, display: display }).fadeOut;
        return this.#_animate(animation);
    }
    /**
     * Perform Fadein animation on selected element.
     *
     * @param timeout {number} Animation duration.
     * @param iteration {number}
     * @param display
     * @return {Promise<Fuxcel>}
     */
    fadein(timeout, iteration, display) {
        if (typeof timeout === 'string') {
            display = timeout;
            timeout = 300;
        }
        else if (timeout && typeof iteration === 'string') {
            display = iteration;
            iteration = 1;
        }
        const animation = animations({ timeout: timeout, iterations: iteration, display: display }).fadeIn;
        return this.#_animate(animation);
    }
    /**
     * Perform a Slidein-down animation on selected element.
     *
     * @param timeout {number} Animation duration.
     * @param iteration
     * @param display
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
        const animation = animations({ timeout: timeout, iterations: iteration, display: display }).slideInDown;
        return this.#_animate(animation);
    }
    /**
     * Perform a Slideout-down animation on selected element.
     *
     * @param timeout {number} Animation duration.
     * @param iteration
     * @param display
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
        const animation = animations({ timeout: timeout, iterations: iteration, display: display }).slideOutDown;
        return this.#_animate(animation);
    }
    /**
     * Perform a Slideout-up animation on selected element.
     *
     * @param timeout {number} Animation duration.
     * @param iteration
     * @param display
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
        const animation = animations({ timeout: timeout, iterations: iteration, display: display }).slideOutUp;
        return this.#_animate(animation);
    }
    /**
     * @return {DOMTokenList} The class list of an element.
     */
    get classes() {
        const selected = this.toArray;
        return selected[0].classList;
    }
    /**
     *  @return {Promise<boolean>} A promise with a boolean argument; true if the given element has the mouse focus; false otherwise.
     */
    get hasFocus() {
        const selected = this.toArray;
        const selector = FuxcelBase.pointerIsTouch ? ':focus' : ':hover';
        return new Promise(resolve => selected.forEach((element) => resolve(fx(element).matchSelector(selector))));
    }
    /**
     * @return {string} The Inner Text value of the given element.
     */
    get innerText() {
        const selected = this.toArray;
        return selected[0].innerText;
    }
    /**
     * @return {string} The Outer Text value of the given element.
     */
    get outerText() {
        const selected = this.toArray;
        return selected[0].outerText;
    }
    /**
     * @return {string} The Inner HTML value of the given element.
     */
    get innerHTML() {
        const selected = this.toArray;
        return selected[0].innerHTML;
    }
    /**
     * @return {string} The Outer HTML value of the given element.
     */
    get outerHTML() {
        const selected = this.toArray;
        return selected[0].outerHTML;
    }
    /**
     * @return {FuxcelValidator} A new instance of the Fuxcel Form Validator.
     */
    get formValidator() {
        return new FuxcelValidator(this);
    }
    /**
     * @return {FuxcelModal} A new instance of the Fuxcel Modal.
     */
    get modal() {
        return new FuxcelModal(this);
    }
    /**
     * Set the Inner Text value for the element
     *
     * @param text {string} The Inner Text value.
     */
    set innerText(text) {
        const selected = this.toArray;
        selected[0].innerText = text;
    }
    /**
     * Set the Outer Text value for the element
     *
     * @param text {string} The Outer Text value.
     */
    set outerText(text) {
        const selected = this.toArray;
        selected[0].outerText = text;
    }
    /**
     * @return The global Button Loader class.
     */
    static get buttonLoaderClass() {
        return Fuxcel.#_buttonLoaderClass;
    }
    /**
     * @return {string|null} The Plugin path.
     */
    static get path() {
        return `${Fuxcel.#_pluginPath?.replace(/\/$/, '')}/..`;
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
     * Set the Plugin path globally.
     *
     * @param path {string} the relative path.
     */
    static set path(path) {
        Fuxcel.#_pluginPath = path;
    }
    /**
     * Add class(es) to the classlist of the selected element.
     *
     * @param tokenList {string[]} Comma separated strings of class(es) to add.
     */
    putClass(...tokenList) {
        const selected = this.toArray;
        selected.forEach((element) => tokenList.forEach(token => element.classList.add(token)));
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
        const selected = this.toArray;
        selected.forEach((element) => (element.classList.contains(oldToken) ?
            element.classList.replace(oldToken, newToken) :
            element.classList.add(newToken)));
        return this;
    }
    /**
     * Removes the given class(es) from the classlist of the given element.
     *
     * @param tokenList {string[]} Comma separated strings of class(es) to remove.
     */
    removeClass(...tokenList) {
        const selected = this.toArray;
        selected.forEach((element) => tokenList.forEach(token => element.classList.remove(token)));
        return this;
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
        return ((name && !value && isString(name)) ?
            selected[0].getAttribute(name) :
            ((isObject(name) ? this.#_setAttrib(name) : this.#_setAttrib(name, value))));
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
        const formattedName = this.#_formatDataAttrib(name);
        return ((name && !value && isString(name)) ?
            selected[0].dataset[formattedName] :
            (isObject(name) ? this.#_setDataAttrib(name) : this.#_setDataAttrib(formattedName, value)));
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
        return ((name && !value && isString(name)) ?
            selected[0][name] :
            (isObject(name) ? this.#_setProp(name) : this.#_setProp(name, value)));
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
        return ((name && !value && isString(name)) ?
            window.getComputedStyle(selected[0]).getPropertyValue(name) :
            (isObject(name) ? this.#_setStyle(name) : this.#_setStyle(name, value)));
    }
    /**
     * Returns the attributes of the selected element as on Object.
     *
     * @return {Object} An object containing the attributes of the selected element.
     */
    listAttrib() {
        const selected = this.toArray;
        const list = {};
        Array.from(selected[0].attributes).forEach((attrib) => list[attrib.name] = attrib.value);
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
        Object.keys(selected[0]).filter(prop => Number.isNaN(parseInt(prop) && selected[0][prop])).forEach(prop => list[prop] = selected[0][prop]);
        return list;
    }
    /**
     * Removes the given [data-*] attribute(s) from the selected element.
     *
     * @param name {string[]} Comma separated strings of [data-*] attribute(s) to remove.
     * @return {Fuxcel} Fuxcel Object of the selected element
     */
    removeAttrib(...name) {
        const selected = this.toArray;
        selected.length && name.length && selected.forEach((element) => name.forEach(attr => element.removeAttribute(attr)));
        return this;
    }
    /**
     * Removes the given [data-*] attribute(s) from the selected element.
     *
     * @param name {string[]} Comma separated strings of [data-*] attribute(s) to remove.
     * @return {Fuxcel} Fuxcel Object of the selected element
     */
    removeDataAttrib(...name) {
        const selected = this.toArray;
        selected.length && name.length && selected.forEach((element) => name.forEach(value => {
            const dataAttr = this.#_formatDataAttrib(value);
            delete element.dataset[dataAttr];
        }));
        return this;
    }
    /**
     * Removes the given property / properties from the selected element.
     *
     * @param name {string[]} Comma separated strings of property / properties to remove.
     * @return {Fuxcel} Fuxcel Object of the selected element
     */
    removeProp(...name) {
        const selected = this.toArray;
        selected.length && name.length && selected.forEach((element) => name.forEach(prop => element[prop] = null));
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
        const children = [];
        (Array.from(selected[0].children)).forEach((child) => {
            if (isString(selector)) {
                if (fx(child).matchSelector(selector))
                    children.push(child);
            }
            else
                children.push(child);
        });
        return fx(children).#_setPrev(this);
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
        const descendants = [];
        fx('*', selected[0]).toArray.forEach((descendant) => {
            if (isString(selector)) {
                if (fx(descendant).matchSelector(selector))
                    descendants.push(descendant);
            }
            else
                descendants.push(descendant);
        });
        return fx(descendants).#_setPrev(this);
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
        const parents = [];
        let parentNode = selected[0].parentNode;
        while (parentNode) {
            if (isString(selector)) {
                if (fx(parentNode).matchSelector(selector)) {
                    parents.push(parentNode);
                    break;
                }
            }
            else {
                if (parentNode !== selected[0])
                    parents.push(parentNode);
            }
            parentNode = parentNode.parentNode;
        }
        return fx(parents).#_setPrev(this);
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
        const prevSiblings = [];
        let prevElemSibling = selected[0].previousElementSibling;
        while (prevElemSibling) {
            if (isString(selector)) {
                if (fx(prevElemSibling).matchSelector(selector)) {
                    prevSiblings.push(prevElemSibling);
                    break;
                }
            }
            else {
                if (prevElemSibling !== selected[0])
                    prevSiblings.push(prevElemSibling);
            }
            prevElemSibling = prevElemSibling.previousElementSibling;
        }
        return fx(prevSiblings).#_setPrev(this);
    }
    /**
     * Returns the direct descendants (Children) of the selected element.
     *
     * _Returns the descendant that matches the selector if the selector parameter is passed._
     *
     * @param selector {Selector} Selectable string.
     * @return {Fuxcel} Fuxcel Object of the selected sibling(s)
     */
    siblings(selector = null) {
        const selected = this.toArray;
        const siblings = [];
        Array.from(selected[0].parentNode?.children).forEach((sibling) => {
            if (isString(selector)) {
                if (fx(sibling).matchSelector(selector) && sibling !== selected[0])
                    siblings.push(sibling);
            }
            else {
                if (sibling !== selected[0])
                    siblings.push(sibling);
            }
        });
        return fx(siblings).#_setPrev(this);
    }
    /**
     * Disables or enables the selected element(s).
     *
     * @param disabled {boolean} Switch between disabling and enabling the selected element(s).
     * @return {Fuxcel} Fuxcel Object of the selected element.
     */
    disable(disabled = true) {
        const selected = this.toArray;
        selected.forEach((element) => {
            const tagName = element.tagName?.toLowerCase();
            const selectedElement = fx(element);
            if (tagName === 'a')
                disabled ? selectedElement.classes.add('disabled') : selectedElement.classes.remove('disabled');
            else
                disabled ? selectedElement.prop({ disabled: true }) : selectedElement.removeProp('disabled');
        });
        return this;
    }
    /**
     *
     * @param uri {string|null=null}=''} Request URL.
     * @param method {('get'|'post'|'put'|'patch'|'delete'|null)} Form Request method.
     * @param data {object|null=null} Additional form request data.
     * @param dataType {('html'|'json'|'jsonp'|'script'|'text'|'xml'|null)} Expected return data type.
     * @param headers {Object|Headers} Additional Headers to be sent along the request.
     * @param beforeSend {Function|null = null} Before request is sent.
     * @param handleError
     */
    handleFormSubmit({ uri = '', method = 'get', data = null, dataType = 'json', headers = null, beforeSend = null, handleError = false }) {
        const selected = this.toArray;
        let response;
        return new Promise((resolve, reject) => selected.forEach((element) => {
            if (fx(element).isElement('form')) {
                const form = fx(element).formValidator;
                const formData = new FormData(element);
                // @ts-ignore
                data && Object.keys(data).length && Object.keys(data).forEach(key => Array.isArray(data[key]) ? formData.append(data[key][0], data[key][1], data[key][2]) : formData.append(key, data[key]));
                if (!uri?.length && form.attrib('action'))
                    uri = form.attrib('action');
                if (form.attrib('method'))
                    method = form.attrib('method');
                !form.errorCount ? typeof fx.fetch === 'function' && fx.fetch({
                    uri: uri,
                    method: method,
                    headers: headers,
                    data: formData,
                    dataType: dataType,
                    beforeSend() {
                        isFunction(beforeSend) && beforeSend(form);
                    },
                    onError(err, status) {
                        reject({ response: err, status: status, form: form });
                    },
                    onComplete(xhr, status) {
                        if (dataType === 'json') {
                            response = xhr.responseJSON;
                            if ((status > 199 && status < 300) || status === 308) {
                                /*if (status === 308)
                                    setTimeout(() => location.href = response.redirect, 2000);
                                else*/
                                resolve({ JSON: response, text: xhr.responseText, status: status, form: form });
                            }
                            else {
                                if (status === 401)
                                    fx.modal({
                                        type: 'error',
                                        content: response.message ?? 'Unauthorized Request',
                                        cancelButtonText: 'Cancel',
                                        onCancel: () => form.toggleFormSubmitButtonState(false)
                                    });
                                if (status === 419)
                                    setTimeout(() => location.href = response.redirect, 2000);
                                else if (status === 422 || status === 500) {
                                    if (handleError && status === 422)
                                        response.errors ?
                                            response.message ? form.renderValidationErrors(response.errors, response.message) : form.renderValidationErrors(response.errors) :
                                            response.message && form.renderValidationErrors({}, response.message);
                                    else
                                        resolve({ JSON: response, status: status, form: form });
                                    form.toggleFormSubmitButtonState(false);
                                }
                                else {
                                    console.error('Server Failure', xhr);
                                    reject({ response: xhr, status: status, form: form });
                                }
                            }
                        }
                        else {
                            if ((status > 199 && status < 300) || status === 308)
                                resolve({ text: xhr.responseText, form: form });
                            else
                                reject({ response: xhr, status: status, form: form });
                        }
                    }
                }) : form.renderValidationErrors(form.errorBag);
            }
        }));
    }
    /**
     * Check if the selected element has a scrollbar in the given direction.
     *
     * @param direction {('vertical'|'horizontal'|null)} Specific direction to check _[horizontal or vertical]_.
     * @return {boolean} true if the selected element has a scrollbar in the specified direction; false otherwise.
     */
    hasScrollBar(direction = 'vertical') {
        const selected = this.toArray;
        let scrollType = { vertical: 'scrollHeight', horizontal: 'scrollWidth' }, clientType = { vertical: 'clientHeight', horizontal: 'clientWidth' };
        if (isString(direction) && scrollType[direction])
            return (selected[0][scrollType[direction]]) > (selected[0][clientType[direction]]);
        throw (`Function \`hasScrollBar()\` expects 1 argument. 0 given.`);
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
            affix: 'beforebegin',
            prefix: 'afterbegin',
            postfix: 'afterend',
            suffix: 'beforeend'
        };
        if (isString(position) && !positions[position])
            throw (`Invalid position option given. Valid position options:\n'affix',\n'prefix',\n'postfix',\n'suffix'`);
        selected.forEach((element) => isString(position) ? element.insertAdjacentHTML(positions[position], value) : element.innerHTML = value);
        return this;
    }
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
        throw (`Function \`matchSelector()\` expects 1 string argument. 0 given`);
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
        throw (`Function \`matchSelector()\` expects 1 argument. 0 given`);
    }
    /**
     * Remove Event Listener(s) from the selected element.
     *
     * _Removes the given event(s) from the selected element if the event parameter is given._
     *
     * _Removes all previous Event Listeners from the selected element._
     *
     * @param events {string[]} Particular event to remove.
     * @return {Fuxcel} Fuxcel Object of the selected element.
     */
    off(...events) {
        const selected = this.toArray;
        selected.forEach((element) => {
            (element.listeners) && element.listeners.forEach((listener, index) => {
                if (events.length) {
                    events.forEach((event) => {
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
     * Toggle the disabled state (property) of the selected element [a button preferably].
     *
     * @param isLoading {boolean} Determines the state of the button.
     */
    toggleButtonLoadState(isLoading = true) {
        const selected = this.toArray;
        const button = fx(selected[0]);
        const loaderElement = fx(Fuxcel.buttonLoaderClass, button);
        if (isLoading) {
            if (!button.prop('disabled') || !button.attrib('disabled'))
                loaderElement.length ?
                    (loaderElement.style('display') === 'none' ? loaderElement.fadein().then(() => button.disable()) : button.disable()) :
                    button.disable();
        }
        else
            loaderElement.length ?
                (loaderElement.style('display') !== 'none' ? loaderElement.fadeout().then(() => button.disable(false)) : button.disable(false)) :
                button.disable(false);
    }
    /**
     * Toggles the submit button state of the selected form.
     *
     * @param isLoading {boolean} Determines the state of the button.
     */
    toggleFormSubmitButtonState(isLoading = true) {
        const selected = this.toArray;
        if (this.isElement('form')) {
            const submitButton = fx('button[type="submit"]', selected[0]).length ?
                fx('button[type="submit"]', selected[0]) :
                fx(`button[form="${selected[0].id}"]`);
            submitButton.toggleButtonLoadState(isLoading);
        }
        else
            console.warn('Non form element given.');
    }
    /**
     * Trigger a new event on the selected element(s).
     *
     * @param event {string}
     * @return {Fuxcel}
     */
    trigger(event) {
        const selected = this.toArray;
        const newEvent = new Event(event, {
            bubbles: true,
            cancelable: true
        });
        selected.forEach((element) => element.dispatchEvent(newEvent));
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
     * @param listener {((e: CustomEvent | KeyboardEvent | MouseEvent | TouchEvent | Event) => any)} Listener function to handle given event.
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
            if (Array.isArray(events) && events.length)
                events.forEach((event) => {
                    element.addEventListener(event, listener, option);
                    element.listeners.push({ element: element, listener: listener, event: event, option: option });
                });
            else {
                if (isObject(events))
                    Object.keys(events).forEach((event) => {
                        element.addEventListener(event, events[event], listener);
                        element.listeners.push({ element: element, listener: events[event], event: event, option: listener });
                    });
                else {
                    const event = events;
                    element.addEventListener(event, listener, option);
                    element.listeners.push({ element: element, listener: listener, event: event, option: option });
                }
            }
        });
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
        if (typeof value === 'string') {
            selected.forEach((element) => element.value = value);
            return this;
        }
        return selected[0].value;
    }
}
class FuxcelValidator extends Fuxcel {
    #_fxValidatorConfig = FuxcelValidator.defaultValidatorConfig;
    static #_defaultConfig = {
        regExp: {
            cardCVV: /[0-9]{3,4}$/gi,
            cardNumber: /^[0-9]+$/gi,
            email: /^(\w+([.-]?))*@\w+([.-]?)*(\.\w{2,3})$/gi,
            name: /^([a-zA-Z]{2,255})(\s[a-zA-Z]{2,255}){1,2}$/gi,
            phone: /^(\+\d{1,3}?\s)(\(\d{3}\)\s)?(\d+\s)*(\d{2,3}-?\d+)+$/g,
            username: /^[a-zA-Z]+(_?[a-zA-Z]){2,255}$/gi,
            password: /[0-9A-Za-z]{8,32}/gi,
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
            config: {
                step: '.fx-step',
                slides: false,
                switch: '[data-step]',
            },
        },
        texts: {
            capslock: 'Capslock active',
            emailFormat: null,
            nameFormat: null,
            passwordFormat: null,
            phoneFormat: null,
            usernameFormat: null,
        },
    };
    static #_initSteps = {};
    static #_stepsClass = '.fx-step';
    static #_validatorErrorBag = {};
    static #_validatorErrorCount = {};
    constructor(selector, context) {
        super(selector, context);
    }
    /**
     * Toggle given icons with a fadeout and fadein animation.
     *
     * @param oldIcon {Selector|Iterable<any>} Old Icon selector
     * @param newIcon {Selector|Iterable<any>} New Icon selector
     * @private
     * @return void
     */
    static #_toggleValidationIcons(oldIcon, newIcon) {
        const _oldIcon = fx(oldIcon);
        const _newIcon = fx(newIcon);
        if (_oldIcon.length && _newIcon.length) {
            if (_oldIcon.style('display') !== 'none')
                _oldIcon.style({ animation: 'fadeOut 500ms linear', display: 'none' });
            _newIcon.style({ display: 'inline-block', animation: 'fadeIn 500ms linear' });
        }
    }
    /**
     * Perform necessary action pre-validation.
     *
     * @param forms {HTMLElement[]} array of HTML Form Element(s).
     * @private
     * @return {FuxcelValidator} Fuxcel Validator Object of the forms.
     */
    #_initValidateForms(forms) {
        forms.forEach((form, index) => {
            const that = this;
            const configObject = this.validatorConfig;
            const _currentForm = fx(form).formValidator;
            if (!_currentForm.attrib('id'))
                _currentForm.attrib({ id: `current-form-${index}` });
            let formId = _currentForm.attrib('id'), formGroups = fx(`#${formId} .form-group`).formValidator;
            // @ts-ignore
            FuxcelValidator.#_validatorErrorBag[formId] = {};
            // @ts-ignore
            FuxcelValidator.#_validatorErrorCount[formId] = 0;
            configObject.config?.nativeValidation ? _currentForm.prop({ noValidate: false }) : _currentForm.prop({ noValidate: true });
            if (formGroups.length)
                formGroups.toArray.forEach((formGroup) => {
                    const _fieldElement = fx('.form-field', formGroup).formValidator;
                    const _labelElement = fx('label', formGroup).formValidator;
                    if (_fieldElement.length && _labelElement.length) {
                        if (_fieldElement.length < 2 && _labelElement.length < 2) {
                            if (!_fieldElement.attrib('id'))
                                if (_fieldElement.attrib('name'))
                                    _fieldElement.attrib({ id: _fieldElement.attrib('name').toString().replaceAll('-', '_') });
                                else {
                                    // @ts-ignore
                                    console.error(`${_fieldElement[0].tagName} element has no \`id\` or \`name\` attribute`, _fieldElement);
                                    throw (`Field element does not have an \`id\` or \`name\` attribute`);
                                }
                            const fieldElementId = _fieldElement.attrib('id');
                            if (_fieldElement.prop('tagName').toString().toLowerCase() === 'input' && !_fieldElement.attrib('placeholder'))
                                // @ts-ignore
                                _fieldElement.attrib({ placeholder: _fieldElement.attrib('name').toTitleCase() });
                            if (!_labelElement.attrib('for'))
                                _labelElement.attrib('for', fieldElementId);
                            // @ts-ignore
                            const expectedFieldElement = _fieldElement[0];
                            // @ts-ignore
                            const expectedLabelElement = _labelElement[0];
                            formGroup = this.#_placeElements(that, form, formGroup, expectedFieldElement, expectedLabelElement);
                            this.#_validate(that, formGroup);
                        }
                    }
                });
            else
                console.error(`init-wrapper element not found in form: #${formId}`);
        });
        return this.#_resetFuxcelObject(fx(forms));
    }
    /**
     * Initialize validation on selected step form(s).
     *
     * @param forms {HTMLElement[]} array of HTML Form Element(s).
     * @return {FuxcelSteps} Fuxcel Steps Object of the forms.
     */
    #_initValidateStepForms(forms) {
        forms.forEach((form, index) => {
            const configObject = this.validatorConfig;
            const _currentForm = fx(form).formValidator;
            if (!_currentForm.attrib('id'))
                _currentForm.attrib({ id: `current-form-${index}` });
            let formId = _currentForm.attrib('id'), formSteps = fx(`#${formId} ${FuxcelValidator.stepsClass}`).formValidator;
            if (formSteps.length) {
                // @ts-ignore
                FuxcelValidator.#_initSteps[index] = formId;
                // @ts-ignore
                FuxcelValidator.#_validatorErrorBag[formId] = {};
                // @ts-ignore
                FuxcelValidator.#_validatorErrorCount[formId] = {};
                configObject.config?.nativeValidation ? _currentForm.prop({ noValidate: false }) : _currentForm.prop({ noValidate: true });
                formSteps.toArray.forEach((step, index) => {
                    step.dataset.fxStep = `${index + 1}`;
                    const stepIndex = parseInt(step.dataset.fxStep);
                    const formGroups = fx(`.form-group`, step).formValidator;
                    // @ts-ignore
                    FuxcelValidator.#_validatorErrorBag[formId][stepIndex] = {};
                    // @ts-ignore
                    FuxcelValidator.#_validatorErrorCount[formId][stepIndex] = 0;
                    if (formGroups.length) {
                        const inputElement = 'input.form-field', selectElement = 'select.form-field', textAreaElement = 'textarea.form-field';
                        formGroups.toArray.forEach((formGroup) => {
                            const _fieldElement = fx(`${inputElement}, ${selectElement}, ${textAreaElement}`, formGroup).formValidator;
                            const _labelElement = fx('label', formGroup).formValidator;
                            if (_fieldElement.length && _labelElement.length) {
                                if (_fieldElement.length < 2 && _labelElement.length < 2) {
                                    if (!_fieldElement.attrib('id'))
                                        if (_fieldElement.attrib('name'))
                                            _fieldElement.attrib({ id: _fieldElement.attrib('name').toString().replaceAll('-', '_') });
                                        else {
                                            // @ts-ignore
                                            console.error(`${_fieldElement[0].tagName} element has no \`id\` or \`name\` attribute`, _fieldElement);
                                            throw (`Field element does not have an \`id\` or \`name\` attribute`);
                                        }
                                    const fieldElementId = _fieldElement.attrib('id');
                                    if (_fieldElement.prop('tagName').toString().toLowerCase() === 'input' && !_fieldElement.attrib('placeholder'))
                                        // @ts-ignore
                                        _fieldElement.attrib({ placeholder: _fieldElement.attrib('name').toTitleCase() });
                                    if (!_labelElement.attrib('for'))
                                        _labelElement.attrib('for', fieldElementId);
                                    // @ts-ignore
                                    const expectedFieldElement = _fieldElement[0];
                                    // @ts-ignore
                                    const expectedLabelElement = _labelElement[0];
                                    formGroup = this.#_placeElements(this, form, formGroup, expectedFieldElement, expectedLabelElement);
                                    this.#_validate(this, formGroup);
                                }
                            }
                        });
                    }
                });
            }
        });
        // @ts-ignore
        Object.keys(this).forEach(key => FuxcelSteps.currentlySelected[key] = this[key]);
        return new FuxcelSteps(this);
    }
    /**
     * Add or remove validation errors from the Validation Error Bag and also update the Error Count for the current form via its selected form field element.
     *
     * _If a string value is passed to the MessageOrRemove parameter, the message is added to the validation error bag for selected element._
     *
     * _If a boolean value is passed to the MessageOrRemove parameter, then previous error is removed from the validation error bag for the selected element._
     *
     * @param MessageOrRemove {string|boolean} String or boolean value indicating whether to add or remove error respectively.
     * @private
     * @return {void}
     */
    #_manipulateErrorBag(MessageOrRemove) {
        const fieldAttribs = this.fieldAttributes;
        if (isBool(MessageOrRemove) && MessageOrRemove)
            Object.keys(FuxcelValidator.#_validatorErrorBag).length && (Object.values(FuxcelValidator.#_initSteps).filter(value => fieldAttribs.formId === value).length ?
                // @ts-ignore
                (Object.keys(FuxcelValidator.#_validatorErrorBag[fieldAttribs.formId]).length && (delete FuxcelValidator.#_validatorErrorBag[fieldAttribs.formId][this.stepFromField][fieldAttribs.id])) :
                // @ts-ignore
                delete FuxcelValidator.#_validatorErrorBag[fieldAttribs.formId][fieldAttribs.id]);
        else {
            if (isString(MessageOrRemove))
                Object.keys(FuxcelValidator.#_validatorErrorBag).length && (Object.values(FuxcelValidator.#_initSteps).filter(value => fieldAttribs.formId === value).length ?
                    // @ts-ignore
                    (Object.keys(FuxcelValidator.#_validatorErrorBag[fieldAttribs.formId]).length && (FuxcelValidator.#_validatorErrorBag[fieldAttribs.formId][this.stepFromField][fieldAttribs.id] = MessageOrRemove)) :
                    // @ts-ignore
                    FuxcelValidator.#_validatorErrorBag[fieldAttribs.formId][fieldAttribs.id] = MessageOrRemove);
        }
        this.#_manipulateErrorCount();
    }
    /**
     * Update the error count in the Validation Error Count Bag of the form by count the total number of errors in the Validation Error Bag for the current form.
     *
     * @private
     * @return {void}
     */
    #_manipulateErrorCount() {
        const fieldAttribs = this.fieldAttributes;
        Object.keys(FuxcelValidator.#_validatorErrorCount).length && (Object.values(FuxcelValidator.#_initSteps).filter(value => fieldAttribs.formId === value).length ?
            // @ts-ignore
            (Object.keys(FuxcelValidator.#_validatorErrorCount[fieldAttribs.formId]).length && (FuxcelValidator.#_validatorErrorCount[fieldAttribs.formId][this.stepFromField] = Object.keys(FuxcelValidator.#_validatorErrorBag[fieldAttribs.formId][this.stepFromField]).length)) :
            // @ts-ignore
            FuxcelValidator.#_validatorErrorCount[fieldAttribs.formId] = Object.keys(FuxcelValidator.#_validatorErrorBag[fieldAttribs.formId]).length);
    }
    /**
     * Place all necessary elements in their required position pre-validation.
     *
     * @param that {FuxcelValidator} Current Form Validator instance.
     * @param form {HTMLFormElement} Initialized form instance.
     * @param formGroup {HTMLElement} Selected Form group.
     * @param expectedFieldElement {HTMLElement} Expected field element in selected form group.
     * @param expectedLabelElement {HTMLElement} Expected label element in selected form group.
     * @private
     * @return {HTMLElement}
     */
    #_placeElements(that, form, formGroup, expectedFieldElement, expectedLabelElement) {
        const configObject = that.validatorConfig;
        const _fieldElement = fx(expectedFieldElement);
        const fieldGroupId = `${expectedFieldElement.id}_group`;
        const validationText = document.createElement('div');
        validationText.classList.add('validation-text');
        validationText.innerHTML = '<small>&nbsp;</small>';
        formGroup.setAttribute('id', fieldGroupId);
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
                if (_fieldElement.attrib('type') && _fieldElement.attrib('type').toString().toLowerCase() === 'password') {
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
            label.innerHTML = expectedLabelElement.innerHTML;
            expectedLabelElement.innerHTML = '';
            expectedLabelElement.append(expectedFieldElement, label);
            newFieldGroup.append(/*expectedFieldElement, */ expectedLabelElement);
            if (configObject.config?.showPassword && configObject.config?.showIcons)
                if (_fieldElement.attrib('type') && _fieldElement.attrib('type').toString().toLowerCase() === 'password')
                    newInputGroupWrapper.append(newFieldGroup, togglePasswordIcons, validationIcons);
                else
                    newInputGroupWrapper.append(newFieldGroup, validationIcons);
            else {
                if (_fieldElement.attrib('type') && _fieldElement.attrib('type').toString().toLowerCase() === 'password' && configObject.config?.showPassword)
                    newInputGroupWrapper.append(newFieldGroup, togglePasswordIcons);
                else if (configObject.config?.showIcons)
                    newInputGroupWrapper.append(newFieldGroup, validationIcons);
                else
                    newInputGroupWrapper.append(newFieldGroup);
            }
            newInputGroup.append(newInputGroupWrapper);
            newFormGroupWrapper.append(newInputGroup, validationText);
            formGroup.append(newFormGroupWrapper);
            newFieldGroup.style.height = `${expectedFieldElement.getBoundingClientRect().height * 2}px`;
            fx(expectedLabelElement, form).style({
                height: '100%',
                /*display: 'flex',
                alignItems: 'center'*/
            });
        }
        else
            formGroup.append(validationText);
        validationText.setAttribute('id', `${expectedFieldElement.id}Valid`);
        return formGroup;
    }
    /**
     * Replace the current selected element(s) with the given one(s) in the Fuxcel Validator Object.
     *
     * @param elements {Fuxcel | FuxcelBase | FuxcelValidator}
     * @private
     * @return {FuxcelValidator} Fuxcel Validator Object of the selected element.
     */
    #_resetFuxcelObject(elements) {
        const documentDOMArray = fx(document).toArray;
        // @ts-ignore
        Object.keys(this).forEach(key => delete this[key]);
        this.length = 0;
        this.prev = { length: 0 };
        documentDOMArray.forEach((value, key) => {
            // @ts-ignore
            this.prev[key] = value;
            this.prev.length++;
        });
        elements.toArray.forEach((value, index) => {
            // @ts-ignore
            this[index] = value;
            this.length++;
        });
        return this;
    }
    /**
     * Change initial default validator config with user config
     *
     * @param config {Object}
     * @private
     * @return {void}
     */
    #_touchConfig(config) {
        const validatorConfigObject = this.validatorConfig;
        Object.keys(validatorConfigObject).forEach((key) => {
            // @ts-ignore
            if (key in config && isObject(config[key])) {
                // @ts-ignore
                const validatorConfigOptionObject = validatorConfigObject[key];
                // @ts-ignore
                const configOptionObject = config[key];
                if (Object.keys(configOptionObject).length)
                    Object.keys(validatorConfigOptionObject).forEach((optionKey) => {
                        if (optionKey in configOptionObject)
                            if (configOptionObject[optionKey] !== '' && configOptionObject[optionKey] !== null && configOptionObject[optionKey] !== undefined)
                                validatorConfigOptionObject[optionKey] = configOptionObject[optionKey];
                    });
            }
        });
    }
    /**
     * Perform validation on the form field elements.
     *
     * @param that {FuxcelValidator} Current Validator instance
     * @param formGroup {HTMLElement} Current selected form group
     * @private
     * @return {void}
     */
    #_validate(that, formGroup) {
        const inputElement = 'input.form-field', selectElement = 'select.form-field', textAreaElement = 'textarea.form-field';
        const configObject = that.#_fxValidatorConfig;
        let refillRequired, passwordToggle = FuxcelValidator.passwordTogglerIconClass, _inputElement = fx(inputElement, formGroup), _selectElement = fx(selectElement, formGroup), _textAreaElement = fx(textAreaElement, formGroup), _element = that.#_resetFuxcelObject(_inputElement.length ? _inputElement : (_selectElement.length ? _selectElement : _textAreaElement)), _passwordToggle = fx(passwordToggle, formGroup), showPasswordToggle = `#${formGroup.id} ${passwordToggle} > .fx-show-password-icon`, hidePasswordToggle = `#${formGroup.id} ${passwordToggle} > .fx-hide-password-icon`;
        const inputGroupWrapper = fx('.input-group-wrapper', formGroup);
        const labelElement = fx('label', inputGroupWrapper);
        _inputElement.length && _inputElement.upon({
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
                                _input.attrib('type')?.toLowerCase() === 'password' && fx(`${showPasswordToggle}, ${hidePasswordToggle}`).style({ animation: 'fadeOut 500ms linear', display: 'none' });
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
                const fxId = _input.dataAttrib('fx-id') && _input.dataAttrib('id').toLowerCase();
                const fxRole = _input.dataAttrib('fx-role') && _input.dataAttrib('role').toLowerCase();
                const elementId = _input.attrib('id') && _input.attrib('id').toLowerCase();
                const elementType = _input.attrib('type') && _input.attrib('type').toLowerCase();
                const filterField = new Set(['name', 'username', 'card_cvv', 'card_number']);
                const filterFieldType = new Set(['date', 'datetime', 'email', 'month']);
                if (_input.canBeValidated) {
                    if (!filterFieldType.has(elementType) && !filterFieldType.has(fxRole) && !filterField.has(elementId) && !filterField.has(fxRole) && !filterField.has(fxId))
                        if (_input.isPasswordField)
                            _input.#_validatePasswordFields();
                        else
                            _input.validateField();
                    if (_input.isEmailField)
                        configObject.config?.validateEmail ? _input.validateEmail(configObject.regExp?.email, configObject.texts?.emailFormat ?? null) : _input.toggleValidation();
                    if (_input.isNameField)
                        configObject.config?.validateName ? _input.validateName(configObject.regExp?.name, configObject.texts?.nameFormat ?? null) : _input.toggleValidation();
                    if (_input.isPhoneField)
                        configObject.config?.validatePhone ? _input.validatePhone(configObject.regExp?.phone, configObject.texts?.phoneFormat ?? null) : _input.toggleValidation();
                    if (_input.isUsernameField)
                        configObject.config?.validateUsername ? _input.validateUsername(configObject.regExp?.username, configObject.texts?.usernameFormat ?? null) : _input.toggleValidation();
                    if (configObject.config?.validateCard) {
                        if (elementId?.includes('card_cvv') || fxRole?.includes('card_cvv') || fxId?.includes('card_cvv'))
                            _input.validateCardCVV(configObject.regExp?.cardCVV);
                        if (elementId?.includes('card_number') || fxRole?.includes('card_number') || fxId?.includes('card_number'))
                            _input.validateCardCVV(configObject.regExp?.cardNumber);
                    }
                    else {
                        if ((elementId?.includes('card_cvv') || fxRole?.includes('card_cvv') || fxId?.includes('card_cvv')) || (elementId?.includes('card_number') || fxRole?.includes('card_number') || fxId?.includes('card_number')))
                            _input.toggleValidation();
                    }
                    filterFieldType.has(elementType) && elementType !== 'email' && _input.validateField();
                }
            },
            keyup: function () {
                const _input = that.#_resetFuxcelObject(fx(this));
                if (_input.isPasswordField)
                    if (_input.length)
                        if (configObject.config?.showPassword && _passwordToggle.length)
                            if (refillRequired && !_input.value()?.length) {
                                _passwordToggle.dataAttrib('require-refill', 'false');
                                refillRequired = parseBool(_passwordToggle.dataAttrib('require-refill'));
                            }
                            else {
                                if (!refillRequired && _input.value()?.length)
                                    if (_input.attrib('type').toLowerCase() === 'password')
                                        FuxcelValidator.#_toggleValidationIcons(hidePasswordToggle, showPasswordToggle);
                                    else
                                        FuxcelValidator.#_toggleValidationIcons(showPasswordToggle, hidePasswordToggle);
                                else {
                                    refillRequired = parseBool(_passwordToggle.dataAttrib('require-refill'));
                                    fx(`${showPasswordToggle}, ${hidePasswordToggle}`).style({ animation: 'fadeOut 500ms linear', display: 'none' });
                                }
                            }
            }
        });
        _selectElement.length && _selectElement.upon({
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
                // @ts-ignore
                const _element = that.#_resetFuxcelObject(fx(this));
                _element.canBeValidated && _element.validateField();
            }
        });
        _textAreaElement.length && _textAreaElement.upon({
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
                // @ts-ignore
                const _element = that.#_resetFuxcelObject(fx(this));
                _element.canBeValidated && _element.validateField();
            }
        });
        if (_element.length) {
            const elementId = _element.attrib('id');
            // @ts-ignore
            const fieldName = elementId.toTitleCase();
            if (_element.canBeValidated && (_element.isElement('input') || _element.isElement('select') || _element.isElement('textarea'))) {
                if (_element.isElement('input')) {
                    const elementType = _element.attrib('type') && _element.attrib('type').toLowerCase();
                    if (configObject.config?.showPassword && _passwordToggle.length)
                        _passwordToggle.off('touchstart', 'click').upon(['touchstart', 'click'], (e) => {
                            let clicked = e.target, _clicked = fx(clicked), _formGroup = _passwordToggle.parents('.form-group'), _passwordField = fx(_element, _formGroup);
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
            const pwdFieldName = pwdField.fieldAttributes.id.toTitleCase();
            const expectedCpwdField = fx(`#${configObject.config?.passwordConfirmId}`, form);
            if (configObject.regExp?.password) {
                if (expectedCpwdField.length) {
                    const cpwdField = expectedCpwdField.formValidator;
                    const cpwdFieldName = cpwdField.fieldAttributes.id.toTitleCase();
                    if (!pwdField.value()?.length) {
                        pwdField.validateField();
                        cpwdField.validateField(`Check Password.`);
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
                    const cpwdFieldName = cpwdField.fieldAttributes.id.toTitleCase();
                    if (pwdField.value()?.length || cpwdField.value()?.length) {
                        if (minLength && maxLength)
                            if (minLength === maxLength) {
                                if (!pwdField.value()?.length) {
                                    pwdField.validateField();
                                    cpwdField.validateField(`Check Password.`);
                                }
                                else if (pwdField.value()?.length !== maxLength) {
                                    pwdField.validateField(`The ${pwdFieldName} field requires ${maxLength} characters.`);
                                    if (!cpwdField.value()?.length)
                                        cpwdField.validateField(`The ${cpwdFieldName} field is required.`);
                                    else
                                        cpwdField.validateField(`Check Password.`);
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
                                    cpwdField.validateField(`Check Password.`);
                                }
                                else {
                                    if (!cpwdField.value()?.length)
                                        cpwdField.validateField(`The ${cpwdFieldName} field is required.`);
                                    else
                                        cpwdField.validateField();
                                    pwdField.validateField();
                                }
                            }
                        else if (minLength) {
                            // @ts-ignore
                            if (pwdField.value()?.length < minLength) {
                                pwdField.validateField(`The ${pwdFieldName} field requires ${minLength} characters.`);
                                cpwdField.validateField(`Check Password.`);
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
    /**
     * Checks if the selected field element can be validated by checking that the [data-fx-validate] is not set to false.
     *
     * @return {boolean} true if validation is possible; false otherwise
     */
    get canBeValidated() {
        const selected = this.toArray;
        return selected.length ? (this.dataAttrib('fx-validate') ? parseBool(this.dataAttrib('fx-validate')) : true) : false;
    }
    /**
     * @return {object} The error bag for the current selected form.
     */
    get errorBag() {
        // @ts-ignore
        return (this.length && this.isElement('form')) && Object.keys(FuxcelValidator.#_validatorErrorBag[this.attrib('id')]).length ? FuxcelValidator.#_validatorErrorBag[this.attrib('id')] : null;
    }
    /**
     * @return {number} The error count for the current selected form.
     */
    get errorCount() {
        // @ts-ignore
        return (this.length && this.isElement('form')) && Object.keys(FuxcelValidator.#_validatorErrorCount).length ? FuxcelValidator.#_validatorErrorCount[this.attrib('id')] : 0;
    }
    /**
     * @return {object} An object containing the error bag and error count for the current selected form(s). Logs an error to the console if selected element(s) not form element(s).
     */
    get getErrors() {
        const selected = this.toArray;
        let errors = {};
        if (selected.length > 1) {
            selected.forEach((element) => {
                const _element = fx(element).formValidator;
                if (element.tagName && _element.isElement('form')) {
                    // @ts-ignore
                    errors[element.id] = {
                        count: _element.errorCount,
                        errors: _element.errorBag
                    };
                }
            });
            return errors;
        }
        return this.isElement('form') ? {
            count: this.errorCount,
            errors: this.errorBag,
        } : console.error('Non form element given.');
    }
    /**
     * @return {object|void} An object containing all form field elements for the current selected form(s). Logs an error to the console if selected element(s) not form element(s).
     */
    get formFieldElements() {
        const selected = this.toArray;
        if (selected.length > 1) {
            const elements = {};
            selected.forEach((element) => {
                if (fx(element).isElement('form')) {
                    const formElement = element;
                    // @ts-ignore
                    elements[formElement.id] = formElement.elements;
                }
            });
            return elements;
        }
        // @ts-ignore
        return this.isElement('form') ? selected[0].elements : console.error('Non form elements given', selected);
    }
    /**
     * Checks if the selected form field element is an email field.
     *
     * @return {boolean} true if it is an email field; false otherwise
     */
    get isEmailField() {
        const attributes = this.fieldAttributes;
        return attributes.type?.includes('email') || attributes.type?.includes('email') || attributes.id?.includes('email') || attributes.fxId?.includes('email') || attributes.fxRole?.includes('email');
    }
    /**
     * Checks if the selected form field element is a name field.
     *
     * @return {boolean} true if it is a name field; false otherwise
     */
    get isNameField() {
        const attributes = this.fieldAttributes;
        return !this.isUsernameField && attributes.id === 'name' || attributes.fxId === 'name' || attributes.fxRole === 'name';
    }
    /**
     * Checks if the selected form field element is a password field.
     *
     * @return {boolean} true if it is a password field; false otherwise
     */
    get isPasswordField() {
        const passwordId = this.#_fxValidatorConfig.config?.passwordId;
        const attributes = this.fieldAttributes;
        return attributes.type === 'password' || attributes.id?.includes(passwordId.toLowerCase()) || attributes.fxId?.includes(passwordId.toLowerCase()) || attributes.fxRole?.includes(passwordId.toLowerCase());
    }
    /**
     * Checks if the selected form field element is a phone field.
     *
     * @return {boolean} true if it is a phone field; false otherwise
     */
    get isPhoneField() {
        const attributes = this.fieldAttributes;
        return attributes.type?.includes('tel') || attributes.type?.includes('phone') || attributes.id?.includes('phone') || attributes.fxId?.includes('phone') || attributes.fxRole?.includes('phone');
    }
    /**
     * Checks if the selected form field element is a username field.
     *
     * @return {boolean} true if it is a username field; false otherwise
     */
    get isUsernameField() {
        const attributes = this.fieldAttributes;
        return attributes.id?.includes('username') || attributes.fxId?.includes('username') || attributes.fxRole?.includes('username');
    }
    /**
     * @return {number} the current step the form field belongs to if the form is a step form; -1 otherwise.
     */
    get stepFromField() {
        const stepDiv = this.parents(FuxcelValidator.stepsClass);
        if (stepDiv.length)
            return parseInt(stepDiv.dataAttrib('fx-step') ?? '0');
        return -1;
    }
    /**
     * @return {ValidationProps} Returns the [ValidationProps](ValidationProps) of the selected form field element.
     */
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
        throw ('Non-Form field element given');
    }
    /**
     * @return {ValidatorConfigObject} current validator config options object of selected form.
     */
    get validatorConfig() {
        return this.#_fxValidatorConfig;
    }
    /**
     * @return {ValidatorConfigObject} the default validator config object.
     */
    static get defaultValidatorConfig() {
        return FuxcelValidator.#_defaultConfig;
    }
    /**
     * @return {string} the password capslock alert class. Default is '.capslock-alert'.
     */
    static get passwordCapslockAlertClass() {
        return '.capslock-alert';
    }
    /**
     * @return {string} the password toggle icon class. Default is '.toggle-password-icons'.
     */
    static get passwordTogglerIconClass() {
        return '.toggle-password-icons';
    }
    /**
     * @return {string} steps class. Default is '.fx-step'.
     */
    static get stepsClass() {
        return FuxcelValidator.#_stepsClass;
    }
    /**
     * Change the default class for steps.
     *
     * @param stepClass {string} class to use for steps.
     */
    static set stepsClass(stepClass) {
        FuxcelValidator.#_stepsClass = stepClass;
    }
    /**
     * Initialize validation on selected form(s).
     *
     * _Throws an error if non form elements are selected_
     *
     * @param config {ValidatorConfigObject} user config object.
     * @return {FuxcelSteps | FuxcelValidator} Fuxcel Validator Object of the forms.
     */
    init(config = null) {
        const selected = this.toArray;
        let forms = selected.filter((element) => fx(element).isElement('form')), nonForms = selected.filter((element) => !fx(element).isElement('form'));
        if (forms.length) {
            if (nonForms.length)
                console.error(`${nonForms.length} non form-element${nonForms.length === 1 ? '' : 's'} passed to validator:`, nonForms);
            config && isObject(config) && this.#_touchConfig(config);
            return this.validatorConfig.stepForm?.use ? this.#_initValidateStepForms(forms) : this.#_initValidateForms(forms);
        }
        else {
            console.error(`Non form-elements passed to the validator`, nonForms);
            throw (`${nonForms.length} non form-element${nonForms.length === 1 ? '' : 's'} passed to validator.`);
        }
    }
    /**
     * Display validation message.
     *
     * @param [message] {string|null=null} message to display [optional]
     * @param renderType {('error'|'success'|null)} validation type
     * @return {FuxcelValidator} Fuxcel Validator Object of the current selected element.
     */
    renderMessage(message = null, renderType = null) {
        this.insertHTML(`<small ${renderType ? 'class="' + renderType + '"' : ''}>${message ?? '&nbsp;'}</small>`);
        return this;
    }
    /**
     * Display all validation errors for the selected form.
     *
     * @param errors {object} An object containing the errors. The keys are the form field ids and their values are the errors for the fields respectively.
     * @param messageOrCallbackFn {((fx: FuxcelValidator, e?: CustomEvent) => any)|StringOrNull}
     * @param callbackFn {((fx: FuxcelValidator, e?: CustomEvent) => any)}
     */
    renderValidationErrors(errors, messageOrCallbackFn = null, callbackFn = null) {
        const selected = this;
        if (selected.isElement('form')) {
            const fieldElements = this.formFieldElements;
            if (isObject(errors))
                Object.keys(errors).forEach((elementId) => {
                    // @ts-ignore
                    const fieldName = elementId.toString().toTitleCase();
                    const element = fx(`#${elementId}`).formValidator;
                    // @ts-ignore
                    if (elementId in fieldElements && (isDefined(errors[elementId])))
                        // @ts-ignore
                        element.validateField(errors[elementId], true);
                    else {
                        // @ts-ignore
                        if (isString(errors[elementId]) && errors[elementId] !== undefined)
                            element.validateField(`Verify ${fieldName} and try again.`, true);
                    }
                });
            // @ts-ignore
            fx('.fx-valid-error')[0].scrollIntoView({
                behavior: "smooth", // Smooth scrolling
                block: "center", // Scroll to the top of the target
            });
        }
        else
            console.warn('Non form element given.');
        typeof messageOrCallbackFn === "string" ?
            // @ts-ignore
            fx.modal({
                type: 'error',
                content: messageOrCallbackFn,
                confirmButtonText: 'Ok',
                onConfirm: (e) => typeof callbackFn === 'function' && callbackFn(this, e)
            }) : typeof messageOrCallbackFn === 'function' && messageOrCallbackFn(this);
        return this;
    }
    /**
     * Show validation error for the selected field.
     *
     * @param message {string|null=null} Validation message.
     * @return {void}
     */
    showError(message = null) {
        const fieldAttribs = this.fieldAttributes;
        const validationProps = this.validationProps;
        // @ts-ignore
        const finalMessage = message ?? `The ${fieldAttribs.id?.toTitleCase()} field is required`;
        this.#_manipulateErrorBag(finalMessage);
        this.#_fxValidatorConfig.config?.showIcons && FuxcelValidator.#_toggleValidationIcons(validationProps.validIcon, validationProps.invalidIcon);
        fx(validationProps.validationField).length && fx(validationProps.validationField).formValidator.renderMessage(finalMessage ?? null);
        if (this.#_fxValidatorConfig.config?.useDefaultStyling)
            fx(`${validationProps.formGroup} .form-group-wrapper`).replaceClass('fx-valid-success', 'fx-valid-error');
        else
            fx(validationProps.formGroup).replaceClass('fx-valid-success', 'fx-valid-error');
        // this.#_manipulateErrorCount();
    }
    /**
     * Show validation success.
     *
     * @param message {string|null=null} Validation message.
     * @return {void}
     */
    showSuccess(message = null) {
        const validationProps = this.validationProps;
        this.#_manipulateErrorBag(true);
        this.#_fxValidatorConfig.config?.showIcons && FuxcelValidator.#_toggleValidationIcons(validationProps.invalidIcon, validationProps.validIcon);
        fx(validationProps.validationField).length && fx(validationProps.validationField).formValidator.renderMessage(message ?? null);
        if (this.#_fxValidatorConfig.config?.useDefaultStyling)
            fx(`${validationProps.formGroup} .form-group-wrapper`).replaceClass('fx-valid-error', 'fx-valid-success');
        else
            fx(validationProps.formGroup).replaceClass('fx-valid-error', 'fx-valid-success');
        // this.#_manipulateErrorCount();
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
        const selected = this;
        const fieldAttribs = selected.fieldAttributes;
        const validationProps = selected.validationProps;
        if (destroyValidation) {
            // @ts-ignore
            delete FuxcelValidator.#_validatorErrorBag[fieldAttribs.formId][fieldAttribs.id];
            // @ts-ignore
            FuxcelValidator.#_validatorErrorCount[fieldAttribs.formId] = Object.keys(FuxcelValidator.#_validatorErrorCount[fieldAttribs.formId]).length;
        }
        if (selected.#_fxValidatorConfig.config?.useDefaultStyling)
            fx(`${validationProps.formGroup} .form-group-wrapper`).removeClass('fx-valid-error', 'fx-valid-success');
        else
            fx(validationProps.formGroup).removeClass('fx-valid-error', 'fx-valid-success');
        !!fx(`${validationProps.validationIconField} > *`)?.length ?
            fx(`${validationProps.validationIconField} > *`).fadeout().then((e) => fx(validationProps.validationField).formValidator.renderMessage(null)) :
            fx(validationProps.validationField).formValidator.renderMessage(null);
        return this;
    }
    /**
     * Returns the error bag for the given step of the current selected element.
     *
     * @param step {number|string} Given step.
     * @return {object} The error bag for the given step of the current selected step form.
     */
    stepErrorBag(step) {
        // @ts-ignore
        return (this.length && this.isElement('form')) && Object.keys(FuxcelValidator.#_validatorErrorBag[this.attrib('id')][step]).length ? FuxcelValidator.#_validatorErrorBag[this.attrib('id')][step] : null;
    }
    /**
     * Returns the error count for the given step of the current selected element.
     *
     * @param step {number|string} Given step.
     * @return {object} The error count for the given step of the current selected step form.
     */
    stepErrorCount(step) {
        // @ts-ignore
        return (this.length && this.isElement('form')) && Object.keys(FuxcelValidator.#_validatorErrorCount[this.attrib('id')]).length ? FuxcelValidator.#_validatorErrorCount[this.attrib('id')][step] : 0;
    }
    /**
     * Validate Card CVV field using Regular Expression
     *
     * @param regExp {RegExp} Regular expression to use.
     * @param customFormatEx {string|null=null} Custom format example to show user.
     * @return {FuxcelValidator} Fuxcel Validator Object of the selected element.
     */
    validateCardCVV(regExp, customFormatEx = null) {
        return this.validateRegex(regExp, `${customFormatEx ?? 'Invalid CVV.'}`);
    }
    /**
     * Validate Card Number field using Regular Expression
     *
     * @param regExp {RegExp} Regular expression to use.
     * @param customFormatEx {string|null=null} Custom format example to show user
     * @return {FuxcelValidator} Fuxcel Validator Object of the selected element.
     */
    validateCardNumber(regExp, customFormatEx = null) {
        const selected = this.toArray;
        // @ts-ignore
        const value = selected[0].value;
        return this.validateRegex(() => value.length ? (value.match(regExp) ?
            // @ts-ignore
            (fx.passLuhnAlgo(selected[0]) ? this.validateField() : this.validateField('Check Card Number and try again.', true)) :
            this.validateField(`${customFormatEx ?? 'Only numbers are allowed.'}`)) : this.toggleValidation());
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
    /**
     * Validate the selected field.
     *
     * @param message {string|null=null} Validation message to display.
     * @param isError {boolean=false} If true and the message parameter is null, an automatic error message is generated.
     * @return {FuxcelValidator} Fuxcel Validator Object of the selected element.
     */
    validateField(message = null, isError = false) {
        const selected = this;
        const fieldAttribs = selected.fieldAttributes;
        const configObject = this.#_fxValidatorConfig.config;
        // @ts-ignore
        const target = selected[0];
        let fieldValue = target.value, minLength = parseInt(selected.attrib('minlength') ?? '0'), fieldName = fieldAttribs.id.toTitleCase(), finalMessage = minLength ?
            (!isString(message) && fieldValue.length && fieldValue.length < minLength ? `The ${fieldName} field requires a minimum of ${minLength} characters.` : message) :
            (!isString(message) ?
                (selected.isPasswordField ?
                    ((fieldAttribs.id === configObject?.passwordConfirmId && configObject?.validatePassword) ? ((!fieldValue.length || fieldValue !== fx(`#${configObject.passwordId}`).value()) ? (fx(`#${configObject.passwordId}`).value()?.length ? 'Ensure passwords.' : `The ${fieldName} field is required.`) : null) : (!fieldValue.length ? `The ${fieldName} field is required.` : null)) :
                    message) :
                message);
        if (!fieldValue || !fieldValue.length || fieldValue.length < minLength || (selected.isPasswordField && (!fieldValue.length || finalMessage)) || isError)
            selected.showError(finalMessage);
        else
            selected.showSuccess(finalMessage);
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
        return this.validateRegex(regExp, `Invalid Password format: (${customFormatEx ?? 'Password requires a minimum of 8 characters an must contain at least 1 uppercase and 1 special character'})`);
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
    validateRegex(regExpOrFn, message) {
        const selected = this.toArray;
        // @ts-ignore
        const value = selected[0].value;
        (regExpOrFn && typeof regExpOrFn === 'function') ? regExpOrFn(this) :
            (regExpOrFn && isString(message) ? ((value.length) ? (value.match(regExpOrFn) ? this.validateField() : this.validateField(message, true)) : this.validateField()) : console.error('Function \`validateRegex()\` expects 2 arguments.'));
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
        const fieldName = selected[0].id.toTitleCase();
        return this.validateRegex(() => value.length ? (value.length > minLength ?
            (value.match(regExp) ? this.validateField() : this.validateField(`Invalid Username format: (${customFormatEx ?? 'Username must start and end with an alphabet, and can only contain alphabets and underscores.'})`)) :
            this.validateField(customFormatEx ?? `The ${fieldName} requires a minimum of 3 characters.`)) : this.toggleValidation());
    }
}
class FuxcelSteps extends FuxcelValidator {
    #that;
    static currentlySelected = {};
    constructor(selected) {
        super(selected);
        this.#that = selected;
        try {
            // @ts-ignore
            if (Steps.constructor.name.length && selected.validatorConfig.stepForm.plugin)
                // @ts-ignore
                new Steps(selected[0]).init(selected.validatorConfig.stepForm.config);
        }
        catch (e) {
        }
        return this;
    }
    /**
     * @return {FuxcelSteps} Fuxcel Validator Object of the selected element.
     */
    get context() {
        return new FuxcelSteps(FuxcelSteps.currentlySelected);
    }
    /**
     * @return {object | (number | string)[]} If more than one selected form element - An Object containing all form steps in arrays respectively; else an array of all steps in the form.
     */
    get formSteps() {
        const steps = [];
        if (this.length > 1) {
            const allSteps = {};
            this.toArray.forEach((form) => {
                if (fx(form).isElement('form')) {
                    // @ts-ignore
                    allSteps[form.id] = [];
                    const stepDivs = fx(FuxcelValidator.stepsClass, form);
                    stepDivs.length && stepDivs.toArray.forEach((stepDiv) => {
                        const step = stepDiv.dataset.fxStep;
                        // @ts-ignore
                        isString(step) && step !== undefined && (allSteps[form.id]).push(step);
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
    /**
     * An object containing the error bag and error count for the current selected step form(s). Logs an error to the console if selected element(s) not form element(s).
     *
     * _Error bag for the specified step if the step is given._
     *
     * _All errors if step is not specified._
     *
     * @param step {number|string|null = null}
     * @return {{count: number, errors: Object}|void}
     */
    stepErrors(step = null) {
        const selected = this.context.toArray;
        let errors = {};
        if (step === null) {
            selected.forEach((element) => {
                // @ts-ignore
                const _element = new FuxcelSteps(element);
                if (element.tagName && _element.isElement('form')) {
                    // @ts-ignore
                    errors[element.id] = {};
                    const steps = _element.formSteps;
                    if (steps.length) {
                        steps.forEach(step => {
                            // @ts-ignore
                            errors[element.id][step] = {
                                count: _element.stepErrorCount(step),
                                errors: _element.stepErrorBag(step)
                            };
                        });
                    }
                }
            });
            return errors;
        }
        return this.context.isElement('form') ? {
            count: this.context.stepErrorCount(step),
            errors: this.context.stepErrorBag(step),
        } : console.error('Non form element given.');
    }
}
class FuxcelModal extends Fuxcel {
    #_isHiding = false;
    static #_modalTarget;
    static #_openModals = [];
    constructor(selector, context, autoActions = true) {
        super(selector, context);
        if (FuxcelModal.modalTriggers.length) {
            FuxcelModal.modalTriggers.off().upon('click', function (e) {
                e.preventDefault();
                const currentTrigger = fx(e.currentTarget);
                const modalAction = currentTrigger.dataAttrib('fx-action')?.toString().toLowerCase() ?? 'open';
                FuxcelModal.#_modalTarget = currentTrigger.parents('.fx-modal');
                if (autoActions)
                    if (modalAction === 'close')
                        FuxcelModal.#_modalTarget.modal.hide();
                    else
                        FuxcelModal.#_modalTarget.modal.toggle();
            });
        }
        else
            console.error('Target modal not found.');
    }
    /**
     * @return {FuxcelModal | null} FuxcelModal object of Current open modal.
     */
    static get currentModal() {
        return this.hasOpenModals ? this.#_openModals[this.#_openModals.length - 1] : null;
    }
    /**
     * @return {boolean} true if any modal is open. False otherwise.
     */
    static get hasOpenModals() {
        return !!this.#_openModals.length;
    }
    /**
     * @return {Fuxcel}
     */
    static get modalTriggers() {
        return fx('*[data-fx-target="modal"]');
    }
    /**
     * Generate a simple Modal with required given parameters.
     *
     * @param title {string} The Modal title.
     * @param html {boolean} Is modal content HTML or Text.
     * @param content {string} The Content for the body of the Modal.
     * @param id {string} id to use for the Modal.
     * @param hasFooter {boolean} If the Modal should be created with a footer.
     * @return {HTMLElement} Generated Modal.
     */
    static init({ title = null, html = true, content, id, hasFooter }) {
        const fxModal = document.createElement('div');
        const modalDialog = document.createElement('div');
        const modalContent = document.createElement('div');
        const modalHeader = document.createElement('div');
        const modalBody = document.createElement('div');
        const modalFooter = document.createElement('div');
        const modalTitle = document.createElement('div');
        const modalCloseButton = document.createElement('div');
        fxModal.id = id;
        fxModal.classList.add('fx-modal', 'filter');
        title && (modalTitle.innerHTML = title);
        html ? (modalBody.innerHTML = content) : (modalBody.innerText = content);
        modalCloseButton.dataset.fxAction = 'close';
        modalCloseButton.dataset.fxTarget = 'modal';
        modalTitle.classList.add('title');
        modalCloseButton.classList.add('close');
        modalDialog.classList.add('fx-modal-dialog', 'fx-dialog-centered', 'fx-dialog-scrollable');
        modalContent.classList.add('fx-modal-content');
        modalHeader.classList.add('fx-modal-header');
        modalBody.classList.add('fx-modal-body');
        modalFooter.classList.add('fx-modal-footer');
        modalHeader.append(modalTitle, modalCloseButton);
        modalContent.append(modalHeader, modalBody, modalFooter);
        modalDialog.append(modalContent);
        fxModal.append(modalDialog);
        !title && modalContent.removeChild(modalHeader);
        !hasFooter && modalContent.removeChild(modalFooter);
        return fxModal;
    }
    /**
     * Destroy selected modal.
     */
    destroy() {
        // @ts-ignore
        this[0].remove();
    }
    /**
     * Close selected modal.
     *
     * @param destroy {boolean}
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
                this[0].dispatchEvent(fxModalHideEvent);
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
        this.style({ pointerEvents: 'none' }).fadein(300).then(() => modalContent.fadein(300).then(() => {
            FuxcelModal.#_openModals.push(this);
            this.style({ pointerEvents: 'unset' });
            if (!parseBool(this.dataAttrib('fx-static')))
                // Hide modal if mouse is left-clicked outside the modal content [Trigger clicking on either buttons if any is available].
                this.upon('click', () => modalContent.hasFocus.then((focused) => !focused ? this.hide() : null));
            if (escKey)
                fx(document).off('keyup').upon('keyup', (e) => {
                    const event = e;
                    const key = event.key.toLowerCase();
                    if (key === 'escape' || key === 'esc')
                        if (FuxcelModal.hasOpenModals)
                            FuxcelModal.currentModal?.hide(true);
                });
            // @ts-ignore
            this[0].dispatchEvent(fxModalShowEvent);
        }));
    }
    /**
     * Toggle between close and open of the selected modal.
     */
    toggle() {
        if (this.style('display') === 'none')
            this.show();
        else
            this.hide();
    }
}
/**
 * Perform a fetch request using the [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API).
 *
 * It provides a convenient way to perform fetch requests with various options and callbacks.
 *
 * It supports different HTTP methods, request data, response data types, and allows for the execution of custom functions before sending the request, after completion, on success, and on error.
 *
 * @param uri {string} Request URL.
 * @param method {('get'|'post'|'put'|'patch'|'delete'|null)} Request method.
 * @param data {Object|BodyInit}  Additional request data.
 * @param dataType {('html'|'json'|'jsonp'|'script'|'text'|'xml'|null)} Expected return data type.
 * @param headers {Object|Headers} Additional Headers to be sent along the request.
 * @param beforeSend {Function|null = null} Before request is sent.
 * @param onComplete {((response: ResponseData, status: number, statusText: string) => void)|null = null} Once request is completed.
 * @param onError {((error: any, status: number, statusText: string) => void)|null = null} If request has errors.
 * @param onSuccess {((response: ResponseData, status: number, statusText: string) => void)|null = null} If request is successful.
 */
fx.fetch = function ({ uri = '', method = 'get', data = null, dataType = 'json', headers = null, beforeSend = null, onComplete = null, onError = null, onSuccess = null }) {
    let status, statusText, responseData;
    const allowedErrorStatuses = new Set([301, 308, 401, 402, 422, 423, 426, 451, 500, 511]);
    const defaultHeaders = {
        'X-Requested-With': 'XMLHttpRequest'
    };
    isFunction(beforeSend) && beforeSend();
    if (data?.constructor.name.toLowerCase() === 'object') {
        const formData = new FormData();
        // @ts-ignore
        Object.keys(data).forEach(key => formData.append(key, data[key]));
        data = formData;
    }
    if (headers?.constructor.name.toLowerCase() === 'object')
        // @ts-ignore
        Object.keys(headers).forEach(key => defaultHeaders[key] = headers[key]);
    headers = defaultHeaders;
    // TODO: Abort request with timeout
    fetch(uri, {
        method: method,
        body: data,
        headers: headers
    }).then(response => {
        responseData = response;
        status = responseData.status;
        statusText = responseData.statusText;
        try {
            // @ts-ignore
            const consumedData = response[dataType]();
            return (consumedData && responseData.ok || (status > 199 && status < 300) || allowedErrorStatuses.has(status)) ? consumedData : Promise.reject(response);
        }
        catch (e) {
            return Promise.reject(e);
        }
    }).then(data => {
        responseData.responseJSON = dataType === 'json' && data;
        responseData.responseText = dataType === 'json' ? JSON.stringify(data) : (dataType === 'text' && data);
        // @ts-ignore
        status > 199 && status < 300 && isFunction(onSuccess) && onSuccess(responseData, status, statusText);
        // @ts-ignore
        isFunction(onComplete) && onComplete(responseData, status, statusText);
        // @ts-ignore
    }).catch(error => isFunction(onError) && onError(error, status, statusText));
};
/**
 * Create quick simple modal with callbacks.
 *
 * @param title {string|null=null} Modal Title.
 * @param type {('success' | 'warning' | 'error')} Modal Type.
 * @param content {string|null=null} Body Content of Modal.
 * @param confirmButtonText {string|null=null} Text for Confirm Button.
 * @param cancelButtonText {string|null=null} Text for Cancel Button.
 * @param html {boolean} Use HTML content? else use Text content.
 * @param onConfirm {((e: CustomEvent, modal: FuxcelModal) => void) | null} Callback on confirm button click.
 * @param onCancel {(e: CustomEvent, modal: FuxcelModal) => void | null} Callback on cancel button click.
 * @param onEsc {(e: CustomEvent, modal: FuxcelModal) => void | null} Callback on Escape key used. Only works when cancel button is not available. [i.e. cancelButtonText is null].
 */
fx.modal = function ({ title = null, type = 'success', content = 'Alert Content', confirmButtonText = null, cancelButtonText = null, html = true, onConfirm = null, onCancel = null, onEsc = null } = {}) {
    let alertIconPath, altAlertIcon;
    const initialModal = FuxcelModal.init({ title: title, html: html, content: content, id: 'init', hasFooter: false });
    const modalBody = fx('.fx-modal-body', initialModal);
    const body = document.querySelector('body');
    alertIconPath = type === 'success' ?
        `${Fuxcel.path}/images/ok-24.svg` :
        (type === 'error' ? `${Fuxcel.path}/images/cancel-24.svg` : `${Fuxcel.path}/images/warning-24.svg`);
    altAlertIcon = type === 'success' ? '✅' : (type === 'error' ? '❌' : '⚠️');
    const alertIcon = `<img src="${alertIconPath}" alt="${altAlertIcon}" class="fx-modal-alert-icon">`;
    const buttonsWrapper = (buttons) => `<div class="fx-modal-alert-buttons">${buttons}</div>`;
    const cancelButton = (content) => `<button type="button" id="fx-modal-cancel" class="fx-btn fx-btn-error" data-fx-action="close" data-fx-target="modal">${content}</button>`;
    const confirmButton = (content) => `<button type="button" id="fx-modal-confirm" class="fx-btn fx-btn-primary" data-fx-target="modal">${content}</button>`;
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
        // Trigger the onEsc() function if available and cancel button is not displayed.
        if (!cancelButtonText)
            modal.off().upon('fx.modal.hide', (e) => typeof onEsc === 'function' ? onEsc(e, modal) : null);
        modal.off('click').upon('click', function (e) {
            const clickedTarget = fx(e.target);
            const isCancel = clickedTarget.matchSelector('#fx-modal-cancel');
            const isConfirm = clickedTarget.matchSelector('#fx-modal-confirm');
            // Hide modal if mouse is left-clicked outside the modal content [Trigger clicking on either buttons if any is available].
            fx('.fx-modal-content', modal).hasFocus.then((focused) => {
                if (!focused)
                    cancelButtonText ?
                        document.querySelector('#fx-modal-cancel')?.dispatchEvent(fxModalCancelButtonClick) :
                        document.querySelector('#fx-modal-confirm')?.dispatchEvent(fxModalCancelButtonClick);
            });
            if (isCancel || isConfirm) {
                modal.hide(true);
                modal.off().upon('fx.modal.hide', (e) => isCancel && typeof onCancel === 'function' ? onCancel(e, modal) : (isConfirm && typeof onConfirm === 'function' ? onConfirm(e, modal) : null));
            }
        });
    }
    else {
        // Trigger the onEsc() function if available and cancel button is not displayed.
        if (!cancelButtonText)
            modal.off().upon('fx.modal.hide', (e) => typeof onEsc === 'function' ? onEsc(e, modal) : null);
    }
    return modal;
};
/**
 * Callback on DOMContentLoaded.
 *
 * @param listener {((e: Event) => void)}
 */
fx.onDocumentLoad = (listener) => {
    fx(document).off().upon('DOMContentLoaded', listener);
};
/**
 * Check if given input passes the Luhn Algorithm Test.
 *
 * @param input {any | string | number} input to check.
 * @return {boolean} true if passed; false otherwise.
 */
fx.passLuhnAlgo = (input) => {
    const digitSum = (c) => (c < 10) ? c : digitSum(Math.trunc(c / 10) + (c % 10));
    return input.split('').reverse()
        .map(Number)
        .map((value, index) => index % 2 !== 0 ? digitSum(value * 2) : 2)
        .reduce((previous, current) => previous + current) % 10 === 0;
};
pushPropToWindow('fuxcel', Fuxcel);
FuxcelModal.modalTriggers.length && new FuxcelModal('*');
