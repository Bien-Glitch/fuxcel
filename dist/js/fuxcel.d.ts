declare type IterableElement = HTMLCollection | HTMLElement[] | HTMLScriptElement[] | HTMLFormElement[] | HTMLInputElement[] | HTMLSelectElement[] | HTMLTextAreaElement[] | Document[] | [];
declare type SingleElement = HTMLElement | HTMLFormElement | HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | Document;
declare type Direction = 'horizontal' | 'vertical';
declare type Position = 'affix' | 'prefix' | 'postfix' | 'suffix';
declare type FieldAttributes = {
    id: string | any;
    type: StringOrNull | undefined;
    fxId: StringOrNull | undefined;
    fxRole: StringOrNull | undefined;
    formId: StringOrNull;
};
declare type FuxcelOrString<T extends string | object, U extends boolean | string | null = null> = T extends object ? Fuxcel : (T extends string ? (U extends string ? Fuxcel : (U extends boolean ? Fuxcel : string)) : string);
declare type AnimationComplete = <T extends string, U extends number | null = 300, V extends number | null = 1>(display: T, timeout: U, iterations: V) => Promise<Fuxcel>;
declare type AnimationPartial = <T extends number | null = 300, U extends number | null = 1>(display: string, timeout: T, iterations: U) => Promise<Fuxcel>;
declare type FuxcelAnimation = AnimationPartial | AnimationComplete;
declare type HTMLListenerArray = Array<{
    element: HTMLElement;
    listener: EventListenerOrEventListenerObject | boolean | undefined;
    event: keyof HTMLElementEventMap | string;
    option: boolean;
}>;
declare type ModalInit = {
    title: StringOrNull;
    html: boolean;
    content: string;
    id: string;
    hasFooter: boolean;
};
declare type FXAnimationOptions = {
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
declare type FXAnimationType = {
    timeout?: number | string;
    iterations?: number;
    display?: string;
};
declare type FXAnimation = (args: FXAnimationType) => {
    blink: FXAnimationOptions;
    fadeIn: FXAnimationOptions;
    fadeOut: FXAnimationOptions;
    slideInDown: FXAnimationOptions;
    slideOutDown: FXAnimationOptions;
    slideOutUp: FXAnimationOptions;
    slideInLeft: FXAnimationOptions;
    slideInRight: FXAnimationOptions;
    slideOutLeft: FXAnimationOptions;
    slideOutRight: FXAnimationOptions;
    zoomIn: FXAnimationOptions;
};
declare type FXModalType = {
    /*** _Modal Title._ ***/ title?: StringOrNull;
    /*** _Modal type._ ***/ type?: ('success' | 'warning' | 'error');
    /*** _Body Content of Modal._ ***/ content?: StringOrNull;
    /*** _Text for Confirm Button._ ***/ confirmButtonText?: StringOrNull;
    /*** _Text for Cancel Button._ ***/ cancelButtonText?: StringOrNull;
    /*** _Use HTML content? else use Text content._ ***/ html?: boolean;
    /*** _Callback on confirm button click._ ***/ onConfirm?: ((e: CustomEvent, modal: FuxcelModal) => void) | null;
    /*** _Callback on cancel button click._ ***/ onCancel?: ((e: CustomEvent, modal: FuxcelModal) => void) | null;
    /*** _Callback on Escape key used. Only works when cancel button is not available. [i.e. cancelButtonText is null]._ ***/ onEsc?: ((e: CustomEvent, modal: FuxcelModal) => void) | null;
};
declare type FXRequestType = {
    /*** _Request URL._ ***/ uri?: string;
    /*** _Request method._ ***/ method?: ('get' | 'post' | 'put' | 'patch' | 'delete');
    /*** _Additional request data._ ***/ data?: BodyInit | object | null;
    /*** _Expected return data type._ ***/ dataType?: ('html' | 'json' | 'jsonp' | 'script' | 'text' | 'xml');
    /*** _Additional Headers to be sent along the request._ ***/ headers?: Object | Headers | null;
    /*** _Before request is sent._ ***/ beforeSend?: Function | null;
    /*** _Once request is completed._ ***/ onComplete?: ((response: ResponseData, status: number, statusText: string) => void) | null;
    /*** _If request has errors._ ***/ onError?: ((error: any, status: number, statusText: string) => void) | null;
    /*** _If request is successful._ ***/ onSuccess?: ((response: ResponseData, status: number, statusText: string) => void) | null;
};
declare type FXFormSubmitType = {
    /*** _Submission URL._ ***/ uri?: StringOrNull;
    /*** _Submission method._ ***/ method?: ('get' | 'post' | 'put' | 'patch' | 'delete');
    /*** _Additional submission data._ ***/ data?: object | null;
    /*** _Expected return data type_ ***/ dataType?: ('html' | 'json' | 'jsonp' | 'script' | 'text' | 'xml');
    /*** _Additional Headers to be sent along the request._ ***/ headers?: Object | Headers | null;
    /*** _Before request is sent._ ***/ beforeSend?: Function | null;
    /*** _Before request is sent._ ***/ handleError?: boolean;
};
declare type Selector = StringOrNull;
/**
 * {string|null = null}
 */
declare type StringOrNull = string | null;
declare type ValidationProps = {
    /*** _id attribute of selected form field._ ***/ id: string;
    /*** _selector of the form group element for selected form field._ ***/ formGroup: string;
    /*** _selector of the validation field for selected form field._ ***/ validationField: string;
    /*** _selector of the validation valid icon for the selected form field._ ***/ validIcon: string;
    /*** _selector of the validation invalid icon for the selected form field._ ***/ invalidIcon: string;
    /*** _selector of the validation icons field for the selected form field._ ***/ validationIconField: string;
};
declare type ValidatorConfigObject = {
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
        passwordConfirmId?: ('password_confirmation' | string);
        passwordId?: ('password' | string);
        initWrapper?: ('.form-group' | string);
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
interface String {
    /**
     * Convert string to title cased string.
     *
     * @param seperator {boolean}
     * @returns {String} Title cased string.
     */
    toTitleCase(seperator: boolean): string;
}
interface HTMLElement extends HTMLCollection {
}
interface HTMLElementWithListenerArray extends HTMLElement {
    listeners?: HTMLListenerArray;
}
declare interface FuxcelBaseInterface {
    get fieldAttributes(): FieldAttributes;
    get prevObj(): {
        length: number;
    };
    get toArray(): IterableElement;
}
declare interface FuxcelInterface {
    get classes(): DOMTokenList;
    get hasFocus(): Promise<any>;
    putClass(...tokenList: string[]): Fuxcel;
    replaceClass(oldToken: string, newToken: string): Fuxcel;
    removeClass(...tokenList: string[]): Fuxcel;
    attrib(name: string | object, value?: boolean | string | null): Fuxcel | string;
    dataAttrib(name: string | object, value?: boolean | string | null): Fuxcel | string;
    prop(name: string | object, value?: boolean | string | null): Fuxcel | string;
    style(name: string | object, value?: boolean | string | null): Fuxcel | string;
    listAttrib(): object;
    listProp(): object;
    removeAttrib(...name: string[]): Fuxcel;
    removeDataAttrib(...name: string[]): Fuxcel;
    removeProp(...name: string[]): Fuxcel;
    children(selector: Selector): Fuxcel;
    descendants(selector: Selector): Fuxcel;
    parents(selector: Selector): Fuxcel;
    prevSiblings(selector: Selector): Fuxcel;
    siblings(selector: Selector): Fuxcel;
    disable(disabled: boolean): Fuxcel;
    handleFormSubmit({ uri, method, data, dataType, beforeSend }: FXFormSubmitType): void;
    hasScrollBar(direction: ('horizontal' | 'vertical' | null)): boolean;
    insertHTML(value: string, position: ('affix' | 'prefix' | 'postfix' | 'suffix' | null)): Fuxcel;
    isElement(tagName: string | HTMLElementTagNameMap): boolean;
    matchSelector(selector: Selector): boolean;
    off(...events: string[]): Fuxcel;
    toggleButtonLoadState(isLoading: boolean): void;
    toggleFormSubmitButtonState(isLoading: boolean): void;
    trigger(event: string, type: ('mouse' | 'keyboard' | null)): Fuxcel;
    upon(events: string | string[] | object, listener?: ((e: CustomEvent | Event) => any) | boolean, option?: boolean): Fuxcel;
    value(value: StringOrNull): Fuxcel | string | null;
}
declare interface FuxcelValidatorInterface {
    get canBeValidated(): boolean;
    get errorBag(): object;
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
    init(config: ValidatorConfigObject | null): FuxcelValidator;
    renderMessage(message: StringOrNull, renderType: StringOrNull): FuxcelValidator;
    renderValidationErrors(errors: object, messageOrCallbackFn: ((fx: FuxcelValidator, e?: CustomEvent) => any) | StringOrNull, callbackFn: ((fx: FuxcelValidator, e?: CustomEvent) => any) | null): void;
    showError(message: StringOrNull): void;
    showSuccess(message: StringOrNull): void;
    toggleValidation(): FuxcelValidator;
    undoValidation(destroyValidation: boolean): FuxcelValidator;
    stepErrorBag(step: number | string): object;
    stepErrorCount(step: number | string): number;
    validateCardCVV(regExp: RegExp, customFormatEx: StringOrNull): FuxcelValidator;
    validateCardNumber(regExp: RegExp, customFormatEx: StringOrNull): FuxcelValidator;
    validateEmail(regExp: RegExp, customFormatEx: StringOrNull): FuxcelValidator;
    validateField(message: StringOrNull, isError: boolean): FuxcelValidator;
    validateName(regExp: RegExp, customFormatEx: StringOrNull): FuxcelValidator;
    validatePassword(regExp: RegExp, customFormatEx: StringOrNull): FuxcelValidator;
    validatePhone(regExp: RegExp, customFormatEx: StringOrNull): FuxcelValidator;
    validateRegex(regExpOrFn: Function | RegExp, message?: StringOrNull): FuxcelValidator;
    validateUsername(regExp: RegExp, customFormatEx: StringOrNull): FuxcelValidator;
}
declare interface FuxcelStepsInterface {
    get context(): FuxcelSteps;
    get formSteps(): object | (number | string)[];
    stepErrors(step: number | string | null): object | void;
}
declare interface FuxcelModalInterface {
    hide(destroy: boolean): void;
    show(escKey?: boolean): void;
    toggle(): void;
}
declare interface FXInterface {
    (selector: string | Iterable<any> | any, context?: string | Iterable<any> | any): Fuxcel;
    fetch: ({ uri, method, data, dataType, beforeSend, onComplete, onError, onSuccess }: FXRequestType) => void;
    modal: ({ title, type, content, confirmButtonText, cancelButtonText, html, onConfirm, onCancel }: FXModalType) => void;
    onDocumentLoad: ((listener: (e: Event) => void) => void);
    passLuhnAlgo: (input: any | string | number) => boolean;
}
declare interface ResponseData extends Response {
    ok: boolean;
    status: number;
    statusText: string;
    responseText?: string;
    responseJSON?: object;
}
declare interface TypeOfInterface {
    (value: any): boolean;
}
/**
 *
 * @param timeout {number|string}
 * @param iteration {number}
 * @param display {string}
 * @returns {FXAnimationType}
 */
declare const animations: FXAnimation;
declare const pushPropToWindow: (prop: string, value: any) => void;
/**
 * Creates new Fuxcel Object with selected element.
 *
 * @param selector {string|Iterable<any>|any} Selectable string or iterable.
 * @param context {string|Iterable<any>|any} Context to select from.
 * @return {Fuxcel} New Fuxcel Object.
 */
declare const fx: FXInterface;
/**
 * Checks if the given value is of type boolean.
 *
 * @param value {any} Value to check.
 * @return {boolean} true if the given value is of type boolean; false otherwise.
 */
declare const isBool: TypeOfInterface;
/**
 * Checks if the given value is defined (not null && not undefined && not an empty string).
 *
 * @param value {any} Value to check.
 * @return {boolean} true if the given value is set; false otherwise.
 */
declare const isDefined: TypeOfInterface;
/**
 * Checks if the given value is of type function.
 *
 * @param value {any} Value to check.
 * @return {boolean} true if the given value is of type function; false otherwise.
 */
declare const isFunction: TypeOfInterface;
/**
 * Checks if the given value is of type object.
 *
 * @param value {any} Value to check.
 * @return {boolean} true if the given value is of type boolean; false otherwise.
 */
declare const isObject: TypeOfInterface;
/**
 * Checks if the given value is of type string.
 *
 * @param value {any} Value to check.
 * @return {boolean} true if the given value is of type string; false otherwise.
 */
declare const isString: TypeOfInterface;
/**
 * Parse the given value and get its boolean value.
 *
 * @param value {any} Value to parse.
 * @return {boolean} Its boolean value; true or false.
 */
declare const parseBool: TypeOfInterface;
declare class FuxcelBase implements FuxcelBaseInterface {
    #private;
    length: number;
    protected prev: {
        length: number;
    };
    /**
     * Initialize the plugin
     *
     * @param selector {string|Iterable<any>|any} Selectable string or iterable.
     * @param context {string|Iterable<any>|any} Context to select from.
     */
    constructor(selector: string | Iterable<any> | any, context?: string | Iterable<any> | any);
    /**
     * Returns an Object containing {FieldAttributes} attributes of the element.
     * @return {FieldAttributes}
     */
    get fieldAttributes(): FieldAttributes;
    /**
     *
     */
    get prevObj(): {
        length: number;
    };
    static get guessPath(): string | null;
    /**
     * @return {Array}
     */
    get toArray(): IterableElement;
    /**
     * Returns true if the device is mobile device; false otherwise.
     */
    static get isMobileDevice(): boolean;
    /**
     * Returns true if the device supports touch; false otherwise.
     */
    static get pointerIsTouch(): boolean;
}
declare class Fuxcel extends FuxcelBase implements FuxcelInterface {
    #private;
    constructor(selector: string | Iterable<any> | any, context?: string | Iterable<any> | any);
    /**
     * Perform Fadeout animation on selected element.
     *
     * @param timeout {number} Animation duration.
     * @param iteration
     * @param display
     * @return {Promise<Fuxcel>}
     */
    fadeout(timeout?: number | string, iteration?: number | string, display?: string): Promise<Fuxcel>;
    /**
     * Perform Fadein animation on selected element.
     *
     * @param timeout {number} Animation duration.
     * @param iteration {number}
     * @param display
     * @return {Promise<Fuxcel>}
     */
    fadein(timeout?: number | string, iteration?: number | string, display?: string): Promise<Fuxcel>;
    /**
     * Perform a Slidein-down animation on selected element.
     *
     * @param timeout {number} Animation duration.
     * @param iteration
     * @param display
     * @return {Promise<Fuxcel>}
     */
    slideindown(timeout?: number | string, iteration?: number | string, display?: string): Promise<Fuxcel>;
    /**
     * Perform a Slideout-down animation on selected element.
     *
     * @param timeout {number} Animation duration.
     * @param iteration
     * @param display
     * @return {Promise<Fuxcel>}
     */
    slideoutdown(timeout?: number | string, iteration?: number | string, display?: string): Promise<Fuxcel>;
    /**
     * Perform a Slideout-up animation on selected element.
     *
     * @param timeout {number} Animation duration.
     * @param iteration
     * @param display
     * @return {Promise<Fuxcel>}
     */
    slideoutup(timeout?: number | string, iteration?: number | string, display?: string): Promise<Fuxcel>;
    /**
     * Perform a Slidein-left animation on selected element.
     *
     * @param timeout {number} Animation duration.
     * @param iteration
     * @param display
     * @return {Promise<Fuxcel>}
     */
    slideinleft(timeout?: number | string, iteration?: number | string, display?: string): Promise<Fuxcel>;
    /**
     * Perform a Slideout-left animation on selected element.
     *
     * @param timeout {number} Animation duration.
     * @param iteration
     * @param display
     * @return {Promise<Fuxcel>}
     */
    slideoutleft(timeout?: number | string, iteration?: number | string, display?: string): Promise<Fuxcel>;
    /**
     * Perform a Slidein-right animation on selected element.
     *
     * @param timeout {number} Animation duration.
     * @param iteration
     * @param display
     * @return {Promise<Fuxcel>}
     */
    slideinright(timeout?: number | string, iteration?: number | string, display?: string): Promise<Fuxcel>;
    /**
     * Perform a Slideout-right animation on selected element.
     *
     * @param timeout {number} Animation duration.
     * @param iteration
     * @param display
     * @return {Promise<Fuxcel>}
     */
    slideoutright(timeout?: number | string, iteration?: number | string, display?: string): Promise<Fuxcel>;
    /**
     * Perform a blink animation on selected element.
     *
     * @param timeout {number} Animation duration.
     * @param iteration
     * @param display
     * @return {Promise<Fuxcel>}
     */
    blink(timeout?: number | string, iteration?: number | string, display?: string): Promise<Fuxcel>;
    /**
     * Perform a Zoom-in animation on selected element.
     *
     * @param timeout {number} Animation duration.
     * @param iteration
     * @param display
     * @return {Promise<Fuxcel>}
     */
    zoomin(timeout?: number | string, iteration?: number | string, display?: string): Promise<Fuxcel>;
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
     * @return {FuxcelValidator} A new instance of the Fuxcel Form Validator.
     */
    get formValidator(): FuxcelValidator;
    /**
     * @return {FuxcelModal} A new instance of the Fuxcel Modal.
     */
    get modal(): FuxcelModal;
    /**
     * Set the Inner Text value for the element
     *
     * @param text {string} The Inner Text value.
     */
    set innerText(text: string);
    /**
     * Set the Outer Text value for the element
     *
     * @param text {string} The Outer Text value.
     */
    set outerText(text: string);
    /**
     * @return The global Button Loader class.
     */
    static get buttonLoaderClass(): string;
    /**
     * @return {string|null} The Plugin path.
     */
    static get path(): string | null;
    /**
     * Set the Button Loader class globally.
     *
     * @param token {string} Class selector of button loader.
     */
    static set buttonLoaderClass(token: string);
    /**
     * Set the Plugin path globally.
     *
     * @param path {string} the relative path.
     */
    static set path(path: string);
    /**
     * Add class(es) to the classlist of the selected element.
     *
     * @param tokenList {string[]} Comma separated strings of class(es) to add.
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
     * Removes the given class(es) from the classlist of the given element.
     *
     * @param tokenList {string[]} Comma separated strings of class(es) to remove.
     */
    removeClass(...tokenList: string[]): Fuxcel;
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
     * Removes the given [data-*] attribute(s) from the selected element.
     *
     * @param name {string[]} Comma separated strings of [data-*] attribute(s) to remove.
     * @return {Fuxcel} Fuxcel Object of the selected element
     */
    removeAttrib(...name: string[]): Fuxcel;
    /**
     * Removes the given [data-*] attribute(s) from the selected element.
     *
     * @param name {string[]} Comma separated strings of [data-*] attribute(s) to remove.
     * @return {Fuxcel} Fuxcel Object of the selected element
     */
    removeDataAttrib(...name: string[]): Fuxcel;
    /**
     * Removes the given property / properties from the selected element.
     *
     * @param name {string[]} Comma separated strings of property / properties to remove.
     * @return {Fuxcel} Fuxcel Object of the selected element
     */
    removeProp(...name: string[]): Fuxcel;
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
     * Returns the direct descendants (Children) of the selected element.
     *
     * _Returns the descendant that matches the selector if the selector parameter is passed._
     *
     * @param selector {Selector} Selectable string.
     * @return {Fuxcel} Fuxcel Object of the selected sibling(s)
     */
    siblings(selector?: Selector): Fuxcel;
    /**
     * Disables or enables the selected element(s).
     *
     * @param disabled {boolean} Switch between disabling and enabling the selected element(s).
     * @return {Fuxcel} Fuxcel Object of the selected element.
     */
    disable(disabled?: boolean): Fuxcel;
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
    handleFormSubmit({ uri, method, data, dataType, headers, beforeSend, handleError }: FXFormSubmitType): Promise<any>;
    /**
     * Check if the selected element has a scrollbar in the given direction.
     *
     * @param direction {('vertical'|'horizontal'|null)} Specific direction to check _[horizontal or vertical]_.
     * @return {boolean} true if the selected element has a scrollbar in the specified direction; false otherwise.
     */
    hasScrollBar(direction?: (Direction | null)): boolean;
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
     * Remove Event Listener(s) from the selected element.
     *
     * _Removes the given event(s) from the selected element if the event parameter is given._
     *
     * _Removes all previous Event Listeners from the selected element._
     *
     * @param events {string[]} Particular event to remove.
     * @return {Fuxcel} Fuxcel Object of the selected element.
     */
    off(...events: string[]): Fuxcel;
    /**
     * Toggle the disabled state (property) of the selected element [a button preferably].
     *
     * @param isLoading {boolean} Determines the state of the button.
     */
    toggleButtonLoadState(isLoading?: boolean): void;
    /**
     * Toggles the submit button state of the selected form.
     *
     * @param isLoading {boolean} Determines the state of the button.
     */
    toggleFormSubmitButtonState(isLoading?: boolean): void;
    /**
     * Trigger a new event on the selected element(s).
     *
     * @param event {string}
     * @param type {('mouse'|'keyboard'|null)}
     * @return {Fuxcel}
     */
    trigger(event: string, type?: ('mouse' | 'keyboard' | null)): Fuxcel;
    /**
     * Add given Event Listener to the selected element.
     *
     * @param events {string} Event
     * @param listener {((e: EventCounts)=>any)}
     * @param option {boolean}
     */
    upon(events: string, listener: ((e: Event) => any), option?: boolean): Fuxcel;
    upon(events: string[], listener: ((e: Event) => any), option?: boolean): Fuxcel;
    upon(events: EventListenerOrEventListenerObject | object, listener?: boolean): Fuxcel;
    value(): string | null;
    value(value: string): Fuxcel;
}
declare class FuxcelValidator extends Fuxcel implements FuxcelValidatorInterface {
    #private;
    constructor(selector: string | Iterable<any> | any, context?: string | Iterable<any> | any);
    /**
     * Checks if the selected field element can be validated by checking that the [data-fx-validate] is not set to false.
     *
     * @return {boolean} true if validation is possible; false otherwise
     */
    get canBeValidated(): boolean;
    /**
     * @return {object} The error bag for the current selected form.
     */
    get errorBag(): object;
    /**
     * @return {number} The error count for the current selected form.
     */
    get errorCount(): number;
    /**
     * @return {object} An object containing the error bag and error count for the current selected form(s). Logs an error to the console if selected element(s) not form element(s).
     */
    get getErrors(): object | void;
    /**
     * @return {object|void} An object containing all form field elements for the current selected form(s). Logs an error to the console if selected element(s) not form element(s).
     */
    get formFieldElements(): object | void;
    /**
     * Checks if the selected form field element is an email field.
     *
     * @return {boolean} true if it is an email field; false otherwise
     */
    get isEmailField(): boolean;
    /**
     * Checks if the selected form field element is a name field.
     *
     * @return {boolean} true if it is a name field; false otherwise
     */
    get isNameField(): boolean;
    /**
     * Checks if the selected form field element is a password field.
     *
     * @return {boolean} true if it is a password field; false otherwise
     */
    get isPasswordField(): boolean;
    /**
     * Checks if the selected form field element is a phone field.
     *
     * @return {boolean} true if it is a phone field; false otherwise
     */
    get isPhoneField(): boolean;
    /**
     * Checks if the selected form field element is a username field.
     *
     * @return {boolean} true if it is a username field; false otherwise
     */
    get isUsernameField(): boolean;
    /**
     * @return {number} the current step the form field belongs to if the form is a step form; -1 otherwise.
     */
    get stepFromField(): number;
    /**
     * @return {ValidationProps} Returns the [ValidationProps](ValidationProps) of the selected form field element.
     */
    get validationProps(): ValidationProps;
    /**
     * @return {ValidatorConfigObject} current validator config options object of selected form.
     */
    get validatorConfig(): ValidatorConfigObject;
    /**
     * @return {ValidatorConfigObject} the default validator config object.
     */
    static get defaultValidatorConfig(): ValidatorConfigObject;
    /**
     * @return {string} the password capslock alert class. Default is '.capslock-alert'.
     */
    static get passwordCapslockAlertClass(): string;
    /**
     * @return {string} the password toggle icon class. Default is '.toggle-password-icons'.
     */
    static get passwordTogglerIconClass(): string;
    /**
     * @return {string} steps class. Default is '.fx-step'.
     */
    static get stepsClass(): string;
    /**
     * Change the default class for steps.
     *
     * @param stepClass {string} class to use for steps.
     */
    static set stepsClass(stepClass: string);
    /**
     * Initialize validation on selected form(s).
     *
     * _Throws an error if non form elements are selected_
     *
     * @param config {ValidatorConfigObject} user config object.
     * @return {FuxcelSteps | FuxcelValidator} Fuxcel Validator Object of the forms.
     */
    init(config?: ValidatorConfigObject | null): FuxcelSteps | FuxcelValidator;
    /**
     * Display validation message.
     *
     * @param [message] {string|null=null} message to display [optional]
     * @param renderType {('error'|'success'|null)} validation type
     * @return {FuxcelValidator} Fuxcel Validator Object of the current selected element.
     */
    renderMessage(message?: StringOrNull, renderType?: StringOrNull): FuxcelValidator;
    /**
     * Display all validation errors for the selected form.
     *
     * @param errors {object} An object containing the errors. The keys are the form field ids and their values are the errors for the fields respectively.
     * @param messageOrCallbackFn {((fx: FuxcelValidator, e?: CustomEvent) => any)|StringOrNull}
     * @param callbackFn {((fx: FuxcelValidator, e?: CustomEvent) => any)}
     */
    renderValidationErrors(errors: object, messageOrCallbackFn?: ((fx: FuxcelValidator, e?: CustomEvent) => any) | StringOrNull, callbackFn?: ((fx: FuxcelValidator, e?: CustomEvent) => any) | null): FuxcelValidator;
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
     * @param message {string|null=null} Validation message.
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
    /**
     * Returns the error bag for the given step of the current selected element.
     *
     * @param step {number|string} Given step.
     * @return {object} The error bag for the given step of the current selected step form.
     */
    stepErrorBag(step: number | string): object;
    /**
     * Returns the error count for the given step of the current selected element.
     *
     * @param step {number|string} Given step.
     * @return {object} The error count for the given step of the current selected step form.
     */
    stepErrorCount(step: number | string): number;
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
     * @param customFormatEx {string|null=null} Custom format example to show user
     * @return {FuxcelValidator} Fuxcel Validator Object of the selected element.
     */
    validateCardNumber(regExp: RegExp, customFormatEx?: StringOrNull): FuxcelValidator;
    /**
     * Validate Email field using Regular Expression.
     *
     * @param regExp {RegExp} Regular expression to use.
     * @param customFormatEx {string|null=null} Custom format example to show user.
     * @return {FuxcelValidator} Fuxcel Validator Object of the selected element.
     **/
    validateEmail(regExp: RegExp, customFormatEx?: StringOrNull): FuxcelValidator;
    /**
     * Validate the selected field.
     *
     * @param message {string|null=null} Validation message to display.
     * @param isError {boolean=false} If true and the message parameter is null, an automatic error message is generated.
     * @return {FuxcelValidator} Fuxcel Validator Object of the selected element.
     */
    validateField(message?: StringOrNull, isError?: boolean): FuxcelValidator;
    /**
     * Validate Name field using Regular Expression
     *
     * @param regExp {RegExp} Regular expression to use.
     * @param customFormatEx {string|null=null} Custom format example to show user.
     * @return {FuxcelValidator} Fuxcel Validator Object of the selected element.
     */
    validateName(regExp: RegExp, customFormatEx?: StringOrNull): FuxcelValidator;
    /**
     * Validate Password field using Regular Expression
     *
     * @param regExp {RegExp} Regular expression to use
     * @param customFormatEx {string|null=null} Custom format example to show user.
     * @return {FuxcelValidator} Fuxcel Validator Object of the selected element.
     */
    validatePassword(regExp: RegExp, customFormatEx?: StringOrNull): FuxcelValidator;
    /**
     * Validate Phone field using Regular Expression
     *
     * @param regExp {RegExp} Regular expression to use
     * @param customFormatEx {string|null=null} Custom format example to show user.
     * @return {FuxcelValidator} Fuxcel Validator Object of the selected element.
     */
    validatePhone(regExp: RegExp, customFormatEx?: StringOrNull): FuxcelValidator;
    /**
     * Validate field using Regular Expression or a callback function
     *
     * @param regExpOrFn {Function|RegExp} Regular Expression or callback function to use.
     * @return {FuxcelValidator} Fuxcel Validator Object of the selected element.
     */
    validateRegex(regExpOrFn: Function): FuxcelValidator;
    validateRegex(regExpOrFn: RegExp, message: string): FuxcelValidator;
    /**
     * Validate Username field using Regular Expression
     *
     * @param regExp {RegExp} Regular expression to use
     * @param customFormatEx {string|null=null} Custom format example to show user.
     * @return {FuxcelValidator} Fuxcel Validator Object of the selected element.
     */
    validateUsername(regExp: RegExp, customFormatEx?: StringOrNull): FuxcelValidator;
}
declare class FuxcelSteps extends FuxcelValidator implements FuxcelStepsInterface {
    #private;
    static currentlySelected: object;
    constructor(selected: FuxcelValidator);
    /**
     * @return {FuxcelSteps} Fuxcel Validator Object of the selected element.
     */
    get context(): FuxcelSteps;
    /**
     * @return {object | (number | string)[]} If more than one selected form element - An Object containing all form steps in arrays respectively; else an array of all steps in the form.
     */
    get formSteps(): object | (number | string)[];
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
    stepErrors(step?: number | string | null): object | void;
}
declare class FuxcelModal extends Fuxcel implements FuxcelModalInterface {
    #private;
    static fxModalCancelButtonClick: Event;
    /**
     * @returns {CustomEvent} modal show event - fx.modal.show event
     */
    static fxModalShowEvent: CustomEvent<{
        plugins: string;
        interface: string;
    }>;
    /**
     * @returns {CustomEvent} modal hide event - fx.modal.hide event
     */
    static fxModalHideEvent: CustomEvent<{
        plugins: string;
        interface: string;
    }>;
    /**
     *
     */
    constructor(selector: string | Iterable<any> | any, context?: string | Iterable<any> | any, autoActions?: boolean);
    /**
     * @return {FuxcelModal | null} FuxcelModal object of Current open modal.
     */
    static get currentModal(): FuxcelModal | null;
    /**
     * @return {boolean} true if any modal is open. False otherwise.
     */
    static get hasOpenModals(): boolean;
    /**
     * @return {Fuxcel}
     */
    static get modalTriggers(): Fuxcel;
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
    static init({ title, html, content, id, hasFooter }: ModalInit): HTMLElement;
    /**
     * Destroy selected modal.
     */
    destroy(): void;
    /**
     * Close selected modal.
     *
     * @param destroy {boolean}
     */
    hide(destroy?: boolean): void;
    /**
     * Open selected modal.
     *
     * @param escKey {boolean=true} Allow closing the modal using the Escape on the KeyBoard if set to true. True by default.
     */
    show(escKey?: boolean | undefined): void;
    /**
     * Toggle between close and open of the selected modal.
     */
    toggle(): void;
}
//# sourceMappingURL=fuxcel.d.ts.map