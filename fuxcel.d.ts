declare type ElementReturn = HTMLElement[] | HTMLFormElement | HTMLInputElement[] | HTMLSelectElement[] | HTMLTextAreaElement[] | Document[];

declare type FieldAttributes = { id: any, type: StringOrNull | undefined, fxId: StringOrNull | undefined, fxRole: StringOrNull | undefined, formId: StringOrNull };

declare type FuxcelOrString<T extends string | object, U extends boolean | string | null = null> = T extends object ? Fuxcel : (T extends string ? (U extends string ? Fuxcel : (U extends boolean ? Fuxcel : string)) : string);

declare type ModalInit = { title: StringOrNull, html: boolean, content: string, id: string, hasFooter: boolean };

declare type FXAnimation = {
	name: string;
	onBegin: object;
	onFinished: object;
	options: {
		keyFrames: Keyframe[] | PropertyIndexedKeyframes | null;
		timing: {
			duration: number,
			iterations: number
		};
	};
}

declare type FXModalType = {
	/*** _Modal Title._ ***/ title?: StringOrNull,
	/*** _Modal type._ ***/ type?: ('success' | 'warning' | 'error'),
	/*** _Body Content of Modal._ ***/ content?: StringOrNull,
	/*** _Text for Confirm Button._ ***/ confirmButtonText?: StringOrNull,
	/*** _Text for Cancel Button._ ***/ cancelButtonText?: StringOrNull,
	/*** _Use HTML content? else use Text content._ ***/ html?: boolean,
	/*** _Callback on confirm button click._ ***/ onConfirm?: ((e: CustomEvent, modal: FuxcelModal) => void) | null,
	/*** _Callback on cancel button click._ ***/ onCancel?: ((e: CustomEvent, modal: FuxcelModal) => void) | null,
	/*** _Callback on Escape key used. Only works when cancel button is not available. [i.e. cancelButtonText is null]._ ***/ onEsc?: ((e: CustomEvent, modal: FuxcelModal) => void) | null,
};

declare type FXRequestType = {
	/*** _Request URL._ ***/ uri: string,
	/*** _Request method._ ***/ method?: ('get' | 'post' | 'put' | 'patch' | 'delete' | null),
	/*** _Additional request data._ ***/ data?: BodyInit | object | null,
	/*** _Expected return data type._ ***/ dataType?: ('html' | 'json' | 'jsonp' | 'script' | 'text' | 'xml'),
	/*** _Before request is sent._ ***/ beforeSend?: Function | null,
	/*** _Once request is completed._ ***/ onComplete?: ((response: ResponseData, status: number, statusText: string) => void) | null,
	/*** _If request has errors._ ***/ onError?: ((error: any, status: number, statusText: string) => void) | null,
	/*** _If request is successful._ ***/ onSuccess?: ((response: ResponseData, status: number, statusText: string) => void) | null,
};

declare type FXFormSubmitType = {
	/*** _Submission URL._ ***/ uri?: StringOrNull,
	/*** _Submission method._ ***/ method?: ('get' | 'post' | 'put' | 'patch' | 'delete'),
	/*** _Additional submission data._ ***/ data?: object | null,
	/*** _Expected return data type_ ***/ dataType?: ('html' | 'json' | 'jsonp' | 'script' | 'text' | 'xml'),
	/*** _Before request is sent._ ***/ beforeSend?: Function | null,
};

declare type Selector = StringOrNull;

declare type StringOrNull = string | null;

declare type ValidationProps = {
	/*** _id attribute of selected form field._ ***/ id: string,
	/*** _selector of the form group element for selected form field._ ***/ formGroup: string,
	/*** _selector of the validation field for selected form field._ ***/ validationField: string,
	/*** _selector of the validation valid icon for the selected form field._ ***/ validIcon: string,
	/*** _selector of the validation invalid icon for the selected form field._ ***/ invalidIcon: string,
	/*** _selector of the validation icons field for the selected form field._ ***/ validationIconField: string
};

declare type ValidatorConfigObject = {
	regExp?: {
		cardCVV?: RegExp | null,
		cardNumber?: RegExp | null,
		email?: RegExp | null,
		name?: RegExp | null,
		phone?: RegExp | null,
		password?: RegExp | null,
		username?: RegExp | null,
	},
	config?: {
		capslockAlert?: boolean,
		showIcons?: boolean,
		showPassword?: boolean,
		validateCard?: boolean,
		validateEmail?: boolean,
		validateName?: boolean,
		validatePassword?: boolean,
		validatePhone?: boolean,
		validateUsername?: boolean,
		nativeValidation?: boolean,
		useDefaultStyling?: boolean,
		passwordConfirmId?: string,
		passwordId?: string,
		initWrapper?: string,
	},
	stepForm?: {
		use?: boolean,
		plugin?: boolean,
		config?: {
			slides?: boolean,
			step?: string,
			switch?: string,
		}
	}
	texts?: {
		capslock?: string,
		emailFormat?: string | null,
		nameFormat?: string | null,
		phoneFormat?: string | null,
		passwordFormat?: string | null,
		usernameFormat?: string | null,
	}
};

declare interface FuxcelBaseInterface {
	get fieldAttributes(): FieldAttributes;
	
	get prevObj(): { length: number };
	
	get toArray(): ElementReturn
}

declare interface FuxcelInterface {
	get classes(): DOMTokenList;
	
	get hasFocus(): Promise<any>;
	
	putClass(...tokenList: string[]): Fuxcel;
	
	replaceClass(oldToken: string, newToken: string): Fuxcel;
	
	removeClass(...tokenList: string[]): Fuxcel;
	
	attrib<T extends string | object, U extends string | null = null>(name: T, value?: U): FuxcelOrString<T, U>;
	
	dataAttrib<T extends string | object, U extends string | null = null>(name: T, value?: U): FuxcelOrString<T, U>;
	
	prop<T extends string | object, U extends boolean | string | null>(name: T, value?: U): FuxcelOrString<T, U>;
	
	style<T extends string | object, U extends string | null>(name: T, value?: U): FuxcelOrString<T, U>;
	
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
	
	handleFormSubmit({uri, method, data, dataType, beforeSend}: FXFormSubmitType): void;
	
	hasScrollBar(direction: ('horizontal' | 'vertical' | null)): boolean;
	
	insertHTML(value: string, position: ('affix' | 'prefix' | 'postfix' | 'suffix' | null)): Fuxcel;
	
	isElement(tagName: string | HTMLElementTagNameMap): boolean;
	
	matchSelector(selector: Selector): boolean;
	
	off(...events: string[]): Fuxcel;
	
	toggleButtonLoadState(isLoading: boolean): void;
	
	toggleFormSubmitButtonState(isLoading: boolean): void;
	
	trigger(event: string): Fuxcel;
	
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
	
	validateRegex(regExpOrFn: Function | RegExp, message ?: StringOrNull): FuxcelValidator;
	
	validateUsername(regExp: RegExp, customFormatEx: StringOrNull): FuxcelValidator;
}

declare interface FuxcelStepsInterface {
	get context(): FuxcelSteps
	
	get formSteps(): object | (number | string)[]
	
	stepErrors(step: number | string | null): object | void
}

declare interface FuxcelModalInterface {
	hide(destroy: boolean): void;
	
	show(escKey?: boolean): void;
	
	toggle(): void;
}

declare interface FXInterface {
	(selector: string | Iterable<any> | any, context?: string | Iterable<any> | any): Fuxcel;
	
	fetch?: ({uri, method, data, dataType, beforeSend, onComplete, onError, onSuccess}: FXRequestType) => void;
	
	modal?: ({title, type, content, confirmButtonText, cancelButtonText, html, onConfirm, onCancel}: FXModalType) => void;
	
	onDocumentLoad?: ((listener: (e: Event) => void) => void)
	
	passLuhnAlgo?: (input: any | string | number) => boolean;
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

//# sourceMappingURL=fuxcel.d.ts.map
