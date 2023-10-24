"use strict";
const listenerArray = [];
const listenerObject = {};
const listenerObjectRemoveList = {};
const validatorErrorBag = {};
const validatorErrorCount = {};
/**
 *
 * @param selector {string|Iterable<any>|any}
 * @param context {string|Iterable<any>|any}
 */
const fx = (selector, context = null) => new Fuxcel(selector, context);
/*const fxValidator = (selector: string | Iterable<any> | any, context: string | Iterable<any> | any = null): FuxcelValidator => new FuxcelValidator(selector, context);*/
/**
 *
 * @param value {any}
 */
const isBool = (value) => {
    return typeof value === 'boolean';
};
const isFunction = (value) => {
    return typeof value === 'function';
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
// @ts-ignore
String.prototype.toTitleCase = function () {
    const value = this;
    let titleCased = '', valueSplit = value.split(/([ _-])/gi);
    valueSplit.forEach((word, index) => {
        word = word.toLowerCase();
        let wordSplit = word.split(''), firstChar = wordSplit[0];
        wordSplit[0] = firstChar.toUpperCase();
        titleCased += wordSplit.join('');
    });
    return String(titleCased);
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
            'fuxcelvalidator',
            'jquery',
            'nodelist',
            'collection'
        ];
        return { iterable: iterable, html: html };
    }
    get #_fuxcel() {
        return new Fuxcel(this);
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
    get fieldAttributes() {
        const selected = this.toArray;
        return {
            // @ts-ignore
            id: selected[0].getAttribute('id') && selected[0].getAttribute('id').toLowerCase(),
            // @ts-ignore
            type: selected[0].getAttribute('type') && selected[0].getAttribute('type').toLowerCase(),
            // @ts-ignore
            fxId: selected[0].getAttribute('type') && selected[0].getAttribute('type').toLowerCase(),
            // @ts-ignore
            fxRole: selected[0].getAttribute('type') && selected[0].getAttribute('type').toLowerCase(),
            // @ts-ignore
            formId: selected[0].form && selected[0].form.id && selected[0].form.id.toLowerCase()
        };
    }
    get prevObj() {
        return this.prev;
    }
    get toArray() {
        if (!this.length)
            throw ('No element selected');
        return this.#_toArray(this);
    }
    static eventListenerBag() {
        return listenerObject;
    }
    static get isMobileDevice() {
        return navigator.userAgent.toLowerCase().includes('mobile');
    }
    static get pointerIsTouch() {
        return window.matchMedia("(pointer: coarse)").matches;
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
        // @ts-ignore
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
    get resetFuxcelObject() {
        const selectedElements = this.toArray;
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
        selectedElements.forEach((value, index) => {
            // @ts-ignore
            this[index] = value;
            this.length++;
        });
        return this;
    }
    get classes() {
        const selected = this.toArray;
        return selected[0].classList;
    }
    get hasFocus() {
        const selected = this.toArray;
        const selector = Fuxcel.pointerIsTouch ? ':focus' : ':hover';
        return new Promise(async (resolve) => {
            await selected.forEach((element) => resolve(fx(element).matchSelector(selector)));
        });
    }
    get innerHTML() {
        const selected = this.toArray;
        return selected[0].innerHTML;
    }
    get outerHTML() {
        const selected = this.toArray;
        return selected[0].outerHTML;
    }
    get formValidator() {
        return new FuxcelValidator(this);
    }
    putClass(...tokenList) {
        const selected = this.toArray;
        selected.forEach((element) => tokenList.forEach(token => element.classList.add(token)));
        return this;
    }
    replaceClass(oldToken, newToken) {
        const selected = this.toArray;
        selected.forEach((element) => (element.classList.contains(oldToken) ?
            element.classList.replace(oldToken, newToken) :
            element.classList.add(newToken)));
        return this;
    }
    removeClass(...tokenList) {
        const selected = this.toArray;
        selected.forEach((element) => tokenList.forEach(token => element.classList.remove(token)));
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
    hasScrollBar(direction = 'vertical') {
        const selected = this.toArray;
        let scrollType = { vertical: 'scrollHeight', horizontal: 'scrollWidth' }, clientType = { vertical: 'clientHeight', horizontal: 'clientWidth' };
        // @ts-ignore
        if (isString(direction) && scrollType[direction])
            // @ts-ignore
            return selected[0][scrollType[direction]] > selected[0][clientType[direction]];
        throw (`Function \`asScrollBar()\` expects 1 argument. 0 given.`);
    }
    insertHTML(value, position = null) {
        const selected = this.toArray;
        const positions = {
            affix: 'beforebegin',
            prefix: 'afterbegin',
            postfix: 'afterend',
            suffix: 'beforeend'
        };
        // @ts-ignore
        if (isString(position) && !positions[position])
            throw (`Invalid position option given. Valid position options:\n'affix',\n'prefix',\n'postfix',\n'suffix'`);
        // @ts-ignore
        selected.forEach((element) => isString(position) ? element.insertAdjacentHTML(positions[position], value) : element.innerHTML = value);
        return this;
    }
    /**
     *
     * @param tagName {string}
     */
    isElement(tagName) {
        const selected = this.toArray;
        if (isString(tagName))
            return selected[0].tagName.toLowerCase() === tagName.toLowerCase();
        throw (`Function \`matchSelector()\` expects 1 string argument. 0 given`);
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
    off(event) {
        const selected = this.toArray;
        selected.forEach((element) => {
            // @ts-ignore
            (element.listeners) && element.listeners.forEach((listener, index) => {
                if (isString(event)) {
                    if (listener.event.toLowerCase() === event?.toLowerCase()) {
                        element.removeEventListener(listener.event, listener.listener, listener.option);
                        // @ts-ignore
                        element.listeners.splice(index, 1);
                    }
                }
                else {
                    element.removeEventListener(listener.event, listener.listener, listener.option);
                    // @ts-ignore
                    delete element.listeners;
                }
            });
        });
        /*// @ts-ignore
        const lastKeyIndex = Object.keys(listenerObjectRemoveList).length - 1;
        // @ts-ignore
        const lastKey = lastKeyIndex === -1 ? -1 : parseInt(Object.keys(listenerObjectRemoveList)[lastKeyIndex]);
        const nextKey = lastKey + 1;
        
        selected.forEach((element: HTMLElement) => {
            let elementHasEvent = false;
            // @ts-ignore
            Object.keys(listenerObjectRemoveList).length && (elementHasEvent = !!Object.keys(listenerObjectRemoveList).filter(key => listenerObjectRemoveList[key]['element'] === element && listenerObjectRemoveList[key]['event'] === event).length);
            // @ts-ignore
            !elementHasEvent && (listenerObjectRemoveList[nextKey] = {element: element, event: event});
        });
        
        console.log(listenerObjectRemoveList)*/
        return this;
    }
    upon(events, listener, option = true) {
        const selected = this.toArray;
        if (isObject(events) && listener === undefined)
            listener = true;
        selected.forEach((element) => {
            // @ts-ignore
            if (!element.listeners)
                // @ts-ignore
                element.listeners = [];
            if (isObject(events))
                Object.keys(events).forEach(event => {
                    // @ts-ignore
                    element.addEventListener(event, events[event], listener);
                    // @ts-ignore
                    element.listeners.push({ element: element, listener: events[event], event: event, option: listener });
                });
            else {
                // @ts-ignore
                element.addEventListener(events, listener, option);
                // @ts-ignore
                element.listeners.push({ element: element, listener: listener, event: events, option: option });
            }
        });
        return this;
    }
}
class FuxcelValidator extends Fuxcel {
    _defaultConfig = {
        regExp: {
            name: /^([a-zA-Z]{2,255})(\s[a-zA-Z]{2,255}){1,2}$/gi,
            username: /^[a-zA-Z]+(_?[a-zA-Z]){2,255}$/gi,
            email: /^\w+([.-]?\w+)*@\w+([.-]?\w{2,3})*(\.\w{2,3})$/gi,
            phone: /^(\+\d{1,3}?\s)(\(\d{3}\)\s)?(\d+\s)*(\d{2,3}-?\d+)+$/g,
            cardCVV: /[0-9]{3,4}$/gi,
            cardNumber: /^[0-9]+$/gi,
        },
        texts: {
            capslock: 'Capslock active',
        },
        config: {
            showIcons: true,
            showPassword: true,
            capslockAlert: true,
            validateCard: false,
            validateName: false,
            validateEmail: true,
            validatePhone: false,
            validatePassword: true,
            validateUsername: false,
            nativeValidation: false,
            useDefaultStyling: true,
            passwordId: 'password',
            passwordConfirmId: 'password_confirmation',
            initWrapper: '.form-group',
        }
    };
    #_fxValidatorConfig = this._defaultConfig;
    constructor(selector, context) {
        super(selector, context);
    }
    #_toggleValidationIcons(oldIcon, newIcon) {
        const _oldIcon = fx(oldIcon);
        const _newIcon = fx(newIcon);
        if (_oldIcon.length && _newIcon.length) {
            if (_oldIcon.style('display') !== 'none')
                _oldIcon.style({ animation: 'fadeOut 500ms linear', display: 'none' });
            _newIcon.style({ display: 'inline-block', animation: 'fadeIn 500ms linear' });
        }
    }
    #_placeElements(configObject, form, formGroup, expectedFieldElement, expectedLabelElement, _fieldElement) {
        const fieldGroupId = `${expectedFieldElement.id}_group`;
        const validationText = document.createElement('div');
        validationText.classList.add('validation-text');
        validationText.innerHTML = '<small>&nbsp;</small>';
        formGroup.setAttribute('id', fieldGroupId);
        if (configObject.config.useDefaultStyling) {
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
            if (configObject.config.showIcons) {
                const imageCheck = new Image();
                const imageClose = new Image();
                imageCheck.src = 'images/ok-24.svg';
                imageClose.src = 'images/cancel-24.svg';
                imageCheck.setAttribute('alt', 'success');
                imageClose.setAttribute('alt', 'error');
                imageCheck.setAttribute('width', '22px');
                imageClose.setAttribute('width', '22px');
                imageCheck.classList.add('valid');
                imageClose.classList.add('invalid');
                validationIcons.classList.add('validation-icons');
                validationIcons.append(imageCheck, imageClose);
            }
            if (configObject.config.showPassword) {
                if (_fieldElement.attrib('type') && _fieldElement.attrib('type').toString().toLowerCase() === 'password') {
                    const showPassword = new Image();
                    const hidePassword = new Image();
                    showPassword.src = 'images/eye-24.png';
                    hidePassword.src = 'images/invisible-24.png';
                    showPassword.setAttribute('alt', 'show-password-toggle');
                    hidePassword.setAttribute('alt', 'hide-password-toggle');
                    showPassword.setAttribute('width', '22px');
                    hidePassword.setAttribute('width', '22px');
                    togglePasswordIcons.classList.add('toggle-password-icons');
                    togglePasswordIcons.append(showPassword, hidePassword);
                }
            }
            newFieldGroup.append(expectedFieldElement, expectedLabelElement);
            if (configObject.config.showPassword && configObject.config.showIcons)
                if (_fieldElement.attrib('type') && _fieldElement.attrib('type').toString().toLowerCase() === 'password')
                    newInputGroupWrapper.append(newFieldGroup, togglePasswordIcons, validationIcons);
                else
                    newInputGroupWrapper.append(newFieldGroup, validationIcons);
            else {
                if (_fieldElement.attrib('type') && _fieldElement.attrib('type').toString().toLowerCase() === 'password' && configObject.config.showPassword)
                    newInputGroupWrapper.append(newFieldGroup, togglePasswordIcons);
                else if (configObject.config.showIcons)
                    newInputGroupWrapper.append(newFieldGroup, validationIcons);
                else
                    newInputGroupWrapper.append(newFieldGroup);
            }
            newInputGroup.append(newInputGroupWrapper);
            newFormGroupWrapper.append(newInputGroup, validationText);
            formGroup.append(newFormGroupWrapper);
        }
        else {
            formGroup.append(validationText);
        }
        validationText.setAttribute('id', `${expectedFieldElement.id}Valid`);
        return formGroup;
    }
    #_initValidateForms(forms) {
        forms.forEach((form, index) => {
            const _currentForm = fx(form).formValidator;
            if (!_currentForm.attrib('id'))
                _currentForm.attrib({ id: `current-form-${index}` });
            let formId = _currentForm.attrib('id'), formGroups = fx(`#${formId} .form-group`).formValidator;
            // @ts-ignore
            validatorErrorBag[formId] = {};
            // @ts-ignore
            validatorErrorCount[formId] = {};
            console.log(validatorErrorBag);
            if (formGroups.length)
                formGroups.toArray.forEach((formGroup) => {
                    const configObject = this.#_fxValidatorConfig;
                    const inputElement = 'input.form-field', selectElement = 'select.form-field', textAreaElement = 'textarea.form-field';
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
                                _fieldElement.attrib({ placeholder: _fieldElement.attrib('name').toString().replaceAll('-', '_') });
                            if (!_labelElement.attrib('for'))
                                _labelElement.attrib('for', fieldElementId);
                            // @ts-ignore
                            const expectedFieldElement = _fieldElement[0];
                            // @ts-ignore
                            const expectedLabelElement = _labelElement[0];
                            formGroup = this.#_placeElements(configObject, form, formGroup, expectedFieldElement, expectedLabelElement, _fieldElement);
                            let _inputElement = fx(inputElement, formGroup), _selectElement = fx(selectElement, formGroup), _textAreaElement = fx(textAreaElement, formGroup);
                            _inputElement.off().upon({
                                input: function () {
                                    const _input = fx(this).formValidator;
                                    const fxId = _input.dataAttrib('fx-id') && _input.dataAttrib('id').toLowerCase();
                                    const fxRole = _input.dataAttrib('fx-role') && _input.dataAttrib('role').toLowerCase();
                                    const elementId = _input.attrib('id') && _input.attrib('id').toLowerCase();
                                    const elementType = _input.attrib('type') && _input.attrib('type').toLowerCase();
                                    const filterField = new Set(['name', 'username', 'card_cvv', 'card_number']);
                                    const filterFieldType = new Set(['date', 'datetime', 'email', 'month']);
                                    if (_input.canBeValidated) {
                                        if (!filterFieldType.has(elementType) && !filterFieldType.has(fxRole) && !filterField.has(elementId) && !filterField.has(fxRole) && !filterField.has(fxId))
                                            if (_input.isPasswordField) {
                                            }
                                            else
                                                _input.validateField();
                                        if (_input.isEmailField)
                                            configObject.config.validateEmail ? _input.validateEmail(configObject.regExp.email) : _input.toggleValidation();
                                    }
                                }
                            });
                        }
                    }
                });
            else
                console.error(`init-wrapper element not found in form: #${formId}`);
        });
        return fx(forms).formValidator;
    }
    init(config = null) {
        const selected = this.toArray;
        let forms = selected.filter((element) => fx(element).isElement('form')), nonForms = selected.filter((element) => !fx(element).isElement('form'));
        if (forms.length) {
            if (nonForms.length)
                console.error(`${nonForms.length} non form-element${nonForms.length === 1 ? '' : 's'} passed to validator:`, nonForms);
            return this.#_initValidateForms(forms);
        }
        else {
            console.error(`Non form-elements passed to the validator`, nonForms);
            throw (`${nonForms.length} non form-element${nonForms.length === 1 ? '' : 's'} passed to validator.`);
        }
    }
    get canBeValidated() {
        const selected = this.toArray;
        return selected.length ? (this.dataAttrib('fx-validate') ? parseBool(this.dataAttrib('fx-validate')) : true) : false;
    }
    get isEmailField() {
        const attributes = this.fieldAttributes;
        return attributes.type?.includes('email') || attributes.type?.includes('email') || attributes.id?.includes('email') || attributes.fxId?.includes('email') || attributes.fxRole?.includes('email');
    }
    get isPasswordField() {
        const passwordId = this.#_fxValidatorConfig.config.passwordId;
        const attributes = this.fieldAttributes;
        return attributes.type === 'password' || attributes.id?.includes(passwordId.toLowerCase()) || attributes.fxId?.includes(passwordId.toLowerCase()) || attributes.fxRole?.includes(passwordId.toLowerCase());
    }
    get isPhoneField() {
        const attributes = this.fieldAttributes;
        return attributes.type?.includes('tel') || attributes.type?.includes('phone') || attributes.id?.includes('phone') || attributes.fxId?.includes('phone') || attributes.fxRole?.includes('phone');
    }
    get isUsernameField() {
        const attributes = this.fieldAttributes;
        return attributes.id?.includes('username') || attributes.fxId?.includes('username') || attributes.fxRole?.includes('username');
    }
    get validationProps() {
        const configObject = this.#_fxValidatorConfig;
        const formGroup = configObject.config.initWrapper;
        const formId = `#${this.fieldAttributes.formId}`;
        const elementId = `#${this.fieldAttributes.id}`;
        // this.validateRegex(/[-_]/, '');
        if (formId)
            return {
                id: elementId,
                formGroup: `${formId} ${formGroup + elementId}_group`,
                validationField: `${formId} ${elementId}Valid`,
                validIcon: `${formId} ${formGroup + elementId}_group .validation-icons > .valid`,
                invalidIcon: `${formId} ${formGroup + elementId}_group .validation-icons > .invalid`,
                validationIconField: `${formId} ${formGroup + elementId}_group .validation-icons`,
            };
        throw ('NonForm element given');
    }
    validateRegex(regExpOrFn, message) {
        const selected = this.toArray;
        if (regExpOrFn && isFunction(regExpOrFn)) { // @ts-ignore
            regExpOrFn(this);
        }
        else {
            if (regExpOrFn && isString(message))
                // @ts-ignore
                if (selected[0].value.length) {
                    // @ts-ignore
                    if (selected[0].value.match(regExpOrFn))
                        this.validateField();
                    else
                        this.validateField(message, true);
                }
                else
                    this.validateField();
            else
                console.error('Function \`validateRegex()\` expects 2 arguments.');
        }
        return this;
    }
    validateEmail(regExp, customFormatEx = null) {
        /*return this.validateRegex(regExp, `Invalid E-Mail format: (eg. ${customFormatEx ?? 'johndoe@email.com'})`);*/
        return this.validateRegex(() => {
            this.validateField();
        });
    }
    validateField(message = null, isError = false) {
        const selected = this;
        // @ts-ignore
        const target = selected[0];
        // @ts-ignore
        const formId = selected[0].form.id, elementId = selected[0].id, tagName = selected[0].tagName.toLowerCase();
        let fieldValue = target.value, minLength = parseInt(selected.attrib('minlength')), fieldName = elementId.toString().toTitleCase().replaceAll(/[_-]/gi, ' '), finalMessage = minLength ?
            (!isString(message) && fieldValue.length && fieldValue.length < minLength ? `The ${fieldName} requires a minimum of ${minLength} characters.` : message) :
            (!isString(message) ? (selected.isPasswordField ? (fieldValue.length ? 'Ensure passwords.' : `The ${fieldName} field is required.`) : (!fieldValue.length ? `The ${fieldName} field is required.` : null)) : message);
        if (!fieldValue || !fieldValue.length || fieldValue.length < minLength || (selected.isPasswordField && (!fieldValue.length || finalMessage)) || isError)
            selected.showError(finalMessage);
        else
            selected.showSuccess(finalMessage);
        return this;
    }
    showError(message = null) {
        const fieldAttribs = this.fieldAttributes;
        const validationProps = this.validationProps;
        // @ts-ignore
        const finalMessage = message ?? `The ${fieldAttribs.id?.toString().toTitleCase().replaceAll(/[_-]/gi, ' ')} field is requires=d`;
        // @ts-ignore
        Object.keys(validatorErrorBag).length && (validatorErrorBag[fieldAttribs.formId][fieldAttribs.id] = finalMessage);
        this.#_fxValidatorConfig.config.showIcons && this.#_toggleValidationIcons(validationProps.validIcon, validationProps.invalidIcon);
        fx(validationProps.validationField).formValidator.renderMessage(finalMessage ?? null);
        if (this.#_fxValidatorConfig.config.useDefaultStyling)
            fx(`${validationProps.formGroup} .form-group-wrapper`).replaceClass('success', 'error');
        else
            fx(validationProps.formGroup).replaceClass('success', 'error');
    }
    showSuccess(message = null) {
        const fieldAttribs = this.fieldAttributes;
        const validationProps = this.validationProps;
        // @ts-ignore
        Object.keys(validatorErrorBag).length && delete validatorErrorBag[fieldAttribs.formId][fieldAttribs.id];
        this.#_fxValidatorConfig.config.showIcons && this.#_toggleValidationIcons(validationProps.invalidIcon, validationProps.validIcon);
        fx(validationProps.validationField).formValidator.renderMessage(message ?? null);
        if (this.#_fxValidatorConfig.config.useDefaultStyling)
            fx(`${validationProps.formGroup} .form-group-wrapper`).replaceClass('error', 'success');
        else
            fx(validationProps.formGroup).replaceClass('error', 'success');
    }
    undoValidation(destroyValidation = false) {
        const selected = this;
        const fieldAttribs = selected.fieldAttributes;
        const validationProps = selected.validationProps;
        if (destroyValidation) {
            // @ts-ignore
            delete validatorErrorBag[fieldAttribs.formId][fieldAttribs.id];
            // @ts-ignore
            validatorErrorCount[fieldAttribs.formId] = Object.keys(validatorErrorCount[fieldAttribs.formId]).length;
        }
        if (selected.#_fxValidatorConfig.config.useDefaultStyling)
            fx(`${validationProps.formGroup} .form-group-wrapper`).removeClass('error', 'success');
        else
            fx(validationProps.formGroup).removeClass('error', 'success');
        return this;
    }
    toggleValidation() {
        return this.canBeValidated ? this.validateField() : this.undoValidation();
    }
    renderMessage(message = null, renderType = null) {
        this.insertHTML(`<small class="${renderType}">${message ?? '&nbsp;'}</small>`);
        return this;
    }
}
document.addEventListener('DOMContentLoaded', () => {
    const body = document.querySelector('body');
    const testElement = fx('form');
    testElement.formValidator.isPasswordField;
    testElement.formValidator.init({
        config: {
            useDefaultStyling: false
        }
    });
});
//# sourceMappingURL=fuxcel.js.map