/**
 * Base class for the Fuxcel selector engine.
 * Handles element selection, array conversion, and static device helpers.
 */
declare class FuxcelBase {
    #private;
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
    /** Returns the `FieldAttributes` of the first selected element. */
    get fieldAttributes(): {
        id: string | undefined;
        fxName: string | undefined;
        type: string | null;
        fxId: string | null;
        fxRole: string | null;
        formId: any;
    };
    /** `true` if the current device is a mobile device. */
    static get isMobileDevice(): boolean;
    /** `true` if the pointer is coarse (touch). */
    static get pointerIsTouch(): boolean;
}

/**
 * Form validation engine.
 * Extends `Fuxcel` with rich real-time validation, error-bag tracking,
 * field-type detection, and step-form support.
 */
declare class FuxcelValidator extends Fuxcel implements FuxcelValidatorInstance {
    #private;
    /**
     * Per-instance error bag: { [formId]: { [fieldId]: errorMessage } }
     * Instance-level so multiple FuxcelValidator instances on different
     * forms (or the same form) never share or overwrite each other's state.
     */
    /**
     * Per-instance error count: { [formId]: number }
     */
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
    validateFromGroup(formGroup: HTMLElement): void;
    get canBeValidated(): boolean;
    get errorBag(): object | null;
    get errorCount(): number;
    get getErrors(): object | void;
    get formFieldElements(): object | void;
    get isEmailField(): boolean;
    get isNameField(): boolean;
    get isPasswordField(): boolean;
    get isPhoneField(): boolean;
    get isUsernameField(): boolean;
    get stepFromField(): number;
    get validationProps(): ValidationProps;
    get validatorConfig(): ValidatorConfigObject;
    static get defaultValidatorConfig(): ValidatorConfigObject;
    static get passwordCapslockAlertClass(): string;
    static get passwordTogglerIconClass(): string;
    static get stepsClass(): string;
    static set stepsClass(v: string);
    init(config?: ValidatorConfigObject | null): any;
    renderMessage(message?: StringOrNull, renderType?: StringOrNull): FuxcelValidator;
    renderValidationErrors(errors?: {
        [key: string]: any;
    } | null, messageOrFn?: ((fx: FuxcelValidator, e?: CustomEvent) => any) | StringOrNull, callbackFn?: ((fx: FuxcelValidator, e?: CustomEvent) => any) | null): FuxcelValidator;
    showError(message?: StringOrNull): void;
    showSuccess(message?: StringOrNull): void;
    toggleValidation(): FuxcelValidator;
    undoValidation(destroyValidation?: boolean): FuxcelValidator;
    stepErrorBag(step: number | string): object | null;
    stepErrorCount(step: number | string): number;
    validateCardCVV(regExp: RegExp, customFormatEx?: StringOrNull): FuxcelValidator;
    validateCardNumber(regExp: RegExp, customFormatEx?: StringOrNull): FuxcelValidator;
    /**
     * Validate Email field using Regular Expression.
     *
     * @param regExp {RegExp} Regular expression to use.
     * @param customFormatEx {string|null=null} Custom format example to show user.
     * @return {FuxcelValidator} Fuxcel Validator Object of the selected element.
     **/
    validateEmail(regExp: RegExp, customFormatEx?: StringOrNull): FuxcelValidator;
    validateField(message?: StringOrNull, isError?: boolean): FuxcelValidator;
    validateName(regExp: RegExp, customFormatEx?: StringOrNull): FuxcelValidator;
    validatePassword(regExp: RegExp, customFormatEx?: StringOrNull): FuxcelValidator;
    validatePhone(regExp: RegExp, customFormatEx?: StringOrNull): FuxcelValidator;
    /**
     * Validate field using Regular Expression or a callback function
     *
     * @param regExpOrFn {Function|RegExp} Regular Expression or callback function to use.
     * @return {FuxcelValidator} Fuxcel Validator Object of the selected element.
     */
    validateRegex(regExpOrFn: Function): FuxcelValidator;
    validateRegex(regExpOrFn: RegExp, message: string): FuxcelValidator;
    validateUsername(regExp: RegExp, customFormatEx?: StringOrNull): FuxcelValidator;
}

/**
 * Modal engine.
 * Handles showing, hiding, toggling, and constructing modals.
 * Auto-wires `[data-fx-target="modal"]` triggers on construction.
 */
declare class FuxcelModal extends Fuxcel implements FuxcelModalInstance {
    #private;
    static fxModalCancelButtonClick: Event;
    static fxModalShowEvent: CustomEvent<{
        plugins: string;
        interface: string;
    }>;
    static fxModalHideEvent: CustomEvent<{
        plugins: string;
        interface: string;
    }>;
    constructor(selector: string | IterableElement | any, context?: string | IterableElement | any, autoActions?: boolean);
    /** The most recently opened modal, or `null` if none is open. */
    static get currentModal(): FuxcelModal | null;
    /** `true` if any modals are currently open. */
    static get hasOpenModals(): boolean;
    /** All elements with `[data-fx-target="modal"]`. */
    static get modalTriggers(): Fuxcel;
    /**
     * Builds a modal DOM structure and returns the root element.
     */
    static init({ title, html, isStatic, content, id, hasFooter }: ModalInit): HTMLElement;
    /** Remove the modal element from the DOM entirely. */
    destroy(): void;
    /**
     * Hide (and optionally destroy) the modal.
     *
     * @param destroy {boolean=false} Whether to remove the element from the DOM after hiding.
     */
    hide(destroy?: boolean): void;
    /**
     * Show the modal.
     *
     * @param escKey {boolean=true} Allow closing via the Escape key.
     */
    show(escKey?: boolean | undefined): void;
    /** Toggle between open and closed state. */
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
    constructor(selector: string | IterableElement | any, context?: string | IterableElement | any);
    fadeout(timeout?: number): Promise<Fuxcel>;
    fadeout(display?: string): Promise<Fuxcel>;
    fadeout(timeout: number, display?: string): Promise<Fuxcel>;
    fadeout(timeout: number, iteration: number, display: string): Promise<Fuxcel>;
    fadein(timeout?: number): Promise<Fuxcel>;
    fadein(display?: string): Promise<Fuxcel>;
    fadein(timeout: number, display: string): Promise<Fuxcel>;
    fadein(timeout: number, iteration: number, display: string): Promise<Fuxcel>;
    slideindown(timeout?: number): Promise<Fuxcel>;
    slideindown(display?: string): Promise<Fuxcel>;
    slideindown(timeout: number, display: string): Promise<Fuxcel>;
    slideindown(timeout: number, iteration: number, display: string): Promise<Fuxcel>;
    slideinup(timeout?: number): Promise<Fuxcel>;
    slideinup(display?: string): Promise<Fuxcel>;
    slideinup(timeout: number, display: string): Promise<Fuxcel>;
    slideinup(timeout: number, iteration: number, display: string): Promise<Fuxcel>;
    slideoutdown(timeout?: number): Promise<Fuxcel>;
    slideoutdown(display?: string): Promise<Fuxcel>;
    slideoutdown(timeout: number, display: string): Promise<Fuxcel>;
    slideoutdown(timeout: number, iteration: number, display: string): Promise<Fuxcel>;
    slideoutup(timeout?: number): Promise<Fuxcel>;
    slideoutup(display?: string): Promise<Fuxcel>;
    slideoutup(timeout: number, display: string): Promise<Fuxcel>;
    slideoutup(timeout: number, iteration: number, display: string): Promise<Fuxcel>;
    slideinleft(timeout?: number): Promise<Fuxcel>;
    slideinleft(display?: string): Promise<Fuxcel>;
    slideinleft(timeout: number, display: string): Promise<Fuxcel>;
    slideinleft(timeout: number, iteration: number, display: string): Promise<Fuxcel>;
    slideoutleft(timeout?: number): Promise<Fuxcel>;
    slideoutleft(display?: string): Promise<Fuxcel>;
    slideoutleft(timeout: number, display: string): Promise<Fuxcel>;
    slideoutleft(timeout: number, iteration: number, display: string): Promise<Fuxcel>;
    slideinright(timeout?: number): Promise<Fuxcel>;
    slideinright(display?: string): Promise<Fuxcel>;
    slideinright(timeout: number, display: string): Promise<Fuxcel>;
    slideinright(timeout: number, iteration: number, display: string): Promise<Fuxcel>;
    slideoutright(timeout?: number): Promise<Fuxcel>;
    slideoutright(display?: string): Promise<Fuxcel>;
    slideoutright(timeout: number, display: string): Promise<Fuxcel>;
    slideoutright(timeout: number, iteration: number, display: string): Promise<Fuxcel>;
    blink(timeout?: number): Promise<Fuxcel>;
    blink(display?: string): Promise<Fuxcel>;
    blink(timeout: number, display: string): Promise<Fuxcel>;
    blink(timeout: number, iteration: number, display: string): Promise<Fuxcel>;
    zoomin(timeout?: number): Promise<Fuxcel>;
    zoomin(display?: string): Promise<Fuxcel>;
    zoomin(timeout: number, display: string): Promise<Fuxcel>;
    zoomin(timeout: number, iteration: number, display: string): Promise<Fuxcel>;
    /**
     * @return {DOMTokenList} The class list of an element.
     */
    get classes(): DOMTokenList;
    /**
     *  @return {Promise<boolean>} A promise with a boolean argument; true if the given element has the mouse focus; false otherwise.
     */
    get hasFocus(): Promise<boolean>;
    /**
     * @return {string} The Inner Text value of the given element.
     */
    get innerText(): string;
    /**
     * Set The Inner Text value of the given element.
     *
     * @param text {string} Text to set
     */
    set innerText(text: string);
    /**
     * @return {string} The Outer Text value of the given element.
     */
    get outerText(): string;
    /**
     * Set The Outer Text value of the given element.
     *
     * @param text {string} Text to set
     */
    set outerText(text: string);
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
    /**
     * Injectable fxModal function.
     * Populated by index.ts — avoids circular imports between Fuxcel and modal/fxModal.
     * @internal
     */
    static _fxModal: ((options?: any) => any) | null;
    /** Returns a new `FuxcelValidator` bound to this element. */
    get formValidator(): FuxcelValidator;
    /** Returns a new `FuxcelModal` bound to this element. */
    get modal(): FuxcelModal;
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
     * Perform callback on each selected item
     *
     * @param callback {((element: Fuxcel, index: number) => void)}
     */
    each(callback: ((element: Fuxcel, index: number) => void)): void;
    attrib(name: object): Fuxcel;
    attrib(name: string): string;
    attrib(name: string, value: string | boolean): Fuxcel;
    dataAttrib(name: object): Fuxcel;
    dataAttrib(name: string): string;
    dataAttrib(name: string, value: string | boolean): Fuxcel;
    prop(name: object): Fuxcel;
    prop(name: string): string;
    prop(name: string, value: string | boolean): Fuxcel;
    style(name: object): Fuxcel;
    style(name: string): string;
    style(name: string, value: string | boolean): Fuxcel;
    /**
     * Returns the attributes of the selected element as on Object.
     *
     * @return {Object} An object containing the attributes of the selected element.
     */
    listAttrib(): object;
    /**
     * Returns the properties of the selected element as on Object.
     *
     * @return {Object} An object containing the properties of the selected element.
     */
    listProp(): object;
    /**
     * Remove selected element(s) from DOM.
     *
     * @return void
     */
    remove(): void;
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
     * @param name {...string} Comma separated strings of [data-*] attribute(s) to remove.
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
     * Inserts the given HTML string to the given position of the selected element.
     *
     * _Inserts the HTML string as inner HTML if no position is given._
     *
     * @param value {string} HTML string to insert
     * @param position {('affix'|'prefix'|'postfix'|'suffix'|null)} Position to place given HTML string.
     * @return {Fuxcel} Fuxcel Object of the selected element
     */
    insertHTML(value: string, position?: (Position | null)): Fuxcel;
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
     * _Returns the descendant that matches the selector if the selector parameter is passed._
     *
     * @param selector {Selector} Selectable string.
     * @return {Fuxcel} Fuxcel Object of the selected descendant(s)
     */
    descendants(selector?: Selector): Fuxcel;
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
     * _Returns the previous sibling that matches the selector if the selector parameter is passed._
     *
     * @param selector {Selector} Selectable string.
     * @return {Fuxcel} Fuxcel Object of the selected previous sibling(s)
     */
    prevSiblings(selector?: Selector): Fuxcel;
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
     * @param tagName {string|HTMLElementTagNameMap} HTML tag name to check for.
     * @return {boolean} true if the selected elements' tag name matches the given tag name; false otherwise.
     */
    isElement(tagName: string | HTMLElementTagNameMap): boolean;
    /**
     * Checks to see if the selected element would be selected by the provided selectorString _-- in other words --_ checks if the selected element "is" the selector.
     *
     * @param selector {Selector} Selector to check element against.
     * @return {boolean} true if the selected element would be selected; false otherwise.
     */
    matchSelector(selector: Selector): boolean;
    /**
     * Check if the selected element has a scrollbar in the given direction.
     *
     * @param direction {('vertical'|'horizontal'|null)} Specific direction to check _[horizontal or vertical]_.
     * @return {boolean} true if the selected element has a scrollbar in the specified direction; false otherwise.
     */
    hasScrollBar(direction?: (Direction | null)): boolean;
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
    handleFormSubmit({ uri, method, data, dataType, headers, beforeSend, timeout, handleError, }?: FXFormSubmitType): Promise<any>;
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
     * @param events {string} Event
     * @param listener {((e: EventInterfaces)=>any)}
     * @param option {boolean}
     */
    upon(events: string, listener: ((e: EventInterfaces) => any), option?: boolean): Fuxcel;
    upon(events: string[], listener: ((e: EventInterfaces) => any), option?: boolean): Fuxcel;
    upon(events: EventListenerOrEventListenerObject | object, listener?: boolean): Fuxcel;
    /**
     * Trigger a new event on the selected element(s).
     *
     * @param {string} event
     * @param {"mouse" | "keyboard" | "custom" | null} type
     * @returns {Fuxcel}
     */
    trigger(event: string, type?: ('mouse' | 'keyboard' | 'custom' | null)): Fuxcel;
    value(): string | null;
    value(value: any): Fuxcel;
    testValidateAfter(formGroup: any): void;
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

type IterableElement = any | NodeList | HTMLCollection | HTMLElement[] | HTMLScriptElement[] | HTMLFormElement[] | HTMLInputElement[] | HTMLSelectElement[] | HTMLTextAreaElement[] | Document[];
type SingleElement = HTMLElement | HTMLFormElement | HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | Document | Element;
type Direction = 'horizontal' | 'vertical';
type Position = 'affix' | 'prefix' | 'postfix' | 'suffix';
type Selector = StringOrNull;
type StringOrNull = string | null;
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
        capslock?: string;
        emailFormat?: string | null;
        nameFormat?: string | null;
        phoneFormat?: string | null;
        passwordFormat?: string | null;
        usernameFormat?: string | null;
    };
};
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
    unspaceLetters: FXAnimationOptions;
    zoomIn: FXAnimationOptions;
};
type FXAnimation = (args: FXAnimationType) => FXAnimationReturn;
type ModalInit = {
    title: StringOrNull;
    html: boolean;
    isStatic: boolean;
    content: string;
    id: string;
    hasFooter: boolean;
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
    /** Fired when confirm is clicked. */ onConfirm?: ((e: CustomEvent, modal: FuxcelModalInstance) => void) | null;
    /** Fired when cancel is clicked. */ onCancel?: ((e: CustomEvent, modal: FuxcelModalInstance) => void) | null;
    /** Fired on Escape (no cancel button). */ onEsc?: ((e: CustomEvent, modal: FuxcelModalInstance) => void) | null;
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
     * Perform Fadeout animation on selected element.
     *
     * @param {number} timeout
     * @returns {Promise<FuxcelInstance>}
     */
    fadein(timeout?: number): Promise<FuxcelInstance>;
    /**
     * Perform Fadeout animation on selected element.
     *
     * @param {string} display
     * @returns {Promise<FuxcelInstance>}
     */
    fadein(display?: string): Promise<FuxcelInstance>;
    /**
     * Perform Fadeout animation on selected element.
     *
     * @param {number} timeout
     * @param {string} display
     * @returns {Promise<FuxcelInstance>}
     */
    fadein(timeout: number, display: string): Promise<FuxcelInstance>;
    /**
     * Perform Fadeout animation on selected element.
     *
     * @param {number} timeout Animation duration.
     * @param {number} iteration Animation iteration count
     * @param {string} display Initial CSS display
     * @returns {Promise<FuxcelInstance>}
     */
    fadein(timeout: number, iteration: number, display: string): Promise<FuxcelInstance>;
    /**
     * Perform Fadeout animation on selected element.
     *
     * @param {string | number} timeout
     * @param {string | number} iteration
     * @param {string} display
     * @returns {Promise<FuxcelInstance>}
     */
    fadein(timeout?: number | string, iteration?: number | string, display?: string): Promise<FuxcelInstance>;
    fadeout(timeout?: number): Promise<FuxcelInstance>;
    fadeout(display?: string): Promise<FuxcelInstance>;
    fadeout(timeout: number, display?: string): Promise<FuxcelInstance>;
    fadeout(timeout: number, iteration: number, display: string): Promise<FuxcelInstance>;
    /**
     * Perform Fadeout animation on selected element.
     *
     * @param {number | string} timeout
     * @param {number | string} iteration
     * @param {string} display
     * @returns {Promise<FuxcelInstance>}
     */
    fadeout(timeout?: number | string, iteration?: number | string, display?: string): Promise<FuxcelInstance>;
    slideindown(timeout?: number): Promise<FuxcelInstance>;
    slideindown(display?: string): Promise<FuxcelInstance>;
    slideindown(timeout: number, display: string): Promise<FuxcelInstance>;
    slideindown(timeout: number, iteration: number, display: string): Promise<FuxcelInstance>;
    /**
     *
     * @param {number | string} timeout
     * @param {number | string} iteration
     * @param {string} display
     * @returns {Promise<FuxcelInstance>}
     */
    slideindown(timeout?: number | string, iteration?: number | string, display?: string): Promise<FuxcelInstance>;
    slideinup(timeout?: number): Promise<FuxcelInstance>;
    slideinup(display?: string): Promise<FuxcelInstance>;
    slideinup(timeout: number, display: string): Promise<FuxcelInstance>;
    slideinup(timeout: number, iteration: number, display: string): Promise<FuxcelInstance>;
    /**
     *
     * @param {number | string} timeout
     * @param {number | string} iteration
     * @param {string} display
     * @returns {Promise<FuxcelInstance>}
     */
    slideinup(timeout?: number | string, iteration?: number | string, display?: string): Promise<FuxcelInstance>;
    slideoutdown(timeout?: number): Promise<FuxcelInstance>;
    slideoutdown(display?: string): Promise<FuxcelInstance>;
    slideoutdown(timeout: number, display: string): Promise<FuxcelInstance>;
    slideoutdown(timeout: number, iteration: number, display: string): Promise<FuxcelInstance>;
    /**
     *
     * @param {number | string} timeout
     * @param {number | string} iteration
     * @param {string} display
     * @returns {Promise<FuxcelInstance>}
     */
    slideoutdown(timeout?: number | string, iteration?: number | string, display?: string): Promise<FuxcelInstance>;
    slideoutup(timeout?: number): Promise<FuxcelInstance>;
    slideoutup(display?: string): Promise<FuxcelInstance>;
    slideoutup(timeout: number, display: string): Promise<FuxcelInstance>;
    slideoutup(timeout: number, iteration: number, display: string): Promise<FuxcelInstance>;
    /**
     *
     * @param {number | string} timeout
     * @param {number | string} iteration
     * @param {string} display
     * @returns {Promise<FuxcelInstance>}
     */
    slideoutup(timeout?: number | string, iteration?: number | string, display?: string): Promise<FuxcelInstance>;
    slideinleft(timeout?: number): Promise<FuxcelInstance>;
    slideinleft(display?: string): Promise<FuxcelInstance>;
    slideinleft(timeout: number, display: string): Promise<FuxcelInstance>;
    slideinleft(timeout: number, iteration: number, display: string): Promise<FuxcelInstance>;
    /**
     *
     * @param {number | string} timeout
     * @param {number | string} iteration
     * @param {string} display
     * @returns {Promise<FuxcelInstance>}
     */
    slideinleft(timeout?: number | string, iteration?: number | string, display?: string): Promise<FuxcelInstance>;
    slideoutleft(timeout?: number): Promise<FuxcelInstance>;
    slideoutleft(display?: string): Promise<FuxcelInstance>;
    slideoutleft(timeout: number, display: string): Promise<FuxcelInstance>;
    slideoutleft(timeout: number, iteration: number, display: string): Promise<FuxcelInstance>;
    /**
     *
     * @param {number | string} timeout
     * @param {number | string} iteration
     * @param {string} display
     * @returns {Promise<FuxcelInstance>}
     */
    slideoutleft(timeout?: number | string, iteration?: number | string, display?: string): Promise<FuxcelInstance>;
    slideinright(timeout?: number): Promise<FuxcelInstance>;
    slideinright(display?: string): Promise<FuxcelInstance>;
    slideinright(timeout: number, display: string): Promise<FuxcelInstance>;
    slideinright(timeout: number, iteration: number, display: string): Promise<FuxcelInstance>;
    /**
     *
     * @param {number | string} timeout
     * @param {number | string} iteration
     * @param {string} display
     * @returns {Promise<FuxcelInstance>}
     */
    slideinright(timeout?: number | string, iteration?: number | string, display?: string): Promise<FuxcelInstance>;
    slideoutright(timeout?: number): Promise<FuxcelInstance>;
    slideoutright(display?: string): Promise<FuxcelInstance>;
    slideoutright(timeout: number, display: string): Promise<FuxcelInstance>;
    slideoutright(timeout: number, iteration: number, display: string): Promise<FuxcelInstance>;
    /**
     *
     * @param {number | string} timeout
     * @param {number | string} iteration
     * @param {string} display
     * @returns {Promise<FuxcelInstance>}
     */
    slideoutright(timeout?: number | string, iteration?: number | string, display?: string): Promise<FuxcelInstance>;
    blink(timeout?: number): Promise<FuxcelInstance>;
    blink(display?: string): Promise<FuxcelInstance>;
    blink(timeout: number, display: string): Promise<FuxcelInstance>;
    blink(timeout: number, iteration: number, display: string): Promise<FuxcelInstance>;
    /**
     *
     * @param {number | string} timeout
     * @param {number | string} iteration
     * @param {string} display
     * @returns {Promise<FuxcelInstance>}
     */
    blink(timeout?: number | string, iteration?: number | string, display?: string): Promise<FuxcelInstance>;
    zoomin(timeout?: number): Promise<FuxcelInstance>;
    zoomin(display?: string): Promise<FuxcelInstance>;
    zoomin(timeout: number, display: string): Promise<FuxcelInstance>;
    zoomin(timeout: number, iteration: number, display: string): Promise<FuxcelInstance>;
    /**
     * Perform a Zoom-in animation on selected element.
     *
     * @param timeout {number|string} Animation duration.
     * @param iteration {number|string}
     * @param display {string}
     * @return {Promise<FuxcelInstance>}
     */
    zoomin(timeout?: number | string, iteration?: number | string, display?: string): Promise<FuxcelInstance>;
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
    putClass(...tokenList: string[]): FuxcelInstance;
    /**
     * Removes the given class(es) from the classlist of the given elements.
     *
     * @param tokenList {...string} Comma separated strings of class(es) to remove.
     */
    removeClass(...tokenList: string[]): FuxcelInstance;
    /**
     * Replace an existing class with the given class.
     *
     * _Add the new class old class if not found._
     *
     * @param oldToken {string} Old class token.
     * @param newToken {string} New class token.
     */
    replaceClass(oldToken: string, newToken: string): FuxcelInstance;
    /**
     * Toggle the given classin the classlist of the given element.
     *
     * @param token {string} Class to toggle.
     */
    toggleClass(token: string): FuxcelInstance;
    attrib(name: object): FuxcelInstance;
    attrib(name: string): string;
    attrib(name: string, value: string | boolean): FuxcelInstance;
    /**
     * Get or Set the given attribute(s) for the selected element (If a string is passed to the name param).
     *
     * _Gets the attribute if only the name is given as a string._
     *
     * _Sets the attribute if name and value is given as a string._
     *
     * _Sets the given attributes if name is given as an Object (Key-Value Pair)._
     *
     * @param name {string|Object} Name of the attribute or a Key-Value pair Object.
     * @param value {string|null = null} Value to set for the attribute; Not required if an Object is passed as an argument to the name parameter.
     * @return {FuxcelInstance|string}
     */
    attrib(name: string | object, value?: string | boolean | null): FuxcelInstance | string;
    dataAttrib(name: object): FuxcelInstance;
    dataAttrib(name: string): string;
    dataAttrib(name: string, value: string | boolean): FuxcelInstance;
    /**
     * Get or Set the given [data-*] attribute(s) for the selected element (If a string is passed to the name param).
     *
     * _Gets the [data-*] attribute if only the name is given as a string._
     *
     * _Sets the [data-*] attribute if name and value is given as a string._
     *
     * _Sets the given [data-*] attributes if name is given as an Object (Key-Value Pair)._
     *
     * @param name {string|Object} Name of the [data-*] attribute or a Key-Value pair Object.
     * @param value {string|null = null} Value to set for the [data-*] attribute; Not required if an Object is passed as an argument to the name parameter.
     * @return {FuxcelInstance|string}
     */
    dataAttrib(name: string | object, value?: string | boolean | null): FuxcelInstance | string;
    prop(name: object): FuxcelInstance;
    prop(name: string): string;
    prop(name: string, value: string | boolean): FuxcelInstance;
    /**
     * Get or Set the given property / properties for the selected element (If a string is passed to the name param).
     *
     * _Gets the property if only the name is given as a string._
     *
     * _Sets the property if name and value is given as a string or name is a string and value is a Boolean._
     *
     * _Sets the given property / properties if name is given as an Object (Key-Value Pair)._
     *
     * @param name {string|Object} Name of the property or a Key-Value pair Object.
     * @param value {boolean|string|null = null} Value to set for the property; Not required if an Object is passed as an argument to the name parameter.
     * @return {FuxcelInstance|string}
     */
    prop(name: string | object, value?: string | boolean | null): FuxcelInstance | string;
    style(name: object): FuxcelInstance;
    style(name: string): string;
    style(name: string, value: string | boolean): FuxcelInstance;
    /**
     * Get or set the given CSS style(s) value of the selected element (If a string is passed to the name param).
     *
     * _Gets the given style if only the name is given as a string._
     *
     * _Sets the given style if name and value is given as a string._
     *
     * _Sets the given styles if name is given as a plain Object (Key-Value Pair)._
     *
     * @param name {string|Object} Name of the style or a Key-Value pair Object.
     * @param value {boolean|string|null = null} Value to set for the style; Not required if an Object is passed as an argument to the name parameter.
     * @return {FuxcelInstance|string}
     */
    style(name: string | object, value?: string | boolean | null): FuxcelInstance | string;
    /**
     * Returns the attributes of the selected element as on Object.
     *
     * @return {Object} An object containing the attributes of the selected element.
     */
    listAttrib(): object;
    /**
     * Returns the properties of the selected element as on Object.
     *
     * @return {Object} An object containing the properties of the selected element.
     */
    listProp(): object;
    /**
     * Removes the given attribute(s) from the selected element.
     *
     * @param name {...string} Comma separated strings of attribute(s) to remove.
     * @return {FuxcelInstance} Fuxcel Object of the selected element
     */
    removeAttrib(...name: string[]): FuxcelInstance;
    /**
     * Removes the given [data-*] attribute(s) from the selected element.
     *
     * @param name {...string} Comma separated strings of [data-*] attribute(s) to remove.
     * @return {FuxcelInstance} Fuxcel Object of the selected element
     */
    removeDataAttrib(...name: string[]): FuxcelInstance;
    /**
     * Removes the given property / properties from the selected element.
     *
     * @param name {...string} Comma separated strings of property / properties to remove.
     * @return {FuxcelInstance} Fuxcel Object of the selected element
     */
    removeProp(...name: string[]): FuxcelInstance;
    /**
     * Remove selected element(s) from DOM.
     *
     * @return void
     */
    remove(): void;
    /**
     * Disables or enables the selected element(s).
     *
     * @param disabled {boolean} Switch between disabling and enabling the selected element(s).
     * @return {FuxcelInstance} Fuxcel Object of the selected element.
     */
    disable(disabled?: boolean): FuxcelInstance;
    /**
     * Inserts the given HTML string to the given position of the selected element.
     *
     * _Inserts the HTML string as inner HTML if no position is given._
     *
     * @param value {string} HTML string to insert
     * @param position {('affix'|'prefix'|'postfix'|'suffix'|null)} Position to place given HTML string.
     * @return {FuxcelInstance} Fuxcel Object of the selected element
     */
    insertHTML(value: string, position?: Position | null): FuxcelInstance;
    /**
     * Checks if the selected element matches the given tag name.
     *
     * @param tagName {string|HTMLElementTagNameMap} HTML tag name to check for.
     * @return {boolean} true if the selected elements' tag name matches the given tag name; false otherwise.
     */
    isElement(tagName: string): boolean;
    /**
     * Checks to see if the selected element would be selected by the provided selectorString _-- in other words --_ checks if the selected element "is" the selector.
     *
     * @param selector {Selector} Selector to check element against.
     * @return {boolean} true if the selected element would be selected; false otherwise.
     */
    matchSelector(selector: Selector): boolean;
    /**
     * Check if the selected element has a scrollbar in the given direction.
     *
     * @param direction {('vertical'|'horizontal'|null)} Specific direction to check _[horizontal or vertical]_.
     * @return {boolean} true if the selected element has a scrollbar in the specified direction; false otherwise.
     */
    hasScrollBar(direction?: Direction | null): boolean;
    /**
     * Returns the direct descendants (Children) of the selected element.
     *
     * _Returns the child that matches the selector if the selector parameter is passed._
     *
     * @param selector {Selector} Selectable string.
     * @return {FuxcelInstance} Fuxcel Object of the selected child(ren)
     */
    children(selector?: Selector): FuxcelInstance;
    /**
     * Returns all the descendants of the selected element.
     *
     * _Returns the descendant that matches the selector if the selector parameter is passed._
     *
     * @param selector {Selector} Selectable string.
     * @return {FuxcelInstance} Fuxcel Object of the selected descendant(s)
     */
    descendants(selector?: Selector): FuxcelInstance;
    /**
     * Returns the parents of the selected element.
     *
     * _Returns the parent that matches the selector if the selector parameter is passed._
     *
     * @param selector {Selector} Selectable string.
     * @return {FuxcelInstance} Fuxcel Object of the selected parent(s)
     */
    parents(selector?: Selector): FuxcelInstance;
    /**
     * Returns the previous siblings of the selected element.
     *
     * _Returns the previous sibling that matches the selector if the selector parameter is passed._
     *
     * @param selector {Selector} Selectable string.
     * @return {FuxcelInstance} Fuxcel Object of the selected previous sibling(s)
     */
    prevSiblings(selector?: Selector): FuxcelInstance;
    /**
     * Returns the siblings of the selected element.
     *
     * _Returns the descendant that matches the selector if the selector parameter is passed._
     *
     * @param selector {Selector} Selectable string.
     * @return {FuxcelInstance} Fuxcel Object of the selected sibling(s)
     */
    siblings(selector?: Selector): FuxcelInstance;
    /**
     * Add given Event Listener to the selected element.
     *
     * @param events {string} Event as a string
     * @param listener {((e: EventInterfaces)=>any)} Listener function to handle given event.
     * @param option {boolean} Optional boolean parameter to set CAPTURING_PHASE of the event listener to either true or false.
     */
    upon(events: string, listener: ((e: EventInterfaces) => any), option?: boolean): FuxcelInstance;
    /**
     * @param events {string[]} Event as an array of strings.
     * @param listener {(e: EventInterfaces) => any} Listener function to handle given event(s).
     * @param option {boolean} Optional boolean parameter to set CAPTURING_PHASE of the event listener to either true or false.
     * @return {FuxcelInstance} Fuxcel Object of the selected element
     */
    upon(events: string[], listener: ((e: EventInterfaces) => any), option?: boolean): FuxcelInstance;
    /**
     *
     * @param events {EventListenerOrEventListenerObject | object} Events passed as a Key-Value pair with each event as the key and the listener functions as the values.
     * @param option {boolean} Optional boolean parameter to set CAPTURING_PHASE of the event listener to either true or false.
     * @returns {FuxcelInstance}
     */
    upon(events: EventListenerOrEventListenerObject | object, option?: boolean): FuxcelInstance;
    /**
     * Add Event Listener(s) to the selected element.
     *
     * @param {EventListenerOrEventListenerObject | string[] | object} events
     * @param {((e: EventInterfaces) => any) | boolean} listener
     * @param {boolean} option
     * @returns {FuxcelInstance}
     */
    upon(events: EventListenerOrEventListenerObject | string[] | object, listener?: ((e: EventInterfaces) => any) | boolean, option?: boolean): FuxcelInstance;
    /**
     * _Remove given Event Listener(s) from the selected element._
     * _If no events are given, all attached listeners will be removed from the element_
     *
     * @param events {string}
     * @returns {FuxcelInstance}
     */
    off(...events: string[]): FuxcelInstance;
    /**
     * Trigger a new event on the selected element(s).
     *
     * @param event {string} Event to trigger on selected element(s).
     * @param type {"mouse" | "keyboard" | "custom" | null} Type of Event (Mouse, Keyboard, Custom). _Defaults to Event when nothing is passed._
     * @returns {FuxcelInstance}
     */
    trigger(event: string, type?: 'mouse' | 'keyboard' | 'custom' | null): FuxcelInstance;
    /**
     * Get the value of the selected element.
     *
     * @return {FuxcelInstance|string|null} The value of the selected element.
     */
    value(): string | null;
    /**
     * Set the value of the selected element.
     *
     * @param value {string|null=null} Value to set for the given element.
     * @return {FuxcelInstance} Fuxcel object of the selected element otherwise.
     */
    value(value: any): FuxcelInstance;
    /**
     * Get or set the value of the selected element.
     *
     * @param value {string|null=null} Value to set for the given element (If available).
     * @return {FuxcelInstance|string|null} The value of the selected element if no parameter is passed for value; Fuxcel object of the selected element otherwise.
     */
    value(value?: any): FuxcelInstance | string | null;
    /**
     * A convenient wrapper for the `fx.fetch(options)` function to automatically parse form-data and submit the form using fetch request using the [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API).
     *
     * _Additional form-data can also be passed_
     *
     * @param options {FXFormSubmitType}
     */
    handleFormSubmit(options?: FXFormSubmitType): Promise<any>;
    /**
     * Toggle the disabled state (property) of the selected element [a button preferably].
     *
     * @param isLoading {boolean} Determines the state of the button.
     * @return {Promise<FuxcelInstance>} Promise of Fuxcel Object of the selected element.
     */
    toggleButtonLoadState(isLoading?: boolean): Promise<FuxcelInstance>;
    /**
     * Toggles the submit button state of the selected form.
     *
     * @param isLoading {boolean} Determines the state of the button.
     * @return {Promise<FuxcelInstance>} Promise of Fuxcel Object of the selected element.
     */
    toggleFormSubmitButtonState(isLoading?: boolean): Promise<FuxcelInstance>;
    /** Get the class list of element. **/ readonly classes: DOMTokenList;
    /** A promise with a boolean argument; true if the given element has the mouse focus; false otherwise. **/ readonly hasFocus: Promise<boolean>;
    /** Returns true if the selected element has the disabled property; false otherwise. **/ readonly isDisabled: boolean;
    /** Returns true if the selected element is a form element. **/ readonly isFormElement: boolean;
    /** The Inner HTML value of the given element. **/ readonly innerHTML: string;
    /** The Outer HTML value of the given element. **/ readonly outerHTML: string;
    /** The Inner Text value of the given element. **/ innerText: string;
    /** The Outer Text value of the given element. **/ outerText: string;
    /** A new instance of the Fuxcel Form Validator. **/ readonly formValidator: FuxcelValidatorInstance;
    /** A new instance of the Fuxcel Modal. **/ readonly modal: FuxcelModalInstance;
}
/** Public API of a FuxcelValidator instance. */
interface FuxcelValidatorInstance extends FuxcelInstance {
    /**
     * Initialize validation on selected form(s).
     *
     * _Throws an error if non form elements are selected._
     *
     * @param config {ValidatorConfigObject} user config object.
     * @return {FuxcelStepsInstance | FuxcelValidatorInstance} Fuxcel Validator Object of the forms.
     */
    init(config?: ValidatorConfigObject | null): FuxcelValidatorInstance | FuxcelStepsInstance;
    /** Validate the selected field. **/
    validateField(): FuxcelValidatorInstance;
    /**
     * Validate the selected field.
     *
     * _Displays a success message._
     *
     * @param message {string} Validation message to display.
     * @returns {FuxcelValidatorInstance}
     */
    validateField(message: string): FuxcelValidatorInstance;
    /**
     * Validate the selected field.
     *
     * _Displays an error message if the `message` parameter is null or if `isError` parameter is true._
     *
     * @param message {StringOrNull} Validation message to display.
     * @param isError {boolean=false} If true and the message parameter is null, an automatic error message is generated.
     * @returns {FuxcelValidatorInstance}
     */
    validateField(message: StringOrNull, isError: boolean): FuxcelValidatorInstance;
    /**
     * Validate the selected field.
     *
     * @param message {string|null=null} Validation message to display.
     * @param isError {boolean=false} If true and the message parameter is null, an automatic error message is generated.
     * @return {FuxcelValidator} Fuxcel Validator Object of the selected element.
     */
    validateField(message?: StringOrNull, isError?: boolean): FuxcelValidatorInstance;
    validateEmail(regExp: RegExp, customFormatEx?: StringOrNull): FuxcelValidatorInstance;
    /**
     * Validate Password field using Regular Expression
     *
     * @param regExp {RegExp} Regular expression to use
     * @return {FuxcelValidator} Fuxcel Validator Object of the selected element.
     */
    validatePassword(regExp: RegExp): FuxcelValidatorInstance;
    /**
     * Validate Password field using Regular Expression
     *
     * @param regExp {RegExp} Regular expression to use
     * @param customFormatEx {string} Custom format example to show user.
     * @return {FuxcelValidator} Fuxcel Validator Object of the selected element.
     */
    validatePassword(regExp: RegExp, customFormatEx: string): FuxcelValidatorInstance;
    /**
     * Validate Password field using Regular Expression
     *
     * @param regExp {RegExp} Regular expression to use
     * @param customFormatEx {string|null=null} Custom format example to show user.
     * @return {FuxcelValidator} Fuxcel Validator Object of the selected element.
     */
    validatePassword(regExp: RegExp, customFormatEx?: StringOrNull): FuxcelValidatorInstance;
    /**
     * Validate Name field using Regular Expression
     *
     * @param regExp {RegExp} Regular expression to use.
     * @return {FuxcelValidator} Fuxcel Validator Object of the selected element.
     */
    validateName(regExp: RegExp): FuxcelValidatorInstance;
    /**
     * Validate Name field using Regular Expression
     *
     * @param regExp {RegExp} Regular expression to use.
     * @param customFormatEx {string} Custom format example to show user.
     * @return {FuxcelValidator} Fuxcel Validator Object of the selected element.
     */
    validateName(regExp: RegExp, customFormatEx: string): FuxcelValidatorInstance;
    /**
     * Validate Name field using Regular Expression
     *
     * @param regExp {RegExp} Regular expression to use.
     * @param customFormatEx {string|null=null} Custom format example to show user.
     * @return {FuxcelValidator} Fuxcel Validator Object of the selected element.
     */
    validateName(regExp: RegExp, customFormatEx?: StringOrNull): FuxcelValidatorInstance;
    /**
     * Validate Phone field using Regular Expression
     *
     * @param regExp {RegExp} Regular expression to use
     * @return {FuxcelValidator} Fuxcel Validator Object of the selected element.
     */
    validatePhone(regExp: RegExp): FuxcelValidatorInstance;
    /**
     * Validate Phone field using Regular Expression
     *
     * @param regExp {RegExp} Regular expression to use
     * @param customFormatEx {string} Custom format example to show user.
     * @return {FuxcelValidator} Fuxcel Validator Object of the selected element.
     */
    validatePhone(regExp: RegExp, customFormatEx: string): FuxcelValidatorInstance;
    /**
     * Validate Phone field using Regular Expression
     *
     * @param regExp {RegExp} Regular expression to use
     * @param customFormatEx {string|null=null} Custom format example to show user.
     * @return {FuxcelValidator} Fuxcel Validator Object of the selected element.
     */
    validatePhone(regExp: RegExp, customFormatEx?: StringOrNull): FuxcelValidatorInstance;
    /**
     * Validate Username field using Regular Expression
     *
     * @param regExp {RegExp} Regular expression to use
     * @return {FuxcelValidator} Fuxcel Validator Object of the selected element.
     */
    validateUsername(regExp: RegExp): FuxcelValidatorInstance;
    /**
     * Validate Username field using Regular Expression
     *
     * @param regExp {RegExp} Regular expression to use
     * @param customFormatEx {string} Custom format example to show user.
     * @return {FuxcelValidator} Fuxcel Validator Object of the selected element.
     */
    validateUsername(regExp: RegExp, customFormatEx: string): FuxcelValidatorInstance;
    /**
     * Validate Username field using Regular Expression
     *
     * @param regExp {RegExp} Regular expression to use
     * @param customFormatEx {string|null=null} Custom format example to show user.
     * @return {FuxcelValidator} Fuxcel Validator Object of the selected element.
     */
    validateUsername(regExp: RegExp, customFormatEx?: StringOrNull): FuxcelValidatorInstance;
    /**
     * Validate Card CVV field using Regular Expression
     *
     * @param regExp {RegExp} Regular expression to use.
     * @return {FuxcelValidator} Fuxcel Validator Object of the selected element.
     */
    validateCardCVV(regExp: RegExp): FuxcelValidatorInstance;
    /**
     * Validate Card CVV field using Regular Expression
     *
     * @param regExp {RegExp} Regular expression to use.
     * @param customFormatEx {string} Custom format example to show user.
     * @return {FuxcelValidator} Fuxcel Validator Object of the selected element.
     */
    validateCardCVV(regExp: RegExp, customFormatEx: string): FuxcelValidatorInstance;
    /**
     * Validate Card CVV field using Regular Expression
     *
     * @param regExp {RegExp} Regular expression to use.
     * @param customFormatEx {string|null=null} Custom format example to show user.
     * @return {FuxcelValidator} Fuxcel Validator Object of the selected element.
     */
    validateCardCVV(regExp: RegExp, customFormatEx?: StringOrNull): FuxcelValidatorInstance;
    /**
     * Validate Card Number field using Regular Expression
     *
     * @param regExp {RegExp} Regular expression to use.
     * @return {FuxcelValidator} Fuxcel Validator Object of the selected element.
     */
    validateCardNumber(regExp: RegExp): FuxcelValidatorInstance;
    /**
     * Validate Card Number field using Regular Expression
     *
     * @param regExp {RegExp} Regular expression to use.
     * @param customFormatEx {string} Custom format example to show user
     * @return {FuxcelValidator} Fuxcel Validator Object of the selected element.
     */
    validateCardNumber(regExp: RegExp, customFormatEx: string): FuxcelValidatorInstance;
    /**
     * Validate Card Number field using Regular Expression
     *
     * @param regExp {RegExp} Regular expression to use.
     * @param customFormatEx {string|null=null} Custom format example to show user
     * @return {FuxcelValidator} Fuxcel Validator Object of the selected element.
     */
    validateCardNumber(regExp: RegExp, customFormatEx?: StringOrNull): FuxcelValidatorInstance;
    /**
     * Validate field using a callback function.
     *
     * @param regExpOrFn {Function} Function to use.
     * @return {FuxcelValidator} Fuxcel Validator Object of the selected element.
     */
    validateRegex(regExpOrFn: Function): FuxcelValidatorInstance;
    /**
     * Validate field using Regular Expression.
     *
     * @param regExpOrFn {RegExp} Regular Expression to use.
     * @param message {string} Validation message.
     * @return {FuxcelValidator} Fuxcel Validator Object of the selected element.
     */
    validateRegex(regExpOrFn: RegExp, message: string): FuxcelValidatorInstance;
    /**
     * Validate field using Regular Expression or a callback function.
     *
     * @param regExpOrFn {Function|RegExp} Regular Expression or callback function to use.
     * @param message {string|null=null} Validation message.
     * @return {FuxcelValidator} Fuxcel Validator Object of the selected element.
     */
    validateRegex(regExpOrFn: RegExp | Function, message?: StringOrNull): FuxcelValidatorInstance;
    /**
     * Show validation error for the selected field.
     *
     * @return {void}
     */
    showError(): void;
    /**
     * Show validation error for the selected field.
     *
     * @param message {string} Validation message.
     * @return {void}
     */
    showError(message: string): void;
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
     * @param message {string} Validation message.
     * @return {void}
     */
    showSuccess(message: string): void;
    /**
     * Show validation success.
     *
     * @param message {string|null=null} Validation message.
     * @return {void}
     */
    showSuccess(message?: StringOrNull): void;
    /**
     * Toggle between validating and removing validation from the selected field.
     *
     * @return {FuxcelValidator} Fuxcel Validator Object of the forms.
     */
    toggleValidation(): FuxcelValidatorInstance;
    /**
     * Remove validation from the selected field element. Also remove the error from the error bag if destroyValidation parameter is set tot true.
     *
     * @param destroyValidation {boolean = false}
     * @return {FuxcelValidator} Fuxcel Validator Object of the forms.
     */
    undoValidation(destroyValidation?: boolean): FuxcelValidatorInstance;
    /** Reset validation message. **/
    renderMessage(): FuxcelValidatorInstance;
    /**
     * Render validation message.
     *
     * @param message {string} message to display.
     * @return {FuxcelValidator} Fuxcel Validator Object of the current selected element.
     */
    renderMessage(message: string): FuxcelValidatorInstance;
    /**
     * Render validation message.
     *
     * @param message {string} message to display.
     * @param renderType {'error'|'success'} validation type.
     * @return {FuxcelValidator} Fuxcel Validator Object of the current selected element.
     */
    renderMessage(message: string, renderType: 'error' | 'success'): FuxcelValidatorInstance;
    /**
     * Render validation message.
     *
     * @param message {string|null=null} message to display [optional]
     * @param renderType {('error'|'success'|null)} validation type
     * @return {FuxcelValidator} Fuxcel Validator Object of the current selected element.
     */
    renderMessage(message?: StringOrNull, renderType?: 'error' | 'success' | null): FuxcelValidatorInstance;
    renderValidationErrors(errors: {
        [key: string]: any;
    }): FuxcelValidatorInstance;
    /**
     * Display all validation errors for the selected form.
     *
     * @param errors {null}
     * @param messageOrFn {((fx: FuxcelValidatorInstance, e?: CustomEvent) => any)}
     */
    renderValidationErrors(errors: null, messageOrFn: ((fx: FuxcelValidatorInstance, e?: CustomEvent) => any)): FuxcelValidatorInstance;
    /**
     * Display all validation errors for the selected form.
     *
     * @param errors {null}
     * @param messageOrFn {string}
     */
    renderValidationErrors(errors: null, messageOrFn: string): FuxcelValidatorInstance;
    /**
     * Display all validation errors for the selected form.
     *
     * @param errors {{ [key: string]: any }} An object containing the errors. The keys are the form field ids and their values are the errors for the fields respectively.
     * @param messageOrFn {((fx: FuxcelValidatorInstance, e?: CustomEvent) => any)}
     */
    renderValidationErrors(errors: {
        [key: string]: any;
    }, messageOrFn: ((fx: FuxcelValidatorInstance, e?: CustomEvent) => any)): FuxcelValidatorInstance;
    /**
     * Display all validation errors for the selected form.
     *
     * @param errors {{ [key: string]: any }} An object containing the errors. The keys are the form field ids and their values are the errors for the fields respectively.
     * @param messageOrFn {string}
     */
    renderValidationErrors(errors: {
        [key: string]: any;
    }, messageOrFn: string): FuxcelValidatorInstance;
    /**
     * Display all validation errors for the selected form.
     *
     * @param errors {{ [key: string]: any }} An object containing the errors. The keys are the form field ids and their values are the errors for the fields respectively.
     * @param messageOrFn {((fx: FuxcelValidator, e?: CustomEvent) => any)}
     * @param callbackFn {((fx: FuxcelValidator, e?: CustomEvent) => any)}
     */
    renderValidationErrors(errors: {
        [key: string]: any;
    }, messageOrFn: ((fx: FuxcelValidatorInstance, e?: CustomEvent) => any), callbackFn: ((fx: FuxcelValidatorInstance, e?: CustomEvent) => any)): FuxcelValidatorInstance;
    /**
     * Display all validation errors for the selected form.
     *
     * @param errors {{ [key: string]: any }} An object containing the errors. The keys are the form field ids and their values are the errors for the fields respectively.
     * @param messageOrFn {string}
     * @param callbackFn {((fx: FuxcelValidator, e?: CustomEvent) => any)}
     */
    renderValidationErrors(errors: {
        [key: string]: any;
    }, messageOrFn: string, callbackFn: ((fx: FuxcelValidatorInstance, e?: CustomEvent) => any)): FuxcelValidatorInstance;
    /**
     * Display all validation errors for the selected form.
     *
     * @param errors {{ [key: string]: any } | null = null} An object containing the errors. The keys are the form field ids and their values are the errors for the fields respectively.
     * @param messageOrFn {((fx: FuxcelValidator, e?: CustomEvent) => any)|StringOrNull}
     * @param callbackFn {((fx: FuxcelValidator, e?: CustomEvent) => any)}
     */
    renderValidationErrors(errors?: {
        [key: string]: any;
    } | null, messageOrFn?: ((fx: FuxcelValidatorInstance, e?: CustomEvent) => any) | StringOrNull, callbackFn?: ((fx: FuxcelValidatorInstance, e?: CustomEvent) => any) | null): FuxcelValidatorInstance;
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
    /**
     * Open selected modal.
     *
     * @param escKey {boolean=true} Allow closing the modal using the Escape on the KeyBoard if set to true. True by default.
     */
    show(escKey?: boolean): void;
    /**
     * Close selected modal.
     *
     * @param destroy {boolean}
     */
    hide(destroy?: boolean): void;
    /**
     * Toggle between close and open of the selected modal.
     */
    toggle(): void;
    /**
     * Destroy selected modal.
     */
    destroy(): void;
}
interface FuxcelConstructor {
    new (selector: string | IterableElement | SingleElement, context?: string | IterableElement | SingleElement): FuxcelInstance;
    (selector: string | IterableElement | SingleElement, context?: string | IterableElement | SingleElement): FuxcelInstance;
    buttonLoaderClass: string;
    path: string | null;
    readonly isMobileDevice: boolean;
    readonly pointerIsTouch: boolean;
}
interface FuxcelValidatorConstructor {
    new (selector: string | IterableElement | SingleElement, context?: string | IterableElement | SingleElement): FuxcelValidatorInstance;
    readonly defaultValidatorConfig: ValidatorConfigObject;
    readonly passwordCapslockAlertClass: string;
    readonly passwordTogglerIconClass: string;
    stepsClass: string;
}
interface FuxcelStepsConstructor {
    new (selected: FuxcelValidatorInstance): FuxcelStepsInstance;
    currentlySelected: object;
}
interface FuxcelModalConstructor {
    new (selector: string | IterableElement | SingleElement, context?: string | IterableElement | SingleElement, autoActions?: boolean): FuxcelModalInstance;
    readonly currentModal: FuxcelModalInstance | null;
    readonly hasOpenModals: boolean;
    readonly modalTriggers: FuxcelInstance;
    init(options: ModalInit): HTMLElement;
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
    /**
     * Create a quick alert / confirm modal.
     *
     * @example
     * fx.modal({ type: 'success', content: 'Saved!' });
     * fx.modal({ type: 'error', content: 'Failed.', confirmButtonText: 'Retry', onConfirm: (e, modal) => {} });
     */
    modal: (options?: FXModalType) => FuxcelModalInstance;
    /**
     * Register a callback on DOMContentLoaded.
     *
     * @example
     * fx.onDocumentLoad(() => console.log('DOM ready'));
     */
    onDocumentLoad: (listener: (e: Event) => void) => void;
    /**
     * Validate a card number against the Luhn algorithm.
     *
     * @example
     * fx.passLuhnAlgo('4532015112830366'); // true
     */
    passLuhnAlgo: (input: string | number) => boolean;
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
    /**
     * Create a quick alert / confirm modal.
     *
     * @example
     * fxModal({ type: 'success', content: 'Saved!' });
     */
    function fxModal(options?: FXModalType): FuxcelModalInstance;
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
        fxModal: (options?: FXModalType) => FuxcelModalInstance;
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

export type { Direction, EventInterfaces, FXAnimation, FXAnimationOptions, FXAnimationReturn, FXAnimationType, FXFormSubmitType, FXInterface, FXModalType, FXRequestType, FieldAttributes, FuxcelConstructor, FuxcelInstance, FuxcelModalConstructor, FuxcelModalInstance, FuxcelStepsConstructor, FuxcelStepsInstance, FuxcelValidatorConstructor, FuxcelValidatorInstance, HTMLElementWithListenerArray, HTMLListenerArray, HTTPRequestMethod, IterableElement, ModalInit, Position, ResponseData, Selector, SingleElement, StringOrNull, ValidationProps, ValidatorConfigObject };
