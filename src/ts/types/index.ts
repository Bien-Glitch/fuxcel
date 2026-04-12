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

import {Fuxcel} from '../core/Fuxcel';
import {FuxcelValidator} from '../validator/FuxcelValidator';
import {FuxcelModal} from '../modal/FuxcelModal';
import {FuxcelSteps} from '../validator/FuxcelSteps';

// ─── Primitive / Element Types ────────────────────────────────────────────────
export type IterableElement =
	| any
	| NodeList
	| HTMLCollection
	| HTMLElement[]
	| HTMLScriptElement[]
	| HTMLFormElement[]
	| HTMLInputElement[]
	| HTMLSelectElement[]
	| HTMLTextAreaElement[]
	| Document[];

export type SingleElement =
	| HTMLElement
	| HTMLFormElement
	| HTMLInputElement
	| HTMLSelectElement
	| HTMLTextAreaElement
	| Document
	| Element;

export type Direction = 'horizontal' | 'vertical';
export type Position = 'affix' | 'prefix' | 'postfix' | 'suffix';
export type Selector = StringOrNull;
export type StringOrNull = string | null;

// ─── Event Types ──────────────────────────────────────────────────────────────

export type EventInterfaces =
	| AnimationEvent | ClipboardEvent | CompositionEvent | CustomEvent
	| DragEvent | ErrorEvent | Event | FocusEvent | HashChangeEvent
	| InputEvent | KeyboardEvent | MouseEvent | PointerEvent | PopStateEvent
	| ProgressEvent | SubmitEvent | StorageEvent | TouchEvent
	| TransitionEvent | UIEvent | WheelEvent;

export type HTMLListenerArray = Array<{
	element: HTMLElement;
	listener: EventListenerOrEventListenerObject | boolean | undefined;
	event: keyof HTMLElementEventMap | string;
	option: boolean;
}>;

export interface HTMLElementWithListenerArray extends HTMLElement {
	listeners?: HTMLListenerArray;
}

// ─── Field / Validation Types ─────────────────────────────────────────────────

export type FieldAttributes = {
	id: string | any;
	fxName: string | undefined;
	type: StringOrNull | undefined;
	fxId: StringOrNull | undefined;
	fxRole: StringOrNull | undefined;
	formId: StringOrNull;
};

export type ValidationProps = {
	/** id attribute of selected form field.        */ id: string;
	/** Selector of the form group element.         */ formGroup: string;
	/** Selector of the validation message field.   */ validationField: string;
	/** Selector of the valid icon.                 */ validIcon: string;
	/** Selector of the invalid icon.               */ invalidIcon: string;
	/** Selector of the validation icons container. */ validationIconField: string;
};

export type ValidatorConfigObject = {
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

export type FormValidationRegistryBag = Record<string, {
	configObject: ValidatorConfigObject;
	bag: { [key: string]: any };
	count: number;
	steps: Record<string, {
		bag: { [key: string]: any };
		count: number
	}>;
}>

// ─── Animation Types ──────────────────────────────────────────────────────────

export type FXAnimationOptions = {
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

export type FXAnimationType = {
	timeout?: number | string;
	iterations?: number;
	display?: string;
};

export type FXAnimationReturn = {
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

export type FXAnimation = (args: FXAnimationType) => FXAnimationReturn;

// ─── Modal Types ──────────────────────────────────────────────────────────────

export type ModalInit = {
	title: StringOrNull;
	html: boolean;
	isStatic: boolean;
	content: string;
	id: string;
	hasFooter: boolean;
};

export type FXModalType = {
	/** Modal title. */                           title?: StringOrNull;
	/** Visual type: success | warning | error.*/ type?: 'success' | 'warning' | 'error';
	/** Body content (HTML or text). */           content?: StringOrNull;
	/** Label for the confirm button. */          confirmButtonText?: StringOrNull;
	/** Label for the cancel button. */           cancelButtonText?: StringOrNull;
	/** Auto-close on confirm click. */           closeOnConfirm?: boolean;
	/** Render body as HTML (default true). */    html?: boolean;
	/** Prevent closing on outside click. */      isStatic?: boolean;
	/** Fired when confirm is clicked. */         onConfirm?: ((e: CustomEvent, modal: FuxcelModal) => void) | null;
	/** Fired when cancel is clicked. */          onCancel?: ((e: CustomEvent, modal: FuxcelModal) => void) | null;
	/** Fired on Escape (no cancel button). */    onEsc?: ((e: CustomEvent, modal: FuxcelModal) => void) | null;
};

// ─── HTTP Types ───────────────────────────────────────────────────────────────
export type HTTPRequestMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';

export type FXRequestType = {
	/** Request URL. */                   uri?: string;
	/** HTTP method. */                   method?: HTTPRequestMethod;
	/** Request body data. */             data?: BodyInit | object | null;
	/** Expected response type. */        dataType?: 'html' | 'json' | 'jsonp' | 'script' | 'text' | 'xml';
	/** Additional request headers. */    headers?: Object | Headers | null;
	/** Called before request is sent. */ beforeSend?: Function | null;
	/** Timeout in seconds. */            timeout?: number;
	/** Called on completion. */          onComplete?: ((response: ResponseData, status: number, statusText: string) => void) | null;
	/** Called on network error. */       onError?: ((error: any, status: number, statusText: string) => void) | null;
	/** Called on HTTP 2xx. */            onSuccess?: ((response: ResponseData, status: number, statusText: string) => void) | null;
};

export type FXFormSubmitType = {
	/** Submission URL. */                uri?: StringOrNull;
	/** HTTP method. */                   method?: HTTPRequestMethod | null;
	/** Additional form data. */          data?: object | null;
	/** Expected response type. */        dataType?: 'html' | 'json' | 'jsonp' | 'script' | 'text' | 'xml';
	/** Additional request headers. */    headers?: Object | Headers | null;
	/** Called before request is sent. */ beforeSend?: Function | null;
	/** Timeout in milliseconds. */       timeout?: number;
	/** Auto-handle 422 errors. */        handleError?: boolean;
};

export type FXFormResponse = {
	/** JSON Object returned from the request **/ JSON?: any,
	/** Text Object returned from the request **/ text?: string,
	/** The request's HTTP response status **/ status: number,
	/** FuxcelValidator instance of the submitted form **/ form: FuxcelValidator
}

export interface ResponseData extends Response {
	ok: boolean;
	status: number;
	statusText: string;
	responseText?: string;
	responseJSON?: object;
}

// ─── Instance Interfaces ──────────────────────────────────────────────────────

/** Public API of a Fuxcel DOM wrapper instance. */
export interface FuxcelInstance {
	length: number;
	toArray: IterableElement;
	
	// ─── Animations ───────────────────────────────────────────────────────
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
	
	// ─── Class Manipulation ───────────────────────────────────────────────────
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
	
	// ─── Iteration ────────────────────────────────────────────────────────────
	/**
	 * Perform callback on each selected item
	 *
	 * @param callback {((element: Fuxcel, index: number) => void)}
	 */
	each(callback: ((element: Fuxcel, index: number) => void)): void;
	
	// ─── Attributes / Properties / Style Accessors ───────────────────────────────
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
	
	// ─── DOM Mutation ─────────────────────────────────────────────────────────
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
	 * Inserts the given HTML string to the given position of the selected element.
	 *
	 * _Defaults to innerHTML._
	 *
	 * @param value {string} HTML string to insert
	 * @return {Fuxcel} Fuxcel Object of the selected element
	 */
	insertHTML(value: string): Fuxcel;
	
	/**
	 * Inserts the given HTML string to the given position of the selected element.
	 *
	 * @param value {string} HTML string to insert
	 * @param position {Position} Position to place given HTML string.
	 * @return {Fuxcel} Fuxcel Object of the selected element
	 */
	insertHTML(value: string, position: Position): Fuxcel;
	
	/**
	 * Inserts the given HTML string to the given position of the selected element.
	 *
	 * _Inserts the HTML string as inner HTML if no position is given._
	 *
	 * @param value {string} HTML string to insert
	 * @param position {Position | null = null} Position to place given HTML string.
	 * @return {Fuxcel} Fuxcel Object of the selected element
	 */
	insertHTML(value: string, position: Position): Fuxcel;
	
	// ─── Traversal ───────────────────────────────────────────────────────
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
	descendants(selector?: Selector): Fuxcel
	
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
	
	
	// ─── Element Checks ───────────────────────────────────────────────────────
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
	
	// ─── Form Helpers ─────────────────────────────────────────────────────────
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
	
	// ─── Events ───────────────────────────────────────────────────────────────
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
	upon(events: string, listener: EventListener, option?: boolean): Fuxcel
	
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
	upon(events: string[], listener: EventListener, option?: boolean): Fuxcel
	
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
	upon(events: object, option: boolean): Fuxcel
	
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
	upon(events: object): Fuxcel
	
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
	 * @param event {string} Event to trigger on selected element(s).
	 * @param type {"mouse" | "keyboard" | "custom" | null} Type of Event (Mouse, Keyboard, Custom). _Defaults to Event when nothing is passed._
	 * @returns {Fuxcel}
	 */
	trigger(event: string, type?: 'mouse' | 'keyboard' | 'custom' | null): Fuxcel;
	
	// ─── Value ─────────────────────────────────────────────────────────
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
	
	// ─── Getters ──────────────────────────────────────────────────────────────
	/** Get the class list of element. **/ readonly classes: DOMTokenList;
	/** A promise with a boolean argument; true if the given element has the mouse focus; false otherwise. **/ readonly hasFocus: Promise<boolean>;
	/** Returns true if the selected element has the disabled property; false otherwise. **/ readonly isDisabled: boolean;
	/** Returns true if the selected element is a form element. **/ readonly isFormElement: boolean;
	/** The Inner HTML value of the given element. **/ readonly innerHTML: string;
	/** The Outer HTML value of the given element. **/ readonly outerHTML: string;
	/** The Inner Text value of the given element. **/ innerText: string;
	/** The Outer Text value of the given element. **/ outerText: string;
	
	// Sub-system accessors
	/** A new instance of the Fuxcel Form Validator. **/ readonly formValidator: FuxcelValidator;
	/** A new instance of the Fuxcel Modal. **/ readonly modal: FuxcelModal;
}

/** Public API of a FuxcelValidator instance. */
export interface FuxcelValidatorInstance extends FuxcelInstance {
	/**
	 * Initialize validation on selected form(s).
	 *
	 * _Throws an error if non form elements are selected._
	 *
	 * @param config {ValidatorConfigObject} user config object.
	 * @return {FuxcelSteps | FuxcelValidator} Fuxcel Validator Object of the forms.
	 */
	init(config?: ValidatorConfigObject | null): FuxcelValidator | FuxcelSteps;
	
	
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
	renderValidationErrors(errors: { [key: string]: any }): FuxcelValidator;
	
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
	renderValidationErrors(errors: { [key: string]: any }, messageOrFn: ((fx: FuxcelValidator, e?: CustomEvent) => any)): FuxcelValidator;
	
	/**
	 * Display all validation errors for the selected form.
	 *
	 * @param errors {{ [key: string]: any }} An object containing the errors. The keys are the form field ids and their values are the errors for the fields respectively.
	 * @param messageOrFn {string}
	 * @return FuxcelValidator
	 */
	renderValidationErrors(errors: { [key: string]: any }, messageOrFn: string): FuxcelValidator;
	
	/**
	 * Display all validation errors for the selected form.
	 *
	 * @param errors {{ [key: string]: any }} An object containing the errors. The keys are the form field ids and their values are the errors for the fields respectively.
	 * @param messageOrFn {((fx: FuxcelValidator, e?: CustomEvent) => any)}
	 * @param callbackFn {((fx: FuxcelValidator, e?: CustomEvent) => any)}
	 * @return FuxcelValidator
	 */
	renderValidationErrors(errors: { [key: string]: any }, messageOrFn: ((fx: FuxcelValidator, e?: CustomEvent) => any), callbackFn: ((fx: FuxcelValidator, e?: CustomEvent) => any)): FuxcelValidator;
	
	/**
	 * Display all validation errors for the selected form.
	 *
	 * @param errors {{ [key: string]: any }} An object containing the errors. The keys are the form field ids and their values are the errors for the fields respectively.
	 * @param messageOrFn {string}
	 * @param callbackFn {((fx: FuxcelValidator, e?: CustomEvent) => any)}
	 * @return FuxcelValidator
	 */
	renderValidationErrors(errors: { [key: string]: any }, messageOrFn: string, callbackFn: ((fx: FuxcelValidator, e?: CustomEvent) => any)): FuxcelValidator;
	
	/**
	 * Display all validation errors for the selected form.
	 *
	 * @param errors {{ [key: string]: any } | null = null} An object containing the errors. The keys are the form field ids and their values are the errors for the fields respectively.
	 * @param messageOrFn {((fx: FuxcelValidator, e?: CustomEvent) => any)|StringOrNull}
	 * @param callbackFn {((fx: FuxcelValidator, e?: CustomEvent) => any)}
	 * @return FuxcelValidator
	 */
	renderValidationErrors(errors?: { [key: string]: any } | null, messageOrFn?: ((fx: FuxcelValidator, e?: CustomEvent) => any) | StringOrNull, callbackFn?: ((fx: FuxcelValidator, e?: CustomEvent) => any) | null): FuxcelValidator;
	
	
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
export interface FuxcelStepsInstance extends FuxcelValidatorInstance {
	readonly context: FuxcelStepsInstance;
	readonly formSteps: object | (number | string)[];
	
	stepErrors(step?: number | string | null): object | void;
}

/** Public API of a FuxcelModal instance. */
export interface FuxcelModalInstance extends FuxcelInstance {
	
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

// ─── Constructor Interfaces ───────────────────────────────────────────────────

export interface FuxcelConstructor {
	new(selector: string | IterableElement | SingleElement, context?: string | IterableElement | SingleElement): Fuxcel;
	
	(selector: string | IterableElement | SingleElement, context?: string | IterableElement | SingleElement): Fuxcel;
	
	buttonLoaderClass: string;
	/** The Plugin path. **/ path: string | null;
	/** `true` if the current device is a mobile device. **/ readonly isMobileDevice: boolean;
	/** `true` if the pointer is coarse (touch). **/ readonly pointerIsTouch: boolean;
}

export interface FuxcelValidatorConstructor {
	new(selector: string | IterableElement | SingleElement, context?: string | IterableElement | SingleElement): FuxcelValidator;
	
	readonly defaultValidatorConfig: ValidatorConfigObject;
	readonly passwordCapslockAlertClass: string;
	readonly passwordTogglerIconClass: string;
	stepsClass: string;
}

export interface FuxcelStepsConstructor {
	new(selected: FuxcelValidator): FuxcelStepsInstance;
	
	currentlySelected: object;
}

export interface FuxcelModalConstructor {
	new(selector: string | IterableElement | SingleElement, context?: string | IterableElement | SingleElement, autoActions?: boolean): FuxcelModal;
	
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

// ─── FXInterface ──────────────────────────────────────────────────────────────

/**
 * The full type of the fx / fuxcel selector function,
 * including all static helper properties attached to it.
 */
export interface FXInterface {
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
	modal: (options?: FXModalType) => FuxcelModal;
	
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
}

// ─── Global augmentation (script-tag support) ─────────────────────────────────

declare global {
	
	// ── Selector functions ────────────────────────────────────────────────────
	
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
	
	// ── Classes ───────────────────────────────────────────────────────────────
	
	/** Core DOM wrapper class. */
	const Fuxcel: FuxcelConstructor;
	
	/** Form validation engine. */
	const FuxcelValidator: FuxcelValidatorConstructor;
	
	/** Multi-step form extension of FuxcelValidator. */
	const FuxcelSteps: FuxcelStepsConstructor;
	
	/** Modal engine. */
	const FuxcelModal: FuxcelModalConstructor;
	
	// ── Standalone functions ──────────────────────────────────────────────────
	
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
	
	// ── Utility helpers ───────────────────────────────────────────────────────
	
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
	
	// ── Window interface ──────────────────────────────────────────────────────
	
	interface Window {
		fx: FXInterface;
		fuxcel: FXInterface;
		Fuxcel: FuxcelConstructor;
		FuxcelValidator: FuxcelValidatorConstructor;
		FuxcelSteps: FuxcelStepsConstructor;
		FuxcelModal: FuxcelModalConstructor;
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

export {};
