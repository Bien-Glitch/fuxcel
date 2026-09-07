/**
 * Base class for the Fuxcel selector engine.
 * Handles element selection, array conversion, and static device helpers.
 */
declare class FuxcelBase {
    #private;
    [index: number]: HTMLElement;
    length: number;
    protected prev: {
        length: number;
    };
    constructor(selector: string | IterableElement | any, context?: string | IterableElement | any);
    /** Guesses the directory path of the current script file. */
    static get guessPath(): string | null;
    /** Returns previous object context. */
    get prevObj(): {
        length: number;
    };
    /** Returns the selected element(s) as a plain array. */
    get toArray(): IterableElement;
    /** `true` if the current device is a mobile device. **/
    static get isMobileDevice(): boolean;
    /** `true` if the pointer is coarse (touch). **/
    static get pointerIsTouch(): boolean;
}

/**
 * Extends `FuxcelValidator` with multi-step form support.
 * Tracks per-step error bags and exposes step-level error queries.
 */
declare class FuxcelSteps extends FuxcelValidator implements FuxcelStepsInstance {
    static currentlySelected: object;
    constructor(selected: FuxcelValidator);
    /** Re-instantiated context of the currently selected forms. */
    get context(): FuxcelSteps;
    /**
     * Returns all step identifiers for the selected form(s).
     * - Single form → `(number | string)[]`
     * - Multiple forms → `{ [formId]: (number | string)[] }`
     */
    get formSteps(): object | (number | string)[];
    /**
     * Returns the error bag and error count for the current selected step form(s).
     *
     * @param step {number|string|null=null} Specific step to query. If null, returns errors for all steps.
     */
    stepErrors(step?: number | string | null): object | void;
}

/**
 * Form validation engine.
 * Extends `Fuxcel` with rich real-time validation, error-bag tracking,
 * field-type detection, and step-form support.
 */
declare class FuxcelValidator extends Fuxcel implements FuxcelValidatorInstance {
    #private;
    /**
     * On Validator Init
     *
     * @type {CustomEventType}
     */
    static fxValidatorInitEvent: CustomEventType;
    /**
     * On Validator Loading
     *
     * @type {CustomEventType}
     */
    static fxValidatorLoadingEvent: CustomEventType;
    /**
     * On Validator Ready
     *
     * @type {CustomEventType}
     */
    static fxValidatorReadyEvent: CustomEventType;
    /**
     * On Validator Init failed
     *
     * @type {CustomEventType}
     */
    static fxValidatorFailedEvent: CustomEventType;
    /**
     * Injectable FuxcelSteps constructor.
     * Populated by index.ts to break the FuxcelValidator → FuxcelSteps circular dependency.
     * @internal
     */
    static _stepsFactory: (new (selected: FuxcelValidator) => any) | null;
    /**
     * Injectable fxModal function.
     * Populated by index.ts to break the FuxcelValidator → fxModal circular dependency.
     * @internal
     */
    static _fxModal: ((options?: FXModalType) => any) | null;
    constructor(selector: string | IterableElement | any, context?: string | IterableElement | any);
    /**
     *
     * @param {HTMLElement} formGroup
     * @param source {StringOrNull='extendValidation'}
     */
    validateFromGroup(formGroup: HTMLElement, source?: StringOrNull): void;
    /** Checks if the selected field element can be validated by checking thw value of `[data-fx-validate]` data-attribute or the parent form-group is not hidden. **/
    get canBeValidated(): boolean;
    /** Get the error bag for the current selected form. **/
    get errorBag(): object | null;
    /** Get the error count for the current selected form. **/
    get errorCount(): number;
    /** Get the password strength for the current selected form of password field. **/
    get passwordStrength(): StrengthResult | null;
    /** An object containing the error bag and error count for the current selected form(s). Logs an error to the console if selected element(s) not form element(s). **/
    get getErrors(): object | void;
    /** An object containing all form field elements for the current selected form(s). Logs an error to the console if selected element(s) not form element(s). **/
    get formFieldElements(): object | void;
    /** Checks if the selected form field element is an email field. **/
    get isEmailField(): boolean;
    /** Checks if the selected form field element is a name field. **/
    get isNameField(): boolean;
    /** Checks if the selected form field element is a password field. **/
    get isPasswordField(): boolean;
    /** Checks if the selected form field element is a phone field. **/
    get isPhoneField(): boolean;
    /** Checks if the selected form field element is a username field. **/
    get isUsernameField(): boolean;
    get stepFromField(): number;
    /** Returns the `ValidationProps` of the selected form field element. **/
    get validationProps(): ValidationProps;
    /** Returns the current `ValidatorConfigObject` options of the selected form. _If any element other than a form or its element (input, select, ...) is selected, the default `ValidatorConfigObject` is returned._ **/
    get validatorConfig(): ValidatorConfigObject;
    /** Returns the default Form Validator Configuration Object. **/
    static get defaultValidatorConfig(): ValidatorConfigObject;
    /** Returns the Password capslock alert class selector **/
    static get passwordCapslockAlertClass(): string;
    /** Returns the Password toggler icon class selector **/
    static get passwordTogglerIconClass(): string;
    static get stepsClass(): string;
    static set stepsClass(selector: string);
    /**
     * Initialize validation on selected form(s) _[Must be an instance of FuxcelValidator]_.
     *
     * _Throws an error if non form elements are selected._
     *
     * @param config {ValidatorConfigObject} user config object.
     * @return {FuxcelSteps | FuxcelValidator} Fuxcel Validator Object of the forms.
     */
    init(config?: ValidatorConfigObject | null): FuxcelSteps | FuxcelValidator | void;
    /**
     * Empties the given form(s) error bag
     *
     * @returns {FuxcelSteps | FuxcelValidator} Fuxcel Validator Object of the forms.
     * @since 2.2.0
     */
    clearErrorBag(): this;
    /** Reset validation message. **/
    renderMessage(): FuxcelValidator;
    /**
     * Render validation message.
     *
     * @param message {StringOrNull} message to display.
     * @return {FuxcelValidator} Fuxcel Validator Object of the current selected element.
     */
    renderMessage(message?: StringOrNull): FuxcelValidator;
    /**
     * Render validation message.
     *
     * @param message {string} message to display.
     * @param renderClass {string} validation type.
     * @return {FuxcelValidator} Fuxcel Validator Object of the current selected element.
     */
    renderMessage(message: string, renderClass: string): FuxcelValidator;
    /**
     * Display all validation errors for the selected form.
     *
     * @param errors {{ [key: string]: any }}
     * @return FuxcelValidator
     */
    renderValidationErrors(errors: {
        [key: string]: any;
    }): FuxcelValidator;
    /**
     * Display all validation errors for the selected form.
     *
     * @param errors {null}
     * @param messageOrFn {((fx: FuxcelValidator, e?: CustomEvent) => any)}
     * @return FuxcelValidator
     */
    renderValidationErrors(errors: null, messageOrFn: ((fx: FuxcelValidator, e?: CustomEvent) => any)): FuxcelValidator;
    /**
     * Display all validation errors for the selected form.
     *
     * @param errors {null}
     * @param messageOrFn {string}
     * @return FuxcelValidator
     */
    renderValidationErrors(errors: null, messageOrFn: string): FuxcelValidator;
    /**
     * Display all validation errors for the selected form.
     *
     * @param errors {{ [key: string]: any }} An object containing the errors. The keys are the form field ids and their values are the errors for the fields respectively.
     * @param messageOrFn {((fx: FuxcelValidator, e?: CustomEvent) => any)}
     * @return FuxcelValidator
     */
    renderValidationErrors(errors: {
        [key: string]: any;
    }, messageOrFn: ((fx: FuxcelValidator, e?: CustomEvent) => any)): FuxcelValidator;
    /**
     * Display all validation errors for the selected form.
     *
     * @param errors {{ [key: string]: any }} An object containing the errors. The keys are the form field ids and their values are the errors for the fields respectively.
     * @param messageOrFn {string}
     * @return FuxcelValidator
     */
    renderValidationErrors(errors: {
        [key: string]: any;
    }, messageOrFn: string): FuxcelValidator;
    /**
     * Display all validation errors for the selected form.
     *
     * @param errors {{ [key: string]: any }} An object containing the errors. The keys are the form field ids and their values are the errors for the fields respectively.
     * @param messageOrFn {((fx: FuxcelValidator, e?: CustomEvent) => any)}
     * @param callbackFn {((fx: FuxcelValidator, e?: CustomEvent) => any)}
     * @return FuxcelValidator
     */
    renderValidationErrors(errors: {
        [key: string]: any;
    }, messageOrFn: ((fx: FuxcelValidator, e?: CustomEvent) => any), callbackFn: ((fx: FuxcelValidator, e?: CustomEvent) => any)): FuxcelValidator;
    /**
     * Display all validation errors for the selected form.
     *
     * @param errors {{ [key: string]: any }} An object containing the errors. The keys are the form field ids and their values are the errors for the fields respectively.
     * @param messageOrFn {string}
     * @param callbackFn {((fx: FuxcelValidator, e?: CustomEvent) => any)}
     * @return FuxcelValidator
     */
    renderValidationErrors(errors: {
        [key: string]: any;
    }, messageOrFn: string, callbackFn: ((fx: FuxcelValidator, e?: CustomEvent) => any)): FuxcelValidator;
    /**
     * Show validation error for the selected field.
     *
     * @return {void}
     */
    showError(): void;
    /**
     * Show validation error for the selected field.
     *
     * @param message {StringOrNull} Validation message.
     * @return {void}
     */
    showError(message: StringOrNull): void;
    /**
     * Show validation success.
     *
     * @return {void}
     */
    showSuccess(): void;
    /**
     * Show validation success.
     *
     * @param message {StringOrNull} Validation message.
     * @return {void}
     */
    showSuccess(message: StringOrNull): void;
    /**
     * Toggle between validating and removing validation from the selected field.
     *
     * @return {FuxcelValidator} Fuxcel Validator Object of the forms.
     */
    toggleValidation(): FuxcelValidator;
    /**
     * Remove validation from the selected field element. Also remove the error from the error bag if destroyValidation parameter is set tot true.
     *
     * @param destroyValidation {boolean = false}
     * @return {FuxcelValidator} Fuxcel Validator Object of the forms.
     */
    undoValidation(destroyValidation?: boolean): FuxcelValidator;
    stepErrorBag(step: number | string): object | null;
    stepErrorCount(step: number | string): number;
    /**
     * Validate Card CVV field using Regular Expression
     *
     * @param regExp {RegExp} Regular expression to use.
     * @return {FuxcelValidator} Fuxcel Validator Object of the selected element.
     */
    validateCardCVV(regExp: RegExp): FuxcelValidator;
    /**
     * Validate Card CVV field using Regular Expression
     *
     * @param regExp {RegExp} Regular expression to use.
     * @param customFormatEx {StringOrNull} Custom format example to show user.
     * @return {FuxcelValidator} Fuxcel Validator Object of the selected element.
     */
    validateCardCVV(regExp: RegExp, customFormatEx: StringOrNull): FuxcelValidator;
    /**
     * Validate Card Number field using Regular Expression
     *
     * @param regExp {RegExp} Regular expression to use.
     * @return {FuxcelValidator} Fuxcel Validator Object of the selected element.
     */
    validateCardNumber(regExp: RegExp): FuxcelValidator;
    /**
     * Validate Card Number field using Regular Expression
     *
     * @param regExp {RegExp} Regular expression to use.
     * @param customFormatEx {StringOrNull} Custom format example to show user
     * @return {FuxcelValidator} Fuxcel Validator Object of the selected element.
     */
    validateCardNumber(regExp: RegExp, customFormatEx: StringOrNull): FuxcelValidator;
    /**
     * Validate Email field using Regular Expression
     *
     * @param regExp {RegExp} Regular expression to use.
     * @return {FuxcelValidator} Fuxcel Validator Object of the selected element.
     */
    validateEmail(regExp: RegExp): FuxcelValidator;
    /**
     * Validate Email field using Regular Expression
     *
     * @param regExp {RegExp} Regular expression to use.
     * @param customFormatEx {StringOrNull} Custom format example to show user.
     * @return {FuxcelValidator} Fuxcel Validator Object of the selected element.
     */
    validateEmail(regExp: RegExp, customFormatEx: StringOrNull): FuxcelValidator;
    /** Validate the selected field. **/
    validateField(): FuxcelValidator;
    /**
     * Validate the selected field.
     *
     * _Automatically generates and displays an error message._
     *
     * @param isError {boolean=false} an automatic error message is generated.
     * @return {FuxcelValidator} Fuxcel Validator Object of the selected element.
     */
    validateField(isError: boolean): FuxcelValidator;
    /**
     * Validate the selected field.
     *
     * _Displays a success message._
     *
     * @param message {string} Validation message to display.
     * @returns {FuxcelValidator}
     */
    validateField(message: string): FuxcelValidator;
    /**
     * Validate the selected field.
     *
     * @param message {StringOrNull} Validation message to display.
     * @param isError {boolean=false} Is Validation message an error? _[defaults to false]._
     * @return {FuxcelValidator} Fuxcel Validator Object of the selected element.
     */
    validateField(message: StringOrNull, isError?: boolean): FuxcelValidator;
    /**
     * Validate Name field using Regular Expression
     *
     * @param regExp {RegExp} Regular expression to use.
     * @return {FuxcelValidator} Fuxcel Validator Object of the selected element.
     */
    validateName(regExp: RegExp): FuxcelValidator;
    /**
     * Validate Name field using Regular Expression
     *
     * @param regExp {RegExp} Regular expression to use.
     * @param customFormatEx {StringOrNull} Custom format example to show user.
     * @return {FuxcelValidator} Fuxcel Validator Object of the selected element.
     */
    validateName(regExp: RegExp, customFormatEx: StringOrNull): FuxcelValidator;
    /**
     * Validate Password field using Regular Expression
     *
     * @param regExp {RegExp} Regular expression to use
     * @return {FuxcelValidator} Fuxcel Validator Object of the selected element.
     */
    validatePassword(regExp: RegExp): FuxcelValidator;
    /**
     * Validate Password field using Regular Expression
     *
     * @param regExp {RegExp} Regular expression to use
     * @param customFormatEx {StringOrNull} Custom format example to show user.
     * @return {FuxcelValidator} Fuxcel Validator Object of the selected element.
     */
    validatePassword(regExp: RegExp, customFormatEx: StringOrNull): FuxcelValidator;
    /**
     * Validate Phone field using Regular Expression
     *
     * @param regExp {RegExp} Regular expression to use
     * @return {FuxcelValidator} Fuxcel Validator Object of the selected element.
     */
    validatePhone(regExp: RegExp): FuxcelValidator;
    /**
     * Validate Phone field using Regular Expression
     *
     * @param regExp {RegExp} Regular expression to use
     * @param customFormatEx {StringOrNull} Custom format example to show user.
     * @return {FuxcelValidator} Fuxcel Validator Object of the selected element.
     */
    validatePhone(regExp: RegExp, customFormatEx: StringOrNull): FuxcelValidator;
    /**
     * Validate field using a callback function.
     *
     * @param regExpOrFn {Function} Function to use.
     * @return {FuxcelValidator} Fuxcel Validator Object of the selected element.
     */
    validateRegex(regExpOrFn: Function): FuxcelValidator;
    /**
     * Validate field using Regular Expression.
     *
     * @param regExpOrFn {RegExp} Regular Expression to use.
     * @param message {StringOrNull} Validation message.
     * @return {FuxcelValidator} Fuxcel Validator Object of the selected element.
     */
    validateRegex(regExpOrFn: RegExp, message: StringOrNull): FuxcelValidator;
    /**
     * Validate Username field using Regular Expression
     *
     * @param regExp {RegExp} Regular expression to use
     * @return {FuxcelValidator} Fuxcel Validator Object of the selected element.
     */
    validateUsername(regExp: RegExp): FuxcelValidator;
    /**
     * Validate Username field using Regular Expression
     *
     * @param regExp {RegExp} Regular expression to use
     * @param customFormatEx {StringOrNull} Custom format example to show user.
     * @return {FuxcelValidator} Fuxcel Validator Object of the selected element.
     */
    validateUsername(regExp: RegExp, customFormatEx: StringOrNull): FuxcelValidator;
}

/**
 * Modal engine.
 * Handles showing, hiding, toggling, and constructing modals.
 * Auto-wires `[data-fx-target="modal"]` triggers on construction.
 */
declare class FuxcelModal extends Fuxcel implements FuxcelModalInstance {
    #private;
    /**
     * On Modal showing
     *
     * @type {CustomEventType}
     */
    static fxModalShowEvent: CustomEventType;
    /**
     * On Modal shown
     *
     * @type {CustomEventType}
     */
    static fxModalShownEvent: CustomEventType;
    /**
     * On Modal hidding
     *
     * @type {CustomEventType}
     */
    static fxModalHideEvent: CustomEventType;
    /**
     * On Modal hidden
     *
     * @type {CustomEventType}
     */
    static fxModalHiddenEvent: CustomEventType;
    constructor(selector: string | IterableElement | any, context?: string | IterableElement | any, autoActions?: boolean);
    /** The most recently opened modal, or `null` if none is open. **/
    static get currentModal(): FuxcelModal | null;
    /** `true` if any modals are currently open. **/
    static get hasOpenModals(): boolean;
    /** All elements with `[data-fx-target="modal"]`. **/
    static get modalTriggers(): Fuxcel;
    /**
     * Builds a modal DOM structure and returns the root element.
     *
     * @param {ModalInit} options
     * @returns {HTMLElement}
     */
    static init({ id, content, title, html, isStatic, hasFooter }: ModalInit): HTMLElement;
    /** Remove the selected modal element from the DOM entirely. **/
    destroy(): void;
    /**
     * Hide (and optionally destroy) the selected modal.
     *
     * @param destroy {boolean=false} Whether to remove the element from the DOM after hiding.
     */
    hide(destroy?: boolean): void;
    /**
     * Open selected modal.
     *
     * @param escKey {boolean=true} Allow closing the modal using the Escape on the KeyBoard if set to true. True by default.
     */
    show(escKey?: boolean | undefined): void;
    /** Toggle between hide and show state of the selected modal. **/
    toggle(): void;
}

/**
 * Core Fuxcel class.
 * Wraps one or more DOM elements and exposes a fluent, chainable API for
 * DOM manipulation, traversal, event handling, and animations.
 */
declare class Fuxcel extends FuxcelBase implements FuxcelInstance {
    #private;
    /**
     * Injectable factory for FuxcelValidator.
     * Populated by index.ts after all modules are loaded, avoiding circular imports.
     * @internal
     */
    static _validatorFactory: ((el: any) => any) | null;
    /**
     * Injectable factory for FuxcelModal.
     * Populated by index.ts after all modules are loaded, avoiding circular imports.
     * @internal
     */
    static _modalFactory: ((el: any) => any) | null;
    /**
     * Injectable fxFetch function.
     * Populated by index.ts — avoids circular imports between Fuxcel and http/fxFetch.
     * @internal
     */
    static _fxFetch: ((options: any) => void) | null;
    /**
     * Injectable fxModal function.
     * Populated by index.ts — avoids circular imports between Fuxcel and modal/fxModal.
     * @internal
     */
    static _fxModal: ((options?: any) => any) | null;
    constructor(selector: string | IterableElement | any, context?: string | IterableElement | any);
    /**
     * Perform Fadeout animation on selected element.*
     *
     * @returns {Promise<Fuxcel>}
     */
    fadeout(): Promise<Fuxcel>;
    /**
     * Perform Fadeout animation on selected element.
     *
     * @param {number} timeout Animation duration.
     * @returns {Promise<Fuxcel>}
     */
    fadeout(timeout: number): Promise<Fuxcel>;
    /**
     * Perform Fadeout animation on selected element.
     *
     * @param {string} display Initial CSS display.
     * @returns {Promise<Fuxcel>}
     */
    fadeout(display: string): Promise<Fuxcel>;
    /**
     * Perform Fadeout animation on selected element.
     *
     * @param {number} timeout Animation duration.
     * @param {number} iteration Animation iteration count.
     * @returns {Promise<Fuxcel>}
     */
    fadeout(timeout: number, iteration: number): Promise<Fuxcel>;
    /**
     * Perform Fadeout animation on selected element.
     *
     * @param {number} timeout Animation duration.
     * @param {string} display Initial CSS display.
     * @returns {Promise<Fuxcel>}
     */
    fadeout(timeout: number, display: string): Promise<Fuxcel>;
    /**
     * Perform Fadeout animation on selected element.
     *
     * @param {number} timeout Animation duration.
     * @param {number} iteration Animation iteration count
     * @param {string} display Initial CSS display
     * @returns {Promise<Fuxcel>}
     */
    fadeout(timeout: number, iteration: number, display: string): Promise<Fuxcel>;
    /**
     * Perform Fadein animation on selected element.*
     *
     * @returns {Promise<Fuxcel>}
     */
    fadein(): Promise<Fuxcel>;
    /**
     * Perform Fadein animation on selected element.
     *
     * @param {number} timeout Animation duration.
     * @returns {Promise<Fuxcel>}
     */
    fadein(timeout: number): Promise<Fuxcel>;
    /**
     * Perform Fadein animation on selected element.
     *
     * @param {string} display Initial CSS display.
     * @returns {Promise<Fuxcel>}
     */
    fadein(display: string): Promise<Fuxcel>;
    /**
     * Perform Fadein animation on selected element.
     *
     * @param {number} timeout Animation duration.
     * @param {number} iteration Animation iteration count.
     * @returns {Promise<Fuxcel>}
     */
    fadein(timeout: number, iteration: number): Promise<Fuxcel>;
    /**
     * Perform Fadein animation on selected element.
     *
     * @param {number} timeout Animation duration.
     * @param {string} display Initial CSS display.
     * @returns {Promise<Fuxcel>}
     */
    fadein(timeout: number, display: string): Promise<Fuxcel>;
    /**
     * Perform Fadein animation on selected element.
     *
     * @param {number} timeout Animation duration.
     * @param {number} iteration Animation iteration count
     * @param {string} display Initial CSS display
     * @returns {Promise<Fuxcel>}
     */
    fadein(timeout: number, iteration: number, display: string): Promise<Fuxcel>;
    /**
     * Perform _Slidein-down_ animation on selected element.
     *
     * @returns {Promise<Fuxcel>}
     */
    slideindown(): Promise<Fuxcel>;
    /**
     * Perform _Slidein-down_ animation on selected element.
     *
     * @param {number} timeout Animation duration.
     * @returns {Promise<Fuxcel>}
     */
    slideindown(timeout: number): Promise<Fuxcel>;
    /**
     * Perform _Slidein-down_ animation on selected element.
     *
     * @param {string} display Initial CSS display.
     * @returns {Promise<Fuxcel>}
     */
    slideindown(display: string): Promise<Fuxcel>;
    /**
     * Perform _Slidein-down_ animation on selected element.
     *
     * @param {number} timeout Animation duration.
     * @param {number} iteration Animation iteration count.
     * @returns {Promise<Fuxcel>}
     */
    slideindown(timeout: number, iteration: number): Promise<Fuxcel>;
    /**
     * Perform _Slidein-down_ animation on selected element.
     *
     * @param {number} timeout Animation duration.
     * @param {string} display Initial CSS display.
     * @returns {Promise<Fuxcel>}
     */
    slideindown(timeout: number, display: string): Promise<Fuxcel>;
    /**
     * Perform _Slidein-down_ animation on selected element.
     *
     * @param {number} timeout Animation duration.
     * @param {number} iteration Animation iteration count
     * @param {string} display Initial CSS display
     * @returns {Promise<Fuxcel>}
     */
    slideindown(timeout: number, iteration: number, display: string): Promise<Fuxcel>;
    /**
     * Perform _Slidein-up_ animation on selected element.
     *
     * @returns {Promise<Fuxcel>}
     */
    slideinup(): Promise<Fuxcel>;
    /**
     * Perform _Slidein-up_ animation on selected element.
     *
     * @param {number} timeout Animation duration.
     * @returns {Promise<Fuxcel>}
     */
    slideinup(timeout: number): Promise<Fuxcel>;
    /**
     * Perform _Slidein-up_ animation on selected element.
     *
     * @param {string} display Initial CSS display.
     * @returns {Promise<Fuxcel>}
     */
    slideinup(display: string): Promise<Fuxcel>;
    /**
     * Perform _Slidein-up_ animation on selected element.
     *
     * @param {number} timeout Animation duration.
     * @param {number} iteration Animation iteration count.
     * @returns {Promise<Fuxcel>}
     */
    slideinup(timeout: number, iteration: number): Promise<Fuxcel>;
    /**
     * Perform _Slidein-up_ animation on selected element.
     *
     * @param {number} timeout Animation duration.
     * @param {string} display Initial CSS display.
     * @returns {Promise<Fuxcel>}
     */
    slideinup(timeout: number, display: string): Promise<Fuxcel>;
    /**
     * Perform _Slidein-up_ animation on selected element.
     *
     * @param {number} timeout Animation duration.
     * @param {number} iteration Animation iteration count.
     * @param {string} display Initial CSS display.
     * @returns {Promise<Fuxcel>}
     */
    slideinup(timeout: number, iteration: number, display: string): Promise<Fuxcel>;
    /**
     * Perform _Slideout-down_ animation on selected element.
     *
     * @returns {Promise<Fuxcel>}
     */
    slideoutdown(): Promise<Fuxcel>;
    /**
     * Perform _Slideout-down_ animation on selected element.*
     *
     * @param {number} timeout Animation duration.
     * @returns {Promise<Fuxcel>}
     */
    slideoutdown(timeout: number): Promise<Fuxcel>;
    /**
     * Perform _Slideout-down_ animation on selected element.
     *
     * @param {string} display Initial CSS display.
     * @returns {Promise<Fuxcel>}
     */
    slideoutdown(display: string): Promise<Fuxcel>;
    /**
     * Perform _Slideout-down_ animation on selected element.
     *
     * @param {number} timeout Animation duration.
     * @param {number} iteration Animation iteration count.
     * @returns {Promise<Fuxcel>}
     */
    slideoutdown(timeout: number, iteration: number): Promise<Fuxcel>;
    /**
     * Perform _Slideout-down_ animation on selected element.
     *
     * @param {number} timeout Animation duration.
     * @param {string} display Initial CSS display.
     * @returns {Promise<Fuxcel>}
     */
    slideoutdown(timeout: number, display: string): Promise<Fuxcel>;
    /**
     * Perform _Slideout-down_ animation on selected element.
     *
     * @param {number} timeout Animation duration.
     * @param {number} iteration Animation iteration count.
     * @param {string} display Initial CSS display.
     * @returns {Promise<Fuxcel>}
     */
    slideoutdown(timeout: number, iteration: number, display: string): Promise<Fuxcel>;
    /**
     * Perform _Slideout-up_ animation on selected element.
     *
     * @returns {Promise<Fuxcel>}
     */
    slideoutup(): Promise<Fuxcel>;
    /**
     * Perform _Slideout-up_ animation on selected element.
     *
     * @param {number} timeout Animation duration.
     * @returns {Promise<Fuxcel>}
     */
    slideoutup(timeout: number): Promise<Fuxcel>;
    /**
     * Perform _Slideout-up_ animation on selected element.
     *
     * @param {string} display Initial CSS display.
     * @returns {Promise<Fuxcel>}
     */
    slideoutup(display: string): Promise<Fuxcel>;
    /**
     * Perform _Slideout-up_ animation on selected element.
     *
     * @param {number} timeout Animation duration.
     * @param {number} iteration Animation iteration count.
     * @returns {Promise<Fuxcel>}
     */
    slideoutup(timeout: number, iteration: number): Promise<Fuxcel>;
    /**
     * Perform _Slideout-up_ animation on selected element.
     *
     * @param {number} timeout Animation duration.
     * @param {string} display Initial CSS display.
     * @returns {Promise<Fuxcel>}
     */
    slideoutup(timeout: number, display: string): Promise<Fuxcel>;
    /**
     * Perform _Slideout-up_ animation on selected element.
     *
     * @param {number} timeout Animation duration.
     * @param {number} iteration Animation iteration count.
     * @param {string} display Initial CSS display.
     * @returns {Promise<Fuxcel>}
     */
    slideoutup(timeout: number, iteration: number, display: string): Promise<Fuxcel>;
    /**
     * Perform _Slidein-left_ animation on selected element.
     *
     * @returns {Promise<Fuxcel>}
     */
    slideinleft(): Promise<Fuxcel>;
    /**
     * Perform _Slidein-left_ animation on selected element.
     *
     * @param {number} timeout Animation duration.
     * @returns {Promise<Fuxcel>}
     */
    slideinleft(timeout: number): Promise<Fuxcel>;
    /**
     * Perform _Slidein-left_ animation on selected element.
     *
     * @param {string} display Initial CSS display.
     * @returns {Promise<Fuxcel>}
     */
    slideinleft(display: string): Promise<Fuxcel>;
    /**
     * Perform _Slidein-left_ animation on selected element.
     *
     * @param {number} timeout Animation duration.
     * @param {number} iteration Animation iteration count.
     * @returns {Promise<Fuxcel>}
     */
    slideinleft(timeout: number, iteration: number): Promise<Fuxcel>;
    /**
     * Perform _Slidein-left_ animation on selected element.
     *
     * @param {number} timeout Animation duration.
     * @param {string} display Initial CSS display.
     * @returns {Promise<Fuxcel>}
     */
    slideinleft(timeout: number, display: string): Promise<Fuxcel>;
    /**
     * Perform _Slidein-left_ animation on selected element.
     *
     * @param {number} timeout Animation duration.
     * @param {number} iteration Animation iteration count.
     * @param {string} display Initial CSS display.
     * @returns {Promise<Fuxcel>}
     */
    slideinleft(timeout: number, iteration: number, display: string): Promise<Fuxcel>;
    /**
     * Perform _Slideout-left_ animation on selected element.
     *
     * @returns {Promise<Fuxcel>}
     */
    slideoutleft(): Promise<Fuxcel>;
    /**
     * Perform _Slideout-left_ animation on selected element.
     *
     * @param {number} timeout Animation duration.
     * @returns {Promise<Fuxcel>}
     */
    slideoutleft(timeout: number): Promise<Fuxcel>;
    /**
     * Perform _Slideout-left_ animation on selected element.
     *
     * @param {string} display Initial CSS display.
     * @returns {Promise<Fuxcel>}
     */
    slideoutleft(display: string): Promise<Fuxcel>;
    /**
     * Perform _Slideout-left_ animation on selected element.
     *
     * @param {number} timeout Animation duration.
     * @param {number} iteration Animation iteration count.
     * @returns {Promise<Fuxcel>}
     */
    slideoutleft(timeout: number, iteration: number): Promise<Fuxcel>;
    /**
     * Perform _Slideout-left_ animation on selected element.
     *
     * @param {number} timeout Animation duration.
     * @param {string} display Initial CSS display.
     * @returns {Promise<Fuxcel>}
     */
    slideoutleft(timeout: number, display: string): Promise<Fuxcel>;
    /**
     * Perform _Slideout-left_ animation on selected element.
     *
     * @param {number} timeout Animation duration.
     * @param {number} iteration Animation iteration count.
     * @param {string} display Initial CSS display.
     * @returns {Promise<Fuxcel>}
     */
    slideoutleft(timeout: number, iteration: number, display: string): Promise<Fuxcel>;
    /**
     * Perform _Slideout-left_ animation on selected element.
     *
     * @returns {Promise<Fuxcel>}
     */
    slideinright(): Promise<Fuxcel>;
    /**
     * Perform _Slideout-left_ animation on selected element.
     *
     * @param {string | number} timeout Animation duration.
     * @returns {Promise<Fuxcel>}
     */
    slideinright(timeout: number): Promise<Fuxcel>;
    /**
     * Perform _Slideout-left_ animation on selected element.
     *
     * @param {string} display Initial CSS display.
     * @returns {Promise<Fuxcel>}
     */
    slideinright(display: string): Promise<Fuxcel>;
    /**
     * Perform _Slideout-left_ animation on selected element.
     *
     * @param {number} timeout Animation duration.
     * @param {number} iteration Animation iteration count.
     * @returns {Promise<Fuxcel>}
     */
    slideinright(timeout: number, iteration: number): Promise<Fuxcel>;
    /**
     * Perform _Slideout-left_ animation on selected element.
     *
     * @param {number} timeout Animation duration.
     * @param {string} display Initial CSS display.
     * @returns {Promise<Fuxcel>}
     */
    slideinright(timeout: number, display: string): Promise<Fuxcel>;
    /**
     * Perform _Slideout-left_ animation on selected element.
     *
     * @param {number} timeout Animation duration.
     * @param {number} iteration Animation iteration count.
     * @param {string} display Initial CSS display.
     * @returns {Promise<Fuxcel>}
     */
    slideinright(timeout: number, iteration: number, display: string): Promise<Fuxcel>;
    /**
     * Perform _Slideout-right_ animation on selected element.
     *
     * @returns {Promise<Fuxcel>}
     */
    slideoutright(): Promise<Fuxcel>;
    /**
     * Perform _Slideout-right_ animation on selected element.
     *
     * @param {number} timeout Animation duration.
     * @returns {Promise<Fuxcel>}
     */
    slideoutright(timeout: number): Promise<Fuxcel>;
    /**
     * Perform _Slideout-right_ animation on selected element.
     *
     * @param {string} display Initial CSS display.
     * @returns {Promise<Fuxcel>}
     */
    slideoutright(display: string): Promise<Fuxcel>;
    /**
     * Perform _Slideout-right_ animation on selected element.
     *
     * @param {number} timeout Animation duration.
     * @param {number} iteration Animation iteration count.
     * @returns {Promise<Fuxcel>}
     */
    slideoutright(timeout: number, iteration: number): Promise<Fuxcel>;
    /**
     * Perform _Slideout-right_ animation on selected element.
     *
     * @param {number} timeout Animation duration.
     * @param {string} display Initial CSS display.
     * @returns {Promise<Fuxcel>}
     */
    slideoutright(timeout: number, display: string): Promise<Fuxcel>;
    /**
     * Perform _Slideout-right_ animation on selected element.
     *
     * @param {number} timeout Animation duration.
     * @param {number} iteration Animation iteration count.
     * @param {string} display Initial CSS display.
     * @returns {Promise<Fuxcel>}
     */
    slideoutright(timeout: number, iteration: number, display: string): Promise<Fuxcel>;
    /**
     * Perform _Blink_ animation on selected element.
     *
     * @returns {Promise<Fuxcel>}
     */
    blink(): Promise<Fuxcel>;
    /**
     * Perform _Blink_ animation on selected element.
     *
     * @param {number} timeout Animation duration.
     * @returns {Promise<Fuxcel>}
     */
    blink(timeout: number): Promise<Fuxcel>;
    /**
     * Perform _Blink_ animation on selected element.
     *
     * @param {string} display Initial CSS display.
     * @returns {Promise<Fuxcel>}
     */
    blink(display: string): Promise<Fuxcel>;
    /**
     * Perform _Blink_ animation on selected element.
     *
     * @param {number} timeout Animation duration.
     * @param {number} iteration Animation iteration count.
     * @returns {Promise<Fuxcel>}
     */
    blink(timeout: number, iteration: number): Promise<Fuxcel>;
    /**
     * Perform _Blink_ animation on selected element.
     *
     * @param {number} timeout Animation duration.
     * @param {string} display Initial CSS display.
     * @returns {Promise<Fuxcel>}
     */
    blink(timeout: number, display: string): Promise<Fuxcel>;
    /**
     * Perform _Blink_ animation on selected element.
     *
     * @param {number} timeout Animation duration.
     * @param {number} iteration Animation iteration count.
     * @param {string} display Initial CSS display.
     * @returns {Promise<Fuxcel>}
     */
    blink(timeout: number, iteration: number, display: string): Promise<Fuxcel>;
    /**
     * Perform _Shake_ animation on selected element.
     *
     * @returns {Promise<Fuxcel>}
     */
    shake(): Promise<Fuxcel>;
    /**
     * Perform _Shake_ animation on selected element.
     *
     * @param {number} timeout Animation duration.
     * @returns {Promise<Fuxcel>}
     */
    shake(timeout: number): Promise<Fuxcel>;
    /**
     * Perform _Shake_ animation on selected element.
     *
     * @param {string} scale Initial CSS display.
     * @returns {Promise<Fuxcel>}
     */
    shake(scale: string): Promise<Fuxcel>;
    /**
     * Perform _Shake_ animation on selected element.
     *
     * @param {number} timeout Animation duration.
     * @param {number} iteration Animation iteration count.
     * @returns {Promise<Fuxcel>}
     */
    shake(timeout: number, iteration: number): Promise<Fuxcel>;
    /**
     * Perform _Shake_ animation on selected element.
     *
     * @param {number} timeout Animation duration.
     * @param {string} scale Initial CSS display.
     * @returns {Promise<Fuxcel>}
     */
    shake(timeout: number, scale: string): Promise<Fuxcel>;
    /**
     * Perform _Shake_ animation on selected element.
     *
     * @param {number} timeout Animation duration.
     * @param {number} iteration Animation iteration count.
     * @param {string} scale Initial CSS display.
     * @returns {Promise<Fuxcel>}
     */
    shake(timeout: number, iteration: number, scale: string): Promise<Fuxcel>;
    /**
     * Perform _Zoom-in_ animation on selected element.
     *
     * @returns {Promise<Fuxcel>}
     */
    zoomin(): Promise<Fuxcel>;
    /**
     * Perform _Zoom-in_ animation on selected element.
     *
     * @param {number} timeout Animation duration.
     * @returns {Promise<Fuxcel>}
     */
    zoomin(timeout: number): Promise<Fuxcel>;
    /**
     * Perform _Zoom-in_ animation on selected element.
     *
     * @param {string} display Initial CSS display.
     * @returns {Promise<Fuxcel>}
     */
    zoomin(display: string): Promise<Fuxcel>;
    /**
     * Perform _Zoom-in_ animation on selected element.
     *
     * @param {number} timeout Animation duration.
     * @param {number} iteration Animation iteration count.
     * @returns {Promise<Fuxcel>}
     */
    zoomin(timeout: number, iteration: number): Promise<Fuxcel>;
    /**
     * Perform _Zoom-in_ animation on selected element.
     *
     * @param {number} timeout Animation duration.
     * @param {string} display Initial CSS display.
     * @returns {Promise<Fuxcel>}
     */
    zoomin(timeout: number, display: string): Promise<Fuxcel>;
    /**
     * Perform _Zoom-in_ animation on selected element.
     *
     * @param {number} timeout Animation duration.
     * @param {number} iteration Animation iteration count.
     * @param {string} display Initial CSS display.
     * @returns {Promise<Fuxcel>}
     */
    zoomin(timeout: number, iteration: number, display: string): Promise<Fuxcel>;
    /**
     * Checks if selected element contains given class.
     *
     * @param {string} token
     * @return {boolean} true if element contains given class; false otherwise.
     */
    hasClass(token: string): boolean;
    /**
     * Add class(es) to the classlist of the selected element.
     *
     * @param tokenList {...string} Comma separated strings of class(es) to add.
     */
    putClass(...tokenList: string[]): Fuxcel;
    /**
     * Replace an existing class with the given class.
     *
     * _Add the new class old class if not found._
     *
     * @param oldToken {string} Old class token.
     * @param newToken {string} New class token.
     */
    replaceClass(oldToken: string, newToken: string): Fuxcel;
    /**
     * Removes the given class(es) from the classlist of the given elements.
     *
     * @param tokenList {...string} Comma separated strings of class(es) to remove.
     */
    removeClass(...tokenList: string[]): Fuxcel;
    /**
     * Toggle the given classin the classlist of the given element.
     *
     * @param token {string} Class to toggle.
     */
    toggleClass(token: string): Fuxcel;
    /**
     * Perform a callback once for each selected element.
     *
     * @param callback {((element: this, index: number, elements: HTMLElement[]) => void)}
     */
    each(callback: (element: this, index: number, elements: HTMLElement[]) => void): void;
    /**
     * Creates a [shallow copy](https://developer.mozilla.org/en-us/docs/Glossary/Shallow_copy) of a portion of a given set of selected elements, filtered down to just the elements from the given array that pass the test implemented by the provided function.
     *
     * @param callback {((element: this, index: number, elements: HTMLElement[]) => boolean)}
     */
    filter(callback: (element: this, index: number, elements: HTMLElement[]) => boolean): this;
    /**
     * Set the given attribute(s) for the selected element.
     *
     * @param value {object} Key-Value pair Object to set for the attribute(s).
     * @return {Fuxcel|string}
     */
    attrib(value: object): Fuxcel;
    /**
     * Get the given attribute for the selected element.
     *
     * @param name {string} Name of the attribute.
     * @return {Fuxcel|string}
     */
    attrib(name: string): string;
    /**
     * Set the given attribute(s) for the selected element.
     *
     * @param name {string} Name of the attribute or a Key-Value pair Object.
     * @param value {string | boolean} Value to set for the attribute.
     * @return {Fuxcel|string}
     */
    attrib(name: string, value: string | boolean): Fuxcel;
    /**
     * Set the given [data-*] attribute(s) for the selected element.
     *
     * @param value {object} Key-Value pair Object to set for the [data-*] attribute(s).
     * @return {Fuxcel | string}
     */
    dataAttrib(value: object): Fuxcel;
    /**
     * Get the given [data-*] attribute.
     *
     * @param name {string} Name of the [data-*] attribute.
     * @return {Fuxcel | string}
     */
    dataAttrib(name: string): string;
    /**
     * Set the given [data-*] attribute(s) for the selected element.
     *
     * @param name {string} Name of the [data-*] attribute or a Key-Value pair Object.
     * @param value {string | object} Value to set for the [data-*] attribute.
     * @return {Fuxcel | string}
     */
    dataAttrib(name: string, value: string | boolean): Fuxcel;
    /**
     * Set the given property / properties for the selected element.
     *
     * @param value {object} Key-Value pair Object to set for the property / properties.
     * @return {Fuxcel | string}
     */
    prop(value: object): Fuxcel;
    /**
     * Get the given property for the selected element.
     *
     * @param name {string} Name of the property.
     * @return {Fuxcel | string}
     */
    prop(name: string): string;
    /**
     * Set the given property for the selected element.
     *
     * @param name {string} Name of the property or a Key-Value pair Object.
     * @param value {string | boolean} Value to set for the property.
     * @return {Fuxcel | string}
     */
    prop(name: string, value: string | boolean): Fuxcel;
    /**
     * Set the given CSS style(s) value of the selected element.
     *
     * @param value {object} Key-value pair Object to set for the style(s).
     * @return {Fuxcel | string}
     */
    style(value: object): Fuxcel;
    /**
     * Get the given CSS style value of the selected element.
     *
     * @param name {string} Name of the style.
     * @return {Fuxcel | string}
     */
    style(name: string): string;
    /**
     * Set the given CSS style value of the selected element.
     *
     * @param name {string} Name of the style.
     * @param value {string | boolean} Value to set for the style.
     * @return {Fuxcel | string}
     */
    style(name: string, value: string | boolean): Fuxcel;
    /**
     * Returns the attributes of the selected element as on Object.
     *
     * @return {Object} A Key-value-pair object containing the attributes of the selected element.
     */
    listAttrib(): object;
    /**
     * Returns the properties of the selected element as on key-value pair Object.
     *
     * @return {Object} A Key-value-pair object containing the properties of the selected element.
     */
    listProp(): object;
    /**
     * Set the `innerHTML` of each selected element, replacing all existing content.
     *
     * When no position is provided, the inner HTML of the element is replaced entirely.
     *
     * @param value {string} HTML string to insert.
     * @returns {Fuxcel} The current `Fuxcel` instance for chaining.
     *
     * @example
     * // Replace inner HTML entirely
     * fx('#container').insertHTML('<p>Hello</p>');
     *
     * @example
     * // Chainable
     * fx('#container').insertHTML('<p>Hello</p>').addClass('loaded');
     */
    insertHTML(value: string): Fuxcel;
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
     * @param position {InsertPositions} Where to insert relative to the selected element.
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
     * @breaking v2.0.1 - The `position` options has changed.
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
    insertHTML(value: string, position: InsertPositions): Fuxcel;
    /**
     * Insert one or more nodes relative to each selected element using the default `'append'` position.
     *
     * Accepts a single node or an array of nodes. Each node can be a raw `HTMLElement`,
     * a plain string, or a `Fuxcel` instance.
     *
     * @param nodes {HTMLElement | FuxcelBase | string | (HTMLElement | FuxcelBase | string)[]} Node(s) to insert.
     * @returns {Fuxcel} The current `Fuxcel` instance for chaining.
     *
     * @example
     * fx('#container').insertNode('<p>Hello</p>');
     * fx('#container').insertNode([fx('#header'), '<hr>', document.createElement('p')]);
     *
     * @since 2.0.1
     */
    insertNode(nodes: HTMLElement | FuxcelBase | string | (HTMLElement | FuxcelBase | string)[]): this;
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
     * @param nodes {HTMLElement | Fuxcel | string | (HTMLElement | Fuxcel | string)[]} Node(s) to insert.
     * @param position {InsertPosition} Where to insert relative to the selected element. Defaults to `'append'`.
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
    insertNode(nodes: HTMLElement | FuxcelBase | string | (HTMLElement | FuxcelBase | string)[], position: InsertPositions): this;
    /**
     * Remove each selected element from the DOM.
     *
     * Removes the element(s) completely.
     *
     * @returns {void}
     *
     * @example
     * // Full removal
     * fx('#banner').remove();
     */
    remove(): void;
    /**
     * Remove each selected element from the DOM.
     *
     * Removes the element(s) completely.
     *
     * @param detach {boolean} Pass `true` to detach instead of fully removing. Defaults to `false`.
     * @returns {void}
     *
     * @example
     * // Full removal
     * fx('#banner').remove(false);
     */
    remove(detach: false): void;
    /**
     * Detach each selected element from the DOM.
     *
     * Detach the element(s) from the DOM but its event
     * listeners and internal data are preserved, allowing it to be reinserted later.
     *
     * @param detach {boolean=true} detach instead of fully removing.
     * @returns {Fuxcel} The current `Fuxcel` instance for chaining.
     *
     * @example
     * // Detach — preserves listeners for reinsertion
     * const header = fx('#header').remove(true);
     * fx('#new-container').append(header);
     */
    remove(detach: true): Fuxcel;
    /**
     * Disables or enables the selected element(s).
     *
     * @param disabled {boolean} Switch between disabling and enabling the selected element(s).
     * @return {Fuxcel} Fuxcel Object of the selected element.
     */
    disable(disabled?: boolean): Fuxcel;
    /**
     * Removes the given attribute(s) from the selected element.
     *
     * @param name {...string} Comma separated strings of attribute(s) to remove.
     * @return {Fuxcel} Fuxcel Object of the selected element
     */
    removeAttrib(...name: string[]): Fuxcel;
    /**
     * Removes the given [data-*] attribute(s) from the selected element.
     *
     * @param name {...string} Comma separated strings of [data-*] attribute(s) to remove.
     * @return {Fuxcel} Fuxcel Object of the selected element
     */
    removeDataAttrib(...name: string[]): Fuxcel;
    /**
     * Removes the given property / properties from the selected element.
     *
     * @param name {...string} Comma separated strings of property / properties to remove.
     * @return {Fuxcel} Fuxcel Object of the selected element
     */
    removeProp(...name: string[]): Fuxcel;
    /**
     * Returns the element at index '0' in the current selection.
     *
     * @returns {Fuxcel} Fuxcel instance of the element at the given index.
     *
     * @example
     * fx('#list li').at()   // first item
     */
    at(): Fuxcel;
    /**
     * Returns the element at the given index in the current selection.
     * Supports negative indices — `-1` returns the last element, `-2` the second to last, and so on.
     *
     * @param index {number} Zero-based index. Negative values count from the end.
     * @returns {Fuxcel} Fuxcel instance of the element at the given index.
     *
     * @example
     * fx('#list li').at(0)   // first item
     * fx('#list li').at(2)   // third item
     * fx('#list li').at(-1)  // last item
     * fx('#list li').at(-2)  // second to last
     */
    at(index: number): Fuxcel;
    /**
     * Returns the direct descendants (Children) of the selected element.
     *
     * @return {Fuxcel} Fuxcel Object of the selected child(ren)
     */
    children(): Fuxcel;
    /**
     * Returns the direct descendant (Child) of the selected element that matches the given selector.
     *
     * @param selector {Selector} Selectable string.
     * @return {Fuxcel} Fuxcel Object of the selected child(ren)
     */
    children(selector: Selector): Fuxcel;
    /**
     * Returns all the descendants of the selected element.
     *
     * @return {Fuxcel} Fuxcel Object of the selected descendant(s)
     */
    descendants(): Fuxcel;
    /**
     * Returns the descendant of the selected element that matches the given selector.
     *
     * @param selector {Selector} Selectable string.
     * @return {Fuxcel} Fuxcel Object of the selected descendant(s)
     */
    descendants(selector: Selector): Fuxcel;
    /**
     * Returns the parents of the selected element.
     *
     * @return {Fuxcel} Fuxcel Object of the selected parent(s)
     */
    parents(): Fuxcel;
    /**
     * Returns the parent of the selected element that matches the given selector.
     *
     * @param selector {Selector} Selectable string.
     * @return {Fuxcel} Fuxcel Object of the selected parent(s)
     */
    parents(selector: Selector): Fuxcel;
    /**
     * Returns the previous siblings of the selected element.
     *
     * @return {Fuxcel} Fuxcel Object of the selected previous sibling(s)
     */
    prevSiblings(): Fuxcel;
    /**
     * Returns the previous sibling of the selected element that matches the given selector.
     *
     * @param selector {Selector} Selectable string.
     * @return {Fuxcel} Fuxcel Object of the selected previous sibling(s)
     */
    prevSiblings(selector: Selector): Fuxcel;
    /**
     * Returns the siblings of the selected element.
     *
     * @return {Fuxcel} Fuxcel Object of the selected sibling(s)
     */
    siblings(): Fuxcel;
    /**
     * Returns the sibling of the selected element that matchee the given selector.
     *
     * @param selector {Selector} Selectable string.
     * @return {Fuxcel} Fuxcel Object of the selected sibling(s)
     */
    siblings(selector: Selector): Fuxcel;
    /**
     * Checks if the selected element matches the given tag name.
     *
     * @param tagName {string | HTMLElementTagNameMap} HTML tag name to check for.
     * @return {boolean} true if the selected elements' tag name matches the given tag name; false otherwise.
     */
    isElement(tagName: string | HTMLElementTagNameMap): boolean;
    /**
     * Checks to see if the selected element would be selected by the provided selector-string _(i.e. checks if the selector is unique to the selected element)_.
     *
     * @param selector {Selector} Selector to check element against.
     * @return {boolean} true if the selected element would be selected; false otherwise.
     */
    matchSelector(selector: Selector): boolean;
    /**
     * Check if the selected element has a scrollbar in the given direction.
     *
     * @param direction {Direction | null} Specific direction to check _[horizontal or vertical]_.
     * @return {boolean} true if the selected element has a scrollbar in the specified direction; false otherwise.
     */
    hasScrollBar(direction?: (Direction | null)): boolean;
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
    handleFormSubmit({ uri, method, data, dataType, headers, beforeSend, timeout, handleError, }?: FXFormSubmitType): Promise<FXFormResponse>;
    /**
     * Toggle the disabled state (property) of the selected element [a button preferably].
     *
     * @param isLoading {boolean} Determines the state of the button.
     * @return {Promise<Fuxcel>} Promise of Fuxcel Object of the selected element.
     */
    toggleButtonLoadState(isLoading?: boolean): Promise<Fuxcel>;
    /**
     * Toggles the submit button state of the selected form.
     *
     * @param isLoading {boolean} Determines the state of the button.
     * @return {Promise<Fuxcel>} Promise of Fuxcel Object of the selected element.
     */
    toggleFormSubmitButtonState(isLoading?: boolean): Promise<Fuxcel>;
    /**
     * Removes all previous Event Listeners from the selected element if no event is given.
     *
     * @return {Fuxcel} Fuxcel Object of the selected element.
     */
    off(): Fuxcel;
    /**
     * Remove the given Event Listener(s) from the selected element.
     *
     * @param events {...string} Particular event to remove.
     * @return {Fuxcel} Fuxcel Object of the selected element.
     */
    off(...events: string[]): Fuxcel;
    /**
     * Add given Event Listener to the selected element.
     *
     * @param events {string} Event as a string
     * @param listener {EventListener} Listener function to handle given event.
     * @param option {boolean} Optional boolean parameter to set CAPTURING_PHASE of the event listener to either true or false.
     * @example
     *	fx('#email').upon('input', function(e) {
     *    console.log(e);
     *  });
     * @return {Fuxcel} Fuxcel Object of the selected element
     */
    upon(events: string, listener: EventListener, option?: boolean): Fuxcel;
    /**
     * Add given Event Listener to the selected element.
     *
     * @param events {string} Event as an array of strings
     * @param listener {EventListener} Listener function to handle given event.
     * @param option {boolean} Optional boolean parameter to set CAPTURING_PHASE of the event listener to either true or false.
     * @example
     *  fx('#email').upon(['focus', 'input'], function(e) {
     *    console.log(e);
     *  });
     * @return {Fuxcel} Fuxcel Object of the selected element
     */
    upon(events: string[], listener: EventListener, option?: boolean): Fuxcel;
    /**
     * Add given Event Listener to the selected element.
     *
     * @param events {object} Event as an array of strings
     * @param option {boolean} boolean parameter to set CAPTURING_PHASE of the event listener to either true or false.
     * @example
     *  fx('#email').upon({
     *    input: function(e) {
     *      console.log(e);
     *    },
     *    focus: (e) => console.log(e);
     *  }, true);
     * @return {Fuxcel} Fuxcel Object of the selected element
     */
    upon(events: object, option: boolean): Fuxcel;
    /**
     * Add given Event Listener to the selected element.
     *
     * @param events {object} Event as an array of strings
     * @example
     *  fx('#email').upon(['focus', 'input'], function(e) {
     *    console.log(e)
     *  });
     * @return {Fuxcel} Fuxcel Object of the selected element
     */
    upon(events: object): Fuxcel;
    /**
     * Trigger a new event on the selected element(s).
     *
     * @param {Event} event
     * @returns {Fuxcel}
     */
    trigger(event: Event): Fuxcel;
    /**
     * Trigger a new event on the selected element(s).
     *
     * @param {string} event
     * @returns {Fuxcel}
     */
    trigger(event: string): Fuxcel;
    /**
     * Trigger a new event on the selected element(s).
     *
     * @param {string} event
     * @param {"mouse" | "keyboard" | "custom" | null} type
     * @returns {Fuxcel}
     */
    trigger(event: string, type: ('mouse' | 'keyboard' | 'custom' | null)): Fuxcel;
    /**
     * Get the value of the selected element.
     *
     * @return {StringOrNull | string[]} The value of the selected element.
     */
    value(): StringOrNull | string[];
    /**
     * Set the value of the selected element.
     *
     * @param value {string} Value to set for the given element (If available).
     * @return {Fuxcel} Fuxcel object of the selected element.
     */
    value(value: string): Fuxcel;
    /**
     * Validate one or more newly added form-group elements against their parent form's
     * existing validator instance — without needing to re-initialize the entire form.
     *
     * For each selected element:
     * - Skips it (with a `console.debug` message) if it doesn't have the `.form-group` class.
     * - Skips it (with a `console.debug` message) if no parent `<form>` element is found.
     * - Skips it (with a `console.debug` message) if the parent `<form>` has no `id` attribute _(required for validator tracking)_.
     * - Otherwise, forwards it to `FuxcelValidator.validateFromGroup`, tagged with `'extendValidation'`
     *   as the source — so if the form-group was already validated, the resulting warning identifies
     *   this method as the caller.
     *
     * @return {void}
     *
     * @example
     * // Add a new field, then extend validation to include it
     * fx('#login-form').insertNode(newFormGroup, 'append');
     * fx(newFormGroup).extendValidation();
     *
     * @example
     * // Extend validation across multiple newly added form-groups at once
     * fx('.form-group.newly-added').extendValidation();
     *
     * @see {@link FuxcelValidator.validateFromGroup} - Underlying validation call for each form-group.
     *
     * @since 2.2.0
     */
    extendValidation(): void;
    /**
     * @return {DOMTokenList} The class list of an element.
     */
    get classes(): DOMTokenList;
    /** Returns the `FieldAttributes` of the first selected element. */
    get fieldAttributes(): {
        id: string | undefined;
        fxName: string | undefined;
        type: string | null;
        fxId: string | null;
        fxRole: string | null;
        formId: any;
    };
    /**
     *  @return {Promise<boolean>} A promise with a boolean argument; true if the given element has the mouse focus; false otherwise.
     */
    get hasFocus(): Promise<boolean>;
    /**
     * @return {string} The Inner Text value of the given element.
     */
    get innerText(): string;
    /**
     * @return {string} The Outer Text value of the given element.
     */
    get outerText(): string;
    /**
     * @return {string} The Inner HTML value of the given element.
     */
    get innerHTML(): string;
    /**
     * @return {string} The Outer HTML value of the given element.
     */
    get outerHTML(): string;
    /**
     * @return {boolean} Returns true if the selected element has the disabled property; false otherwise.
     */
    get isDisabled(): boolean;
    /**
     * @return {boolean} Returns true if the selected element is a form element.
     */
    get isFormElement(): boolean;
    /** TRAVERSAL **/
    /** Returns the direct parent of the first selected element. */
    get parent(): this;
    /** Returns the next sibling of the first selected element. */
    get next(): this;
    /** Returns the previous sibling of the first selected element. */
    get previous(): this;
    /** Returns the first element in the current selection. */
    get first(): this;
    /** Returns the last element in the current selection. */
    get last(): this;
    /** Returns a new `FuxcelValidator` bound to this element. */
    get formValidator(): FuxcelValidator;
    /** Returns a new `FuxcelModal` bound to this element. */
    get modal(): FuxcelModal;
    /**
     * Set The Inner Text value of the given element.
     *
     * @param text {string} Text to set
     */
    set innerText(text: string);
    /**
     * Set The Outer Text value of the given element.
     *
     * @param text {string} Text to set
     */
    set outerText(text: string);
    /**
     * @return {string} The global Button Loader class.
     */
    static get buttonLoaderClass(): string;
    /**
     * Set the Button Loader class globally.
     *
     * @param token {string} Class selector of button loader.
     */
    static set buttonLoaderClass(token: string);
    /**
     * @return {string|null} The Plugin path.
     */
    static get path(): string | null;
    /**
     * Set the Plugin path globally.
     *
     * @param path {string} the relative path.
     */
    static set path(path: string);
}

/**
 * fuxcel — Consolidated type declarations.
 *
 * This is the single source of truth for every type, interface, and global
 * augmentation in the library. It covers both usage contexts:
 *
 * ── ESM / module usage ───────────────────────────────────────────────────────
 * All types are exported as named exports and can be imported normally:
 *
 *   import type { FXRequestType, ValidatorConfigObject } from 'fuxcel';
 *
 * ── Script-tag / non-module usage ────────────────────────────────────────────
 * The `global {}` block augments `Window` and the global scope so IDEs surface
 * full intellisense for `fx`, `fuxcel`, `FuxcelValidator` etc. without any
 * import statement. Activate with one of:
 *
 *   /// <reference path="./node_modules/fuxcel/src/global.d.ts" />
 *
 *   // tsconfig.json
 *   { "include": ["node_modules/fuxcel/src/global.d.ts"] }
 */

/** Array of elements **/
type IterableElement = {} | FuxcelBase | NodeList | HTMLCollection | HTMLElement[] | HTMLScriptElement[] | HTMLFormElement[] | HTMLInputElement[] | HTMLOptionElement[] | HTMLSelectElement[] | HTMLTextAreaElement[] | Document[];
type SingleElement = HTMLElement | HTMLFormElement | HTMLInputElement | HTMLOptionElement | HTMLSelectElement | HTMLTextAreaElement | Document | Element;
type Direction = 'horizontal' | 'vertical';
type InsertPositions = 'before' | 'prepend' | 'append' | 'after';
type StringOrNull = string | null;
type Selector = StringOrNull;
type CustomEventType = CustomEvent<{
    plugin: string;
    interface: string;
    timestamp: number;
}>;
type EventInterfaces = AnimationEvent | ClipboardEvent | CompositionEvent | CustomEvent | DragEvent | ErrorEvent | Event | FocusEvent | HashChangeEvent | InputEvent | KeyboardEvent | MouseEvent | PointerEvent | PopStateEvent | ProgressEvent | SubmitEvent | StorageEvent | TouchEvent | TransitionEvent | UIEvent | WheelEvent;
type HTMLListenerArray = Array<{
    element: HTMLElement;
    listener: EventListenerOrEventListenerObject | boolean | undefined;
    event: keyof HTMLElementEventMap | string;
    option: boolean;
}>;
interface HTMLElementWithListenerArray extends HTMLElement {
    listeners?: HTMLListenerArray;
}
type FieldAttributes = {
    id: string | any;
    fxName: string | undefined;
    type: StringOrNull | undefined;
    fxId: StringOrNull | undefined;
    fxRole: StringOrNull | undefined;
    formId: StringOrNull;
};
type ValidationProps = {
    /** id attribute of selected form field.        */ id: string;
    /** Selector of the form group element.         */ formGroup: string;
    /** Selector of the validation message field.   */ validationField: string;
    /** Selector of the valid icon.                 */ validIcon: string;
    /** Selector of the invalid icon.               */ invalidIcon: string;
    /** Selector of the validation icons container. */ validationIconField: string;
};
type ValidatorConfigObject = {
    regExp?: {
        cardCVV?: RegExp | null;
        cardNumber?: RegExp | null;
        email?: RegExp | null;
        name?: RegExp | null;
        phone?: RegExp | null;
        password?: RegExp | null;
        username?: RegExp | null;
    };
    config?: {
        capslockAlert?: boolean;
        showIcons?: boolean;
        showPassword?: boolean;
        validateCard?: boolean;
        validateEmail?: boolean;
        validateName?: boolean;
        validatePassword?: boolean;
        validatePhone?: boolean;
        validateUsername?: boolean;
        nativeValidation?: boolean;
        useDefaultStyling?: boolean;
        showPasswordStrength?: boolean;
        passwordConfirmId?: 'password_confirmation' | string;
        passwordId?: 'password' | string;
        initWrapper?: '.form-group' | string;
    };
    stepForm?: {
        use?: boolean;
        plugin?: boolean;
        config?: {
            slides?: boolean;
            step?: string;
            switch?: string;
        };
    };
    texts?: {
        capslockFormat?: string;
        emailFormat?: string | null;
        nameFormat?: string | null;
        phoneFormat?: string | null;
        passwordFormat?: string | null;
        usernameFormat?: string | null;
    };
};
type FormValidationRegistryBag = Record<string, {
    configObject: ValidatorConfigObject;
    bag: {
        [key: string]: any;
    };
    count: number;
    passwordStrength?: StrengthResult | null;
    steps: Record<string, {
        bag: {
            [key: string]: any;
        };
        count: number;
    }>;
}>;
type Strength = 'weak' | 'fair' | 'good' | 'strong';
interface ExtractedRule {
    name: string;
    regex: RegExp;
    weight: number;
}
interface StrengthResult {
    score: number;
    label: Strength;
    passed: string[];
    failed: string[];
    rules: ExtractedRule[];
    color: string;
}
type FXAnimationOptions = {
    name: string;
    onBegin: object;
    onFinished: object;
    options: {
        keyFrames: Keyframe[] | PropertyIndexedKeyframes | null;
        timing: {
            duration: string | number;
            iterations: number;
        };
    };
};
type FXAnimationType = {
    timeout?: number | string;
    iterations?: number;
    display?: string;
};
type FXAnimationReturn = {
    blink: FXAnimationOptions;
    fadeIn: FXAnimationOptions;
    fadeOut: FXAnimationOptions;
    slideInDown: FXAnimationOptions;
    slideInUp: FXAnimationOptions;
    slideOutDown: FXAnimationOptions;
    slideOutUp: FXAnimationOptions;
    slideInLeft: FXAnimationOptions;
    slideInRight: FXAnimationOptions;
    slideOutLeft: FXAnimationOptions;
    slideOutRight: FXAnimationOptions;
    spaceLettersBig: FXAnimationOptions;
    spaceLettersSmall: FXAnimationOptions;
    staticShake: FXAnimationOptions;
    unspaceLetters: FXAnimationOptions;
    zoomIn: FXAnimationOptions;
};
type FXAnimation = (args: FXAnimationType) => FXAnimationReturn;
type ModalInit = {
    id: string;
    title: StringOrNull;
    content?: StringOrNull;
    html?: boolean;
    isStatic?: boolean;
    hasFooter?: boolean;
};
type FXModalType = {
    /** Modal title. */ title?: StringOrNull;
    /** Visual type: success | warning | error.*/ type?: 'success' | 'warning' | 'error';
    /** Body content (HTML or text). */ content?: StringOrNull;
    /** Label for the confirm button. */ confirmButtonText?: StringOrNull;
    /** Label for the cancel button. */ cancelButtonText?: StringOrNull;
    /** Auto-close on confirm click. */ closeOnConfirm?: boolean;
    /** Render body as HTML (default true). */ html?: boolean;
    /** Prevent closing on outside click. */ isStatic?: boolean;
    /** Fired when confirm is clicked. */ onConfirm?: ((e: CustomEvent, modal: FuxcelModal) => void) | null;
    /** Fired when cancel is clicked. */ onCancel?: ((e: CustomEvent, modal: FuxcelModal) => void) | null;
    /** Fired on Escape (no cancel button). */ onEsc?: ((e: CustomEvent, modal: FuxcelModal) => void) | null;
};
type HTTPRequestMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';
type FXRequestType = {
    /** Request URL. */ uri?: string;
    /** HTTP method. */ method?: HTTPRequestMethod;
    /** Request body data. */ data?: BodyInit | object | null;
    /** Expected response type. */ dataType?: 'html' | 'json' | 'jsonp' | 'script' | 'text' | 'xml';
    /** Additional request headers. */ headers?: Object | Headers | null;
    /** Called before request is sent. */ beforeSend?: Function | null;
    /** Timeout in seconds. */ timeout?: number;
    /** Called on completion. */ onComplete?: ((response: ResponseData, status: number, statusText: string) => void) | null;
    /** Called on network error. */ onError?: ((error: any, status: number, statusText: string) => void) | null;
    /** Called on HTTP 2xx. */ onSuccess?: ((response: ResponseData, status: number, statusText: string) => void) | null;
};
type FXFormSubmitType = {
    /** Submission URL. */ uri?: StringOrNull;
    /** HTTP method. */ method?: HTTPRequestMethod | null;
    /** Additional form data. */ data?: object | null;
    /** Expected response type. */ dataType?: 'html' | 'json' | 'jsonp' | 'script' | 'text' | 'xml';
    /** Additional request headers. */ headers?: Object | Headers | null;
    /** Called before request is sent. */ beforeSend?: Function | null;
    /** Timeout in milliseconds. */ timeout?: number;
    /** Auto-handle 422 errors. */ handleError?: boolean;
};
type FXFormResponse = {
    /** JSON Object returned from the request **/ JSON?: any;
    /** Text Object returned from the request **/ text?: string;
    /** The request's HTTP response status **/ status: number;
    /** FuxcelValidator instance of the submitted form **/ form: FuxcelValidator;
};
type FxFetchPageResponse = {
    data: string | object | undefined;
    status: number;
    statusText: string;
};
type FxPageNavigateResponse = {
    html: string;
    status: number;
    statusText: string;
};
type FXPageNavigateOptions = {
    url?: string | null;
    selector?: string | null;
    dataType?: 'json' | 'text';
    replace?: boolean;
};
interface ResponseData extends Response {
    ok: boolean;
    status: number;
    statusText: string;
    responseText?: string;
    responseJSON?: object;
}
/** Public API of a Fuxcel DOM wrapper instance. */
interface FuxcelInstance {
    length: number;
    toArray: IterableElement;
    /**
     * Perform Fadein animation on selected element.*
     *
     * @returns {Promise<Fuxcel>}
     */
    fadein(): Promise<Fuxcel>;
    /**
     * Perform Fadein animation on selected element.
     *
     * @param {number} timeout Animation duration.
     * @returns {Promise<Fuxcel>}
     */
    fadein(timeout: number): Promise<Fuxcel>;
    /**
     * Perform Fadein animation on selected element.
     *
     * @param {string} display Initial CSS display.
     * @returns {Promise<Fuxcel>}
     */
    fadein(display: string): Promise<Fuxcel>;
    /**
     * Perform Fadein animation on selected element.
     *
     * @param {number} timeout Animation duration.
     * @param {number} iteration Animation iteration count.
     * @returns {Promise<Fuxcel>}
     */
    fadein(timeout: number, iteration: number): Promise<Fuxcel>;
    /**
     * Perform Fadein animation on selected element.
     *
     * @param {number} timeout Animation duration.
     * @param {string} display Initial CSS display.
     * @returns {Promise<Fuxcel>}
     */
    fadein(timeout: number, display: string): Promise<Fuxcel>;
    /**
     * Perform Fadein animation on selected element.
     *
     * @param {number} timeout Animation duration.
     * @param {number} iteration Animation iteration count
     * @param {string} display Initial CSS display
     * @returns {Promise<Fuxcel>}
     */
    fadein(timeout: number, iteration: number, display: string): Promise<Fuxcel>;
    /**
     * Perform Fadein animation on selected element.
     *
     * @param {string | number} timeout Animation duration.
     * @param {string | number} iteration Animation iteration count.
     * @param {string} display Initial CSS display.
     * @returns {Promise<Fuxcel>}
     */
    fadein(timeout?: number | string, iteration?: number | string, display?: string): Promise<Fuxcel>;
    /**
     * Perform Fadeout animation on selected element.*
     *
     * @returns {Promise<Fuxcel>}
     */
    fadeout(): Promise<Fuxcel>;
    /**
     * Perform Fadeout animation on selected element.
     *
     * @param {number} timeout Animation duration.
     * @returns {Promise<Fuxcel>}
     */
    fadeout(timeout: number): Promise<Fuxcel>;
    /**
     * Perform Fadeout animation on selected element.
     *
     * @param {string} display Initial CSS display.
     * @returns {Promise<Fuxcel>}
     */
    fadeout(display: string): Promise<Fuxcel>;
    /**
     * Perform Fadeout animation on selected element.
     *
     * @param {number} timeout Animation duration.
     * @param {number} iteration Animation iteration count.
     * @returns {Promise<Fuxcel>}
     */
    fadeout(timeout: number, iteration: number): Promise<Fuxcel>;
    /**
     * Perform Fadeout animation on selected element.
     *
     * @param {number} timeout Animation duration.
     * @param {string} display Initial CSS display.
     * @returns {Promise<Fuxcel>}
     */
    fadeout(timeout: number, display: string): Promise<Fuxcel>;
    /**
     * Perform Fadeout animation on selected element.
     *
     * @param {number} timeout Animation duration.
     * @param {number} iteration Animation iteration count
     * @param {string} display Initial CSS display
     * @returns {Promise<Fuxcel>}
     */
    fadeout(timeout: number, iteration: number, display: string): Promise<Fuxcel>;
    /**
     * Perform Fadeout animation on selected element.
     *
     * @param {string | number} timeout Animation duration.
     * @param {string | number} iteration Animation iteration count
     * @param {string} display Initial CSS display
     * @returns {Promise<Fuxcel>}
     */
    fadeout(timeout?: number | string, iteration?: number | string, display?: string): Promise<Fuxcel>;
    /**
     * Perform _Slidein-down_ animation on selected element.
     *
     * @returns {Promise<Fuxcel>}
     */
    slideindown(): Promise<Fuxcel>;
    /**
     * Perform _Slidein-down_ animation on selected element.
     *
     * @param {number} timeout Animation duration.
     * @returns {Promise<Fuxcel>}
     */
    slideindown(timeout: number): Promise<Fuxcel>;
    /**
     * Perform _Slidein-down_ animation on selected element.
     *
     * @param {string} display Initial CSS display.
     * @returns {Promise<Fuxcel>}
     */
    slideindown(display: string): Promise<Fuxcel>;
    /**
     * Perform _Slidein-down_ animation on selected element.
     *
     * @param {number} timeout Animation duration.
     * @param {number} iteration Animation iteration count.
     * @returns {Promise<Fuxcel>}
     */
    slideindown(timeout: number, iteration: number): Promise<Fuxcel>;
    /**
     * Perform _Slidein-down_ animation on selected element.
     *
     * @param {number} timeout Animation duration.
     * @param {string} display Initial CSS display.
     * @returns {Promise<Fuxcel>}
     */
    slideindown(timeout: number, display: string): Promise<Fuxcel>;
    /**
     * Perform _Slidein-down_ animation on selected element.
     *
     * @param {number} timeout Animation duration.
     * @param {number} iteration Animation iteration count
     * @param {string} display Initial CSS display
     * @returns {Promise<Fuxcel>}
     */
    slideindown(timeout: number, iteration: number, display: string): Promise<Fuxcel>;
    /**
     * Perform _Slidein-down_ animation on selected element.
     *
     * @param {string | number} timeout Animation duration.
     * @param {string | number} iteration Animation iteration count.
     * @param {string} display Initial CSS display.
     * @returns {Promise<Fuxcel>}
     */
    slideindown(timeout?: number | string, iteration?: number | string, display?: string): Promise<Fuxcel>;
    /**
     * Perform _Slidein-up_ animation on selected element.
     *
     * @returns {Promise<Fuxcel>}
     */
    slideinup(): Promise<Fuxcel>;
    /**
     * Perform _Slidein-up_ animation on selected element.
     *
     * @param {number} timeout Animation duration.
     * @returns {Promise<Fuxcel>}
     */
    slideinup(timeout: number): Promise<Fuxcel>;
    /**
     * Perform _Slidein-up_ animation on selected element.
     *
     * @param {string} display Initial CSS display.
     * @returns {Promise<Fuxcel>}
     */
    slideinup(display: string): Promise<Fuxcel>;
    /**
     * Perform _Slidein-up_ animation on selected element.
     *
     * @param {number} timeout Animation duration.
     * @param {number} iteration Animation iteration count.
     * @returns {Promise<Fuxcel>}
     */
    slideinup(timeout: number, iteration: number): Promise<Fuxcel>;
    /**
     * Perform _Slidein-up_ animation on selected element.
     *
     * @param {number} timeout Animation duration.
     * @param {string} display Initial CSS display.
     * @returns {Promise<Fuxcel>}
     */
    slideinup(timeout: number, display: string): Promise<Fuxcel>;
    /**
     * Perform _Slidein-up_ animation on selected element.
     *
     * @param {number} timeout Animation duration.
     * @param {number} iteration Animation iteration count.
     * @param {string} display Initial CSS display.
     * @returns {Promise<Fuxcel>}
     */
    slideinup(timeout: number, iteration: number, display: string): Promise<Fuxcel>;
    /**
     * Perform _Slidein-up_ animation on selected element.
     *
     * @param {number | string} timeout Animation duration.
     * @param {number | string} iteration Animation iteration count.
     * @param {string} display Initial CSS display.
     * @returns {Promise<Fuxcel>}
     */
    slideinup(timeout?: number | string, iteration?: number | string, display?: string): Promise<Fuxcel>;
    /**
     * Perform _Slideout-down_ animation on selected element.
     *
     * @returns {Promise<Fuxcel>}
     */
    slideoutdown(): Promise<Fuxcel>;
    /**
     * Perform _Slideout-down_ animation on selected element.*
     *
     * @param {number} timeout Animation duration.
     * @returns {Promise<Fuxcel>}
     */
    slideoutdown(timeout: number): Promise<Fuxcel>;
    /**
     * Perform _Slideout-down_ animation on selected element.
     *
     * @param {string} display Initial CSS display.
     * @returns {Promise<Fuxcel>}
     */
    slideoutdown(display: string): Promise<Fuxcel>;
    /**
     * Perform _Slideout-down_ animation on selected element.
     *
     * @param {number} timeout Animation duration.
     * @param {number} iteration Animation iteration count.
     * @returns {Promise<Fuxcel>}
     */
    slideoutdown(timeout: number, iteration: number): Promise<Fuxcel>;
    /**
     * Perform _Slideout-down_ animation on selected element.
     *
     * @param {number} timeout Animation duration.
     * @param {string} display Initial CSS display.
     * @returns {Promise<Fuxcel>}
     */
    slideoutdown(timeout: number, display: string): Promise<Fuxcel>;
    /**
     * Perform _Slideout-down_ animation on selected element.
     *
     * @param {number} timeout Animation duration.
     * @param {number} iteration Animation iteration count.
     * @param {string} display Initial CSS display.
     * @returns {Promise<Fuxcel>}
     */
    slideoutdown(timeout: number, iteration: number, display: string): Promise<Fuxcel>;
    /**
     * Perform _Slideout-down_ animation on selected element.
     *
     * @param {number | string} timeout Animation duration.
     * @param {number | string} iteration Animation iteration count.
     * @param {string} display Initial CSS display.
     * @returns {Promise<Fuxcel>}
     */
    slideoutdown(timeout?: number | string, iteration?: number | string, display?: string): Promise<Fuxcel>;
    /**
     * Perform _Slideout-up_ animation on selected element.
     *
     * @returns {Promise<Fuxcel>}
     */
    slideoutup(): Promise<Fuxcel>;
    /**
     * Perform _Slideout-up_ animation on selected element.
     *
     * @param {number} timeout Animation duration.
     * @returns {Promise<Fuxcel>}
     */
    slideoutup(timeout: number): Promise<Fuxcel>;
    /**
     * Perform _Slideout-up_ animation on selected element.
     *
     * @param {string} display Initial CSS display.
     * @returns {Promise<Fuxcel>}
     */
    slideoutup(display: string): Promise<Fuxcel>;
    /**
     * Perform _Slideout-up_ animation on selected element.
     *
     * @param {number} timeout Animation duration.
     * @param {number} iteration Animation iteration count.
     * @returns {Promise<Fuxcel>}
     */
    slideoutup(timeout: number, iteration: number): Promise<Fuxcel>;
    /**
     * Perform _Slideout-up_ animation on selected element.
     *
     * @param {number} timeout Animation duration.
     * @param {string} display Initial CSS display.
     * @returns {Promise<Fuxcel>}
     */
    slideoutup(timeout: number, display: string): Promise<Fuxcel>;
    /**
     * Perform _Slideout-up_ animation on selected element.
     *
     * @param {number} timeout Animation duration.
     * @param {number} iteration Animation iteration count.
     * @param {string} display Initial CSS display.
     * @returns {Promise<Fuxcel>}
     */
    slideoutup(timeout: number, iteration: number, display: string): Promise<Fuxcel>;
    /**
     * Perform _Slideout-up_ animation on selected element.
     *
     * @param {string | number} timeout Animation duration.
     * @param {string | number} iteration Animation iteration count.
     * @param {string} display Initial CSS display.
     * @returns {Promise<Fuxcel>}
     */
    slideoutup(timeout?: number | string, iteration?: number | string, display?: string): Promise<Fuxcel>;
    /**
     * Perform _Slidein-left_ animation on selected element.
     *
     * @returns {Promise<Fuxcel>}
     */
    slideinleft(): Promise<Fuxcel>;
    /**
     * Perform _Slidein-left_ animation on selected element.
     *
     * @param {number} timeout Animation duration.
     * @returns {Promise<Fuxcel>}
     */
    slideinleft(timeout: number): Promise<Fuxcel>;
    /**
     * Perform _Slidein-left_ animation on selected element.
     *
     * @param {string} display Initial CSS display.
     * @returns {Promise<Fuxcel>}
     */
    slideinleft(display: string): Promise<Fuxcel>;
    /**
     * Perform _Slidein-left_ animation on selected element.
     *
     * @param {number} timeout Animation duration.
     * @param {number} iteration Animation iteration count.
     * @returns {Promise<Fuxcel>}
     */
    slideinleft(timeout: number, iteration: number): Promise<Fuxcel>;
    /**
     * Perform _Slidein-left_ animation on selected element.
     *
     * @param {number} timeout Animation duration.
     * @param {string} display Initial CSS display.
     * @returns {Promise<Fuxcel>}
     */
    slideinleft(timeout: number, display: string): Promise<Fuxcel>;
    /**
     * Perform _Slidein-left_ animation on selected element.
     *
     * @param {number} timeout Animation duration.
     * @param {number} iteration Animation iteration count.
     * @param {string} display Initial CSS display.
     * @returns {Promise<Fuxcel>}
     */
    slideinleft(timeout: number, iteration: number, display: string): Promise<Fuxcel>;
    /**
     * Perform _Slidein-left_ animation on selected element.
     *
     * @param {string | number} timeout Animation duration.
     * @param {string | number} iteration Animation iteration count.
     * @param {string} display Initial CSS display.
     * @returns {Promise<Fuxcel>}
     */
    slideinleft(timeout?: number | string, iteration?: number | string, display?: string): Promise<Fuxcel>;
    /**
     * Perform _Slideout-left_ animation on selected element.
     *
     * @returns {Promise<Fuxcel>}
     */
    slideoutleft(): Promise<Fuxcel>;
    /**
     * Perform _Slideout-left_ animation on selected element.
     *
     * @param {number} timeout Animation duration.
     * @returns {Promise<Fuxcel>}
     */
    slideoutleft(timeout: number): Promise<Fuxcel>;
    /**
     * Perform _Slideout-left_ animation on selected element.
     *
     * @param {string} display Initial CSS display.
     * @returns {Promise<Fuxcel>}
     */
    slideoutleft(display: string): Promise<Fuxcel>;
    /**
     * Perform _Slideout-left_ animation on selected element.
     *
     * @param {number} timeout Animation duration.
     * @param {number} iteration Animation iteration count.
     * @returns {Promise<Fuxcel>}
     */
    slideoutleft(timeout: number, iteration: number): Promise<Fuxcel>;
    /**
     * Perform _Slideout-left_ animation on selected element.
     *
     * @param {number} timeout Animation duration.
     * @param {string} display Initial CSS display.
     * @returns {Promise<Fuxcel>}
     */
    slideoutleft(timeout: number, display: string): Promise<Fuxcel>;
    /**
     * Perform _Slideout-left_ animation on selected element.
     *
     * @param {number} timeout Animation duration.
     * @param {number} iteration Animation iteration count.
     * @param {string} display Initial CSS display.
     * @returns {Promise<Fuxcel>}
     */
    slideoutleft(timeout: number, iteration: number, display: string): Promise<Fuxcel>;
    /**
     * Perform _Slideout-left_ animation on selected element.
     *
     * @param {string | number} timeout Animation duration.
     * @param {string | number} iteration Animation iteration count.
     * @param {string} display Initial CSS display.
     * @returns {Promise<Fuxcel>}
     */
    slideoutleft(timeout?: number | string, iteration?: number | string, display?: string): Promise<Fuxcel>;
    /**
     * Perform _Slideout-left_ animation on selected element.
     *
     * @returns {Promise<Fuxcel>}
     */
    slideinright(): Promise<Fuxcel>;
    /**
     * Perform _Slideout-left_ animation on selected element.
     *
     * @param {string | number} timeout Animation duration.
     * @returns {Promise<Fuxcel>}
     */
    slideinright(timeout: number): Promise<Fuxcel>;
    /**
     * Perform _Slideout-left_ animation on selected element.
     *
     * @param {string} display Initial CSS display.
     * @returns {Promise<Fuxcel>}
     */
    slideinright(display: string): Promise<Fuxcel>;
    /**
     * Perform _Slideout-left_ animation on selected element.
     *
     * @param {number} timeout Animation duration.
     * @param {number} iteration Animation iteration count.
     * @returns {Promise<Fuxcel>}
     */
    slideinright(timeout: number, iteration: number): Promise<Fuxcel>;
    /**
     * Perform _Slideout-left_ animation on selected element.
     *
     * @param {number} timeout Animation duration.
     * @param {string} display Initial CSS display.
     * @returns {Promise<Fuxcel>}
     */
    slideinright(timeout: number, display: string): Promise<Fuxcel>;
    /**
     * Perform _Slideout-left_ animation on selected element.
     *
     * @param {number} timeout Animation duration.
     * @param {number} iteration Animation iteration count.
     * @param {string} display Initial CSS display.
     * @returns {Promise<Fuxcel>}
     */
    slideinright(timeout: number, iteration: number, display: string): Promise<Fuxcel>;
    /**
     * Perform _Slidein-right_ animation on selected element.
     *
     * @param {string | number} timeout Animation duration.
     * @param {string | number} iteration Animation iteration count.
     * @param {string} display Initial CSS display.
     * @returns {Promise<Fuxcel>}
     */
    slideinright(timeout?: number | string, iteration?: number | string, display?: string): Promise<Fuxcel>;
    /**
     * Perform _Slideout-right_ animation on selected element.
     *
     * @returns {Promise<Fuxcel>}
     */
    slideoutright(): Promise<Fuxcel>;
    /**
     * Perform _Slideout-right_ animation on selected element.
     *
     * @param {number} timeout Animation duration.
     * @returns {Promise<Fuxcel>}
     */
    slideoutright(timeout: number): Promise<Fuxcel>;
    /**
     * Perform _Slideout-right_ animation on selected element.
     *
     * @param {string} display Initial CSS display.
     * @returns {Promise<Fuxcel>}
     */
    slideoutright(display: string): Promise<Fuxcel>;
    /**
     * Perform _Slideout-right_ animation on selected element.
     *
     * @param {number} timeout Animation duration.
     * @param {number} iteration Animation iteration count.
     * @returns {Promise<Fuxcel>}
     */
    slideoutright(timeout: number, iteration: number): Promise<Fuxcel>;
    /**
     * Perform _Slideout-right_ animation on selected element.
     *
     * @param {number} timeout Animation duration.
     * @param {string} display Initial CSS display.
     * @returns {Promise<Fuxcel>}
     */
    slideoutright(timeout: number, display: string): Promise<Fuxcel>;
    /**
     * Perform _Slideout-right_ animation on selected element.
     *
     * @param {number} timeout Animation duration.
     * @param {number} iteration Animation iteration count.
     * @param {string} display Initial CSS display.
     * @returns {Promise<Fuxcel>}
     */
    slideoutright(timeout: number, iteration: number, display: string): Promise<Fuxcel>;
    /**
     * Perform _Slideout-right_ animation on selected element.
     *
     * @param {string | number} timeout Animation duration.
     * @param {string | number} iteration Animation iteration count.
     * @param {string} display Initial CSS display.
     * @returns {Promise<Fuxcel>}
     */
    slideoutright(timeout?: number | string, iteration?: number | string, display?: string): Promise<Fuxcel>;
    /**
     * Perform _Blink_ animation on selected element.
     *
     * @returns {Promise<Fuxcel>}
     */
    blink(): Promise<Fuxcel>;
    /**
     * Perform _Blink_ animation on selected element.
     *
     * @param {number} timeout Animation duration.
     * @returns {Promise<Fuxcel>}
     */
    blink(timeout: number): Promise<Fuxcel>;
    /**
     * Perform _Blink_ animation on selected element.
     *
     * @param {string} display Initial CSS display.
     * @returns {Promise<Fuxcel>}
     */
    blink(display: string): Promise<Fuxcel>;
    /**
     * Perform _Blink_ animation on selected element.
     *
     * @param {number} timeout Animation duration.
     * @param {number} iteration Animation iteration count.
     * @returns {Promise<Fuxcel>}
     */
    blink(timeout: number, iteration: number): Promise<Fuxcel>;
    /**
     * Perform _Blink_ animation on selected element.
     *
     * @param {number} timeout Animation duration.
     * @param {string} display Initial CSS display.
     * @returns {Promise<Fuxcel>}
     */
    blink(timeout: number, display: string): Promise<Fuxcel>;
    /**
     * Perform _Blink_ animation on selected element.
     *
     * @param {number} timeout Animation duration.
     * @param {number} iteration Animation iteration count.
     * @param {string} display Initial CSS display.
     * @returns {Promise<Fuxcel>}
     */
    blink(timeout: number, iteration: number, display: string): Promise<Fuxcel>;
    /**
     * Perform _Blink_ animation on selected element.
     *
     * @param {string | number} timeout Animation duration.
     * @param {string | number} iteration Animation iteration count.
     * @param {string} display Initial CSS display.
     * @returns {Promise<Fuxcel>}
     */
    blink(timeout?: number | string, iteration?: number | string, display?: string): Promise<Fuxcel>;
    /**
     * Perform _Shake_ animation on selected element.
     *
     * @returns {Promise<Fuxcel>}
     */
    shake(): Promise<Fuxcel>;
    /**
     * Perform _Shake_ animation on selected element.
     *
     * @param {number} timeout Animation duration.
     * @returns {Promise<Fuxcel>}
     */
    shake(timeout: number): Promise<Fuxcel>;
    /**
     * Perform _Shake_ animation on selected element.
     *
     * @param {string} scale Initial CSS display.
     * @returns {Promise<Fuxcel>}
     */
    shake(scale: string): Promise<Fuxcel>;
    /**
     * Perform _Shake_ animation on selected element.
     *
     * @param {number} timeout Animation duration.
     * @param {number} iteration Animation iteration count.
     * @returns {Promise<Fuxcel>}
     */
    shake(timeout: number, iteration: number): Promise<Fuxcel>;
    /**
     * Perform _Shake_ animation on selected element.
     *
     * @param {number} timeout Animation duration.
     * @param {string} scale Initial CSS display.
     * @returns {Promise<Fuxcel>}
     */
    shake(timeout: number, scale: string): Promise<Fuxcel>;
    /**
     * Perform _Shake_ animation on selected element.
     *
     * @param {number} timeout Animation duration.
     * @param {number} iteration Animation iteration count.
     * @param {string} scale Initial CSS display.
     * @returns {Promise<Fuxcel>}
     */
    shake(timeout: number, iteration: number, scale: string): Promise<Fuxcel>;
    /**
     * Perform _Shake_ animation on selected element.
     *
     * @param {string | number} timeout Animation duration.
     * @param {string | number} iteration Animation iteration count.
     * @param {string} scale Initial CSS display.
     * @returns {Promise<Fuxcel>}
     */
    shake(timeout?: number | string, iteration?: number | string, scale?: string): Promise<Fuxcel>;
    /**
     * Perform _Zoom-in_ animation on selected element.
     *
     * @returns {Promise<Fuxcel>}
     */
    zoomin(): Promise<Fuxcel>;
    /**
     * Perform _Zoom-in_ animation on selected element.
     *
     * @param {number} timeout Animation duration.
     * @returns {Promise<Fuxcel>}
     */
    zoomin(timeout: number): Promise<Fuxcel>;
    /**
     * Perform _Zoom-in_ animation on selected element.
     *
     * @param {string} display Initial CSS display.
     * @returns {Promise<Fuxcel>}
     */
    zoomin(display: string): Promise<Fuxcel>;
    /**
     * Perform _Zoom-in_ animation on selected element.
     *
     * @param {number} timeout Animation duration.
     * @param {number} iteration Animation iteration count.
     * @returns {Promise<Fuxcel>}
     */
    zoomin(timeout: number, iteration: number): Promise<Fuxcel>;
    /**
     * Perform _Zoom-in_ animation on selected element.
     *
     * @param {number} timeout Animation duration.
     * @param {string} display Initial CSS display.
     * @returns {Promise<Fuxcel>}
     */
    zoomin(timeout: number, display: string): Promise<Fuxcel>;
    /**
     * Perform _Zoom-in_ animation on selected element.
     *
     * @param {number} timeout Animation duration.
     * @param {number} iteration Animation iteration count.
     * @param {string} display Initial CSS display.
     * @returns {Promise<Fuxcel>}
     */
    zoomin(timeout: number, iteration: number, display: string): Promise<Fuxcel>;
    /**
     * Perform _Zoom-in_ animation on selected element.
     *
     * @param {string | number} timeout Animation duration.
     * @param {string | number} iteration Animation iteration count.
     * @param {string} display Initial CSS display.
     * @returns {Promise<Fuxcel>}
     */
    zoomin(timeout?: number | string, iteration?: number | string, display?: string): Promise<Fuxcel>;
    /**
     * Checks if selected element contains given class.
     *
     * @param {string} token
     * @return {boolean} true if element contains given class; false otherwise.
     */
    hasClass(token: string): boolean;
    /**
     * Add class(es) to the classlist of the selected element.
     *
     * @param tokenList {...string} Comma separated strings of class(es) to add.
     */
    putClass(...tokenList: string[]): Fuxcel;
    /**
     * Removes the given class(es) from the classlist of the given elements.
     *
     * @param tokenList {...string} Comma separated strings of class(es) to remove.
     */
    removeClass(...tokenList: string[]): Fuxcel;
    /**
     * Replace an existing class with the given class.
     *
     * _Add the new class old class if not found._
     *
     * @param oldToken {string} Old class token.
     * @param newToken {string} New class token.
     */
    replaceClass(oldToken: string, newToken: string): Fuxcel;
    /**
     * Toggle the given class in the classlist of the given element.
     *
     * @param token {string} Class to toggle.
     */
    toggleClass(token: string): Fuxcel;
    /**
     * Perform a callback once for each selected element.
     *
     * @param callback {((element: this, index: number, elements: HTMLElement[]) => void)}
     */
    each(callback: (element: this, index: number, elements: HTMLElement[]) => void): void;
    /**
     * Creates a [shallow copy](https://developer.mozilla.org/en-us/docs/Glossary/Shallow_copy) of a portion of a given set of selected elements, filtered down to just the elements from the given array that pass the test implemented by the provided function.
     *
     * @param callback {((element: this, index: number, elements: HTMLElement[]) => boolean)}
     */
    filter(callback: (element: this, index: number, elements: HTMLElement[]) => boolean): this;
    /**
     * Set the given attribute(s) for the selected element.
     *
     * @param name {object} Key-Value pair Object to set for the attribute(s).
     * @return {Fuxcel|string}
     */
    attrib(name: object): Fuxcel;
    /**
     * Get the given attribute for the selected element.
     *
     * @param name {string} Name of the attribute.
     * @return {Fuxcel|string}
     */
    attrib(name: string): string;
    /**
     * Set the given attribute(s) for the selected element.
     *
     * @param name {string} Name of the attribute or a Key-Value pair Object.
     * @param value {string | boolean} Value to set for the attribute.
     * @return {Fuxcel|string}
     */
    attrib(name: string, value: string | boolean): Fuxcel;
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
    attrib(name: string | object, value?: boolean | string | null): Fuxcel | string | null;
    /**
     * Set the given [data-*] attribute(s) for the selected element.
     *
     * @param name {object} Key-Value pair Object to set for the [data-*] attribute(s).
     * @return {Fuxcel | string}
     */
    dataAttrib(name: object): Fuxcel;
    /**
     * Get the given [data-*] attribute.
     *
     * @param name {string} Name of the [data-*] attribute.
     * @return {Fuxcel | string}
     */
    dataAttrib(name: string): string;
    /**
     * Set the given [data-*] attribute(s) for the selected element.
     *
     * @param name {string} Name of the [data-*] attribute or a Key-Value pair Object.
     * @param value {string | object} Value to set for the [data-*] attribute.
     * @return {Fuxcel | string}
     */
    dataAttrib(name: string, value: string | boolean): Fuxcel;
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
    dataAttrib(name: string | object, value?: boolean | string | null): Fuxcel | string;
    /**
     * Set the given property / properties for the selected element.
     *
     * @param name {object}Key-Value pair Object to set for the property / properties.
     * @return {Fuxcel | string}
     */
    prop(name: object): Fuxcel;
    /**
     * Get the given property for the selected element.
     *
     * @param name {string} Name of the property.
     * @return {Fuxcel | string}
     */
    prop(name: string): string;
    /**
     * Set the given property for the selected element.
     *
     * @param name {string} Name of the property or a Key-Value pair Object.
     * @param value {string | boolean} Value to set for the property.
     * @return {Fuxcel | string}
     */
    prop(name: string, value: string | boolean): Fuxcel;
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
    prop(name: string | object, value?: boolean | string | null): Fuxcel | string;
    /**
     * Set the given CSS style(s) value of the selected element.
     *
     * @param name {object} Key-value pair Object to set for the style(s).
     * @return {Fuxcel | string}
     */
    style(name: object): Fuxcel;
    /**
     * Get the given CSS style value of the selected element.
     *
     * @param name {string} Name of the style.
     * @return {Fuxcel | string}
     */
    style(name: string): string;
    /**
     * Set the given CSS style value of the selected element.
     *
     * @param name {string} Name of the style.
     * @param value {string | boolean} Value to set for the style.
     * @return {Fuxcel | string}
     */
    style(name: string, value: string | boolean): Fuxcel;
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
    style(name: string | object, value?: boolean | string | null): Fuxcel | string;
    /**
     * Returns the attributes of the selected element as on Object.
     *
     * @return {Object} A Key-value-pair object containing the attributes of the selected element.
     */
    listAttrib(): object;
    /**
     * Returns the properties of the selected element as on key-value pair Object.
     *
     * @return {Object} A Key-value-pair object containing the properties of the selected element.
     */
    listProp(): object;
    /**
     * Insert one or more nodes relative to each selected element using the default `'append'` position.
     *
     * Accepts a single node or an array of nodes. Each node can be a raw `HTMLElement`,
     * a plain string, or a `Fuxcel` instance.
     *
     * @param nodes {HTMLElement | FuxcelBase | string | (HTMLElement | FuxcelBase | string)[]} Node(s) to insert.
     * @returns {Fuxcel} The current `Fuxcel` instance for chaining.
     *
     * @example
     * fx('#container').insertNode('<p>Hello</p>');
     * fx('#container').insertNode([fx('#header'), '<hr>', document.createElement('p')]);
     */
    insertNode(nodes: HTMLElement | FuxcelBase | string | (HTMLElement | FuxcelBase | string)[]): this;
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
     * @param position {InsertPosition} Where to insert relative to the selected element. Defaults to `'append'`.
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
    insertNode(nodes: HTMLElement | FuxcelBase | string | (HTMLElement | FuxcelBase | string)[], position: InsertPositions): this;
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
    insertNode(nodes: HTMLElement | FuxcelBase | string | (HTMLElement | FuxcelBase | string)[], position?: InsertPositions): this;
    /**
     * Remove each selected element from the DOM.
     *
     * Removes the element(s) completely.
     *
     * @returns {void}
     *
     * @example
     * // Full removal
     * fx('#banner').remove();
     */
    remove(): void;
    /**
     * Remove each selected element from the DOM.
     *
     * Removes the element(s) completely.
     *
     * @param detach {boolean} Pass `true` to detach instead of fully removing. Defaults to `false`.
     * @returns {void}
     *
     * @example
     * // Full removal
     * fx('#banner').remove(false);
     */
    remove(detach: false): void;
    /**
     * Detach each selected element from the DOM.
     *
     * Detach the element(s) from the DOM but its event
     * listeners and internal data are preserved, allowing it to be reinserted later.
     *
     * @param detach {boolean=true} detach instead of fully removing.
     * @returns {Fuxcel} The current `Fuxcel` instance for chaining.
     *
     * @example
     * // Detach — preserves listeners for reinsertion
     * const header = fx('#header').remove(true);
     * fx('#new-container').append(header);
     */
    remove(detach: true): Fuxcel;
    /**
     * Remove or detach each selected element from the DOM.
     *
     * When `detach` is `true`, the element is removed from the DOM but its event
     * listeners and internal data are preserved, allowing it to be reinserted later.
     * When `false` (default), the element is removed completely.
     *
     * @param detach {boolean} Pass `true` to detach instead of fully removing. Defaults to `false`.
     * @returns {Fuxcel|void} The current `Fuxcel` instance for chaining.
     *
     * @example
     * // Full removal
     * fx('#banner').remove();
     *
     * @example
     * // Detach — preserves listeners for reinsertion
     * const header = fx('#header').remove(true);
     * fx('#new-container').append(header);
     */
    remove(detach?: boolean): Fuxcel | void;
    /**
     * Disables or enables the selected element(s).
     *
     * @param disabled {boolean} Switch between disabling and enabling the selected element(s).
     * @return {Fuxcel} Fuxcel Object of the selected element.
     */
    disable(disabled?: boolean): Fuxcel;
    /**
     * Removes the given attribute(s) from the selected element.
     *
     * @param name {...string} Comma separated strings of attribute(s) to remove.
     * @return {Fuxcel} Fuxcel Object of the selected element
     */
    removeAttrib(...name: string[]): Fuxcel;
    /**
     * Removes the given [data-*] attribute(s) from the selected element.
     *
     * @param name {...string} Comma separated strings of [data-*] attribute(s) to remove.
     * @return {Fuxcel} Fuxcel Object of the selected element
     */
    removeDataAttrib(...name: string[]): Fuxcel;
    /**
     * Removes the given property / properties from the selected element.
     *
     * @param name {...string} Comma separated strings of property / properties to remove.
     * @return {Fuxcel} Fuxcel Object of the selected element
     */
    removeProp(...name: string[]): Fuxcel;
    /**
     * Set the `innerHTML` of each selected element, replacing all existing content.
     *
     * When no position is provided, the inner HTML of the element is replaced entirely.
     *
     * @param value {string} HTML string to insert.
     * @returns {Fuxcel} The current `Fuxcel` instance for chaining.
     *
     * @example
     * // Replace inner HTML entirely
     * fx('#container').insertHTML('<p>Hello</p>');
     *
     * @example
     * // Chainable
     * fx('#container').insertHTML('<p>Hello</p>').addClass('loaded');
     */
    insertHTML(value: string): Fuxcel;
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
     * @param position {InsertPositions} Where to insert relative to the selected element.
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
     * @deprecated The `position` option has changed from `affix`,`prefix`,`suffix`,`postfix` to `before`,`prepend`,`append`,`after` been moved to a direct parameter.
     * Use {@link InsertPositions} with the new signature instead.
     * @see {@link InsertPositions}
     */
    insertHTML(value: string, position: InsertPositions): Fuxcel;
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
     *
     * @deprecated The `position` option has changed from `affix`,`prefix`,`suffix`,`postfix` to `before`,`prepend`,`append`,`after` been moved to a direct parameter.
     * Use {@link InsertPositions} with the new signature instead.
     * @see {@link InsertPositions}
     */
    insertHTML(value: string, position?: InsertPositions): Fuxcel;
    /**
     * Returns the element at index '0' in the current selection.
     *
     * @returns {Fuxcel} Fuxcel instance of the element at the given index.
     *
     * @example
     * fx('#list li').at()   // first item
     */
    at(): Fuxcel;
    /**
     * Returns the element at the given index in the current selection.
     * Supports negative indices — `-1` returns the last element, `-2` the second to last, and so on.
     *
     * @param index {number} Zero-based index. Negative values count from the end.
     * @returns {Fuxcel} Fuxcel instance of the element at the given index.
     *
     * @example
     * fx('#list li').at(0)   // first item
     * fx('#list li').at(2)   // third item
     * fx('#list li').at(-1)  // last item
     * fx('#list li').at(-2)  // second to last
     */
    at(index: number): Fuxcel;
    /**
     * Returns the element at the given index in the current selection.
     * Supports negative indices — `-1` returns the last element, `-2` the second to last, and so on.
     * Defaults to '0' if no index is given
     *
     * @param index {number} Zero-based index. Negative values count from the end. Defaults to '0'
     * @returns {Fuxcel} Fuxcel instance of the element at the given index.
     *
     * @example
     * fx('#list li').at(0)   // first item
     * fx('#list li').at(2)   // third item
     * fx('#list li').at(-1)  // last item
     * fx('#list li').at(-2)  // second to last
     */
    at(index?: number): Fuxcel;
    /**
     * Returns the direct descendants (Children) of the selected element.
     *
     * @return {Fuxcel} Fuxcel Object of the selected child(ren)
     */
    children(): Fuxcel;
    /**
     * Returns the direct descendant (Child) of the selected element that matches the given selector.
     *
     * @param selector {Selector} Selectable string.
     * @return {Fuxcel} Fuxcel Object of the selected child(ren)
     */
    children(selector: Selector): Fuxcel;
    /**
     * Returns the direct descendants (Children) of the selected element.
     *
     * _Returns the child that matches the selector if the selector parameter is passed._
     *
     * @param selector {Selector} Selectable string.
     * @return {Fuxcel} Fuxcel Object of the selected child(ren)
     */
    children(selector?: Selector): Fuxcel;
    /**
     * Returns all the descendants of the selected element.
     *
     * @return {Fuxcel} Fuxcel Object of the selected descendant(s)
     */
    descendants(): Fuxcel;
    /**
     * Returns the descendant of the selected element that matches the given selector.
     *
     * @param selector {Selector} Selectable string.
     * @return {Fuxcel} Fuxcel Object of the selected descendant(s)
     */
    descendants(selector: Selector): Fuxcel;
    /**
     * Returns all the descendants of the selected element.
     *
     * _Returns the descendant that matches the selector if the selector parameter is passed._
     *
     * @param selector {Selector} Selectable string.
     * @return {Fuxcel} Fuxcel Object of the selected descendant(s)
     */
    descendants(selector?: Selector): Fuxcel;
    /**
     * Returns the parents of the selected element.
     *
     * @return {Fuxcel} Fuxcel Object of the selected parent(s)
     */
    parents(): Fuxcel;
    /**
     * Returns the parent of the selected element that matches the given selector.
     *
     * @param selector {Selector} Selectable string.
     * @return {Fuxcel} Fuxcel Object of the selected parent(s)
     */
    parents(selector: Selector): Fuxcel;
    /**
     * Returns the parents of the selected element.
     *
     * _Returns the parent that matches the selector if the selector parameter is passed._
     *
     * @param selector {Selector} Selectable string.
     * @return {Fuxcel} Fuxcel Object of the selected parent(s)
     */
    parents(selector?: Selector): Fuxcel;
    /**
     * Returns the previous siblings of the selected element.
     *
     * @return {Fuxcel} Fuxcel Object of the selected previous sibling(s)
     */
    prevSiblings(): Fuxcel;
    /**
     * Returns the previous sibling of the selected element that matches the given selector.
     *
     * @param selector {Selector} Selectable string.
     * @return {Fuxcel} Fuxcel Object of the selected previous sibling(s)
     */
    prevSiblings(selector: Selector): Fuxcel;
    /**
     * Returns the previous siblings of the selected element.
     *
     * _Returns the previous sibling that matches the selector if the selector parameter is passed._
     *
     * @param selector {Selector} Selectable string.
     * @return {Fuxcel} Fuxcel Object of the selected previous sibling(s)
     */
    prevSiblings(selector?: Selector): Fuxcel;
    /**
     * Returns the siblings of the selected element.
     *
     * @return {Fuxcel} Fuxcel Object of the selected sibling(s)
     */
    siblings(): Fuxcel;
    /**
     * Returns the sibling of the selected element that matchee the given selector.
     *
     * @param selector {Selector} Selectable string.
     * @return {Fuxcel} Fuxcel Object of the selected sibling(s)
     */
    siblings(selector: Selector): Fuxcel;
    /**
     * Returns the siblings of the selected element.
     *
     * _Returns the siblings that matches the selector if the selector parameter is passed._
     *
     * @param selector {Selector} Selectable string.
     * @return {Fuxcel} Fuxcel Object of the selected sibling(s)
     */
    siblings(selector?: Selector): Fuxcel;
    /**
     * Checks if the selected element matches the given tag name.
     *
     * @param tagName {string | HTMLElementTagNameMap} HTML tag name to check for.
     * @return {boolean} true if the selected elements' tag name matches the given tag name; false otherwise.
     */
    isElement(tagName: string | HTMLElementTagNameMap): boolean;
    /**
     * Checks to see if the selected element would be selected by the provided selector-string _(i.e. checks if the selector is unique to the selected element)_.
     *
     * @param selector {Selector} Selector to check element against.
     * @return {boolean} true if the selected element would be selected; false otherwise.
     */
    matchSelector(selector: Selector): boolean;
    /**
     * Check if the selected element has a scrollbar in the given direction.
     *
     * @param direction {Direction | null} Specific direction to check _[horizontal or vertical]_.
     * @return {boolean} true if the selected element has a scrollbar in the specified direction; false otherwise.
     */
    hasScrollBar(direction?: Direction): boolean;
    /**
     * A convenient wrapper for the `fx.fetch(options)` function to automatically parse form-data and submit the form using the [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API).
     *
     * _Additional form-data can also be passed_
     *
     * @param options {FXFormSubmitType}
     * @return {Promise<{JSON?: any, text?: string, status: number, form: FuxcelValidator}>}
     */
    handleFormSubmit(options?: FXFormSubmitType): Promise<FXFormResponse>;
    /**
     * Toggle the disabled state (property) of the selected element [a button preferably].
     *
     * @param isLoading {boolean} Determines the state of the button.
     * @return {Promise<Fuxcel>} Promise of Fuxcel Object of the selected element.
     */
    toggleButtonLoadState(isLoading?: boolean): Promise<Fuxcel>;
    /**
     * Toggles the submit button state of the selected form.
     *
     * @param isLoading {boolean} Determines the state of the button.
     * @return {Promise<Fuxcel>} Promise of Fuxcel Object of the selected element.
     */
    toggleFormSubmitButtonState(isLoading?: boolean): Promise<Fuxcel>;
    /**
     * Removes all previous Event Listeners from the selected element if no event is given.
     *
     * @return {Fuxcel} Fuxcel Object of the selected element.
     */
    off(): Fuxcel;
    /**
     * Remove the given Event Listener(s) from the selected element.
     *
     * @param events {...string} Particular event to remove.
     * @return {Fuxcel} Fuxcel Object of the selected element.
     */
    off(...events: string[]): Fuxcel;
    /**
     * _Remove the given Event Listener(s) from the selected element._
     *
     * _Removes all previous Event Listeners from the selected element if no event is given._
     *
     * @param events {...string} Particular event to remove.
     * @return {Fuxcel} Fuxcel Object of the selected element.
     */
    off(...events: string[]): Fuxcel;
    /**
     * Add given Event Listener to the selected element.
     *
     * @param events {string} Event as a string
     * @param listener {EventListener} Listener function to handle given event.
     * @param option {boolean} Optional boolean parameter to set CAPTURING_PHASE of the event listener to either true or false.
     * @example
     *	fx('#email').upon('input', function(e) {
     *    console.log(e);
     *  });
     * @return {Fuxcel} Fuxcel Object of the selected element
     */
    upon(events: string, listener: EventListener, option?: boolean): Fuxcel;
    /**
     * Add given Event Listener to the selected element.
     *
     * @param events {string} Event as an array of strings
     * @param listener {EventListener} Listener function to handle given event.
     * @param option {boolean} Optional boolean parameter to set CAPTURING_PHASE of the event listener to either true or false.
     * @example
     *  fx('#email').upon(['focus', 'input'], function(e) {
     *    console.log(e);
     *  });
     * @return {Fuxcel} Fuxcel Object of the selected element
     */
    upon(events: string[], listener: EventListener, option?: boolean): Fuxcel;
    /**
     * Add given Event Listener to the selected element.
     *
     * @param events {object} Event as an array of strings
     * @param option {boolean} boolean parameter to set CAPTURING_PHASE of the event listener to either true or false.
     * @example
     *  fx('#email').upon({
     *    input: function(e) {
     *      console.log(e);
     *    },
     *    focus: (e) => console.log(e);
     *  }, true);
     * @return {Fuxcel} Fuxcel Object of the selected element
     */
    upon(events: object, option: boolean): Fuxcel;
    /**
     * Add given Event Listener to the selected element.
     *
     * @param events {object} Event as an array of strings
     * @example
     *  fx('#email').upon(['focus', 'input'], function(e) {
     *    console.log(e)
     *  });
     * @return {Fuxcel} Fuxcel Object of the selected element
     */
    upon(events: object): Fuxcel;
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
    upon(events: object | string[] | string, listener?: EventListener | boolean, option?: boolean): Fuxcel;
    /**
     * Trigger a new event on the selected element(s).
     *
     * @param {Event} event
     * @returns {Fuxcel}
     */
    trigger(event: Event): Fuxcel;
    /**
     * Trigger a new event on the selected element(s).
     *
     * @param {string} event
     * @returns {Fuxcel}
     */
    trigger(event: string): Fuxcel;
    /**
     * Trigger a new event on the selected element(s).
     *
     * @param {string} event
     * @param {"mouse" | "keyboard" | "custom" | null} type
     * @returns {Fuxcel}
     */
    trigger(event: string, type: ('mouse' | 'keyboard' | 'custom' | null)): Fuxcel;
    /**
     * Trigger a new event on the selected element(s).
     *
     * @param event {string} Event to trigger on selected element(s).
     * @param type {"mouse" | "keyboard" | "custom" | null} Type of Event (Mouse, Keyboard, Custom). _Defaults to Event when nothing is passed._
     * @returns {Fuxcel}
     */
    trigger(event: string | Event, type?: 'mouse' | 'keyboard' | 'custom' | null): Fuxcel;
    /**
     * Get the value of the selected element.
     *
     * @return {StringOrNull} The value of the selected element.
     */
    value(): StringOrNull | string[];
    /**
     * Set the value of the selected element.
     *
     * @param value {string} Value to set for the given element (If available).
     * @return {Fuxcel} Fuxcel object of the selected element.
     */
    value(value: string): Fuxcel;
    /**
     * Get or set the value of the selected element.
     *
     * @param value {StringOrNull = null} Value to set for the given element (If available).
     * @return {StringOrNull | Fuxcel} The value of the selected element if no parameter is passed for value; Fuxcel object of the selected element otherwise.
     */
    value(value?: StringOrNull): StringOrNull | string[] | Fuxcel;
    /**
     * Validate one or more newly added form-group elements against their parent form's
     * existing validator instance — without needing to re-initialize the entire form.
     *
     * For each selected element:
     * - Skips it (with a `console.debug` message) if it doesn't have the `.form-group` class.
     * - Skips it (with a `console.debug` message) if no parent `<form>` element is found.
     * - Skips it (with a `console.debug` message) if the parent `<form>` has no `id` attribute _(required for validator tracking)_.
     * - Otherwise, forwards it to `FuxcelValidator.validateFromGroup`, tagged with `'extendValidation'`
     *   as the source — so if the form-group was already validated, the resulting warning identifies
     *   this method as the caller.
     *
     * @return {void}
     *
     * @example
     * // Add a new field, then extend validation to include it
     * fx('#login-form').insertNode(newFormGroup, 'append');
     * fx(newFormGroup).extendValidation();
     *
     * @example
     * // Extend validation across multiple newly added form-groups at once
     * fx('.form-group.newly-added').extendValidation();
     *
     * @see {@link FuxcelValidator.validateFromGroup} - Underlying validation call for each form-group.
     */
    extendValidation(): void;
    /** Get the class list of element. **/ readonly classes: DOMTokenList;
    /** A promise with a boolean argument; true if the given element has the mouse focus; false otherwise. **/ readonly hasFocus: Promise<boolean>;
    /** Returns true if the selected element has the disabled property; false otherwise. **/ readonly isDisabled: boolean;
    /** Returns true if the selected element is a form element. **/ readonly isFormElement: boolean;
    /** The Inner HTML value of the given element. **/ readonly innerHTML: string;
    /** The Outer HTML value of the given element. **/ readonly outerHTML: string;
    /** The Inner Text value of the given element. **/ innerText: string;
    /** The Outer Text value of the given element. **/ outerText: string;
    /** Returns the direct parent of the first selected element. **/ parent: this;
    /** Returns the next sibling of the first selected element. **/ next: this;
    /** Returns the previous sibling of the first selected element. **/ previous: this;
    /** Returns the first element in the current selection. **/ first: this;
    /** Returns the last element in the current selection. **/ last: this;
    /** A new instance of the Fuxcel Form Validator. **/ readonly formValidator: FuxcelValidator;
    /** A new instance of the Fuxcel Modal. **/ readonly modal: FuxcelModal;
}
/** Public API of a FuxcelValidator instance. **/
interface FuxcelValidatorInstance extends FuxcelInstance {
    /**
     * Initialize validation on selected form(s).
     *
     * _Throws an error if non form elements are selected._
     *
     * @param config {ValidatorConfigObject} user config object.
     * @param source {string | null = 'init'}
     * @return {FuxcelSteps | FuxcelValidator} Fuxcel Validator Object of the forms.
     */
    init(config?: ValidatorConfigObject | null, source?: string | null): FuxcelValidator | FuxcelSteps | void;
    /** Empties the given form(s) error bags **/
    clearErrorBag(): this;
    /** Validate the selected field. **/
    validateField(): FuxcelValidator;
    /**
     * Validate the selected field.
     *
     * _Automatically generates and displays an error message._
     *
     * @param isError {boolean=false} an automatic error message is generated.
     * @return {FuxcelValidator} Fuxcel Validator Object of the selected element.
     */
    validateField(isError: boolean): FuxcelValidator;
    /**
     * Validate the selected field.
     *
     * _Displays a success message._
     *
     * @param message {string} Validation message to display.
     * @returns {FuxcelValidator}
     */
    validateField(message: string): FuxcelValidator;
    /**
     * Validate the selected field.
     *
     * @param message {StringOrNull} Validation message to display.
     * @param isError {boolean=false} Is Validation message an error? _[defaults to false]._
     * @return {FuxcelValidator} Fuxcel Validator Object of the selected element.
     */
    validateField(message: StringOrNull, isError?: boolean): FuxcelValidator;
    /**
     * Validate the selected field.
     *
     * _Displays an error message if the `message` parameter is null or if `isError` parameter is true._
     *
     * @param message {StringOrNull} Validation message to display.
     * @param isError {boolean=false} If true and the message parameter is null, an automatic error message is generated.
     * @returns {FuxcelValidator}
     */
    validateField(message: StringOrNull | boolean, isError?: boolean): FuxcelValidator;
    /**
     * Validate Email field using Regular Expression
     *
     * @param regExp {RegExp} Regular expression to use.
     * @return {FuxcelValidator} Fuxcel Validator Object of the selected element.
     */
    validateEmail(regExp: RegExp): FuxcelValidator;
    /**
     * Validate Email field using Regular Expression
     *
     * @param regExp {RegExp} Regular expression to use.
     * @param customFormatEx {StringOrNull} Custom format example to show user.
     * @return {FuxcelValidator} Fuxcel Validator Object of the selected element.
     */
    validateEmail(regExp: RegExp, customFormatEx: StringOrNull): FuxcelValidator;
    /**
     * Validate Email field using Regular Expression
     *
     * @param regExp {RegExp} Regular expression to use.
     * @param customFormatEx {StringOrNull = null} Custom format example to show user.
     * @return {FuxcelValidator} Fuxcel Validator Object of the selected element.
     */
    validateEmail(regExp: RegExp, customFormatEx?: StringOrNull): FuxcelValidator;
    /**
     * Validate Password field using Regular Expression
     *
     * @param regExp {RegExp} Regular expression to use
     * @return {FuxcelValidator} Fuxcel Validator Object of the selected element.
     */
    validatePassword(regExp: RegExp): FuxcelValidator;
    /**
     * Validate Password field using Regular Expression
     *
     * @param regExp {RegExp} Regular expression to use
     * @param customFormatEx {StringOrNull} Custom format example to show user.
     * @return {FuxcelValidator} Fuxcel Validator Object of the selected element.
     */
    validatePassword(regExp: RegExp, customFormatEx: StringOrNull): FuxcelValidator;
    /**
     * Validate Password field using Regular Expression
     *
     * @param regExp {RegExp} Regular expression to use
     * @param customFormatEx {string|null=null} Custom format example to show user.
     * @return {FuxcelValidator} Fuxcel Validator Object of the selected element.
     */
    validatePassword(regExp: RegExp, customFormatEx?: StringOrNull): FuxcelValidator;
    /**
     * Validate Name field using Regular Expression
     *
     * @param regExp {RegExp} Regular expression to use.
     * @return {FuxcelValidator} Fuxcel Validator Object of the selected element.
     */
    validateName(regExp: RegExp): FuxcelValidator;
    /**
     * Validate Name field using Regular Expression
     *
     * @param regExp {RegExp} Regular expression to use.
     * @param customFormatEx {StringOrNull} Custom format example to show user.
     * @return {FuxcelValidator} Fuxcel Validator Object of the selected element.
     */
    validateName(regExp: RegExp, customFormatEx: StringOrNull): FuxcelValidator;
    /**
     * Validate Name field using Regular Expression
     *
     * @param regExp {RegExp} Regular expression to use.
     * @param customFormatEx {string|null=null} Custom format example to show user.
     * @return {FuxcelValidator} Fuxcel Validator Object of the selected element.
     */
    validateName(regExp: RegExp, customFormatEx?: StringOrNull): FuxcelValidator;
    /**
     * Validate Phone field using Regular Expression
     *
     * @param regExp {RegExp} Regular expression to use
     * @return {FuxcelValidator} Fuxcel Validator Object of the selected element.
     */
    validatePhone(regExp: RegExp): FuxcelValidator;
    /**
     * Validate Phone field using Regular Expression
     *
     * @param regExp {RegExp} Regular expression to use
     * @param customFormatEx {StringOrNull} Custom format example to show user.
     * @return {FuxcelValidator} Fuxcel Validator Object of the selected element.
     */
    validatePhone(regExp: RegExp, customFormatEx: StringOrNull): FuxcelValidator;
    /**
     * Validate Phone field using Regular Expression
     *
     * @param regExp {RegExp} Regular expression to use
     * @param customFormatEx {string|null=null} Custom format example to show user.
     * @return {FuxcelValidator} Fuxcel Validator Object of the selected element.
     */
    validatePhone(regExp: RegExp, customFormatEx?: StringOrNull): FuxcelValidator;
    /**
     * Validate Username field using Regular Expression
     *
     * @param regExp {RegExp} Regular expression to use
     * @return {FuxcelValidator} Fuxcel Validator Object of the selected element.
     */
    validateUsername(regExp: RegExp): FuxcelValidator;
    /**
     * Validate Username field using Regular Expression
     *
     * @param regExp {RegExp} Regular expression to use
     * @param customFormatEx {StringOrNull} Custom format example to show user.
     * @return {FuxcelValidator} Fuxcel Validator Object of the selected element.
     */
    validateUsername(regExp: RegExp, customFormatEx: StringOrNull): FuxcelValidator;
    /**
     * Validate Username field using Regular Expression
     *
     * @param regExp {RegExp} Regular expression to use
     * @param customFormatEx {string|null=null} Custom format example to show user.
     * @return {FuxcelValidator} Fuxcel Validator Object of the selected element.
     */
    validateUsername(regExp: RegExp, customFormatEx?: StringOrNull): FuxcelValidator;
    /**
     * Validate Card CVV field using Regular Expression
     *
     * @param regExp {RegExp} Regular expression to use.
     * @return {FuxcelValidator} Fuxcel Validator Object of the selected element.
     */
    validateCardCVV(regExp: RegExp): FuxcelValidator;
    /**
     * Validate Card CVV field using Regular Expression
     *
     * @param regExp {RegExp} Regular expression to use.
     * @param customFormatEx {StringOrNull} Custom format example to show user.
     * @return {FuxcelValidator} Fuxcel Validator Object of the selected element.
     */
    validateCardCVV(regExp: RegExp, customFormatEx: StringOrNull): FuxcelValidator;
    /**
     * Validate Card CVV field using Regular Expression
     *
     * @param regExp {RegExp} Regular expression to use.
     * @param customFormatEx {string|null=null} Custom format example to show user.
     * @return {FuxcelValidator} Fuxcel Validator Object of the selected element.
     */
    validateCardCVV(regExp: RegExp, customFormatEx?: StringOrNull): FuxcelValidator;
    /**
     * Validate Card Number field using Regular Expression
     *
     * @param regExp {RegExp} Regular expression to use.
     * @return {FuxcelValidator} Fuxcel Validator Object of the selected element.
     */
    validateCardNumber(regExp: RegExp): FuxcelValidator;
    /**
     * Validate Card Number field using Regular Expression
     *
     * @param regExp {RegExp} Regular expression to use.
     * @param customFormatEx {StringOrNull} Custom format example to show user
     * @return {FuxcelValidator} Fuxcel Validator Object of the selected element.
     */
    validateCardNumber(regExp: RegExp, customFormatEx: StringOrNull): FuxcelValidator;
    /**
     * Validate Card Number field using Regular Expression
     *
     * @param regExp {RegExp} Regular expression to use.
     * @param customFormatEx {string|null=null} Custom format example to show user
     * @return {FuxcelValidator} Fuxcel Validator Object of the selected element.
     */
    validateCardNumber(regExp: RegExp, customFormatEx?: StringOrNull): FuxcelValidator;
    /**
     * Validate field using a callback function.
     *
     * @param regExpOrFn {Function} Function to use.
     * @return {FuxcelValidator} Fuxcel Validator Object of the selected element.
     */
    validateRegex(regExpOrFn: Function): FuxcelValidator;
    /**
     * Validate field using Regular Expression.
     *
     * @param regExpOrFn {RegExp} Regular Expression to use.
     * @param message {StringOrNull} Validation message.
     * @return {FuxcelValidator} Fuxcel Validator Object of the selected element.
     */
    validateRegex(regExpOrFn: RegExp, message: StringOrNull): FuxcelValidator;
    /**
     * Validate field using Regular Expression or a callback function.
     *
     * @param regExpOrFn {Function|RegExp} Regular Expression or callback function to use.
     * @param message {string|null=null} Validation message.
     * @return {FuxcelValidator} Fuxcel Validator Object of the selected element.
     */
    validateRegex(regExpOrFn: RegExp | Function, message?: StringOrNull): FuxcelValidator;
    /**
     * Validate the given form-group element.
     *
     * _Internally guards against re-validating a form-group that's already been
     * validated — if the given element has already been processed, a warning is
     * logged to the console and the call is a no-op._
     *
     * @param formGroup {HTMLElement} The form-group element to validate.
     * @return {void}
     */
    validateFromGroup(formGroup: HTMLElement): void;
    /**
     * Validate the given form-group element, tagging the call with a source label
     * for diagnostic purposes.
     *
     * _If the given element has already been validated, a warning is logged to the
     * console — including the `source` value — to help identify which code path
     * triggered the duplicate call._
     *
     * @param formGroup {HTMLElement} The form-group element to validate.
     * @param source {string} Label identifying the calling function/context _(e.g. `'extendValidation'`)_. Included in the console warning if the form-group has already been validated.
     * @return {void}
     */
    validateFromGroup(formGroup: HTMLElement, source: string): void;
    /**
     * Validate the given form-group element.
     *
     * _Internally guards against re-validating a form-group that's already been
     * validated — if the given element has already been processed, a warning is
     * logged to the console (tagged with `source`, if provided) and the call is a
     * no-op._
     *
     * @param formGroup {HTMLElement} The form-group element to validate.
     * @param source {StringOrNull=null} Optional label identifying the calling function/context _(e.g. `'extendValidation'`)_. Used to make the duplicate-validation warning more diagnostic. Defaults to `'validateFromGroup'` internally if omitted.
     * @return {void}
     */
    validateFromGroup(formGroup: HTMLElement, source?: StringOrNull): void;
    /**
     * Show validation error for the selected field.
     *
     * @return {void}
     */
    showError(): void;
    /**
     * Show validation error for the selected field.
     *
     * @param message {StringOrNull} Validation message.
     * @return {void}
     */
    showError(message: StringOrNull): void;
    /**
     * Show validation error for the selected field.
     *
     * @param message {string|null=null} Validation message.
     * @return {void}
     */
    showError(message?: StringOrNull): void;
    /**
     * Show validation success.
     *
     * @return {void}
     */
    showSuccess(): void;
    /**
     * Show validation success.
     *
     * @param message {StringOrNull} Validation message.
     * @return {void}
     */
    showSuccess(message: StringOrNull): void;
    /**
     * Show validation success.
     *
     * @param message {StringOrNull = null} Validation message.
     * @return {void}
     */
    showSuccess(message?: StringOrNull): void;
    /**
     * Toggle between validating and removing validation from the selected field.
     *
     * @return {FuxcelValidator} Fuxcel Validator Object of the forms.
     */
    toggleValidation(): FuxcelValidator;
    /**
     * Remove validation from the selected field element. Also remove the error from the error bag if destroyValidation parameter is set tot true.
     *
     * @param destroyValidation {boolean = false}
     * @return {FuxcelValidator} Fuxcel Validator Object of the forms.
     */
    undoValidation(destroyValidation?: boolean): FuxcelValidator;
    /** Reset validation message. **/
    renderMessage(): FuxcelValidator;
    /**
     * Render validation message.
     *
     * @param message {string} message to display.
     * @return {FuxcelValidator} Fuxcel Validator Object of the current selected element.
     */
    renderMessage(message: string): FuxcelValidator;
    /**
     * Render validation message.
     *
     * @param message {StringOrNull = null} message to display [optional]
     * @param renderClass {StringOrNull} validation type
     * @return {FuxcelValidator} Fuxcel Validator Object of the current selected element.
     */
    renderMessage(message?: StringOrNull, renderClass?: StringOrNull): FuxcelValidator;
    /**
     * Render validation message.
     *
     * @param message {string|null=null} message to display [optional]
     * @param renderType {('error'|'success'|null)} validation type
     * @return {FuxcelValidator} Fuxcel Validator Object of the current selected element.
     */
    renderMessage(message?: StringOrNull, renderType?: 'error' | 'success' | null): FuxcelValidator;
    /**
     * Display all validation errors for the selected form.
     *
     * @param errors {{ [key: string]: any }}
     * @return FuxcelValidator
     */
    renderValidationErrors(errors: {
        [key: string]: any;
    }): FuxcelValidator;
    /**
     * Display all validation errors for the selected form.
     *
     * @param errors {null}
     * @param messageOrFn {((fx: FuxcelValidator, e?: CustomEvent) => any)}
     * @return FuxcelValidator
     */
    renderValidationErrors(errors: null, messageOrFn: ((fx: FuxcelValidator, e?: CustomEvent) => any)): FuxcelValidator;
    /**
     * Display all validation errors for the selected form.
     *
     * @param errors {null}
     * @param messageOrFn {string}
     * @return FuxcelValidator
     */
    renderValidationErrors(errors: null, messageOrFn: string): FuxcelValidator;
    /**
     * Display all validation errors for the selected form.
     *
     * @param errors {{ [key: string]: any }} An object containing the errors. The keys are the form field ids and their values are the errors for the fields respectively.
     * @param messageOrFn {((fx: FuxcelValidator, e?: CustomEvent) => any)}
     * @return FuxcelValidator
     */
    renderValidationErrors(errors: {
        [key: string]: any;
    }, messageOrFn: ((fx: FuxcelValidator, e?: CustomEvent) => any)): FuxcelValidator;
    /**
     * Display all validation errors for the selected form.
     *
     * @param errors {{ [key: string]: any }} An object containing the errors. The keys are the form field ids and their values are the errors for the fields respectively.
     * @param messageOrFn {string}
     * @return FuxcelValidator
     */
    renderValidationErrors(errors: {
        [key: string]: any;
    }, messageOrFn: string): FuxcelValidator;
    /**
     * Display all validation errors for the selected form.
     *
     * @param errors {{ [key: string]: any }} An object containing the errors. The keys are the form field ids and their values are the errors for the fields respectively.
     * @param messageOrFn {((fx: FuxcelValidator, e?: CustomEvent) => any)}
     * @param callbackFn {((fx: FuxcelValidator, e?: CustomEvent) => any)}
     * @return FuxcelValidator
     */
    renderValidationErrors(errors: {
        [key: string]: any;
    }, messageOrFn: ((fx: FuxcelValidator, e?: CustomEvent) => any), callbackFn: ((fx: FuxcelValidator, e?: CustomEvent) => any)): FuxcelValidator;
    /**
     * Display all validation errors for the selected form.
     *
     * @param errors {{ [key: string]: any }} An object containing the errors. The keys are the form field ids and their values are the errors for the fields respectively.
     * @param messageOrFn {string}
     * @param callbackFn {((fx: FuxcelValidator, e?: CustomEvent) => any)}
     * @return FuxcelValidator
     */
    renderValidationErrors(errors: {
        [key: string]: any;
    }, messageOrFn: string, callbackFn: ((fx: FuxcelValidator, e?: CustomEvent) => any)): FuxcelValidator;
    /**
     * Display all validation errors for the selected form.
     *
     * @param errors {{ [key: string]: any } | null = null} An object containing the errors. The keys are the form field ids and their values are the errors for the fields respectively.
     * @param messageOrFn {((fx: FuxcelValidator, e?: CustomEvent) => any)|StringOrNull}
     * @param callbackFn {((fx: FuxcelValidator, e?: CustomEvent) => any)}
     * @return FuxcelValidator
     */
    renderValidationErrors(errors?: {
        [key: string]: any;
    } | null, messageOrFn?: ((fx: FuxcelValidator, e?: CustomEvent) => any) | StringOrNull, callbackFn?: ((fx: FuxcelValidator, e?: CustomEvent) => any) | null): FuxcelValidator;
    stepErrorBag(step: number): object | null;
    stepErrorBag(step: string): object | null;
    /**
     * Returns the error bag for the given step of the current selected element.
     *
     * @param step {number|string} Given step.
     * @return {object} The error bag for the given step of the current selected step form.
     */
    stepErrorBag(step: number | string): object | null;
    stepErrorCount(step: number): number;
    stepErrorCount(step: string): number;
    /**
     * Returns the error count for the given step of the current selected element.
     *
     * @param step {number|string} Given step.
     * @return {object} The error count for the given step of the current selected step form.
     */
    stepErrorCount(step: number | string): number;
    /** Checks if the selected field element can be validated by checking thw value of `[data-fx-validate]` data-attribute or the parent form-group is not hidden. **/ readonly canBeValidated: boolean;
    /** Get the error bag for the current selected form. **/ readonly errorBag: object | null;
    /** Get the error count for the current selected form. **/ readonly errorCount: number;
    /** Get the password strength for the current selected form of password field. **/ readonly passwordStrength: StrengthResult | null;
    /** An object containing the error bag and error count for the current selected form(s). Logs an error to the console if selected element(s) not form element(s). **/ readonly getErrors: object | void;
    /** An object containing all form field elements for the current selected form(s). Logs an error to the console if selected element(s) not form element(s). **/ readonly formFieldElements: object | void;
    /** Checks if the selected form field element is an email field. **/ readonly isEmailField: boolean;
    /** Checks if the selected form field element is a name field. **/ readonly isNameField: boolean;
    /** Checks if the selected form field element is a password field. **/ readonly isPasswordField: boolean;
    /** Checks if the selected form field element is a phone field. **/ readonly isPhoneField: boolean;
    /** Checks if the selected form field element is a username field. **/ readonly isUsernameField: boolean;
    readonly stepFromField: number;
    /** Returns the `ValidationProps` of the selected form field element. **/ readonly validationProps: ValidationProps;
    /** Returns the current `ValidatorConfigObject` options of selected form. **/ readonly validatorConfig: ValidatorConfigObject;
}
/** Public API of a FuxcelSteps instance. */
interface FuxcelStepsInstance extends FuxcelValidatorInstance {
    readonly context: FuxcelStepsInstance;
    readonly formSteps: object | (number | string)[];
    stepErrors(step?: number | string | null): object | void;
}
/** Public API of a FuxcelModal instance. */
interface FuxcelModalInstance extends FuxcelInstance {
    /** Remove the selected modal element from the DOM entirely. **/
    destroy(): void;
    /**
     * Hide (and optionally destroy) the selected modal.
     *
     * @param destroy {boolean=false} Whether to remove the element from the DOM after hiding.
     */
    hide(destroy?: boolean): void;
    /**
     * Open selected modal.
     *
     * @param escKey {boolean=true} Allow closing the modal using the Escape on the KeyBoard if set to true. True by default.
     */
    show(escKey?: boolean): void;
    /** Toggle between hide and show state of the selected modal. **/
    toggle(): void;
}
interface FuxcelConstructor {
    new (selector: string | IterableElement | SingleElement, context?: string | IterableElement | SingleElement): Fuxcel;
    (selector: string | IterableElement | SingleElement, context?: string | IterableElement | SingleElement): Fuxcel;
    buttonLoaderClass: string;
    /** The Plugin path. **/ path: string | null;
    /** `true` if the current device is a mobile device. **/ readonly isMobileDevice: boolean;
    /** `true` if the pointer is coarse (touch). **/ readonly pointerIsTouch: boolean;
}
interface FuxcelValidatorConstructor {
    new (selector: string | IterableElement | SingleElement, context?: string | IterableElement | SingleElement): FuxcelValidator;
    readonly defaultValidatorConfig: ValidatorConfigObject;
    readonly passwordCapslockAlertClass: string;
    readonly passwordTogglerIconClass: string;
    stepsClass: string;
}
interface FuxcelStepsConstructor {
    new (selected: FuxcelValidator): FuxcelStepsInstance;
    currentlySelected: object;
}
interface FuxcelModalConstructor {
    new (selector: string | IterableElement | SingleElement, context?: string | IterableElement | SingleElement, autoActions?: boolean): FuxcelModal;
    /** The most recently opened modal, or `null` if none is open. **/ readonly currentModal: FuxcelModal | null;
    /** `true` if any modals are currently open. **/ readonly hasOpenModals: boolean;
    /** All elements with `[data-fx-target="modal"]`. **/ readonly modalTriggers: Fuxcel;
    /**
     * Builds a modal DOM structure and returns the root element.
     *
     * @param {ModalInit} options
     * @returns {HTMLElement}
     */
    init(options: ModalInit): HTMLElement;
}
/**
 * Type definition for the number formatting function interface.
 *
 * Defines the contract for a function that formats a `number` or numeric `string`
 * into a locale-aware string with grouped thousands separators and a fixed number
 * of decimal places, using `Intl.NumberFormat` (via `Number.prototype.toLocaleString`)
 * under the hood with the `'en-US'` locale.
 *
 * This interface is implemented by the `formatNumber` function.
 *
 * **Why string input needs coercion:**
 * Passing a numeric string directly to `String.prototype.toLocaleString()` silently
 * ignores all formatting options and returns the string unchanged — there is no
 * warning or error. Implementations of this interface MUST coerce string input to
 * a `number` before formatting to avoid this pitfall.
 *
 * @interface FxFormatNumber
 * @category Utilities
 * @category Formatting
 *
 * @example
 * // Implementing the interface
 * const myFormatNumber: FxFormatNumber = (value, fractionDigits = 2) => {
 *   const num = typeof value === 'string' ? Number(value) : value;
 *   return num.toLocaleString('en-US', {
 *     minimumFractionDigits: fractionDigits,
 *     maximumFractionDigits: fractionDigits,
 *   });
 * };
 *
 * @see {@link formatNumber} - Implementation of this interface
 * @since 2.2.0
 */
interface FxFormatNumber {
    /**
     * Format a number as a locale-aware string with grouped thousands separators,
     * using the default of 2 decimal places.
     *
     * @param value {number} The number to format.
     * @return {string} The formatted number string, with 2 decimal places.
     *
     * @example
     * formatNumber(1234.5);   // '1,234.50'
     * formatNumber(1234);     // '1,234.00'
     *
     * @since 2.2.0
     */
    (value: number): string;
    /**
     * Format a numeric string as a locale-aware string with grouped thousands
     * separators, using the default of 2 decimal places.
     *
     * The string is coerced to a `number` internally before formatting — this
     * overload does NOT fall back to `String.prototype.toLocaleString`, which
     * would otherwise silently ignore all formatting options.
     *
     * @param value {string} The numeric string to format.
     * @return {string} The formatted number string, with 2 decimal places.
     *
     * @example
     * formatNumber('1234.5');   // '1,234.50'
     * formatNumber('1234');     // '1,234.00'
     *
     * @since 2.2.0
     */
    (value: string): string;
    /**
     * Format a number as a locale-aware string with grouped thousands separators
     * and a specified number of decimal places.
     *
     * @param value {number} The number to format.
     * @param fractionDigits {number} Number of decimal places to show _(applied as
     *   both `minimumFractionDigits` and `maximumFractionDigits`, so the output
     *   always has exactly this many decimal places)_.
     * @return {string} The formatted number string.
     *
     * @example
     * formatNumber(1234.567, 3);   // '1,234.567'
     * formatNumber(1234, 0);       // '1,234'
     *
     * @since 2.2.0
     */
    (value: number, fractionDigits: number): string;
    /**
     * Format a numeric string as a locale-aware string with grouped thousands
     * separators and a specified number of decimal places.
     *
     * The string is coerced to a `number` internally before formatting — this
     * overload does NOT fall back to `String.prototype.toLocaleString`, which
     * would otherwise silently ignore all formatting options.
     *
     * @param value {string} The numeric string to format.
     * @param fractionDigits {number} Number of decimal places to show _(applied as
     *   both `minimumFractionDigits` and `maximumFractionDigits`, so the output
     *   always has exactly this many decimal places)_.
     * @return {string} The formatted number string.
     *
     * @example
     * formatNumber('1234.5', 3);   // '1,234.500'
     * formatNumber('1234', 0);     // '1,234'
     *
     * @since 2.2.0
     */
    (value: string, fractionDigits: number): string;
    /**
     * Format a number or numeric string as a locale-aware string with grouped
     * thousands separators and a fixed number of decimal places.
     *
     * This is the unified signature that encompasses all narrower overloads above.
     * String input is coerced to a `number` before formatting — this signature does
     * NOT fall back to `String.prototype.toLocaleString`, which would otherwise
     * silently ignore all formatting options.
     *
     * @param value {number | string} The number, or numeric string, to format.
     * @param fractionDigits {number=2} Number of decimal places to show _(applied as
     *   both `minimumFractionDigits` and `maximumFractionDigits`, so the output
     *   always has exactly this many decimal places)_. Defaults to `2` if omitted.
     * @return {string} The formatted number string.
     *
     * @example
     * formatNumber(1234.5);        // '1,234.50'
     * formatNumber('1234.5');      // '1,234.50'
     * formatNumber(1234.567, 3);   // '1,234.567'
     * formatNumber(1234, 0);       // '1,234'
     *
     * @since 2.2.0
     */
    (value: number | string, fractionDigits?: number): string;
}
/**
 * Type definition for the page fetching function interface.
 *
 * Defines the contract for a function that fetches page resources using either
 * a custom HTTP client (`fx.fetch`) or the native Fetch API as a fallback.
 * This interface is implemented by the `fxFetchPage` function.
 *
 * The function is designed for AJAX-based page navigation in single-page applications (SPAs)
 * and supports both JSON and plain text responses. It provides a unified API regardless
 * of which underlying fetch mechanism is used.
 *
 * @interface FxFetchPage
 * @category HTTP Client
 * @category Page Navigation
 *
 * @example
 * // Implementing the interface
 * const myFetchPage: FxFetchPage = (url, dataType, beforeSend?) => {
 *   // Implementation that returns Promise<string>
 *   return fetch(url).then(r => r.text());
 * };
 *
 * @example
 * // Using the interface as a type guard
 * function isFetchPageFunction(fn: any): fn is FxFetchPage {
 *   return typeof fn === 'function' && fn.length >= 2;
 * }
 *
 * @see {@link fxFetchPage} - Implementation of this interface
 * @see {@link FxPageNavigate} - Related navigation interface
 * @since 2.0.1
 */
interface FxFetchPage {
    /**
     * Fetches a URL and returns the response as a text string.
     *
     * This overload expects a **text response** and is typically used for fetching
     * HTML pages, plain text files, or any content that should be returned as-is
     * without parsing.
     *
     * @param {string} url - The URL to request. Must be a valid absolute or relative URL.
     * @param {"text"} dataType - Must be the literal string `"text"` for this overload.
     *   Indicates that the response should be treated as plain text.
     * @param {(() => void) | null} [beforeSend] - Optional callback executed immediately
     *   before the HTTP request is sent. Useful for:
     *   - Starting loading indicators
     *   - Showing progress bars
     *   - Logging request initiation
     *   - Setting up request state
     *
     * @returns {Promise<string>} A Promise that resolves with the response body as a string.
     *   The Promise will reject if the request fails due to network errors, timeouts,
     *   or HTTP error status codes.
     *
     * @throws {Error} Network errors, timeouts, or HTTP error responses
     *
     * @example
     * // Fetch HTML page
     * const fetchPage: FxFetchPage = fxFetchPage;
     *
     * fetchPage('/about.html', 'text')
     *   .then(html => {
     *     document.getElementById('content').innerHTML = html;
     *   })
     *   .catch(err => console.error('Failed to load page:', err));
     *
     * @example
     * // With beforeSend callback
     * fetchPage('/page.html', 'text', () => {
     *   console.log('Fetching page...');
     *   showLoadingSpinner();
     * }).then(html => {
     *   hideLoadingSpinner();
     *   renderPage(html);
     * });
     *
     * @example
     * // Using async/await
     * async function loadAboutPage() {
     *   const html = await fetchPage('/about', 'text', () => {
     *     fxPageLoader.start();
     *   });
     *   document.body.innerHTML = html;
     *   fxPageLoader.finish();
     * }
     */
    (url: string, dataType: 'text', beforeSend?: (() => void) | null): Promise<FxFetchPageResponse>;
    /**
     * Fetches a URL and returns the response as a JSON string (unparsed).
     *
     * This overload expects a **JSON response** but returns it as a string rather
     * than parsing it automatically. This gives the caller control over when and how
     * to parse the JSON, useful for error handling or custom parsing logic.
     *
     * **Important:** The response is NOT automatically parsed into a JavaScript object.
     * You must call `JSON.parse()` on the returned string to get the object.
     *
     * @param {string} url - The URL to request. Should point to a JSON endpoint or file.
     * @param {"json"} dataType - Must be the literal string `"json"` for this overload.
     *   Indicates that the response is expected to be valid JSON (though it's returned unparsed).
     * @param {(() => void) | null} [beforeSend] - Optional callback executed immediately
     *   before the HTTP request is sent. Useful for:
     *   - Starting loading indicators
     *   - Logging API calls
     *   - Analytics tracking
     *   - Request state management
     *
     * @returns {Promise<string>} A Promise that resolves with the raw JSON response as a string.
     *   **The JSON is NOT parsed** - you must parse it yourself using `JSON.parse()`.
     *   The Promise will reject if the request fails.
     *
     * @throws {Error} Network errors, timeouts, or HTTP error responses
     *
     * @example
     * // Fetch and parse JSON
     * const fetchPage: FxFetchPage = fxFetchPage;
     *
     * fetchPage('/api/users.json', 'json')
     *   .then(jsonString => {
     *     const users = JSON.parse(jsonString);
     *     console.log(users);
     *   })
     *   .catch(err => console.error('Failed to load users:', err));
     *
     * @example
     * // With error handling for invalid JSON
     * fetchPage('/api/data.json', 'json', () => {
     *   console.log('Fetching data...');
     * })
     *   .then(jsonString => {
     *     try {
     *       const data = JSON.parse(jsonString);
     *       return data;
     *     } catch (parseError) {
     *       console.error('Invalid JSON:', parseError);
     *       throw new Error('Server returned invalid JSON');
     *     }
     *   })
     *   .then(data => updateUI(data));
     *
     * @example
     * // Using async/await with custom parsing
     * async function loadUserData() {
     *   try {
     *     const jsonString = await fetchPage('/api/user', 'json', () => {
     *       showLoader();
     *     });
     *
     *     const userData = JSON.parse(jsonString);
     *
     *     if (!userData.id) {
     *       throw new Error('Invalid user data');
     *     }
     *
     *     return userData;
     *   } catch (error) {
     *     console.error('Failed to load user:', error);
     *     return null;
     *   } finally {
     *     hideLoader();
     *   }
     * }
     *
     * @remarks
     * **Why return unparsed JSON?**
     * - Allows custom error handling for parsing errors
     * - Gives caller control over parsing (e.g., using reviver function)
     * - Consistent return type with 'text' dataType
     * - Avoids double-parsing if response needs to be stored as string
     */
    (url: string, dataType: 'json', beforeSend?: (() => void) | null): Promise<FxFetchPageResponse>;
    /**
     * Fetches a URL with the specified data type and optional beforeSend callback.
     *
     * This is the unified signature that encompasses both the 'text' and 'json' overloads.
     * It provides maximum flexibility by accepting either data type and always returning
     * the raw response string.
     *
     * This signature is particularly useful for:
     * - Generic wrapper functions
     * - Dynamic data type selection
     * - Type-safe implementations
     * - Library integration
     *
     * @param {string} url - The URL of the resource to fetch. Can be absolute or relative.
     * @param {"json" | "text"} dataType - The expected response format:
     *   - `"json"` - Response is expected to be JSON (returned as unparsed string)
     *   - `"text"` - Response is expected to be plain text/HTML
     * @param {(() => void) | null} [beforeSend] - Optional callback invoked immediately
     *   before the request starts. Can be `null`, `undefined`, or a function.
     *
     * @returns {Promise<string>} A Promise that resolves with the response content as a string.
     *   For JSON responses, the string contains unparsed JSON that must be parsed separately.
     *   For text responses, the string contains the raw text content.
     *
     * @throws {Error} Rejects with error for network failures, timeouts, or HTTP errors
     *
     * @example
     * // Dynamic data type based on file extension
     * function smartFetch(url: string) {
     *   const dataType = url.endsWith('.json') ? 'json' : 'text';
     *   return fxFetchPage(url, dataType, () => {
     *     console.log(`Fetching ${dataType} from ${url}`);
     *   });
     * }
     *
     * @example
     * // Generic wrapper with logging
     * async function fetchWithLogging(
     *   url: string,
     *   type: 'json' | 'text'
     * ): Promise<string> {
     *   const startTime = Date.now();
     *
     *   const content = await fxFetchPage(url, type, () => {
     *     console.log(`Starting fetch: ${url}`);
     *   });
     *
     *   const duration = Date.now() - startTime;
     *   console.log(`Fetch completed in ${duration}ms`);
     *
     *   return content;
     * }
     *
     * @example
     * // Type-safe implementation
     * class PageLoader {
     *   private fetcher: FxFetchPage;
     *
     *   constructor(fetcher: FxFetchPage) {
     *     this.fetcher = fetcher;
     *   }
     *
     *   async loadPage(url: string): Promise<string> {
     *     return this.fetcher(url, 'text', () => {
     *       this.showSpinner();
     *     });
     *   }
     *
     *   async loadData(url: string): Promise<any> {
     *     const jsonString = await this.fetcher(url, 'json', () => {
     *       this.showSpinner();
     *     });
     *     return JSON.parse(jsonString);
     *   }
     *
     *   private showSpinner() {
     *     // Show loading indicator
     *   }
     * }
     *
     * @remarks
     * **Implementation Notes:**
     * - The function MUST support both 'json' and 'text' data types
     * - The beforeSend callback MUST be optional and nullable
     * - The return value MUST always be a Promise<string>
     * - JSON responses MUST NOT be automatically parsed
     * - The function SHOULD add appropriate headers (e.g., X-Requested-With)
     * - The function SHOULD handle both successful and error responses
     *
     * **Type Safety:**
     * - TypeScript will enforce that dataType is either 'json' or 'text'
     * - The beforeSend parameter accepts undefined, null, or a function
     * - Return type is always Promise<string> regardless of dataType
     *
     * @see {@link fxFetchPage} - Standard implementation
     */
    (url: string, dataType: 'json' | 'text', beforeSend?: (() => void) | null): Promise<FxFetchPageResponse>;
}
/**
 * Type definition for the page loader interface.
 *
 * Defines the contract for an object that controls a top progress bar for visual
 * feedback during asynchronous operations, particularly page navigation and AJAX requests.
 * This interface is implemented by the `fxPageLoader` object.
 *
 * The loader provides a YouTube/Medium-style thin progress bar that appears at the
 * top of the viewport, animates from 0% to 100%, and automatically fades out when
 * the operation completes. It's designed to give users immediate visual feedback
 * that something is happening.
 *
 * @interface FxPageLoader
 * @category UI Components
 * @category Loading States
 * @category User Feedback
 *
 * @example
 * // Implementing the interface
 * const myLoader: FxPageLoader = {
 *   start() {
 *     // Show progress bar
 *   },
 *   finish() {
 *     // Hide progress bar
 *   }
 * };
 *
 * @example
 * // Type guard for loader objects
 * function isPageLoader(obj: any): obj is FxPageLoader {
 *   return obj && typeof obj.start === 'function' && typeof obj.finish === 'function';
 * }
 *
 * @example
 * // Using as a type for dependency injection
 * class PageManager {
 *   constructor(private loader: FxPageLoader) {}
 *
 *   async loadPage(url: string) {
 *     this.loader.start();
 *     try {
 *       const content = await fetch(url);
 *       return content;
 *     } finally {
 *       this.loader.finish();
 *     }
 *   }
 * }
 *
 * @see {@link fxPageLoader} - Implementation of this interface
 * @see {@link FxPageNavigate} - Often used together with page navigation
 * @see {@link FxFetchPage} - Often used together with page fetching
 * @since 2.0.1
 */
interface FxPageLoader {
    /**
     * Starts the page loading progress bar animation.
     *
     * Creates and displays a fixed progress bar at the top of the viewport, then
     * animates it from 0% to approximately 90% width using randomized increments.
     * The animation continues until `finish()` is called, providing ongoing visual
     * feedback to the user that an operation is in progress.
     *
     * **Key Behaviors:**
     * - Creates progress bar element on first call (reused for subsequent calls)
     * - Starts at 10% width for immediate visual feedback
     * - Increments randomly to 90% (never reaches 100% until finish() is called)
     * - Updates every 200ms for smooth, realistic progress feel
     * - Safe to call multiple times (will reset existing bar)
     *
     * @function
     * @memberof FxPageLoader
     *
     * @returns {void} This method does not return a value.
     *
     * @example
     * // Basic usage
     * const loader: FxPageLoader = fxPageLoader;
     *
     * loader.start();
     * fetch('/api/data')
     *   .then(response => response.json())
     *   .then(data => console.log(data))
     *   .finally(() => loader.finish());
     *
     * @example
     * // With async/await
     * async function loadData() {
     *   const loader: FxPageLoader = fxPageLoader;
     *   loader.start();
     *
     *   try {
     *     const data = await fetchData();
     *     return data;
     *   } finally {
     *     loader.finish();  // Always called, even on error
     *   }
     * }
     *
     * @example
     * // Multiple concurrent operations
     * const loader: FxPageLoader = fxPageLoader;
     * loader.start();
     *
     * Promise.all([
     *   fetch('/api/users'),
     *   fetch('/api/posts'),
     *   fetch('/api/comments')
     * ]).finally(() => {
     *   loader.finish();
     * });
     *
     * @example
     * // Integration with page navigation
     * fxFetchPage('/page.html', 'text', fxPageLoader.start)
     *   .then(html => {
     *     document.body.innerHTML = html;
     *     fxPageLoader.finish();
     *   });
     *
     * @remarks
     * **Visual Specifications:**
     * - Position: Fixed at top of viewport (top: 0, left: 0)
     * - Height: 5px
     * - Color: #4f46e5 (Indigo 600)
     * - Z-index: 99999 (appears above all content)
     * - Transition: 0.2s ease for width, 0.3s ease for opacity
     *
     * **Animation Behavior:**
     * - Initial width: 10% (immediate visual feedback)
     * - Update interval: 200ms
     * - Increment: Random 0-10% per update
     * - Maximum width: 90% (caps at 90 until finish() called)
     * - Never completes automatically (requires finish() call)
     *
     * **Implementation Details:**
     * - Creates `<div id="fx-progress">` element
     * - Appends to document.body
     * - Uses setInterval for animation loop
     * - Stores interval ID for cleanup in finish()
     * - Element persists and is reused across calls
     *
     * **Performance:**
     * - Lightweight (single DOM element)
     * - Hardware-accelerated CSS transitions
     * - Efficient interval-based animation
     * - Minimal JavaScript execution
     *
     * **Best Practices:**
     * - Always pair with finish() call
     * - Use try/finally to ensure finish() is called
     * - Safe to call start() multiple times
     * - Don't rely on animation reaching 100% (it won't)
     *
     * @see {@link FxPageLoader.finish} - Completes and hides the progress bar
     */
    start(): void;
    /**
     * Completes the page loading progress bar animation and hides it.
     *
     * Immediately sets the progress bar to 100% width to show completion, then
     * fades it out and resets it after a brief delay. Also clears the animation
     * interval started by `start()` to prevent memory leaks and unnecessary processing.
     *
     * **Key Behaviors:**
     * - Clears animation interval immediately
     * - Jumps to 100% width for completion visual
     * - Waits 300ms at 100% (allows user to see completion)
     * - Fades out via opacity transition
     * - Resets to 0% width (ready for next use)
     * - Safe to call even if start() was never called
     * - Safe to call multiple times (idempotent)
     *
     * @function
     * @memberof FxPageLoader
     *
     * @returns {void} This method does not return a value.
     *
     * @example
     * // Basic usage
     * const loader: FxPageLoader = fxPageLoader;
     *
     * loader.start();
     * fetch('/api/data')
     *   .then(response => response.json())
     *   .then(data => console.log(data))
     *   .catch(err => console.error(err))
     *   .finally(() => loader.finish());  // Always called
     *
     * @example
     * // Guaranteed cleanup with try/finally
     * async function loadPage() {
     *   const loader: FxPageLoader = fxPageLoader;
     *   loader.start();
     *
     *   try {
     *     const html = await fxFetchPage('/page.html', 'text');
     *     document.body.innerHTML = html;
     *   } catch (error) {
     *     console.error('Load failed:', error);
     *   } finally {
     *     loader.finish();  // Ensures cleanup even on error
     *   }
     * }
     *
     * @example
     * // Multiple operations with single loader
     * const loader: FxPageLoader = fxPageLoader;
     * loader.start();
     *
     * Promise.allSettled([
     *   fetch('/api/users'),
     *   fetch('/api/posts'),
     *   fetch('/api/comments')
     * ]).then(results => {
     *   results.forEach(result => {
     *     if (result.status === 'fulfilled') {
     *       console.log('Success:', result.value);
     *     } else {
     *       console.error('Failed:', result.reason);
     *     }
     *   });
     * }).finally(() => {
     *   loader.finish();
     * });
     *
     * @example
     * // Safe to call without prior start()
     * const loader: FxPageLoader = fxPageLoader;
     * loader.finish();  // Does nothing if bar not started
     *
     * @example
     * // Integration with custom error handling
     * class DataLoader {
     *   private loader: FxPageLoader;
     *
     *   constructor(loader: FxPageLoader) {
     *     this.loader = loader;
     *   }
     *
     *   async load(url: string) {
     *     this.loader.start();
     *
     *     try {
     *       const response = await fetch(url);
     *       if (!response.ok) throw new Error('HTTP error');
     *       return await response.json();
     *     } catch (error) {
     *       this.handleError(error);
     *       throw error;
     *     } finally {
     *       this.loader.finish();  // Always cleanup
     *     }
     *   }
     *
     *   private handleError(error: any) {
     *     console.error('Load error:', error);
     *   }
     * }
     *
     * @remarks
     * **Animation Sequence:**
     * 1. Interval cleared (stops width animation)
     * 2. Width set to 100% (~200ms CSS transition)
     * 3. 300ms delay at 100% width
     * 4. Opacity set to 0 (~300ms CSS transition)
     * 5. Width reset to 0% (no visual impact, already invisible)
     *
     * **Timing Breakdown:**
     * - Transition to 100%: ~200ms
     * - Pause at completion: 300ms
     * - Fade out duration: ~300ms
     * - Total time: ~800ms from finish() to fully hidden
     *
     * **Memory Management:**
     * - Clears interval timer to prevent leaks
     * - Progress bar element remains in DOM (reused)
     * - No event listeners to clean up
     * - Minimal memory footprint
     *
     * **Edge Cases:**
     * - If progressBar is null: Returns immediately (no-op)
     * - If start() never called: Returns immediately (no-op)
     * - Multiple calls: Safe, resets fade-out timer
     * - Called during fade-out: Resets animation state
     *
     * **Visual Behavior:**
     * - Immediate jump to 100% (no gradual animation)
     * - Brief pause at 100% (satisfying completion visual)
     * - Smooth fade out (opacity transition)
     * - Invisible reset to 0% (preparation for next use)
     *
     * **Best Practices:**
     * - Always use try/finally blocks
     * - Call in Promise.finally() for safety
     * - Don't assume timing (use events if needed)
     * - Safe to call multiple times
     * - No need to check if started
     *
     * @see {@link FxPageLoader.start} - Starts the progress bar
     */
    finish(): void;
}
/**
 * Interface for the `fxPageNavigate` function that enables SPA-style navigation
 * by fetching page content via AJAX, updating the browser history, and injecting
 * the fetched content into a specified DOM container — with automatic fallback to
 * hard navigation on failure.
 *
 * ---
 *
 * **Navigation Flow:**
 * 1. Validates the URL — rejects if `null` or same as current location
 * 2. Starts the page loader via `fxPageLoader.start`
 * 3. Fetches the new page content via `fxFetchPage`
 * 4. Adds `fx-leaving` class to `<html>` for transition animations
 * 5. Updates browser history via `pushState` or `replaceState`
 * 6. Injects fetched content into the target DOM container
 * 7. Dispatches `fxPageNavigateReady` event on `document`
 * 8. Resolves with the fetched HTML string
 *
 * ---
 *
 * **On Failure:**
 * - Logs the error to the console
 * - Calls `fxPageLoader.finish()` to hide the loading indicator
 * - Removes the `fx-leaving` class from `<html>`
 * - Falls back to hard navigation via `window.location.href`
 * - Rejects the Promise with the error
 *
 * ---
 *
 * **CSS Classes:**
 * - `fx-leaving` — added to `<html>` during navigation, removed on completion or failure.
 *   Use this class to drive page transition animations.
 *
 * ---
 *
 * **History Management:**
 * - `pushState` _(default)_ — creates a new history entry, preserving back-button navigation
 * - `replaceState` — replaces the current history entry, useful for redirects or tab-like navigation
 *
 * ---
 *
 * @fires document#fxPageNavigateReady - Dispatched on `document` when navigation completes
 *   and new content has been injected into the DOM. Use this to re-initialize components,
 *   bind event listeners, or run scripts that depend on the new page content.
 *
 * @see {@link FXPageNavigateOptions} - Options type definition
 * @see {@link fxFetchPage} - Page fetching function used internally
 * @see {@link fxPageLoader} - Page loading indicator
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/History_API | History API}
 * @since 2.0.1
 */
interface FxPageNavigate {
    /**
     * Navigate to a new URL using the default `'json'` response type and `pushState` history mode.
     *
     * Fetches the page content at the given URL, updates the browser history with a new entry,
     * and injects the response into `'#root'` — the default container selector.
     *
     * Rejects immediately if `url` is `null` or matches the current location.
     *
     * @param options.url {string | null} The URL to navigate to.
     * @returns {Promise<string>} Resolves with the fetched HTML string on success.
     *
     * @throws {string} Rejects with an empty string if `url` is `null` or matches the current location.
     * @throws {Error} Rejects with the error object if the AJAX fetch fails.
     *
     * @example
     * // Minimal — navigates to /about, injects into #root, uses json, pushState
     * fxPageNavigate({ url: '/about' })
     *   .then(html => console.log('Done'))
     *   .catch(err => console.error(err));
     */
    (options: {
        url?: string | null;
    }): Promise<FxPageNavigateResponse>;
    /**
     * Navigate to a new URL and inject the fetched content into a specific DOM container.
     *
     * Fetches the page at the given URL and injects the response into the element
     * matching `selector`. Uses `'json'` as the default response type and `pushState`
     * as the default history mode.
     *
     * Rejects immediately if `url` is `null` or matches the current location.
     *
     * @param options.url {string | null} The URL to navigate to.
     * @param options.selector {string | null} CSS selector of the DOM element to inject content into.
     *   Defaults to `'#root'` if not specified or `null`.
     * @returns {Promise<string>} Resolves with the fetched HTML string on success.
     *
     * @throws {string} Rejects with an empty string if `url` is `null` or matches the current location.
     * @throws {Error} Rejects with the error object if the AJAX fetch fails.
     *
     * @example
     * // Navigate and inject into a custom container
     * fxPageNavigate({ url: '/about', selector: '#main-content' })
     *   .then(html => console.log('Injected into #main-content'))
     *   .catch(err => console.error(err));
     */
    (options: {
        url?: string | null;
        selector?: string | null;
    }): Promise<FxPageNavigateResponse>;
    /**
     * Navigate to a new URL, inject content into a specific container, and specify the response type.
     *
     * Fetches the page at the given URL, processes the response according to `dataType`,
     * and injects it into the element matching `selector`. Uses `pushState` as the
     * default history mode.
     *
     * Rejects immediately if `url` is `null` or matches the current location.
     *
     * @param options.url {string | null} The URL to navigate to.
     * @param options.selector {string | null} CSS selector of the DOM element to inject content into.
     *   Defaults to `'#root'` if not specified or `null`.
     * @param options.dataType {"json" | "text"} Expected response type. Determines how the
     *   response is processed before injection:
     *   - `'json'` — Response treated as JSON _(default)_
     *   - `'text'` — Response treated as plain text/HTML
     * @returns {Promise<string>} Resolves with the fetched HTML string on success.
     *
     * @throws {string} Rejects with an empty string if `url` is `null` or matches the current location.
     * @throws {Error} Rejects with the error object if the AJAX fetch fails.
     *
     * @example
     * // Navigate with text/HTML response type
     * fxPageNavigate({ url: '/about', selector: '#main-content', dataType: 'text' })
     *   .then(html => console.log('Done'))
     *   .catch(err => console.error(err));
     *
     * @example
     * // Navigate with JSON response and post-processing
     * fxPageNavigate({ url: '/api/page', selector: '#content', dataType: 'json' })
     *   .then(jsonString => {
     *     const data = JSON.parse(jsonString);
     *     updateMetaTags(data.meta);
     *     setPageTitle(data.title);
     *   });
     */
    (options: {
        url?: string | null;
        selector?: string | null;
        dataType?: 'json' | 'text';
    }): Promise<FxPageNavigateResponse>;
    /**
     * Navigate to a new URL with full control over the container, response type, and history mode.
     *
     * Fetches the page at the given URL, processes the response according to `dataType`,
     * injects it into the element matching `selector`, and updates the browser history
     * using either `pushState` or `replaceState` based on the `replace` flag.
     *
     * Rejects immediately if `url` is `null` or matches the current location.
     *
     * @param options {FXPageNavigateOptions} Full configuration object for the navigation.
     * @param options.url {string | null} The URL to navigate to.
     * @param options.selector {string | null} CSS selector of the DOM element to inject content into.
     *   Defaults to `'#root'` if not specified or `null`.
     * @param options.dataType {"json" | "text"} Expected response type. Defaults to `'json'`.
     *   - `'json'` — Response treated as JSON
     *   - `'text'` — Response treated as plain text/HTML
     * @param options.replace {boolean} Whether to replace the current history entry instead of
     *   creating a new one. Defaults to `false`.
     *   - `false` — Uses `history.pushState()` — user can navigate back _(default)_
     *   - `true` — Uses `history.replaceState()` — useful for redirects or tab-like navigation
     * @returns {Promise<string>} Resolves with the fetched HTML string on success.
     *
     * @throws {string} Rejects with an empty string if `url` is `null` or matches the current location.
     * @throws {Error} Rejects with the error object if the AJAX fetch fails.
     *
     * @example
     * // Full options — replace history entry, text response
     * fxPageNavigate({
     *   url: '/dashboard',
     *   selector: '#app',
     *   dataType: 'text',
     *   replace: true
     * })
     *   .then(html => console.log('Redirected'))
     *   .catch(err => console.error(err));
     *
     * @example
     * // Full options — push history entry, json response
     * fxPageNavigate({
     *   url: '/profile',
     *   selector: '#main',
     *   dataType: 'json',
     *   replace: false
     * }).then(jsonString => {
     *   const data = JSON.parse(jsonString);
     *   setPageTitle(data.title);
     * });
     *
     * @example
     * // async/await with full options
     * async function navigate(url: string) {
     *   try {
     *     await fxPageNavigate({ url, selector: '#app', dataType: 'text', replace: false });
     *     window.scrollTo(0, 0);
     *     trackPageView(url);
     *   } catch (error) {
     *     console.error('Navigation error:', error);
     *   }
     * }
     *
     * @example
     * // Listen for navigation ready event to re-initialize components
     * document.addEventListener('fxPageNavigateReady', () => {
     *   initializeComponents();
     *   window.scrollTo(0, 0);
     * });
     */
    (options: FXPageNavigateOptions): Promise<FxPageNavigateResponse>;
}
/**
 * The full type of the fx / fuxcel selector function,
 * including all static helper properties attached to it.
 */
interface FXInterface {
    /**
     * Select element(s) and return a Fuxcel instance.
     *
     * @param selector {string | IterableElement | SingleElement} CSS selector or element(s).
     * @param context  {string | IterableElement | SingleElement} Optional context to search within.
     * @example
     * fx('#btn').fadein(300);
     * fx('.items', '#list').each((el) => console.log(el));
     * @see document.querySelectorAll
     */
    (selector: string | IterableElement | SingleElement, context?: string | IterableElement | SingleElement): Fuxcel;
    /**
     * A convenient wrapper for the [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) to Perform an HTTP fetch request.
     *
     * It supports different HTTP methods, request data, response data types, and allows for the execution of custom functions before sending the request, after completion, on success, and on error.
     *
     * @example
     * const sendButton = fx('#post');
     *
     * fx.fetch({
     *  uri: '/api',
     *  method: 'post',
     *  beforeSend() => sendButton.disable(true),
     *  onSuccess: (res) => console.log(res.responseJSON),
     *  onError: (error) => console.log(error);
     * });
     */
    fetch: (options: FXRequestType) => void;
    fetchPage: FxFetchPage;
    pageLoader: FxPageLoader;
    /**
     * Create a quick alert / confirm modal.
     *
     * @example
     * fx.modal({ type: 'success', content: 'Saved!' });
     * fx.modal({ type: 'error', content: 'Failed.', confirmButtonText: 'Retry', onConfirm: (e, modal) => {} });
     */
    modal: (options?: FXModalType) => FuxcelModal;
    pageNavigate: FxPageNavigate;
    /**
     * Register a callback on DOMContentLoaded.
     *
     * @example
     * fx.onDocumentLoad(() => console.log('DOM ready'));
     */
    onDocumentLoad: (listener: (e: Event) => void) => Fuxcel;
    /**
     * Check if the given input passes the Luhn Algorithm test.
     * Commonly used to validate credit card numbers.
     *
     * @param input {string | number} The number to validate.
     * @example
     * fx.passLuhnAlgo('4532015112830366'); // true
     * @returns {boolean} `true` if the number passes the Luhn check; `false` otherwise.
     */
    passLuhnAlgo: (input: string | number) => boolean;
    formatNumber: FxFormatNumber;
}
declare global {
    /**
     * Core selector function. Creates a Fuxcel instance wrapping the matched element(s).
     *
     * @example
     * fx('#btn').upon('click', fn);
     * fx('#btn').fadein(300);
     * fx.fetch({ uri: '/api', method: 'post' });
     */
    const fx: FXInterface;
    /**
     * Alias of fx. Identical in every way — selector + static helpers.
     *
     * @example
     * fuxcel('#btn').fadein();
     * fuxcel.modal({ type: 'success', content: 'Done!' });
     */
    const fuxcel: FXInterface;
    /** Core DOM wrapper class. */
    const Fuxcel: FuxcelConstructor;
    /** Form validation engine. */
    const FuxcelValidator: FuxcelValidatorConstructor;
    /** Multi-step form extension of FuxcelValidator. */
    const FuxcelSteps: FuxcelStepsConstructor;
    /** Modal engine. */
    const FuxcelModal: FuxcelModalConstructor;
    const formatNumber: typeof fx.formatNumber;
    /**
     * Create a quick alert / confirm modal.
     *
     * @example
     * fxModal({ type: 'success', content: 'Saved!' });
     */
    function fxModal(options?: FXModalType): FuxcelModal;
    /**
     * Perform an HTTP fetch request.
     *
     * @example
     * fxFetch({ uri: '/api/users', method: 'get', onSuccess: (res) => console.log(res.responseJSON) });
     */
    function fxFetch(options: FXRequestType): void;
    /**
     * Validate a card number against the Luhn algorithm.
     *
     * @example
     * passLuhnAlgo('4532015112830366'); // true
     */
    function passLuhnAlgo(input: string | number): boolean;
    /** Returns true if value is of type boolean. */
    function isBool(value: any): boolean;
    /** Returns true if value is not null, undefined, or an empty string. */
    function isDefined(value: any): boolean;
    /** Returns true if value is of type function. */
    function isFunction(value: any): boolean;
    /** Returns true if value is of type object. */
    function isObject(value: any): boolean;
    /** Returns true if value is of type string. */
    function isString(value: any): boolean;
    /**
     * Parses a loose value to its boolean equivalent.
     * Treats true, 'true', 1, '1', 'on', 'yes' as true; everything else as false.
     *
     * @example
     * parseBool('yes');  // true
     * parseBool('off');  // false
     */
    function parseBool(value: any): boolean;
    interface Window {
        fx: FXInterface;
        fuxcel: FXInterface;
        Fuxcel: FuxcelConstructor;
        FuxcelValidator: FuxcelValidatorConstructor;
        FuxcelSteps: FuxcelStepsConstructor;
        FuxcelModal: FuxcelModalConstructor;
        formatNumber: FxFormatNumber;
        fxModal: (options?: FXModalType) => FuxcelModal;
        fxFetch: (options: FXRequestType) => void;
        passLuhnAlgo: (input: string | number) => boolean;
        isBool: (value: any) => boolean;
        isDefined: (value: any) => boolean;
        isFunction: (value: any) => boolean;
        isObject: (value: any) => boolean;
        isString: (value: any) => boolean;
        parseBool: (value: any) => boolean;
    }
}

export type { CustomEventType, Direction, EventInterfaces, ExtractedRule, FXAnimation, FXAnimationOptions, FXAnimationReturn, FXAnimationType, FXFormResponse, FXFormSubmitType, FXInterface, FXModalType, FXPageNavigateOptions, FXRequestType, FieldAttributes, FormValidationRegistryBag, FuxcelConstructor, FuxcelInstance, FuxcelModalConstructor, FuxcelModalInstance, FuxcelStepsConstructor, FuxcelStepsInstance, FuxcelValidatorConstructor, FuxcelValidatorInstance, FxFetchPage, FxFetchPageResponse, FxFormatNumber, FxPageLoader, FxPageNavigate, FxPageNavigateResponse, HTMLElementWithListenerArray, HTMLListenerArray, HTTPRequestMethod, InsertPositions, IterableElement, ModalInit, ResponseData, Selector, SingleElement, Strength, StrengthResult, StringOrNull, ValidationProps, ValidatorConfigObject };
