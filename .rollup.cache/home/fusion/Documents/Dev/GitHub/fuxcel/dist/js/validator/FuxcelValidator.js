import { Fuxcel, fx } from '../core/Fuxcel';
import { isDefined, isObject, isString, parseBool } from '../utils';
/**
 * Form validation engine.
 * Extends `Fuxcel` with rich real-time validation, error-bag tracking,
 * field-type detection, and step-form support.
 */
export class FuxcelValidator extends Fuxcel {
    #_fxValidatorConfig = FuxcelValidator.defaultValidatorConfig;
    /**
     * Default Validator configuration.
     *
     * @type {ValidatorConfigObject}
     * @private
     */
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
        const registry = FuxcelValidator.#_registry[this.isElement('form') ? this.fieldAttributes?.id : this.fieldAttributes?.formId];
        const passwordId = registry.configObject.config?.passwordId;
        const a = this.fieldAttributes;
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
    /** Returns the current `ValidatorConfigObject` options of selected form. **/
    get validatorConfig() {
        return this.#_fxValidatorConfig;
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
        if (!!(registry.configObject.config?.useDefaultStyling))
            fx(`${validationProps.formGroup} .form-group-wrapper`).replaceClass('fx-valid-success', 'fx-valid-error');
        else
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
        if (registry.configObject.config?.useDefaultStyling)
            fx(`${validationProps.formGroup} .form-group-wrapper`).replaceClass('fx-valid-error', 'fx-valid-success');
        else
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
        // @ts-ignore
        const value = selected[0].value;
        return this.validateRegex(() => 
        // @ts-ignore
        value.length ?
            (value.match(regExp) ? (passLuhnAlgo(selected[0]) ? this.validateField() : this.validateField('Check Card Number and try again.', true)) : this.validateField(`${customFormatEx ?? 'Only numbers are allowed.'}`)) :
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
//# sourceMappingURL=FuxcelValidator.js.map