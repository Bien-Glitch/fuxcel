declare type ElementReturn = HTMLElement[] | HTMLInputElement[] | HTMLSelectElement[] | HTMLTextAreaElement[];

declare type FieldAttributes = { id: any, type: StringOrNull | undefined, fxId: StringOrNull | undefined, fxRole: StringOrNull | undefined, formId: StringOrNull };

declare type FuxcelOrString<T extends string | object, U extends boolean | string | null = null> = T extends object ? Fuxcel : (T extends string ? (U extends string ? Fuxcel : (U extends boolean ? Fuxcel : string)) : string);

declare type Selector = StringOrNull;

declare type StringOrNull = string | null;

declare type ValidationProps = { id: string, formGroup: string, validationField: string, validIcon: string, invalidIcon: string, validationIconField: string };

declare type ValidatorConfigObject = {
	regExp: {
		cardCVV: RegExp | null,
		cardNumber: RegExp | null,
		email: RegExp | null,
		name: RegExp | null,
		phone: RegExp | null,
		password: RegExp | null,
		username: RegExp | null,
	},
	config: {
		capslockAlert: boolean,
		showIcons: boolean,
		showPassword: boolean,
		validateCard: boolean,
		validateEmail: boolean,
		validateName: boolean,
		validatePassword: boolean,
		validatePhone: boolean,
		validateUsername: boolean,
		nativeValidation: boolean,
		useDefaultStyling: boolean,
		passwordConfirmId: string,
		passwordId: string,
		initWrapper: string,
	},
	texts: {
		capslock: string,
		emailFormat: string | null,
		nameFormat: string | null,
		phoneFormat: string | null,
		passwordFormat: string | null,
		usernameFormat: string | null,
	}
};

interface FuxcelBaseInterface {
	get fieldAttributes(): FieldAttributes;
	
	get prevObj(): { length: number };
	
	get toArray(): ElementReturn
}

interface FuxcelInterface {
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
	
	hasScrollBar(direction: string): boolean;
	
	insertHTML(value: string, position: StringOrNull): Fuxcel;
	
	isElement(tagName: string): boolean;
	
	matchSelector(selector: Selector): boolean;
	
	off(event?: StringOrNull): Fuxcel;
	
	upon(events: string | object, listener?: Function | boolean, option?: boolean): Fuxcel;
	
	value(value: StringOrNull): Fuxcel | string | null;
}

interface FuxcelValidatorInterface {
	get canBeValidated(): boolean;
	
	get errorBag(): object;
	
	get errorCount(): object;
	
	get getErrors(): object | void;
	
	get formFieldElements(): any;
	
	get isEmailField(): boolean;
	
	get isNameField(): boolean;
	
	get isPasswordField(): boolean;
	
	get isPhoneField(): boolean;
	
	get isUsernameField(): boolean;
	
	get stepFromField(): number;
	
	get validationProps(): ValidationProps;
	
	get validatorConfig(): ValidatorConfigObject;
	
	init(config: Object | null): FuxcelValidator;
	
	initSteps(config: Object | number | null): FuxcelSteps;
	
	renderMessage(message: StringOrNull, renderType: StringOrNull): FuxcelValidator;
	
	renderValidationErrors(errors: object, message: StringOrNull, callbackFn: Function | null): void;
	
	showError(message: StringOrNull): void;
	
	showSuccess(message: StringOrNull): void;
	
	toggleValidation(): FuxcelValidator;
	
	undoValidation(destroyValidation: boolean): FuxcelValidator;
	
	stepErrorBag(step: number | string): object
	
	stepErrorCount(step: number | string): number
	
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

interface FuxcelStepsInterface {
	get context(): FuxcelSteps
	
	get formSteps(): object | (number | string)[]
	
	stepErrors(step: number | string | null): object | void
}

interface FXInterface {
	(selector: string | Iterable<any> | any, context?: string | Iterable<any> | any): Fuxcel;
}

interface TypeOfInterface {
	(value: any): boolean;
}

/**
 * Creates new Fuxcel Object with selected element.
 *
 * @param selector {string|Iterable<any>|any} Selectable string or iterable.
 * @param context {string|Iterable<any>|any} Context to select from.
 * @return {Fuxcel} New Fuxcel Object.
 */
const fx: FXInterface = (selector: string | Iterable<any> | any, context: string | Iterable<any> | any = null): Fuxcel => new Fuxcel(selector, context);


/**
 * Checks if the given value is of type boolean.
 *
 * @param value {any} Value to check.
 * @return {boolean} true if the given value is of type boolean; false otherwise.
 */
const isBool: TypeOfInterface = (value: any): boolean => {
	return typeof value === 'boolean';
}

/**
 * Checks if the given value is of type function.
 *
 * @param value {any} Value to check.
 * @return {boolean} true if the given value is of type function; false otherwise.
 */
const isFunction: TypeOfInterface = (value: any): boolean => {
	return typeof value === 'function';
}

/**
 * Checks if the given value is of type string.
 *
 * @param value {any} Value to check.
 * @return {boolean} true if the given value is of type string; false otherwise.
 */
const isString: TypeOfInterface = (value: any): boolean => {
	return typeof value === 'string' && true;
}

/**
 * Checks if the given value is of type object.
 *
 * @param value {any} Value to check.
 * @return {boolean} true if the given value is of type boolean; false otherwise.
 */
const isObject: TypeOfInterface = (value: any): boolean => {
	return typeof value === 'object';
}

/**
 * Check if given input passes the Luhn Algorithm Test.
 *
 * @param input {any | string | number} input to check.
 * @return {boolean} true if passed; false otherwise.
 */
const passLuhnAlgo = (input: any | string | number): boolean => {
	const digitSum = (c: any | number): number => (c < 10) ? c : digitSum(Math.trunc(c / 10) + (c % 10));
	
	return input.split('').reverse()
		.map(Number)
		.map((value: number, index: number) => index % 2 !== 0 ? digitSum(value * 2) : 2)
		.reduce((previous: number, current: number) => previous + current) % 10 === 0;
}

/**
 * Parse the given value and get its boolean value.
 *
 * @param value {any} Value to parse.
 * @return {boolean} Its boolean value; true or false.
 */
const parseBool = (value: any): boolean => {
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
}

// @ts-ignore
String.prototype.toTitleCase = function (): string {
	const value = this;
	
	let titleCased = '',
		valueSplit = value.split(/([ _-])/gi);
	
	valueSplit.forEach((word: string, index) => {
		word = word.toLowerCase();
		let wordSplit = word.split(''),
			firstChar = wordSplit[0];
		wordSplit[0] = firstChar.toUpperCase();
		titleCased += wordSplit.join('');
	});
	return String(titleCased);
}

class FuxcelBase implements FuxcelBaseInterface {
	length: number;
	protected prev: { length: number };
	
	/**
	 * Initialize the plugin
	 *
	 * @param selector {string|Iterable<any>|any} Selectable string or iterable.
	 * @param context {string|Iterable<any>|any} Context to select from.
	 */
	constructor(selector: string | Iterable<any> | any, context?: string | Iterable<any> | any) {
		const fuxcel: any = this;
		const selectedElements: any[] | NodeListOf<any> | undefined = init();
		const documentDOMArray: any[] = fuxcel.#_toArray(document);
		
		this.length = 0;
		this.prev = {length: 0};
		
		documentDOMArray.forEach((value, key) => {
			fuxcel.prev[key] = value;
			fuxcel.prev.length++;
		});
		
		selectedElements && selectedElements.forEach((value, key) => {
			fuxcel[key] = value;
			this.length++
		});
		
		function init(): [] | NodeListOf<any> | undefined {
			let selected: NodeListOf<any>;
			
			try {
				const _context: HTMLElement = context && ((isString(context) ?
					fuxcel.#_toArray(document.querySelector(context)) :
					fuxcel.#_toArray(context)))[0];
				
				if (fuxcel.#_isHTMLElement(selector) || fuxcel.#_isIterable(selector)) {
					const target: [] = fuxcel.#_toArray(selector);
					
					if (context) {
						if (target.length) {
							target.forEach((value: HTMLElement) => value.dataset.fuxcelTempId = 'fuxcel-temp-selector');
							selected = _context.querySelectorAll('[data-fuxcel-temp-id="fuxcel-temp-selector"]');
							target.forEach((value: HTMLElement) => delete value.dataset.fuxcelTempId);
							return selected;
						}
					}
					return target;
				}
				return context && _context ? _context.querySelectorAll(selector) : document.querySelectorAll(selector);
			} catch (e) {
				console.trace(e);
			}
		}
		
		return fuxcel
	}
	
	/**
	 * Checks if the given selected element is iterable.
	 *
	 * @param element {any}
	 * @private
	 * @return {boolean} Returns true if the element is iterable; false otherwise.
	 */
	#_isIterable(element: any): boolean {
		return !!FuxcelBase.#_constructors.iterable.filter(value => value === element.constructor.name.toLowerCase()).length || Array.isArray(element);
	}
	
	/**
	 * Checks if the given selected element is an HTML Element.
	 *
	 * @param element {any} Given Element
	 * @private
	 * @return {boolean} Returns true if the element is an HTMML Element; false otherwise.
	 */
	#_isHTMLElement(element: HTMLElement | any): boolean {
		return !!FuxcelBase.#_constructors.html.filter(value => element.constructor.name.toLowerCase().includes(value)).length;
	}
	
	/**
	 * Wraps given element(s) in an array.
	 *
	 * @param element {any}
	 * @private
	 * @return {boolean} Returns HTML Element(s) wrapped in an array.
	 */
	#_toArray(element: any): ElementReturn {
		return this.#_isIterable(element) ? Array.from(element) : [element];
	}
	
	/**
	 * Returns an Object containing {FieldAttributes} attributes of the element.
	 * @return {FieldAttributes}
	 */
	get fieldAttributes(): FieldAttributes {
		const selected = <HTMLInputElement[] | HTMLSelectElement[] | HTMLTextAreaElement[]>this.toArray;
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
	get prevObj(): { length: number } {
		return this.prev;
	}
	
	get toArray() {
		if (!this.length)
			console.trace('No element selected');
		return this.#_toArray(this);
	}
	
	static get #_constructors(): { iterable: any[], html: any[] } {
		const html: any[] = ['html'];
		const iterable: any[] = [
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
		return {iterable: iterable, html: html};
	}
	
	/**
	 * Returns true if the device is mobile device; false otherwise.
	 */
	static get isMobileDevice(): boolean {
		return navigator.userAgent.toLowerCase().includes('mobile');
	}
	
	/**
	 * Returns true if the device supports touch; false otherwise.
	 */
	static get pointerIsTouch(): boolean {
		return window.matchMedia("(pointer: coarse)").matches;
	}
}

class Fuxcel extends FuxcelBase implements FuxcelInterface {
	static pluginPath: string = './';
	
	constructor(selector: string | Iterable<any> | any, context?: string | Iterable<any> | any) {
		super(selector, context);
	}
	
	#_formatDataAttrib(name: string): string {
		let replaced: string = '',
			nameSplit: string[] = name.toString().split('-');
		
		nameSplit.forEach((split: string, idx: number) => {
			if (idx) {
				let splinted = split.split(''),
					firstWord = splinted[0];
				splinted[0] = firstWord.toUpperCase();
				replaced += splinted.join('');
			}
		});
		return `${nameSplit[0]}${replaced}`;
	}
	
	#_setAttrib(name: string | object, value?: string): Fuxcel {
		const selected: HTMLElement[] = this.toArray;
		
		if (isString(name) && isString(value)) {
			selected.forEach((element: HTMLElement) => element.setAttribute(<string>name, <string>value));
		} else if (isObject(name)) {
			Object.keys(name).forEach(key => {
				// @ts-ignore
				selected.forEach((element: HTMLElement) => element.setAttribute(key, name[key]));
			});
		} else {
			if (isString(name))
				throw (`Argument for \`name\` expects a String or an Object in function \`attrib()\`. ${typeof name} given.`);
			else
				throw (`Function \`attrib()\` expects 1-2 arguments. None given.`);
		}
		return this;
	}
	
	#_setDataAttrib(name: string | object, value?: string): Fuxcel {
		const selected: HTMLElement[] = this.toArray;
		
		if (isString(name) && isString(value)) {
			// @ts-ignore
			selected.forEach((element: HTMLElement) => element.dataset[name] = value);
		} else if (isObject(name)) {
			Object.keys(name).forEach(key => {
				// @ts-ignore
				selected.forEach((element: HTMLElement) => element.dataset[key] = name[key]);
			});
		} else {
			if (isString(name))
				throw (`Argument for \`name\` expects a String or an Object in function \`dataAttrib()\`. ${typeof name} given.`);
			else
				throw (`Function \`dataAttrib()\` expects 1-2 arguments. None given.`);
		}
		return this;
	}
	
	#_setPrev(prevObj: Fuxcel): Fuxcel {
		// @ts-ignore
		this.prev = new Fuxcel(prevObj);
		return this;
	}
	
	#_setProp(name: string | object, value?: string): Fuxcel {
		const selected: HTMLElement[] = this.toArray;
		
		if (isString(name) && (isString(value) || isBool(value))) {
			// @ts-ignore
			selected.forEach((element: HTMLElement) => element[name] = value);
		} else if (isObject(name)) {
			Object.keys(name).forEach(key => {
				// @ts-ignore
				selected.forEach((element: HTMLElement) => element[key] = name[key]);
			});
		} else {
			if (isString(name))
				throw (`Argument for \`name\` expects a String or an Object in function \`prop()\`. ${typeof name} given.`);
			else
				throw (`Function \`prop()\` expects 1-2 arguments. None given.`);
		}
		return this;
	}
	
	#_setStyle(name: string | object, value?: string): Fuxcel {
		const selected: HTMLElement[] = this.toArray;
		
		if (isString(name) && (isString(value) || isBool(value))) {
			// @ts-ignore
			selected.forEach((element: HTMLElement) => element.style[name] = value);
		} else if (isObject(name)) {
			Object.keys(name).forEach(key => {
				// @ts-ignore
				selected.forEach((element: HTMLElement) => element.style[key] = name[key]);
			});
		} else {
			if (isString(name))
				throw (`Argument for \`name\` expects a String or an Object in function \`prop()\`. ${typeof name} given.`);
			else
				throw (`Function \`prop()\` expects 1-2 arguments. None given.`);
		}
		return this;
	}
	
	/**
	 * Returns the class list of an element
	 */
	get classes(): DOMTokenList {
		const selected: HTMLElement[] = this.toArray;
		return selected[0].classList
	}
	
	/**
	 *  Return true if the given element has the mouse focus; false otherwise.
	 */
	get hasFocus(): Promise<any> {
		const selected: HTMLElement[] = this.toArray;
		const selector = Fuxcel.pointerIsTouch ? ':focus' : ':hover';
		
		return new Promise(async resolve => {
			await selected.forEach((element: HTMLElement) => resolve(fx(element).matchSelector(selector)));
		});
	}
	
	 /**
	 * Returns the Inner HTML value of the given element.
	 */
	get innerHTML(): string {
		const selected: HTMLElement[] = this.toArray;
		return selected[0].innerHTML;
	}
	
	/**
	 * Returns the Outer HTML value of the given element.
	 */
	get outerHTML(): string {
		const selected: HTMLElement[] = this.toArray;
		return selected[0].outerHTML;
	}
	
	/**
	 * Returns a new instance of the Form Validator.
	 */
	get formValidator(): FuxcelValidator {
		return new FuxcelValidator(this);
	}
	
	/**
	 * Get the Plugin path.
	 */
	static get path() {
		return Fuxcel.pluginPath.replace(/\/$/, '');
	}
	
	/**
	 * Set the Plugin path globally.
	 *
	 * @param path {string} the relative path.
	 */
	static set path(path: string) {
		Fuxcel.pluginPath = path;
	}
	
	/**
	 * Add class(es) to the classlist of the selected element.
	 *
	 * @param tokenList
	 */
	putClass(...tokenList: string[]): Fuxcel {
		const selected: HTMLElement[] = this.toArray;
		selected.forEach((element: HTMLElement) => tokenList.forEach(token => element.classList.add(token)));
		return this;
	}
	
	/**
	 * Replace an existing class with the given class
	 *
	 * _Add the new class old class if not found._
	 *
	 * @param oldToken {string} Old class token.
	 * @param newToken {string} New class token.
	 */
	replaceClass(oldToken: string, newToken: string): Fuxcel {
		const selected: HTMLElement[] = this.toArray;
		selected.forEach((element: HTMLElement) => (element.classList.contains(oldToken) ?
				element.classList.replace(oldToken, newToken) :
				element.classList.add(newToken)
		));
		return this;
	}
	
	/**
	 * Removes the given class(es) from the classlist of the given element.
	 *
	 * @param tokenList
	 */
	removeClass(...tokenList: string[]): Fuxcel {
		const selected: HTMLElement[] = this.toArray;
		selected.forEach((element: HTMLElement) => tokenList.forEach(token => element.classList.remove(token)));
		return this;
	}
	
	/**
	 *
	 *
	 * @param name {string|Object}
	 * @param value {string|null}
	 * @return {Fuxcel|string}
	 */
	attrib<T extends string | object, U extends string | null = null>(name: T, value?: U): FuxcelOrString<T, U> {
		const selected: HTMLElement[] = this.toArray;
		
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
	dataAttrib<T extends string | object, U extends string | null = null>(name: T, value?: U): FuxcelOrString<T, U> {
		const selected: HTMLElement[] = this.toArray;
		const formattedName: string = this.#_formatDataAttrib(<string>name);
		
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
	prop<T extends string | object, U extends boolean | string | null>(name: T, value?: U): FuxcelOrString<T, U> {
		const selected: HTMLElement[] = this.toArray;
		
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
	style<T extends string | object, U extends string | null>(name: T, value?: U): FuxcelOrString<T, U> {
		const selected: HTMLElement[] = this.toArray;
		
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
	listAttrib(): object {
		const selected: HTMLElement[] = this.toArray;
		const list = {};
		// @ts-ignore
		Array.from(selected[0].attributes).forEach(attrib => list[attrib.name] = attrib.value);
		return list;
	}
	
	/**
	 * @return Object
	 */
	listProp(): object {
		const selected: HTMLElement[] = this.toArray;
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
	removeAttrib(...name: string[]): Fuxcel {
		const selected: HTMLElement[] = this.toArray;
		selected.length && name.length && selected.forEach((element: HTMLElement) => name.forEach(attr => element.removeAttribute(attr)));
		return this;
	}
	
	/**
	 *
	 * @param name {string[]}
	 * @return Fuxcel
	 */
	removeDataAttrib(...name: string[]): Fuxcel {
		const selected: HTMLElement[] = this.toArray;
		selected.length && name.length && selected.forEach((element: HTMLElement) => name.forEach(value => {
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
	removeProp(...name: string[]): Fuxcel {
		const selected: HTMLElement[] = this.toArray;
		// @ts-ignore
		selected.length && name.length && selected.forEach((element: HTMLElement) => name.forEach(prop => element[prop] = null));
		return this;
	}
	
	children(selector: Selector = null): Fuxcel {
		const selected: HTMLElement[] = this.toArray;
		const children: HTMLElement[] = [];
		
		// @ts-ignore
		Array.from(selected[0].children).forEach((child: HTMLElement) => {
			if (isString(selector)) {
				if (fx(child).matchSelector(selector))
					children.push(child);
			} else
				children.push(child);
		});
		return fx(children).#_setPrev(this);
	}
	
	descendants(selector: Selector = null): Fuxcel {
		const selected: HTMLElement[] = this.toArray;
		const descendants: HTMLElement[] = [];
		
		fx('*', selected[0]).toArray.forEach((descendant: HTMLElement) => {
			if (isString(selector)) {
				if (fx(descendant).matchSelector(selector))
					descendants.push(descendant);
			} else
				descendants.push(descendant);
		});
		return fx(descendants).#_setPrev(this);
	}
	
	parents(selector: Selector = null): Fuxcel {
		const selected: HTMLElement[] = this.toArray;
		const parents: HTMLElement[] = [];
		let parentNode = selected[0].parentNode;
		// @ts-ignore
		
		while (parentNode) {
			if (isString(selector)) {
				if (fx(parentNode).matchSelector(selector)) {
					parents.push(<HTMLElement>parentNode);
					break;
				}
			} else {
				if (parentNode !== selected[0])
					parents.push(<HTMLElement>parentNode);
			}
			parentNode = parentNode.parentNode;
		}
		return fx(parents).#_setPrev(this);
	}
	
	/**
	 *
	 * @param selector {Selector}
	 */
	prevSiblings(selector: Selector = null): Fuxcel {
		const selected: HTMLElement[] = this.toArray;
		const prevSiblings: HTMLElement[] = [];
		let prevElemSibling = selected[0].previousElementSibling;
		
		while (prevElemSibling) {
			if (isString(selector)) {
				if (fx(prevElemSibling).matchSelector(selector)) {
					prevSiblings.push(<HTMLElement>prevElemSibling);
					break;
				}
			} else {
				if (prevElemSibling !== selected[0])
					prevSiblings.push(<HTMLElement>prevElemSibling);
			}
			prevElemSibling = prevElemSibling.previousElementSibling;
		}
		return fx(prevSiblings).#_setPrev(this);
	}
	
	/**
	 *
	 * @param selector
	 */
	siblings(selector: Selector = null): Fuxcel {
		const selected: HTMLElement[] = this.toArray;
		const siblings: HTMLElement[] = [];
		
		// @ts-ignore
		Array.from(selected[0].parentNode.children).forEach((sibling: HTMLElement) => {
			if (isString(selector)) {
				if (fx(sibling).matchSelector(selector) && sibling !== selected[0])
					siblings.push(sibling)
			} else {
				if (sibling !== selected[0])
					siblings.push(sibling)
			}
		});
		return fx(siblings).#_setPrev(this);
	}
	
	hasScrollBar(direction: string = 'vertical'): boolean {
		const selected: HTMLElement[] = this.toArray;
		let scrollType: { vertical: string, horizontal: string } = {vertical: 'scrollHeight', horizontal: 'scrollWidth'},
			clientType: { vertical: string, horizontal: string } = {vertical: 'clientHeight', horizontal: 'clientWidth'};
		
		// @ts-ignore
		if (isString(direction) && scrollType[direction])
			// @ts-ignore
			return selected[0][scrollType[direction]] > selected[0][clientType[direction]]
		throw (`Function \`asScrollBar()\` expects 1 argument. 0 given.`);
	}
	
	insertHTML(value: string, position: StringOrNull = null): Fuxcel {
		const selected: HTMLElement[] = this.toArray;
		const positions: { affix: string, prefix: string, postfix: string, suffix: string } = {
			affix: 'beforebegin',
			prefix: 'afterbegin',
			postfix: 'afterend',
			suffix: 'beforeend'
		}
		
		// @ts-ignore
		if (isString(position) && !positions[position])
			throw (`Invalid position option given. Valid position options:\n'affix',\n'prefix',\n'postfix',\n'suffix'`);
		
		// @ts-ignore
		selected.forEach((element: HTMLElement) => isString(position) ? element.insertAdjacentHTML(positions[position], value) : element.innerHTML = value);
		return this
	}
	
	/**
	 *
	 * @param tagName {string}
	 */
	isElement(tagName: string): boolean {
		const selected: HTMLElement[] = this.toArray;
		if (isString(tagName))
			return selected[0].tagName.toLowerCase() === tagName.toLowerCase();
		throw (`Function \`matchSelector()\` expects 1 string argument. 0 given`);
	}
	
	/**
	 *
	 * @param selector {Selector}
	 */
	matchSelector(selector: Selector): boolean {
		const selected: HTMLElement[] = this.toArray;
		if (isString(selector))
			return (selected[0].matches || selected[0].webkitMatchesSelector).call(selected[0], <string>selector);
		throw (`Function \`matchSelector()\` expects 1 argument. 0 given`);
	}
	
	/*#_handleEvent(element: HTMLElement, listener: Function, event: string, option = true) {
		let elementHasEvent = false;
		
		// @ts-ignore
		!listenerObject[event] && (listenerObject[event] = {});
		
		// @ts-ignore
		const lastKeyIndex = Object.keys(listenerObject[event]).length - 1;
		// @ts-ignore
		const lastKey = lastKeyIndex === -1 ? -1 : parseInt(Object.keys(listenerObject[event])[lastKeyIndex]);
		const nextKey = lastKey + 1;
		
		// @ts-ignore
		Object.keys(listenerObject[event]).length && (elementHasEvent = !!Object.keys(listenerObject[event]).filter(key => listenerObject[event][key]['element'] === element).length);
		// @ts-ignore
		!elementHasEvent && (listenerObject[event][nextKey] = {element: element, listener: listener, event: event, option: option});
		
		// @ts-ignore
		element.addEventListener(event, listener, option);
		// @ts-ignore
		// element.removeEventListener(event, listener, option);
		
		if (Object.keys(listenerObjectRemoveList).length) {
			const removeListObjectKeys = Object.keys(listenerObjectRemoveList);
			
			removeListObjectKeys.forEach(key => {
				if (element === listenerObjectRemoveList[key]['element'])
					if (listenerObjectRemoveList[key]['event']) {
						console.log(event)
					} else {
						const addedListObjectKeys = Object.keys(listenerObject);
						
						if (addedListObjectKeys.length) {
							addedListObjectKeys.forEach(key => {
								Object.keys(listenerObject[key]).forEach(listKey => {
									const listObject = listenerObject[key][listKey];
									
									if (element === listObject['element'] && event === listObject['event']) {
										element.removeEventListener(event, listener, option)
										console.log(listObject['listener'])
										console.log(listener)
									}
								});
							})
						}
					}
			});
		}
		// return listener;
	}*/
	
	off(event?: string): Fuxcel
	off(event?: StringOrNull): Fuxcel {
		const selected: HTMLElement[] = this.toArray;
		
		selected.forEach((element: HTMLElement) => {
			// @ts-ignore
			(element.listeners) && element.listeners.forEach((listener: { event: string, listener: any, option: any }, index) => {
				if (isString(event)) {
					if (listener.event.toLowerCase() === event?.toLowerCase()) {
						element.removeEventListener(listener.event, listener.listener, listener.option)
						// @ts-ignore
						element.listeners.splice(index, 1);
					}
				} else {
					element.removeEventListener(listener.event, listener.listener, listener.option)
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
	
	upon(events: string, listener: Function, option?: boolean): Fuxcel
	upon(events: object, listener?: Function | boolean, option?: boolean): Fuxcel
	upon(events: string | object, listener?: Function | boolean, option: boolean = true): Fuxcel {
		const selected: HTMLElement[] = this.toArray;
		
		if (isObject(events) && listener === undefined)
			listener = true;
		
		selected.forEach((element: HTMLElement) => {
			// @ts-ignore
			if (!element.listeners)
				// @ts-ignore
				element.listeners = [];
			
			if (isObject(events))
				Object.keys(events).forEach(event => {
					// @ts-ignore
					element.addEventListener(event, events[event], listener)
					// @ts-ignore
					element.listeners.push({element: element, listener: events[event], event: event, option: listener});
				});
			else {
				// @ts-ignore
				element.addEventListener(events, listener, option);
				// @ts-ignore
				element.listeners.push({element: element, listener: listener, event: events, option: option});
			}
		});
		return this;
	}
	
	value(): string | null;
	value(value: string): Fuxcel;
	value(value: StringOrNull = null): Fuxcel | string | null {
		const selected: HTMLElement[] = this.toArray;
		
		if (value) {
			// @ts-ignore
			selected.forEach((element: HTMLElement) => element.value = value);
			return this;
		}
		// @ts-ignore
		return selected[0].value;
	}
	
	formSubmit() {
	}
}

class FuxcelValidator extends Fuxcel implements FuxcelValidatorInterface {
	#_fxValidatorConfig: ValidatorConfigObject = FuxcelValidator.defaultValidatorConfig;
	#_initSteps: boolean = false;
	
	static #_defaultConfig: ValidatorConfigObject = {
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
	}
	
	static #_stepsClass: string = '.fx-step';
	static #_validatorErrorBag: object = {};
	static #_validatorErrorCount: object = {};
	
	constructor(selector: string | Iterable<any> | any, context?: string | Iterable<any> | any) {
		super(selector, context);
	}
	
	static #_toggleValidationIcons(oldIcon: string, newIcon: string) {
		const _oldIcon: Fuxcel = fx(oldIcon);
		const _newIcon: Fuxcel = fx(newIcon);
		
		if (_oldIcon.length && _newIcon.length) {
			if (_oldIcon.style('display') !== 'none')
				_oldIcon.style({animation: 'fadeOut 500ms linear', display: 'none'});
			_newIcon.style({display: 'inline-block', animation: 'fadeIn 500ms linear'});
		}
	}
	
	#_initValidateForms(forms: HTMLElement[]): FuxcelValidator {
		forms.forEach((form: HTMLElement, index) => {
			const that = this;
			const configObject = this.validatorConfig;
			const _currentForm = fx(form).formValidator;
			
			if (!_currentForm.attrib('id'))
				_currentForm.attrib({id: `current-form-${index}`});
			
			let formId = _currentForm.attrib('id'),
				formGroups = fx(`#${formId} .form-group`).formValidator;
			
			// @ts-ignore
			FuxcelValidator.#_validatorErrorBag[formId] = {};
			// @ts-ignore
			FuxcelValidator.#_validatorErrorCount[formId] = 0;
			
			configObject.config.nativeValidation ? _currentForm.prop({noValidate: false}) : _currentForm.prop({noValidate: true});
			
			if (formGroups.length)
				formGroups.toArray.forEach((formGroup: HTMLElement) => {
					const _fieldElement = fx('.form-field', formGroup).formValidator;
					const _labelElement = fx('label', formGroup).formValidator;
					
					if (_fieldElement.length && _labelElement.length) {
						if (_fieldElement.length < 2 && _labelElement.length < 2) {
							if (!_fieldElement.attrib('id'))
								if (_fieldElement.attrib('name'))
									_fieldElement.attrib({id: _fieldElement.attrib('name').toString().replaceAll('-', '_')});
								else {
									// @ts-ignore
									console.error(`${_fieldElement[0].tagName} element has no \`id\` or \`name\` attribute`, _fieldElement);
									throw (`Field element does not have an \`id\` or \`name\` attribute`);
								}
							
							const fieldElementId: string = _fieldElement.attrib('id');
							
							if (_fieldElement.prop('tagName').toString().toLowerCase() === 'input' && !_fieldElement.attrib('placeholder'))
								// @ts-ignore
								_fieldElement.attrib({placeholder: _fieldElement.attrib('name').toString().toTitleCase().replaceAll(/[_-]/gi, ' ')});
							
							if (!_labelElement.attrib('for'))
								_labelElement.attrib('for', fieldElementId);
							
							// @ts-ignore
							const expectedFieldElement: HTMLElement = _fieldElement[0];
							// @ts-ignore
							const expectedLabelElement: HTMLElement = _labelElement[0];
							
							formGroup = this.#_placeElements(
								configObject,
								form,
								formGroup,
								expectedFieldElement,
								expectedLabelElement,
								_fieldElement
							);
							
							this.#_validate(
								that,
								formGroup,
							);
						}
					}
				});
			else
				console.error(`init-wrapper element not found in form: #${formId}`);
		});
		return this.#_resetFuxcelObject(fx(forms));
	}
	
	#_manipulateErrorBag(MessageOrRemove: string | boolean): void {
		const fieldAttribs = this.fieldAttributes;
		
		if (isBool(MessageOrRemove) && MessageOrRemove)
			Object.keys(FuxcelValidator.#_validatorErrorBag).length && (this.#_initSteps ?
				// @ts-ignore
				(Object.keys(FuxcelValidator.#_validatorErrorBag[fieldAttribs.formId]).length && (delete FuxcelValidator.#_validatorErrorBag[fieldAttribs.formId][this.stepFromField][fieldAttribs.id])) :
				// @ts-ignore
				delete FuxcelValidator.#_validatorErrorBag[fieldAttribs.formId][fieldAttribs.id]);
		else {
			if (isString(MessageOrRemove))
				Object.keys(FuxcelValidator.#_validatorErrorBag).length && (this.#_initSteps ?
					// @ts-ignore
					(Object.keys(FuxcelValidator.#_validatorErrorBag[fieldAttribs.formId]).length && (FuxcelValidator.#_validatorErrorBag[fieldAttribs.formId][this.stepFromField][fieldAttribs.id] = MessageOrRemove)) :
					// @ts-ignore
					FuxcelValidator.#_validatorErrorBag[fieldAttribs.formId][fieldAttribs.id] = MessageOrRemove);
		}
		
		this.#_manipulateErrorCount();
	}
	
	#_manipulateErrorCount(): void {
		const fieldAttribs = this.fieldAttributes;
		Object.keys(FuxcelValidator.#_validatorErrorCount).length && (this.#_initSteps ?
			// @ts-ignore
			(Object.keys(FuxcelValidator.#_validatorErrorCount[fieldAttribs.formId]).length && (FuxcelValidator.#_validatorErrorCount[fieldAttribs.formId][this.stepFromField] = Object.keys(FuxcelValidator.#_validatorErrorBag[fieldAttribs.formId][this.stepFromField]).length)) :
			// @ts-ignore
			FuxcelValidator.#_validatorErrorCount[fieldAttribs.formId] = Object.keys(FuxcelValidator.#_validatorErrorBag[fieldAttribs.formId]).length);
	}
	
	#_placeElements(configObject: ValidatorConfigObject, form: HTMLElement, formGroup: HTMLElement, expectedFieldElement: HTMLElement, expectedLabelElement: HTMLElement, _fieldElement: Fuxcel): HTMLElement {
		const fieldGroupId: string = `${expectedFieldElement.id}_group`;
		const validationText: HTMLDivElement = document.createElement('div');
		
		validationText.classList.add('validation-text');
		validationText.innerHTML = '<small>&nbsp;</small>';
		
		formGroup.setAttribute('id', fieldGroupId);
		
		if (configObject.config.useDefaultStyling) {
			const newInputGroup: HTMLDivElement = document.createElement('div');
			const newFormGroupWrapper: HTMLDivElement = document.createElement('div');
			const validationIcons: HTMLDivElement = document.createElement('div');
			const togglePasswordIcons: HTMLDivElement = document.createElement('div');
			const newInputGroupWrapper: HTMLDivElement = document.createElement('div');
			const newFieldGroup: HTMLDivElement = document.createElement('div');
			
			newFormGroupWrapper.classList.add('form-group-wrapper');
			newInputGroup.classList.add('input-group');
			
			formGroup.classList.add('fx-default-style');
			newInputGroupWrapper.classList.add('input-group-wrapper', 'fx-floating-label');
			newFieldGroup.classList.add('field-group');
			
			if (configObject.config.showIcons) {
				const imageCheck: HTMLImageElement = new Image();
				const imageClose: HTMLImageElement = new Image();
				
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
					const showPassword: HTMLImageElement = new Image();
					const hidePassword: HTMLImageElement = new Image();
					
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
			
			newInputGroup.append(newInputGroupWrapper)
			newFormGroupWrapper.append(newInputGroup, validationText);
			formGroup.append(newFormGroupWrapper);
			
			newFieldGroup.style.height = `${expectedFieldElement.getBoundingClientRect().height * 2}px`;
			fx(expectedLabelElement, form).style({
				height: '100%',
				display: 'flex',
				alignItems: 'center'
			});
		} else
			formGroup.append(validationText);
		validationText.setAttribute('id', `${expectedFieldElement.id}Valid`);
		return formGroup;
	}
	
	#_resetFuxcelObject(elements: Fuxcel | FuxcelBase | FuxcelValidator): FuxcelValidator {
		/*const selectedElements: any[] | NodeListOf<any> | undefined = this.toArray;*/
		const documentDOMArray: any[] = fx(document).toArray;
		
		// @ts-ignore
		Object.keys(this).forEach(key => delete this[key]);
		this.length = 0;
		this.prev = {length: 0};
		
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
	
	#_touchConfig(config: object) {
		const validatorConfigObject: ValidatorConfigObject = this.validatorConfig;
		Object.keys(validatorConfigObject).forEach((key: string) => {
			// @ts-ignore
			if (key in config && isObject(config[key])) {
				// @ts-ignore
				const validatorConfigOptionObject = validatorConfigObject[key];
				// @ts-ignore
				const configOptionObject = config[key];
				
				if (Object.keys(configOptionObject).length)
					Object.keys(validatorConfigOptionObject).forEach((optionKey: string) => {
						if (optionKey in configOptionObject)
							if (configOptionObject[optionKey] !== '' && configOptionObject[optionKey] !== null && configOptionObject[optionKey] !== undefined)
								validatorConfigOptionObject[optionKey] = configOptionObject[optionKey];
					});
			}
		});
	}
	
	/*validate(that: FuxcelValidator, formGroup: HTMLElement) {
		return this.#_validate(that, formGroup)
	}
	
	static vad(that: FuxcelValidator, formGroup: HTMLElement) {
		return new FuxcelValidator(that).#_validate(that, formGroup);
	}*/
	
	#_validate(that: FuxcelValidator, formGroup: HTMLElement) {
		const inputElement = 'input.form-field', selectElement = 'select.form-field', textAreaElement = 'textarea.form-field';
		const configObject: ValidatorConfigObject = that.#_fxValidatorConfig;
		
		let refillRequired: boolean,
			passwordToggle = FuxcelValidator.passwordTogglerIconClass,
			_inputElement = fx(inputElement, formGroup),
			_selectElement = fx(selectElement, formGroup),
			_textAreaElement = fx(textAreaElement, formGroup),
			_element = that.#_resetFuxcelObject(_inputElement.length ? _inputElement : (_selectElement.length ? _selectElement : _textAreaElement)),
			_passwordToggle = fx(passwordToggle, formGroup),
			showPasswordToggle = `#${formGroup.id} ${passwordToggle} > .fx-show-password-icon`,
			hidePasswordToggle = `#${formGroup.id} ${passwordToggle} > .fx-hide-password-icon`;
		
		_inputElement.length && _inputElement.off().upon({
			blur: function () {
				const _input = that.#_resetFuxcelObject(fx(this));
				
				if (configObject.config.showPassword && _passwordToggle.length)
					if (_input.isPasswordField)
						_passwordToggle.hasFocus.then((focused: boolean) => {
							if (!focused && _input.value()?.length) {
								_passwordToggle.dataAttrib('require-refill', 'true')
								refillRequired = parseBool(_passwordToggle.dataAttrib('require-refill'));
								fx(`${showPasswordToggle}, ${hidePasswordToggle}`).style({animation: 'fadeOut 500ms linear', display: 'none'});
							}
						});
				// @ts-ignore
				_input.#_resetFuxcelObject(fx(_input[0].form));
			},
			focus: function () {
				const _input = that.#_resetFuxcelObject(fx(this));
				
				if (configObject.config.showPassword && _passwordToggle.length)
					if (_input.isPasswordField)
						_passwordToggle.hasFocus.then((focused: boolean) => {
							if (!focused && _input.value()?.length) {
								_passwordToggle.dataAttrib('require-refill', 'true')
								refillRequired = parseBool(_passwordToggle.dataAttrib('require-refill'));
							}
						});
				// @ts-ignore
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
						configObject.config.validateEmail ? _input.validateEmail(<RegExp>configObject.regExp.email, configObject.texts.emailFormat ?? null) : _input.toggleValidation();
					
					if (_input.isNameField)
						!configObject.config.validateName ? _input.validateName(<RegExp>configObject.regExp.name, configObject.texts.nameFormat ?? null) : _input.toggleValidation();
					
					if (_input.isPhoneField)
						configObject.config.validatePhone ? _input.validatePhone(<RegExp>configObject.regExp.phone, configObject.texts.phoneFormat ?? null) : _input.toggleValidation();
					
					if (_input.isUsernameField)
						configObject.config.validateUsername ? _input.validateUsername(<RegExp>configObject.regExp.username, configObject.texts.usernameFormat ?? null) : _input.toggleValidation();
					
					if (configObject.config.validateCard) {
						if (elementId?.includes('card_cvv') || fxRole?.includes('card_cvv') || fxId?.includes('card_cvv'))
							_input.validateCardCVV(<RegExp>configObject.regExp.cardCVV);
						if (elementId?.includes('card_number') || fxRole?.includes('card_number') || fxId?.includes('card_number'))
							_input.validateCardCVV(<RegExp>configObject.regExp.cardNumber);
					} else {
						if ((elementId?.includes('card_cvv') || fxRole?.includes('card_cvv') || fxId?.includes('card_cvv')) || (elementId?.includes('card_number') || fxRole?.includes('card_number') || fxId?.includes('card_number')))
							_input.toggleValidation();
					}
					filterFieldType.has(elementType) && elementType !== 'email' && _input.validateField();
				}
				// @ts-ignore
				_input.#_resetFuxcelObject(fx(_input[0].form))
			},
			keyup: function () {
				const _input = that.#_resetFuxcelObject(fx(this));
				
				if (_input.isPasswordField)
					if (_input.length)
						if (configObject.config.showPassword && _passwordToggle.length)
							if (refillRequired && !_input.value()?.length) {
								_passwordToggle.dataAttrib('require-refill', 'false');
								refillRequired = parseBool(_passwordToggle.dataAttrib('require-refill'));
							} else {
								if (!refillRequired && _input.value()?.length)
									if (_input.attrib('type').toLowerCase() === 'password')
										FuxcelValidator.#_toggleValidationIcons(hidePasswordToggle, showPasswordToggle);
									else
										FuxcelValidator.#_toggleValidationIcons(showPasswordToggle, hidePasswordToggle);
								else {
									refillRequired = parseBool(_passwordToggle.dataAttrib('require-refill'));
									fx(`${showPasswordToggle}, ${hidePasswordToggle}`).style({animation: 'fadeOut 500ms linear', display: 'none'});
								}
							}
				// @ts-ignore
				_input.#_resetFuxcelObject(fx(_input[0].form));
			}
		});
		
		_selectElement.length && _selectElement.off().upon('change', function () {
			// @ts-ignore
			const _element = that.#_resetFuxcelObject(fx(this));
			_element.canBeValidated && _element.validateField();
			// @ts-ignore
			_element.#_resetFuxcelObject(fx(_element[0].form));
		});
		
		_textAreaElement.length && _textAreaElement.off().upon('input', function () {
			// @ts-ignore
			const _element = that.#_resetFuxcelObject(fx(this));
			_element.canBeValidated && _element.validateField();
			// @ts-ignore
			_element.#_resetFuxcelObject(fx(_element[0].form));
		});
		
		if (_element.length) {
			const elementId = _element.attrib('id');
			// @ts-ignore
			const fieldName = _element.attrib('id').toString().toTitleCase().replaceAll(/[_-]/gi, ' ');
			
			if (_element.canBeValidated && (_element.isElement('input') || _element.isElement('select') || _element.isElement('textarea')))
				if (_element.isElement('input')) {
					const elementType = _element.attrib('type') && _element.attrib('type').toLowerCase();
					
					if (configObject.config.showPassword && _passwordToggle.length)
						_passwordToggle.off().upon('click', (e: MouseEvent) => {
							let clicked = e.target,
								_clicked = fx(clicked),
								_passwordField = fx(_element, _passwordToggle.prevSiblings('.field-group'));
							
							// @ts-ignore
							if (_clicked[0] === fx(showPasswordToggle)[0]) {
								FuxcelValidator.#_toggleValidationIcons(showPasswordToggle, hidePasswordToggle);
								_passwordField.attrib({type: 'text'});
							} else {
								FuxcelValidator.#_toggleValidationIcons(hidePasswordToggle, showPasswordToggle);
								_passwordField.attrib({type: 'password'});
							}
							// @ts-ignore
							_passwordField[0].focus({preventScroll: false});
						});
					
					if (elementType !== 'checkbox' && elementType !== 'radio') {
						this.#_manipulateErrorBag(`The ${fieldName} field is required.`);
						this.#_manipulateErrorCount();
					}
				} else {
					if (!_element.value()?.length) {
						this.#_manipulateErrorBag(`The ${fieldName} field is required.`);
						this.#_manipulateErrorCount();
					}
				}
		}
	}
	
	#_validatePasswordFields() {
		const selected: HTMLElement[] = this.toArray;
		// @ts-ignore
		const form: HTMLFormElement = selected[0].form;
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
					} else {
						if (!cpwdField.value()?.length)
							cpwdField.validateField(`The ${cpwdFieldName} field is required.`);
						else
							cpwdField.validateField();
						pwdField.validatePassword(configObject.regExp.password, configObject.texts.passwordFormat ?? null);
					}
				} else
					pwdField.validatePassword(configObject.regExp.password, configObject.texts.passwordFormat ?? null);
			} else {
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
								} else if (pwdField.value()?.length !== maxLength) {
									pwdField.validateField(`The ${pwdFieldName} field requires ${maxLength} characters.`);
									
									if (!cpwdField.value()?.length)
										cpwdField.validateField(`The ${cpwdFieldName} field is required.`);
									else
										cpwdField.validateField(`Check Password.`);
								} else {
									if (!cpwdField.value()?.length)
										cpwdField.validateField(`The ${cpwdFieldName} field is required.`);
									else
										cpwdField.validateField();
									pwdField.validateField();
								}
							} else {
								// @ts-ignore
								if (pwdField.value()?.length < minLength || pwdField.value()?.length > maxLength) {
									pwdField.validateField(`The ${pwdFieldName} field must be between ${minLength} and ${maxLength} characters.`);
									cpwdField.validateField(`Check Password.`);
								} else {
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
							} else {
								pwdField.validateField();
								cpwdField.validateField();
							}
						} else {
							if (!cpwdField.value()?.length)
								cpwdField.validateField(`The ${cpwdFieldName} field is required.`);
							else
								cpwdField.validateField();
							pwdField.validateField();
						}
					} else {
						pwdField.validateField();
						cpwdField.validateField();
					}
				} else {
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
		} else {
			console.log(this)
			this.validateField();
		}
	}
	
	get canBeValidated(): boolean {
		const selected: HTMLElement[] = this.toArray;
		return selected.length ? (this.dataAttrib('fx-validate') ? parseBool(this.dataAttrib('fx-validate')) : true) : false;
	}
	
	get errorBag(): object {
		// @ts-ignore
		return (this.length && this.isElement('form')) && Object.keys(FuxcelValidator.#_validatorErrorBag[this.attrib('id')]).length ? FuxcelValidator.#_validatorErrorBag[this.attrib('id')] : null;
	}
	
	get errorCount(): object {
		// @ts-ignore
		return (this.length && this.isElement('form')) && Object.keys(FuxcelValidator.#_validatorErrorCount).length ? FuxcelValidator.#_validatorErrorCount[this.attrib('id')] : 0;
	}
	
	get getErrors(): object | void {
		const selected: HTMLElement[] = this.toArray;
		let errors: object = {};
		
		if (selected.length > 1) {
			selected.forEach((element: HTMLElement) => {
				const _element = fx(element).formValidator;
				if (element.tagName && _element.isElement('form')) {
					// @ts-ignore
					errors[element.id] = {
						count: _element.errorCount,
						errors: _element.errorBag
					}
				}
			});
			return errors;
		}
		return this.isElement('form') ? {
			count: this.errorCount,
			errors: this.errorBag,
		} : console.error('Non form element given.');
	}
	
	
	get formFieldElements(): any {
		const selected: HTMLElement[] = this.toArray;
		if (selected.length > 1) {
			const elements = {}
			selected.forEach((element: HTMLFormElement | HTMLElement) => {
				if (fx(element).isElement('form'))
					// @ts-ignore
					elements[element.id] = <HTMLFormElement>element.elements
			});
			return elements
		}
		// @ts-ignore
		return this.isElement('form') ? selected[0].elements : console.error('Non form elements given', selected)
	}
	
	get isEmailField(): boolean {
		const attributes = this.fieldAttributes;
		return attributes.type?.includes('email') || attributes.type?.includes('email') || attributes.id?.includes('email') || attributes.fxId?.includes('email') || attributes.fxRole?.includes('email');
	}
	
	get isNameField(): boolean {
		const attributes = this.fieldAttributes;
		return !this.isUsernameField && attributes.id?.includes('name') || attributes.fxId?.includes('name') || attributes.fxRole?.includes('name');
	}
	
	get isPasswordField(): boolean {
		const passwordId = this.#_fxValidatorConfig.config.passwordId;
		const attributes = this.fieldAttributes;
		return attributes.type === 'password' || attributes.id?.includes(passwordId.toLowerCase()) || attributes.fxId?.includes(passwordId.toLowerCase()) || attributes.fxRole?.includes(passwordId.toLowerCase());
	}
	
	get isPhoneField(): boolean {
		const attributes = this.fieldAttributes;
		return attributes.type?.includes('tel') || attributes.type?.includes('phone') || attributes.id?.includes('phone') || attributes.fxId?.includes('phone') || attributes.fxRole?.includes('phone');
	}
	
	get isUsernameField(): boolean {
		const attributes = this.fieldAttributes;
		return attributes.id?.includes('username') || attributes.fxId?.includes('username') || attributes.fxRole?.includes('username');
	}
	
	get stepFromField(): number {
		if (this.#_initSteps) {
			const stepDiv = this.parents(FuxcelValidator.stepsClass);
			return parseInt(stepDiv.dataAttrib('fx-step') ?? 0);
		}
		return -1;
	}
	
	get validationProps(): ValidationProps {
		const configObject = this.#_fxValidatorConfig;
		
		const formGroup: string = configObject.config.initWrapper;
		const formId: string = `#${this.fieldAttributes.formId}`;
		const elementId: string = `#${this.fieldAttributes.id}`;
		
		if (formId)
			return {
				id: elementId,
				formGroup: `${formId} ${formGroup + elementId}_group`,
				validationField: `${formId} ${elementId}Valid`,
				validIcon: `${formId} ${formGroup + elementId}_group .validation-icons > .fx-valid-icon`,
				invalidIcon: `${formId} ${formGroup + elementId}_group .validation-icons > .fx-invalid-icon`,
				validationIconField: `${formId} ${formGroup + elementId}_group .validation-icons`,
			}
		throw ('Non-Form element given');
	}
	
	get validatorConfig(): ValidatorConfigObject {
		return this.#_fxValidatorConfig;
	}
	
	static get defaultValidatorConfig(): ValidatorConfigObject {
		return FuxcelValidator.#_defaultConfig;
	}
	
	static get passwordCapslockAlertClass() {
		return '.capslock-alert'
	}
	
	static get passwordTogglerIconClass() {
		return '.toggle-password-icons'
	}
	
	static get stepsClass() {
		return FuxcelValidator.#_stepsClass;
	}
	
	static set stepsClass(stepClass: string) {
		FuxcelValidator.#_stepsClass = stepClass;
	}
	
	init(config: Object | null = null): FuxcelValidator {
		const selected: HTMLElement[] = this.toArray;
		let forms = selected.filter((element: HTMLElement) => fx(element).isElement('form')),
			nonForms = selected.filter((element: HTMLElement) => !fx(element).isElement('form'));
		
		if (forms.length) {
			if (nonForms.length)
				console.error(`${nonForms.length} non form-element${nonForms.length === 1 ? '' : 's'} passed to validator:`, nonForms);
			config && isObject(config) && this.#_touchConfig(config);
			return this.#_initValidateForms(forms);
		} else {
			console.error(`Non form-elements passed to the validator`, nonForms);
			throw (`${nonForms.length} non form-element${nonForms.length === 1 ? '' : 's'} passed to validator.`);
		}
	}
	
	initSteps(config: Object | number | null = null): FuxcelSteps {
		const selected: HTMLElement[] = this.toArray;
		const forms = selected.filter((element: HTMLElement) => fx(element).isElement('form'));
		
		forms.forEach((form: HTMLElement, index) => {
			const configObject = this.validatorConfig;
			const _currentForm = fx(form).formValidator;
			
			if (!_currentForm.attrib('id'))
				_currentForm.attrib({id: `current-form-${index}`});
			
			let formId = _currentForm.attrib('id'),
				formSteps = fx(`#${formId} ${FuxcelValidator.stepsClass}`).formValidator;
			
			
			if (formSteps.length) {
				// @ts-ignore
				FuxcelValidator.#_validatorErrorBag[formId] = {};
				// @ts-ignore
				FuxcelValidator.#_validatorErrorCount[formId] = {};
				
				this.#_initSteps = true;
				configObject.config.nativeValidation ? _currentForm.prop({noValidate: false}) : _currentForm.prop({noValidate: true});
				
				formSteps.toArray.forEach((step: HTMLElement) => {
					step.dataset.fxStep = <string>step.dataset.fxStep;
					const stepIndex = parseInt(step.dataset.fxStep);
					const formGroups = fx(`.form-group`, step).formValidator;
					
					// @ts-ignore
					FuxcelValidator.#_validatorErrorBag[formId][stepIndex] = {};
					// @ts-ignore
					FuxcelValidator.#_validatorErrorCount[formId][stepIndex] = 0;
					
					if (formGroups.length) {
						const inputElement = 'input.form-field', selectElement = 'select.form-field', textAreaElement = 'textarea.form-field';
						
						formGroups.toArray.forEach((formGroup: HTMLElement) => {
							const _fieldElement = fx(`${inputElement}, ${selectElement}, ${textAreaElement}`, formGroup).formValidator;
							const _labelElement = fx('label', formGroup).formValidator;
							
							if (_fieldElement.length && _labelElement.length) {
								if (_fieldElement.length < 2 && _labelElement.length < 2) {
									if (!_fieldElement.attrib('id'))
										if (_fieldElement.attrib('name'))
											_fieldElement.attrib({id: _fieldElement.attrib('name').toString().replaceAll('-', '_')});
										else {
											// @ts-ignore
											console.error(`${_fieldElement[0].tagName} element has no \`id\` or \`name\` attribute`, _fieldElement);
											throw (`Field element does not have an \`id\` or \`name\` attribute`);
										}
									
									const fieldElementId: string = _fieldElement.attrib('id');
									if (_fieldElement.prop('tagName').toString().toLowerCase() === 'input' && !_fieldElement.attrib('placeholder'))
										// @ts-ignore
										_fieldElement.attrib({placeholder: _fieldElement.attrib('name').toString().toTitleCase().replaceAll(/[_-]/gi, ' ')});
									
									if (!_labelElement.attrib('for'))
										_labelElement.attrib('for', fieldElementId);
									
									// @ts-ignore
									const expectedFieldElement: HTMLElement = _fieldElement[0];
									// @ts-ignore
									const expectedLabelElement: HTMLElement = _labelElement[0];
									
									this.#_placeElements(
										configObject,
										form,
										formGroup,
										expectedFieldElement,
										expectedLabelElement,
										_fieldElement
									);
									
									this.#_validate(
										this,
										formGroup,
									);
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
	
	renderMessage(message: StringOrNull = null, renderType: StringOrNull = null): FuxcelValidator {
		this.insertHTML(`<small ${renderType ? 'class="' + renderType + '"' : ''}>${message ?? '&nbsp;'}</small>`);
		return this;
	}
	
	renderValidationErrors(errors: object, message: StringOrNull = null, callbackFn: Function | null = null): void {
		const selected: FuxcelValidator = this;
		// @ts-ignore
		const target: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement = selected[0];
		
		if (selected.isElement('form')) {
			const fieldElements = this.formFieldElements;
			if (isObject(errors))
				Object.keys(errors).forEach((elementId: string) => {
					// @ts-ignore
					const fieldName = elementId.toString().toTitleCase();
					const element: FuxcelValidator = fx(`#${elementId}`).formValidator;
					// @ts-ignore
					if (elementId in fieldElements && (isString(errors[elementId]) && errors[elementId] !== undefined))
						// @ts-ignore
						element.validateField(errors[elementId], true);
					else {
						// @ts-ignore
						if (isString(errors[elementId]) && errors[elementId] !== undefined)
							element.validateField(`Verify ${fieldName} and try again.`, true);
					}
				});
		}
	}
	
	showError(message: StringOrNull = null): void {
		const fieldAttribs = this.fieldAttributes;
		const validationProps = this.validationProps;
		
		// @ts-ignore
		const finalMessage: string = message ?? `The ${fieldAttribs.id?.toString().toTitleCase().replaceAll(/[_-]/gi, ' ')} field is required`;
		
		this.#_manipulateErrorBag(finalMessage);
		this.#_fxValidatorConfig.config.showIcons && FuxcelValidator.#_toggleValidationIcons(validationProps.validIcon, validationProps.invalidIcon);
		
		fx(validationProps.validationField).formValidator.renderMessage(finalMessage ?? null);
		
		if (this.#_fxValidatorConfig.config.useDefaultStyling)
			fx(`${validationProps.formGroup} .form-group-wrapper`).replaceClass('fx-valid-success', 'fx-valid-error');
		else
			fx(validationProps.formGroup).replaceClass('fx-valid-success', 'fx-valid-error');
		this.#_manipulateErrorCount();
	}
	
	showSuccess(message: StringOrNull = null): void {
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
	
	toggleValidation(): FuxcelValidator {
		return this.canBeValidated ? this.validateField() : this.undoValidation();
	}
	
	undoValidation(destroyValidation: boolean = false): FuxcelValidator {
		const selected: FuxcelValidator = this;
		const fieldAttribs = selected.fieldAttributes;
		const validationProps = selected.validationProps;
		
		if (destroyValidation) {
			// @ts-ignore
			delete FuxcelValidator.#_validatorErrorBag[fieldAttribs.formId][fieldAttribs.id];
			// @ts-ignore
			FuxcelValidator.#_validatorErrorCount[fieldAttribs.formId] = Object.keys(FuxcelValidator.#_validatorErrorCount[fieldAttribs.formId]).length
		}
		
		if (selected.#_fxValidatorConfig.config.useDefaultStyling)
			fx(`${validationProps.formGroup} .form-group-wrapper`).removeClass('fx-valid-error', 'fx-valid-success');
		else
			fx(validationProps.formGroup).removeClass('fx-valid-error', 'fx-valid-success');
		return this;
	}
	
	stepErrorBag(step: number | string): object {
		// @ts-ignore
		return (this.length && this.isElement('form')) && Object.keys(FuxcelValidator.#_validatorErrorBag[this.attrib('id')][step]) ? FuxcelValidator.#_validatorErrorBag[this.attrib('id')][step] : null;
	}
	
	stepErrorCount(step: number | string): number {
		// @ts-ignore
		return (this.length && this.isElement('form')) && Object.keys(FuxcelValidator.#_validatorErrorCount[this.attrib('id')][step]) ? FuxcelValidator.#_validatorErrorCount[this.attrib('id')][step] : 0;
	}
	
	validateCardCVV(regExp: RegExp, customFormatEx: StringOrNull = null): FuxcelValidator {
		return this.validateRegex(regExp, `Invalid CVV.`);
	}
	
	validateCardNumber(regExp: RegExp, customFormatEx: StringOrNull = null): FuxcelValidator {
		const selected: HTMLElement[] = this.toArray;
		// @ts-ignore
		const value: string = selected[0].value;
		
		return this.validateRegex(() => value.length ? (value.match(regExp) ?
			(passLuhnAlgo(selected[0]) ? this.validateField() : this.validateField('Check Card Number and try again.', true)) :
			this.validateField(`${customFormatEx ?? 'Only numbers are allowed.'}`)) : this.toggleValidation());
	}
	
	validateEmail(regExp: RegExp, customFormatEx: StringOrNull = null): FuxcelValidator {
		return this.validateRegex(regExp, `Invalid E-Mail format: (eg. ${customFormatEx ?? 'johndoe@email.com'})`);
	}
	
	validateField(message: StringOrNull = null, isError: boolean = false): FuxcelValidator {
		const selected: FuxcelValidator = this;
		const fieldAttribs = selected.fieldAttributes;
		const configObject = this.#_fxValidatorConfig.config;
		// @ts-ignore
		const target: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement = selected[0];
		
		let fieldValue = target.value,
			minLength = parseInt(selected.attrib('minlength') ?? 0),
			fieldName = fieldAttribs.id.toString().toTitleCase().replaceAll(/[_-]/gi, ' '),
			finalMessage = minLength ?
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
	
	validateName(regExp: RegExp, customFormatEx: StringOrNull = null): FuxcelValidator {
		return this.validateRegex(regExp, `Invalid Name format: (eg. ${customFormatEx ?? 'john doe, john doe woods'})`);
	}
	
	validatePassword(regExp: RegExp, customFormatEx: StringOrNull = null): FuxcelValidator {
		return this.validateRegex(regExp, `Invalid Password format: (${customFormatEx ?? 'Password requires a minimum of 8 characters an must contain at least 1 uppercase and 1 special character'})`);
	}
	
	validatePhone(regExp: RegExp, customFormatEx: StringOrNull = null): FuxcelValidator {
		return this.validateRegex(regExp, `Invalid Phone format: (eg. ${customFormatEx ?? '+234 8156547099, +1 104 2198'})`);
	}
	
	validateRegex(regExpOrFn: Function): FuxcelValidator
	validateRegex(regExpOrFn: RegExp, message: string): FuxcelValidator
	validateRegex(regExpOrFn: Function | RegExp, message ?: StringOrNull): FuxcelValidator {
		const selected: HTMLElement[] = this.toArray;
		// @ts-ignore
		const value: string = selected[0].value;
		
		// @ts-ignore
		(regExpOrFn && isFunction(regExpOrFn)) ? regExpOrFn(this) :
			// @ts-ignore
			(regExpOrFn && isString(message) ? ((value.length) ? (value.match(regExpOrFn) ? this.validateField() : this.validateField(message, true)) : this.validateField()) : console.error('Function \`validateRegex()\` expects 2 arguments.'));
		return this;
	}
	
	validateUsername(regExp: RegExp, customFormatEx: StringOrNull = null): FuxcelValidator {
		const selected: HTMLElement[] = this.toArray;
		// @ts-ignore
		const value: string = selected[0].value;
		const minLength = parseInt(this.attrib('minlength') ?? 2);
		// @ts-ignore
		const fieldName = selected[0].id.toString().toTitleCase().replaceAll(/[_-]/gi, ' ');
		
		return this.validateRegex(() => value.length ? (value.length > minLength ?
			(value.match(regExp) ? this.validateField() : this.validateField(`Invalid Username format: (${customFormatEx ?? 'Username must start and end with an alphabet, and can only contain alphabets and underscores.'})`)) :
			this.validateField(customFormatEx ?? `The ${fieldName} requires a minimum of 3 characters.`)) : this.toggleValidation());
	}
}

class FuxcelSteps extends FuxcelValidator implements FuxcelStepsInterface {
	readonly #that: FuxcelValidator;
	static currentlySelected: object = {};
	
	constructor(selected: FuxcelValidator) {
		super(selected);
		this.#that = selected;
		return this;
	}
	
	get context(): FuxcelSteps {
		return new FuxcelSteps(<any>FuxcelSteps.currentlySelected);
	}
	
	get formSteps(): object | (number | string)[] {
		const steps: (number | string)[] = [];
		
		if (this.length > 1) {
			const allSteps = {};
			this.toArray.forEach((element: HTMLElement) => {
				if (fx(element).isElement('form')) {
					// @ts-ignore
					allSteps[element.id] = [];
					const stepDivs: Fuxcel = fx(FuxcelValidator.stepsClass, element);
					
					stepDivs.length && stepDivs.toArray.forEach((stepDiv: HTMLElement) => {
						const step = stepDiv.dataset.fxStep;
						// @ts-ignore
						isString(step) && step !== undefined && (allSteps[element.id]).push(step)
					});
				}
			});
			return allSteps;
		}
		
		if (this.isElement('form')) {
			const stepDivs: Fuxcel = fx(FuxcelValidator.stepsClass, this);
			
			stepDivs.length && stepDivs.toArray.forEach((stepDiv: HTMLElement) => {
				const step = stepDiv.dataset.fxStep;
				isString(step) && step !== undefined && steps.push(step);
			});
		}
		return steps;
	}
	
	stepErrors(step: number | string | null = null): object | void {
		const selected: HTMLElement[] = this.context.toArray;
		let errors: object = {};
		
		if (selected.length > 1 && step === null) {
			selected.forEach((element: HTMLElement) => {
				// @ts-ignore
				const _element = new FuxcelSteps(element);
				if (element.tagName && _element.isElement('form')) {
					// @ts-ignore
					errors[element.id] = {};
					const steps = <(number | string)[]>_element.formSteps;
					if (steps.length) {
						steps.forEach(step => {
							// @ts-ignore
							errors[element.id][step] = {
								count: _element.stepErrorCount(step),
								errors: _element.stepErrorBag(step)
							}
						});
					}
				}
			});
			return errors;
		}
		
		return this.context.isElement('form') ? {
			count: this.context.stepErrorCount(<string | number>step),
			errors: this.context.stepErrorBag(<string | number>step),
		} : console.error('Non form element given.');
	}
}
