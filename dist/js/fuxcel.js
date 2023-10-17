"use strict";
/**
 *
 * @param selector {string|Iterable<any>|any}
 * @param context {string|Iterable<any>|any}
 */
const fx = (selector, context = null) => new Fuxcel(selector, context);
/**
 *
 * @param value {any}
 */
const isBool = (value) => {
    return typeof value === 'boolean';
};
/**
 *
 * @param value {any}
 */
const isString = (value) => {
    return typeof value === 'string' && true;
};
/**
 *
 * @param value
 */
const isObject = (value) => {
    return typeof value === 'object';
};
class FuxcelBase {
    length;
    prev;
    /**
     *
     * @param selector {string|Iterable<any>|any}
     * @param context {string|Iterable<any>|any}
     */
    constructor(selector, context) {
        const fuxcel = this;
        const selectedElements = init();
        const documentDOMArray = fuxcel.#_toArray(document);
        this.length = 0;
        this.prev = { length: 0 };
        documentDOMArray.forEach((value, key) => {
            fuxcel.prev[key] = value;
            fuxcel.prev.length++;
        });
        selectedElements && selectedElements.forEach((value, key) => {
            fuxcel[key] = value;
            this.length++;
        });
        function init() {
            let selected;
            try {
                const _context = context && ((isString(context) ?
                    fuxcel.#_toArray(document.querySelector(context)) :
                    fuxcel.#_toArray(context)))[0];
                if (fuxcel.#_isHTMLElement(selector) || fuxcel.#_isIterable(selector)) {
                    const target = fuxcel.#_toArray(selector);
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
                return context ? _context.querySelectorAll(selector) : document.querySelectorAll(selector);
            }
            catch (e) {
                throw (e);
            }
        }
        return fuxcel;
    }
    get #_constructors() {
        const html = ['html'];
        const iterable = [
            's',
            'fuxcel',
            'jquery',
            'nodelist',
            'collection'
        ];
        return { iterable: iterable, html: html };
    }
    #_isIterable(element) {
        return !!this.#_constructors.iterable.filter(value => value === element.constructor.name.toLowerCase()).length || Array.isArray(element);
    }
    #_isHTMLElement(element) {
        return !!this.#_constructors.html.filter(value => element.constructor.name.toLowerCase().includes(value)).length;
    }
    #_toArray(element) {
        return this.#_isIterable(element) ? Array.from(element) : [element];
    }
    #_setPrev(prevObj) {
        this.prev = new Fuxcel(prevObj);
    }
    get prevObj() {
        return this.prev;
    }
    get toArray() {
        return this.#_toArray(this);
    }
}
class Fuxcel extends FuxcelBase {
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
            // @ts-ignore
            selected.forEach((element) => element.setAttribute(name, value));
        }
        else if (isObject(name)) {
            Object.keys(name).forEach(key => {
                // @ts-ignore
                selected.forEach((element) => element.setAttribute(key, name[key]));
            });
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
            // @ts-ignore
            selected.forEach((element) => element.dataset[name] = value);
        }
        else if (isObject(name)) {
            Object.keys(name).forEach(key => {
                // @ts-ignore
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
            // @ts-ignore
            selected.forEach((element) => element[name] = value);
        }
        else if (isObject(name)) {
            Object.keys(name).forEach(key => {
                // @ts-ignore
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
            // @ts-ignore
            selected.forEach((element) => element.style[name] = value);
        }
        else if (isObject(name)) {
            Object.keys(name).forEach(key => {
                // @ts-ignore
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
     *
     * @param name {string|Object}
     * @param value {string|null}
     * @return {Fuxcel|string}
     */
    attrib(name, value) {
        const selected = this.toArray;
        // @ts-ignore
        return (name && !value && isString(name)) ?
            // @ts-ignore
            selected[0].getAttribute(name) :
            // @ts-ignore
            this.#_setAttrib(name, value);
    }
    /**
     *
     * @param name {string|Object}
     * @param value {boolean|string|null}
     * @return {Fuxcel|string}
     */
    dataAttrib(name, value) {
        const selected = this.toArray;
        const formattedName = this.#_formatDataAttrib(name);
        // @ts-ignore
        return (name && !value && isString(name)) ?
            selected[0].dataset[formattedName] :
            // @ts-ignore
            this.#_setDataAttrib(formattedName, value);
    }
    /**
     *
     * @param name {string|Object}
     * @param value {boolean|string|null}
     * @return {Fuxcel|string}
     */
    prop(name, value) {
        const selected = this.toArray;
        // @ts-ignore
        return (name && !value && isString(name)) ?
            // @ts-ignore
            selected[0][name] :
            // @ts-ignore
            this.#_setProp(name, value);
    }
    /**
     *
     * @param name {string|Object}
     * @param value {boolean|string|null}
     * @return {Fuxcel|string}
     */
    style(name, value) {
        const selected = this.toArray;
        // @ts-ignore
        return (name && !value && isString(name)) ?
            // @ts-ignore
            window.getComputedStyle(selected[0]).getPropertyValue(name) :
            // @ts-ignore
            this.#_setStyle(name, value);
    }
    /**
     * @return Object
     */
    listAttrib() {
        const selected = this.toArray;
        const list = {};
        // @ts-ignore
        Array.from(selected[0].attributes).forEach(attrib => list[attrib.name] = attrib.value);
        return list;
    }
    /**
     * @return Object
     */
    listProp() {
        const selected = this.toArray;
        const list = {};
        // @ts-ignore
        Object.keys(selected[0]).filter(prop => Number.isNaN(parseInt(prop) && selected[0][prop])).forEach(prop => list[prop] = selected[0][prop]);
        return list;
    }
    /**
     *
     * @param name {string[]}
     * @return Fuxcel
     */
    removeAttrib(...name) {
        const selected = this.toArray;
        selected.length && name.length && selected.forEach((element) => name.forEach(attr => element.removeAttribute(attr)));
        return this;
    }
    /**
     *
     * @param name {string[]}
     * @return Fuxcel
     */
    removeDataAttrib(...name) {
        const selected = this.toArray;
        selected.length && name.length && selected.forEach((element) => name.forEach(value => {
            const dataAttr = this.#_formatDataAttrib(value);
            // @ts-ignore
            delete element.dataset[dataAttr];
        }));
        return this;
    }
    /**
     *
     * @param name {string[]}
     * @return Fuxcel
     */
    removeProp(...name) {
        const selected = this.toArray;
        // @ts-ignore
        selected.length && name.length && selected.forEach((element) => name.forEach(prop => element[prop] = null));
        return this;
    }
    children(selector = null) {
        const selected = this.toArray;
        const children = [];
        // @ts-ignore
        Array.from(selected[0].children).forEach((child) => {
            if (isString(selector)) {
                if (fx(child).matchSelector(selector))
                    children.push(child);
            }
            else
                children.push(child);
        });
        return fx(children).#_setPrev(this);
    }
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
     *
     * @param selector {Selector}
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
     *
     * @param selector
     */
    siblings(selector = null) {
        const selected = this.toArray;
        const siblings = [];
        // @ts-ignore
        Array.from(selected[0].parentNode.children).forEach((sibling) => {
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
    hasFocus() {
        // const selected: HTMLElement[] = this.toArray;
        return this.matchSelector(':hover');
    }
    /**
     *
     * @param selector {Selector}
     */
    matchSelector(selector) {
        const selected = this.toArray;
        if (isString(selector))
            return (selected[0].matches || selected[0].webkitMatchesSelector).call(selected[0], selector);
        throw (`Function \`matchSelector()\` expects 1 argument. 0 given`);
    }
}
document.addEventListener('DOMContentLoaded', () => {
    const testDiv = fx('#div');
    console.log(testDiv.siblings());
});
// const input = document.querySelector('.test-input');
// input.setAttribute('type', 'password');
//# sourceMappingURL=fuxcel.js.map