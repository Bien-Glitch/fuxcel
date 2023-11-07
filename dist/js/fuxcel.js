"use strict";
const fx = (selector, context = null) => new Fuxcel(selector, context);
const isBool = (value) => {
    return typeof value === 'boolean';
};
const isFunction = (value) => {
    return typeof value === 'function';
};
const isString = (value) => {
    return typeof value === 'string' && true;
};
const isObject = (value) => {
    return typeof value === 'object';
};
const passLuhnAlgo = (input) => {
    const digitSum = (c) => (c < 10) ? c : digitSum(Math.trunc(c / 10) + (c % 10));
    return input.split('').reverse()
        .map(Number)
        .map((value, index) => index % 2 !== 0 ? digitSum(value * 2) : 2)
        .reduce((previous, current) => previous + current) % 10 === 0;
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
                return context && _context ? _context.querySelectorAll(selector) : document.querySelectorAll(selector);
            }
            catch (e) {
                console.trace(e);
            }
        }
        return fuxcel;
    }
    #_isIterable(element) {
        return !!FuxcelBase.#_constructors.iterable.filter(value => value === element.constructor.name.toLowerCase()).length || Array.isArray(element);
    }
    #_isHTMLElement(element) {
        return !!FuxcelBase.#_constructors.html.filter(value => element.constructor.name.toLowerCase().includes(value)).length;
    }
    #_toArray(element) {
        return this.#_isIterable(element) ? Array.from(element) : [element];
    }
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
    get prevObj() {
        return this.prev;
    }
    get toArray() {
        if (!this.length)
            console.trace('No element selected');
        return this.#_toArray(this);
    }
    static get #_constructors() {
        const html = ['html'];
        const iterable = [
            'fuxcel',
            'fuxcelbase',
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
    static get isMobileDevice() {
        return navigator.userAgent.toLowerCase().includes('mobile');
    }
    static get pointerIsTouch() {
        return window.matchMedia("(pointer: coarse)").matches;
    }
}
class Fuxcel extends FuxcelBase {
    static pluginPath = './';
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
            Object.keys(name).forEach(key => {
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
    static get path() {
        return Fuxcel.pluginPath.replace(/\/$/, '');
    }
    static set path(path) {
        Fuxcel.pluginPath = path;
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
    attrib(name, value) {
        const selected = this.toArray;
        return (name && !value && isString(name)) ?
            selected[0].getAttribute(name) :
            this.#_setAttrib(name, value);
    }
    dataAttrib(name, value) {
        const selected = this.toArray;
        const formattedName = this.#_formatDataAttrib(name);
        return (name && !value && isString(name)) ?
            selected[0].dataset[formattedName] :
            this.#_setDataAttrib(formattedName, value);
    }
    prop(name, value) {
        const selected = this.toArray;
        return (name && !value && isString(name)) ?
            selected[0][name] :
            this.#_setProp(name, value);
    }
    style(name, value) {
        const selected = this.toArray;
        return (name && !value && isString(name)) ?
            window.getComputedStyle(selected[0]).getPropertyValue(name) :
            this.#_setStyle(name, value);
    }
    listAttrib() {
        const selected = this.toArray;
        const list = {};
        Array.from(selected[0].attributes).forEach(attrib => list[attrib.name] = attrib.value);
        return list;
    }
    listProp() {
        const selected = this.toArray;
        const list = {};
        Object.keys(selected[0]).filter(prop => Number.isNaN(parseInt(prop) && selected[0][prop])).forEach(prop => list[prop] = selected[0][prop]);
        return list;
    }
    removeAttrib(...name) {
        const selected = this.toArray;
        selected.length && name.length && selected.forEach((element) => name.forEach(attr => element.removeAttribute(attr)));
        return this;
    }
    removeDataAttrib(...name) {
        const selected = this.toArray;
        selected.length && name.length && selected.forEach((element) => name.forEach(value => {
            const dataAttr = this.#_formatDataAttrib(value);
            delete element.dataset[dataAttr];
        }));
        return this;
    }
    removeProp(...name) {
        const selected = this.toArray;
        selected.length && name.length && selected.forEach((element) => name.forEach(prop => element[prop] = null));
        return this;
    }
    children(selector = null) {
        const selected = this.toArray;
        const children = [];
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
    siblings(selector = null) {
        const selected = this.toArray;
        const siblings = [];
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
        if (isString(direction) && scrollType[direction])
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
        if (isString(position) && !positions[position])
            throw (`Invalid position option given. Valid position options:\n'affix',\n'prefix',\n'postfix',\n'suffix'`);
        selected.forEach((element) => isString(position) ? element.insertAdjacentHTML(positions[position], value) : element.innerHTML = value);
        return this;
    }
    isElement(tagName) {
        const selected = this.toArray;
        if (isString(tagName))
            return selected[0].tagName.toLowerCase() === tagName.toLowerCase();
        throw (`Function \`matchSelector()\` expects 1 string argument. 0 given`);
    }
    matchSelector(selector) {
        const selected = this.toArray;
        if (isString(selector))
            return (selected[0].matches || selected[0].webkitMatchesSelector).call(selected[0], selector);
        throw (`Function \`matchSelector()\` expects 1 argument. 0 given`);
    }
    off(event) {
        const selected = this.toArray;
        selected.forEach((element) => {
            (element.listeners) && element.listeners.forEach((listener, index) => {
                if (isString(event)) {
                    if (listener.event.toLowerCase() === event?.toLowerCase()) {
                        element.removeEventListener(listener.event, listener.listener, listener.option);
                        element.listeners.splice(index, 1);
                    }
                }
                else {
                    element.removeEventListener(listener.event, listener.listener, listener.option);
                    delete element.listeners;
                }
            });
        });
        return this;
    }
    upon(events, listener, option = true) {
        const selected = this.toArray;
        if (isObject(events) && listener === undefined)
            listener = true;
        selected.forEach((element) => {
            if (!element.listeners)
                element.listeners = [];
            if (isObject(events))
                Object.keys(events).forEach(event => {
                    element.addEventListener(event, events[event], listener);
                    element.listeners.push({ element: element, listener: events[event], event: event, option: listener });
                });
            else {
                element.addEventListener(events, listener, option);
                element.listeners.push({ element: element, listener: listener, event: events, option: option });
            }
        });
        return this;
    }
    value(value = null) {
        const selected = this.toArray;
        if (value) {
            selected.forEach((element) => element.value = value);
            return this;
        }
        return selected[0].value;
    }
    formSubmit() {
    }
}
class FuxcelValidator extends Fuxcel {
    #_fxValidatorConfig = FuxcelValidator.defaultValidatorConfig;
    #_initSteps = false;
    static #_defaultConfig = {
        regExp: {
            cardCVV: /[0-9]{3,4}$/gi,
            cardNumber: /^[0-9]+$/gi,
            email: /^\w+([.-]?\w+)*@\w+([.-]?\w{2,3})*(\.\w{2,3})$/gi,
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
            useDefaultStyling: true,
            passwordConfirmId: 'password_confirmation',
            passwordId: 'password',
            initWrapper: '.form-group',
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
    static #_stepsClass = '.fx-step';
    static #_validatorErrorBag = {};
    static #_validatorErrorCount = {};
    constructor(selector, context) {
        super(selector, context);
    }
    static #_toggleValidationIcons(oldIcon, newIcon) {
        const _oldIcon = fx(oldIcon);
        const _newIcon = fx(newIcon);
        if (_oldIcon.length && _newIcon.length) {
            if (_oldIcon.style('display') !== 'none')
                _oldIcon.style({ animation: 'fadeOut 500ms linear', display: 'none' });
            _newIcon.style({ display: 'inline-block', animation: 'fadeIn 500ms linear' });
        }
    }
    #_initValidateForms(forms) {
        forms.forEach((form, index) => {
            const that = this;
            const configObject = this.validatorConfig;
            const _currentForm = fx(form).formValidator;
            if (!_currentForm.attrib('id'))
                _currentForm.attrib({ id: `current-form-${index}` });
            let formId = _currentForm.attrib('id'), formGroups = fx(`#${formId} .form-group`).formValidator;
            FuxcelValidator.#_validatorErrorBag[formId] = {};
            FuxcelValidator.#_validatorErrorCount[formId] = 0;
            configObject.config.nativeValidation ? _currentForm.prop({ noValidate: false }) : _currentForm.prop({ noValidate: true });
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
                                    console.error(`${_fieldElement[0].tagName} element has no \`id\` or \`name\` attribute`, _fieldElement);
                                    throw (`Field element does not have an \`id\` or \`name\` attribute`);
                                }
                            const fieldElementId = _fieldElement.attrib('id');
                            if (_fieldElement.prop('tagName').toString().toLowerCase() === 'input' && !_fieldElement.attrib('placeholder'))
                                _fieldElement.attrib({ placeholder: _fieldElement.attrib('name').toString().toTitleCase().replaceAll(/[_-]/gi, ' ') });
                            if (!_labelElement.attrib('for'))
                                _labelElement.attrib('for', fieldElementId);
                            const expectedFieldElement = _fieldElement[0];
                            const expectedLabelElement = _labelElement[0];
                            formGroup = this.#_placeElements(configObject, form, formGroup, expectedFieldElement, expectedLabelElement, _fieldElement);
                            this.#_validate(that, formGroup);
                        }
                    }
                });
            else
                console.error(`init-wrapper element not found in form: #${formId}`);
        });
        return this.#_resetFuxcelObject(fx(forms));
    }
    #_manipulateErrorBag(MessageOrRemove) {
        const fieldAttribs = this.fieldAttributes;
        if (isBool(MessageOrRemove) && MessageOrRemove)
            Object.keys(FuxcelValidator.#_validatorErrorBag).length && (this.#_initSteps ?
                (Object.keys(FuxcelValidator.#_validatorErrorBag[fieldAttribs.formId]).length && (delete FuxcelValidator.#_validatorErrorBag[fieldAttribs.formId][this.stepFromField][fieldAttribs.id])) :
                delete FuxcelValidator.#_validatorErrorBag[fieldAttribs.formId][fieldAttribs.id]);
        else {
            if (isString(MessageOrRemove))
                Object.keys(FuxcelValidator.#_validatorErrorBag).length && (this.#_initSteps ?
                    (Object.keys(FuxcelValidator.#_validatorErrorBag[fieldAttribs.formId]).length && (FuxcelValidator.#_validatorErrorBag[fieldAttribs.formId][this.stepFromField][fieldAttribs.id] = MessageOrRemove)) :
                    FuxcelValidator.#_validatorErrorBag[fieldAttribs.formId][fieldAttribs.id] = MessageOrRemove);
        }
        this.#_manipulateErrorCount();
    }
    #_manipulateErrorCount() {
        const fieldAttribs = this.fieldAttributes;
        Object.keys(FuxcelValidator.#_validatorErrorCount).length && (this.#_initSteps ?
            (Object.keys(FuxcelValidator.#_validatorErrorCount[fieldAttribs.formId]).length && (FuxcelValidator.#_validatorErrorCount[fieldAttribs.formId][this.stepFromField] = Object.keys(FuxcelValidator.#_validatorErrorBag[fieldAttribs.formId][this.stepFromField]).length)) :
            FuxcelValidator.#_validatorErrorCount[fieldAttribs.formId] = Object.keys(FuxcelValidator.#_validatorErrorBag[fieldAttribs.formId]).length);
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
                imageCheck.src = `${Fuxcel.path}/images/ok-24.svg`;
                imageClose.src = `${Fuxcel.path}/images/cancel-24.svg`;
                imageCheck.setAttribute('alt', 'V');
                imageClose.setAttribute('alt', 'X');
                imageCheck.setAttribute('width', '22px');
                imageClose.setAttribute('width', '22px');
                imageCheck.classList.add('fx-valid-icon');
                imageClose.classList.add('fx-invalid-icon');
                validationIcons.classList.add('validation-icons');
                validationIcons.append(imageCheck, imageClose);
            }
            if (configObject.config.showPassword) {
                if (_fieldElement.attrib('type') && _fieldElement.attrib('type').toString().toLowerCase() === 'password') {
                    const showPassword = new Image();
                    const hidePassword = new Image();
                    showPassword.src = './images/eye-24.png';
                    hidePassword.src = './images/invisible-24.png';
                    showPassword.setAttribute('alt', 'show-password-toggle');
                    hidePassword.setAttribute('alt', 'hide-password-toggle');
                    showPassword.setAttribute('width', '22px');
                    hidePassword.setAttribute('width', '22px');
                    showPassword.classList.add('fx-show-password-icon');
                    hidePassword.classList.add('fx-hide-password-icon');
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
            newFieldGroup.style.height = `${expectedFieldElement.getBoundingClientRect().height * 2}px`;
            fx(expectedLabelElement, form).style({
                height: '100%',
                display: 'flex',
                alignItems: 'center'
            });
        }
        else
            formGroup.append(validationText);
        validationText.setAttribute('id', `${expectedFieldElement.id}Valid`);
        return formGroup;
    }
    #_resetFuxcelObject(elements) {
        const documentDOMArray = fx(document).toArray;
        Object.keys(this).forEach(key => delete this[key]);
        this.length = 0;
        this.prev = { length: 0 };
        documentDOMArray.forEach((value, key) => {
            this.prev[key] = value;
            this.prev.length++;
        });
        elements.toArray.forEach((value, index) => {
            this[index] = value;
            this.length++;
        });
        return this;
    }
    #_touchConfig(config) {
        const validatorConfigObject = this.validatorConfig;
        Object.keys(validatorConfigObject).forEach((key) => {
            if (key in config && isObject(config[key])) {
                const validatorConfigOptionObject = validatorConfigObject[key];
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
    #_validate(that, formGroup) {
        const inputElement = 'input.form-field', selectElement = 'select.form-field', textAreaElement = 'textarea.form-field';
        const configObject = that.#_fxValidatorConfig;
        let refillRequired, passwordToggle = FuxcelValidator.passwordTogglerIconClass, _inputElement = fx(inputElement, formGroup), _selectElement = fx(selectElement, formGroup), _textAreaElement = fx(textAreaElement, formGroup), _element = that.#_resetFuxcelObject(_inputElement.length ? _inputElement : (_selectElement.length ? _selectElement : _textAreaElement)), _passwordToggle = fx(passwordToggle, formGroup), showPasswordToggle = `#${formGroup.id} ${passwordToggle} > .fx-show-password-icon`, hidePasswordToggle = `#${formGroup.id} ${passwordToggle} > .fx-hide-password-icon`;
        _inputElement.length && _inputElement.off().upon({
            blur: function () {
                const _input = that.#_resetFuxcelObject(fx(this));
                if (configObject.config.showPassword && _passwordToggle.length)
                    if (_input.isPasswordField)
                        _passwordToggle.hasFocus.then((focused) => {
                            if (!focused && _input.value()?.length) {
                                _passwordToggle.dataAttrib('require-refill', 'true');
                                refillRequired = parseBool(_passwordToggle.dataAttrib('require-refill'));
                                fx(`${showPasswordToggle}, ${hidePasswordToggle}`).style({ animation: 'fadeOut 500ms linear', display: 'none' });
                            }
                        });
                _input.#_resetFuxcelObject(fx(_input[0].form));
            },
            focus: function () {
                const _input = that.#_resetFuxcelObject(fx(this));
                if (configObject.config.showPassword && _passwordToggle.length)
                    if (_input.isPasswordField)
                        _passwordToggle.hasFocus.then((focused) => {
                            if (!focused && _input.value()?.length) {
                                _passwordToggle.dataAttrib('require-refill', 'true');
                                refillRequired = parseBool(_passwordToggle.dataAttrib('require-refill'));
                            }
                        });
                _input.#_resetFuxcelObject(fx(_input[0].form));
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
                        configObject.config.validateEmail ? _input.validateEmail(configObject.regExp.email, configObject.texts.emailFormat ?? null) : _input.toggleValidation();
                    if (_input.isNameField)
                        !configObject.config.validateName ? _input.validateName(configObject.regExp.name, configObject.texts.nameFormat ?? null) : _input.toggleValidation();
                    if (_input.isPhoneField)
                        configObject.config.validatePhone ? _input.validatePhone(configObject.regExp.phone, configObject.texts.phoneFormat ?? null) : _input.toggleValidation();
                    if (_input.isUsernameField)
                        configObject.config.validateUsername ? _input.validateUsername(configObject.regExp.username, configObject.texts.usernameFormat ?? null) : _input.toggleValidation();
                    if (configObject.config.validateCard) {
                        if (elementId?.includes('card_cvv') || fxRole?.includes('card_cvv') || fxId?.includes('card_cvv'))
                            _input.validateCardCVV(configObject.regExp.cardCVV);
                        if (elementId?.includes('card_number') || fxRole?.includes('card_number') || fxId?.includes('card_number'))
                            _input.validateCardCVV(configObject.regExp.cardNumber);
                    }
                    else {
                        if ((elementId?.includes('card_cvv') || fxRole?.includes('card_cvv') || fxId?.includes('card_cvv')) || (elementId?.includes('card_number') || fxRole?.includes('card_number') || fxId?.includes('card_number')))
                            _input.toggleValidation();
                    }
                    filterFieldType.has(elementType) && elementType !== 'email' && _input.validateField();
                }
                _input.#_resetFuxcelObject(fx(_input[0].form));
            },
            keyup: function () {
                const _input = that.#_resetFuxcelObject(fx(this));
                if (_input.isPasswordField)
                    if (_input.length)
                        if (configObject.config.showPassword && _passwordToggle.length)
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
                _input.#_resetFuxcelObject(fx(_input[0].form));
            }
        });
        _selectElement.length && _selectElement.off().upon('change', function () {
            const _element = that.#_resetFuxcelObject(fx(this));
            _element.canBeValidated && _element.validateField();
            _element.#_resetFuxcelObject(fx(_element[0].form));
        });
        _textAreaElement.length && _textAreaElement.off().upon('input', function () {
            const _element = that.#_resetFuxcelObject(fx(this));
            _element.canBeValidated && _element.validateField();
            _element.#_resetFuxcelObject(fx(_element[0].form));
        });
        if (_element.length) {
            const elementId = _element.attrib('id');
            const fieldName = _element.attrib('id').toString().toTitleCase().replaceAll(/[_-]/gi, ' ');
            if (_element.canBeValidated && (_element.isElement('input') || _element.isElement('select') || _element.isElement('textarea')))
                if (_element.isElement('input')) {
                    const elementType = _element.attrib('type') && _element.attrib('type').toLowerCase();
                    if (configObject.config.showPassword && _passwordToggle.length)
                        _passwordToggle.off().upon('click', (e) => {
                            let clicked = e.target, _clicked = fx(clicked), _passwordField = fx(_element, _passwordToggle.prevSiblings('.field-group'));
                            if (_clicked[0] === fx(showPasswordToggle)[0]) {
                                FuxcelValidator.#_toggleValidationIcons(showPasswordToggle, hidePasswordToggle);
                                _passwordField.attrib({ type: 'text' });
                            }
                            else {
                                FuxcelValidator.#_toggleValidationIcons(hidePasswordToggle, showPasswordToggle);
                                _passwordField.attrib({ type: 'password' });
                            }
                            _passwordField[0].focus({ preventScroll: false });
                        });
                    if (elementType !== 'checkbox' && elementType !== 'radio') {
                        this.#_manipulateErrorBag(`The ${fieldName} field is required.`);
                        this.#_manipulateErrorCount();
                    }
                }
                else {
                    if (!_element.value()?.length) {
                        this.#_manipulateErrorBag(`The ${fieldName} field is required.`);
                        this.#_manipulateErrorCount();
                    }
                }
        }
    }
    #_validatePasswordFields() {
        const selected = this.toArray;
        const form = selected[0].form;
        const configObject = this.validatorConfig;
        if (configObject.config.validatePassword) {
            const pwdField = fx(`#${configObject.config.passwordId}`, form).formValidator;
            const pwdFieldName = pwdField.fieldAttributes.id.toString().toTitleCase().replaceAll(/[_-]/gi, ' ');
            const expectedCpwdField = fx(`#${configObject.config.passwordConfirmId}`, form);
            pwdField.#_initSteps = this.#_initSteps;
            if (configObject.regExp.password) {
                if (expectedCpwdField.length) {
                    const cpwdField = expectedCpwdField.formValidator;
                    const cpwdFieldName = cpwdField.fieldAttributes.id.toString().toTitleCase().replaceAll(/[_-]/gi, ' ');
                    cpwdField.#_initSteps = this.#_initSteps;
                    if (!pwdField.value()?.length) {
                        pwdField.validateField();
                        cpwdField.validateField(`Check Password.`);
                    }
                    else {
                        if (!cpwdField.value()?.length)
                            cpwdField.validateField(`The ${cpwdFieldName} field is required.`);
                        else
                            cpwdField.validateField();
                        pwdField.validatePassword(configObject.regExp.password, configObject.texts.passwordFormat ?? null);
                    }
                }
                else
                    pwdField.validatePassword(configObject.regExp.password, configObject.texts.passwordFormat ?? null);
            }
            else {
                const minLength = parseInt(pwdField.attrib('minlength') ?? 0);
                const maxLength = parseInt(pwdField.attrib('maxlength') ?? 0);
                if (expectedCpwdField.length) {
                    const cpwdField = expectedCpwdField.formValidator;
                    const cpwdFieldName = cpwdField.fieldAttributes.id.toString().toTitleCase().replaceAll(/[_-]/gi, ' ');
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
                        if (pwdField.value()?.length < minLength || pwdField.value()?.length > maxLength)
                            pwdField.validateField(`The ${pwdFieldName} field must be between ${minLength} and ${maxLength} characters.`);
                        else
                            pwdField.validateField();
                    else
                        pwdField.validateField();
                }
            }
        }
        else {
            console.log(this);
            this.validateField();
        }
    }
    get canBeValidated() {
        const selected = this.toArray;
        return selected.length ? (this.dataAttrib('fx-validate') ? parseBool(this.dataAttrib('fx-validate')) : true) : false;
    }
    get errorBag() {
        return (this.length && this.isElement('form')) && Object.keys(FuxcelValidator.#_validatorErrorBag[this.attrib('id')]).length ? FuxcelValidator.#_validatorErrorBag[this.attrib('id')] : null;
    }
    get errorCount() {
        return (this.length && this.isElement('form')) && Object.keys(FuxcelValidator.#_validatorErrorCount).length ? FuxcelValidator.#_validatorErrorCount[this.attrib('id')] : 0;
    }
    get getErrors() {
        const selected = this.toArray;
        let errors = {};
        if (selected.length > 1) {
            selected.forEach((element) => {
                const _element = fx(element).formValidator;
                if (element.tagName && _element.isElement('form')) {
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
    get formFieldElements() {
        const selected = this.toArray;
        if (selected.length > 1) {
            const elements = {};
            selected.forEach((element) => {
                if (fx(element).isElement('form'))
                    elements[element.id] = element.elements;
            });
            return elements;
        }
        return this.isElement('form') ? selected[0].elements : console.error('Non form elements given', selected);
    }
    get isEmailField() {
        const attributes = this.fieldAttributes;
        return attributes.type?.includes('email') || attributes.type?.includes('email') || attributes.id?.includes('email') || attributes.fxId?.includes('email') || attributes.fxRole?.includes('email');
    }
    get isNameField() {
        const attributes = this.fieldAttributes;
        return !this.isUsernameField && attributes.id?.includes('name') || attributes.fxId?.includes('name') || attributes.fxRole?.includes('name');
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
    get stepFromField() {
        if (this.#_initSteps) {
            const stepDiv = this.parents(FuxcelValidator.stepsClass);
            return parseInt(stepDiv.dataAttrib('fx-step') ?? 0);
        }
        return -1;
    }
    get validationProps() {
        const configObject = this.#_fxValidatorConfig;
        const formGroup = configObject.config.initWrapper;
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
        throw ('Non-Form element given');
    }
    get validatorConfig() {
        return this.#_fxValidatorConfig;
    }
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
    static set stepsClass(stepClass) {
        FuxcelValidator.#_stepsClass = stepClass;
    }
    init(config = null) {
        const selected = this.toArray;
        let forms = selected.filter((element) => fx(element).isElement('form')), nonForms = selected.filter((element) => !fx(element).isElement('form'));
        if (forms.length) {
            if (nonForms.length)
                console.error(`${nonForms.length} non form-element${nonForms.length === 1 ? '' : 's'} passed to validator:`, nonForms);
            config && isObject(config) && this.#_touchConfig(config);
            return this.#_initValidateForms(forms);
        }
        else {
            console.error(`Non form-elements passed to the validator`, nonForms);
            throw (`${nonForms.length} non form-element${nonForms.length === 1 ? '' : 's'} passed to validator.`);
        }
    }
    initSteps(config = null) {
        const selected = this.toArray;
        const forms = selected.filter((element) => fx(element).isElement('form'));
        forms.forEach((form, index) => {
            const configObject = this.validatorConfig;
            const _currentForm = fx(form).formValidator;
            if (!_currentForm.attrib('id'))
                _currentForm.attrib({ id: `current-form-${index}` });
            let formId = _currentForm.attrib('id'), formSteps = fx(`#${formId} ${FuxcelValidator.stepsClass}`).formValidator;
            if (formSteps.length) {
                FuxcelValidator.#_validatorErrorBag[formId] = {};
                FuxcelValidator.#_validatorErrorCount[formId] = {};
                this.#_initSteps = true;
                configObject.config.nativeValidation ? _currentForm.prop({ noValidate: false }) : _currentForm.prop({ noValidate: true });
                formSteps.toArray.forEach((step) => {
                    step.dataset.fxStep = step.dataset.fxStep;
                    const stepIndex = parseInt(step.dataset.fxStep);
                    const formGroups = fx(`.form-group`, step).formValidator;
                    FuxcelValidator.#_validatorErrorBag[formId][stepIndex] = {};
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
                                            console.error(`${_fieldElement[0].tagName} element has no \`id\` or \`name\` attribute`, _fieldElement);
                                            throw (`Field element does not have an \`id\` or \`name\` attribute`);
                                        }
                                    const fieldElementId = _fieldElement.attrib('id');
                                    if (_fieldElement.prop('tagName').toString().toLowerCase() === 'input' && !_fieldElement.attrib('placeholder'))
                                        _fieldElement.attrib({ placeholder: _fieldElement.attrib('name').toString().toTitleCase().replaceAll(/[_-]/gi, ' ') });
                                    if (!_labelElement.attrib('for'))
                                        _labelElement.attrib('for', fieldElementId);
                                    const expectedFieldElement = _fieldElement[0];
                                    const expectedLabelElement = _labelElement[0];
                                    this.#_placeElements(configObject, form, formGroup, expectedFieldElement, expectedLabelElement, _fieldElement);
                                    this.#_validate(this, formGroup);
                                }
                            }
                        });
                    }
                });
            }
        });
        Object.keys(this).forEach(key => FuxcelSteps.currentlySelected[key] = this[key]);
        return new FuxcelSteps(this);
    }
    renderMessage(message = null, renderType = null) {
        this.insertHTML(`<small ${renderType ? 'class="' + renderType + '"' : ''}>${message ?? '&nbsp;'}</small>`);
        return this;
    }
    renderValidationErrors(errors, message = null, callbackFn = null) {
        const selected = this;
        const target = selected[0];
        if (selected.isElement('form')) {
            const fieldElements = this.formFieldElements;
            if (isObject(errors))
                Object.keys(errors).forEach((elementId) => {
                    const fieldName = elementId.toString().toTitleCase();
                    const element = fx(`#${elementId}`).formValidator;
                    if (elementId in fieldElements && (isString(errors[elementId]) && errors[elementId] !== undefined))
                        element.validateField(errors[elementId], true);
                    else {
                        if (isString(errors[elementId]) && errors[elementId] !== undefined)
                            element.validateField(`Verify ${fieldName} and try again.`, true);
                    }
                });
        }
    }
    showError(message = null) {
        const fieldAttribs = this.fieldAttributes;
        const validationProps = this.validationProps;
        const finalMessage = message ?? `The ${fieldAttribs.id?.toString().toTitleCase().replaceAll(/[_-]/gi, ' ')} field is required`;
        this.#_manipulateErrorBag(finalMessage);
        this.#_fxValidatorConfig.config.showIcons && FuxcelValidator.#_toggleValidationIcons(validationProps.validIcon, validationProps.invalidIcon);
        fx(validationProps.validationField).formValidator.renderMessage(finalMessage ?? null);
        if (this.#_fxValidatorConfig.config.useDefaultStyling)
            fx(`${validationProps.formGroup} .form-group-wrapper`).replaceClass('fx-valid-success', 'fx-valid-error');
        else
            fx(validationProps.formGroup).replaceClass('fx-valid-success', 'fx-valid-error');
        this.#_manipulateErrorCount();
    }
    showSuccess(message = null) {
        const validationProps = this.validationProps;
        this.#_manipulateErrorBag(true);
        this.#_fxValidatorConfig.config.showIcons && FuxcelValidator.#_toggleValidationIcons(validationProps.invalidIcon, validationProps.validIcon);
        fx(validationProps.validationField).formValidator.renderMessage(message ?? null);
        if (this.#_fxValidatorConfig.config.useDefaultStyling)
            fx(`${validationProps.formGroup} .form-group-wrapper`).replaceClass('fx-valid-error', 'fx-valid-success');
        else
            fx(validationProps.formGroup).replaceClass('fx-valid-error', 'fx-valid-success');
        this.#_manipulateErrorCount();
    }
    toggleValidation() {
        return this.canBeValidated ? this.validateField() : this.undoValidation();
    }
    undoValidation(destroyValidation = false) {
        const selected = this;
        const fieldAttribs = selected.fieldAttributes;
        const validationProps = selected.validationProps;
        if (destroyValidation) {
            delete FuxcelValidator.#_validatorErrorBag[fieldAttribs.formId][fieldAttribs.id];
            FuxcelValidator.#_validatorErrorCount[fieldAttribs.formId] = Object.keys(FuxcelValidator.#_validatorErrorCount[fieldAttribs.formId]).length;
        }
        if (selected.#_fxValidatorConfig.config.useDefaultStyling)
            fx(`${validationProps.formGroup} .form-group-wrapper`).removeClass('fx-valid-error', 'fx-valid-success');
        else
            fx(validationProps.formGroup).removeClass('fx-valid-error', 'fx-valid-success');
        return this;
    }
    stepErrorBag(step) {
        return (this.length && this.isElement('form')) && Object.keys(FuxcelValidator.#_validatorErrorBag[this.attrib('id')][step]) ? FuxcelValidator.#_validatorErrorBag[this.attrib('id')][step] : null;
    }
    stepErrorCount(step) {
        return (this.length && this.isElement('form')) && Object.keys(FuxcelValidator.#_validatorErrorCount[this.attrib('id')][step]) ? FuxcelValidator.#_validatorErrorCount[this.attrib('id')][step] : 0;
    }
    validateCardCVV(regExp, customFormatEx = null) {
        return this.validateRegex(regExp, `Invalid CVV.`);
    }
    validateCardNumber(regExp, customFormatEx = null) {
        const selected = this.toArray;
        const value = selected[0].value;
        return this.validateRegex(() => value.length ? (value.match(regExp) ?
            (passLuhnAlgo(selected[0]) ? this.validateField() : this.validateField('Check Card Number and try again.', true)) :
            this.validateField(`${customFormatEx ?? 'Only numbers are allowed.'}`)) : this.toggleValidation());
    }
    validateEmail(regExp, customFormatEx = null) {
        return this.validateRegex(regExp, `Invalid E-Mail format: (eg. ${customFormatEx ?? 'johndoe@email.com'})`);
    }
    validateField(message = null, isError = false) {
        const selected = this;
        const fieldAttribs = selected.fieldAttributes;
        const configObject = this.#_fxValidatorConfig.config;
        const target = selected[0];
        let fieldValue = target.value, minLength = parseInt(selected.attrib('minlength') ?? 0), fieldName = fieldAttribs.id.toString().toTitleCase().replaceAll(/[_-]/gi, ' '), finalMessage = minLength ?
            (!isString(message) && fieldValue.length && fieldValue.length < minLength ? `The ${fieldName} field requires a minimum of ${minLength} characters.` : message) :
            (!isString(message) ?
                (selected.isPasswordField ?
                    ((fieldAttribs.id === configObject.passwordConfirmId && configObject.validatePassword) ? ((!fieldValue.length || fieldValue !== fx(`#${configObject.passwordId}`).value()) ? (fx(`#${configObject.passwordId}`).value()?.length ? 'Ensure passwords.' : `The ${fieldName} field is required.`) : null) : (!fieldValue.length ? `The ${fieldName} field is required.` : null)) :
                    message) :
                message);
        if (!fieldValue || !fieldValue.length || fieldValue.length < minLength || (selected.isPasswordField && (!fieldValue.length || finalMessage)) || isError)
            selected.showError(finalMessage);
        else
            selected.showSuccess(finalMessage);
        return this;
    }
    validateName(regExp, customFormatEx = null) {
        return this.validateRegex(regExp, `Invalid Name format: (eg. ${customFormatEx ?? 'john doe, john doe woods'})`);
    }
    validatePassword(regExp, customFormatEx = null) {
        return this.validateRegex(regExp, `Invalid Password format: (${customFormatEx ?? 'Password requires a minimum of 8 characters an must contain at least 1 uppercase and 1 special character'})`);
    }
    validatePhone(regExp, customFormatEx = null) {
        return this.validateRegex(regExp, `Invalid Phone format: (eg. ${customFormatEx ?? '+234 8156547099, +1 104 2198'})`);
    }
    validateRegex(regExpOrFn, message) {
        const selected = this.toArray;
        const value = selected[0].value;
        (regExpOrFn && isFunction(regExpOrFn)) ? regExpOrFn(this) :
            (regExpOrFn && isString(message) ? ((value.length) ? (value.match(regExpOrFn) ? this.validateField() : this.validateField(message, true)) : this.validateField()) : console.error('Function \`validateRegex()\` expects 2 arguments.'));
        return this;
    }
    validateUsername(regExp, customFormatEx = null) {
        const selected = this.toArray;
        const value = selected[0].value;
        const minLength = parseInt(this.attrib('minlength') ?? 2);
        const fieldName = selected[0].id.toString().toTitleCase().replaceAll(/[_-]/gi, ' ');
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
        return this;
    }
    get context() {
        return new FuxcelSteps(FuxcelSteps.currentlySelected);
    }
    get formSteps() {
        const steps = [];
        if (this.length > 1) {
            const allSteps = {};
            this.toArray.forEach((element) => {
                if (fx(element).isElement('form')) {
                    allSteps[element.id] = [];
                    const stepDivs = fx(FuxcelValidator.stepsClass, element);
                    stepDivs.length && stepDivs.toArray.forEach((stepDiv) => {
                        const step = stepDiv.dataset.fxStep;
                        isString(step) && step !== undefined && (allSteps[element.id]).push(step);
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
    stepErrors(step = null) {
        const selected = this.context.toArray;
        let errors = {};
        if (selected.length > 1 && step === null) {
            selected.forEach((element) => {
                const _element = new FuxcelSteps(element);
                if (element.tagName && _element.isElement('form')) {
                    errors[element.id] = {};
                    const steps = _element.formSteps;
                    if (steps.length) {
                        steps.forEach(step => {
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
//# sourceMappingURL=fuxcel.js.map