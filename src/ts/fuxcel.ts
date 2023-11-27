const fxModalCancelButtonClick = new Event('click');
const fxModalShowEvent = new CustomEvent('fx.modal.show', {
	bubbles: true,
	detail: {
		plugins: 'Fuxcel',
		interface: 'FuxcelModalInterface'
	},
	
});
const fxModalHideEvent = new CustomEvent('fx.modal.hide', {
	bubbles: true,
	detail: {
		plugins: 'Fuxcel',
		interface: 'FuxcelModalInterface'
	},
});

const animations = ({timeout = 300, iterations = 1}) => {
	return {
		fadeIn: {
			name: 'fadein',
			onBegin: {display: 'unset'},
			onFinished: {},
			options: {
				keyFrames: [{opacity: 0, display: 'none'}, {opacity: 1, display: 'inline-block'}],
				timing: {duration: timeout, iterations: iterations}
			}
		},
		fadeOut: {
			name: 'fadeout',
			onBegin: {display: ''},
			onFinished: {display: 'none'},
			options: {
				keyFrames: [{opacity: 1, display: 'inline-block'}, {opacity: 0, display: 'none'}],
				timing: {duration: timeout, iterations: iterations}
			}
		},
		slideInDown: {
			name: 'slideindown',
			onBegin: {display: ''},
			onFinished: {},
			options: {
				keyFrames: [{transform: 'translate3d(0, 100%, 0)', visibility: 'hidden'}, {transform: 'translate3d(0, 0, 0)', visibility: 'visible'}],
				timing: {duration: timeout, iterations: iterations}
			},
		},
		slideOutDown: {
			name: 'slideoutdown',
			onBegin: {display: ''},
			onFinished: {display: 'none'},
			options: {
				keyFrames: [{transform: 'translate3d(0, 0, 0)', visibility: 'visible'}, {transform: 'translate3d(0, 100%, 0)', visibility: 'hidden'}],
				timing: {duration: timeout, iterations: iterations}
			}
		},
		slideOutUp: {
			name: 'slideoutup',
			onBegin: {display: ''},
			onFinished: {display: 'none'},
			options: {
				keyFrames: [{transform: 'translate3d(0, 0, 0)', visibility: 'visible'}, {transform: 'translate3d(0, -100%, 0)', visibility: 'hidden'}],
				timing: {duration: timeout, iterations: iterations}
			}
		},
	}
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
	
	valueSplit.forEach((word: string) => {
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
	 * @return {ElementReturn} Returns HTML Element(s) wrapped in an array.
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
			'fuxcelmodal',
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
	static #_pluginPath: string = './';
	
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
		const selected: ElementReturn = this.toArray;
		
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
		const selected: ElementReturn = this.toArray;
		
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
		const selected: ElementReturn = this.toArray;
		
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
		const selected: ElementReturn = this.toArray;
		
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
	 *
	 * @param animation
	 * @private
	 * @return {Promise<Fuxcel>}
	 */
	#_animate(animation: FXAnimation): Promise<Fuxcel> {
		const selected: ElementReturn = <HTMLElement[]>this.toArray;
		return new Promise(resolve => selected.forEach((element: HTMLElement) => {
			Object.keys(animation.onBegin).length && fx(element).style(animation.onBegin);
			element.animate(animation.options.keyFrames, animation.options.timing).finished.then(() => {
				Object.keys(animation.onFinished).length && fx(element).style(animation.onFinished)
				resolve(this);
			});
		}));
	}
	
	/**
	 *
	 * @param timeout
	 * @return {Promise<Fuxcel>}
	 */
	fadeout(timeout: number = 300): Promise<Fuxcel> {
		const animation: FXAnimation = animations({timeout: timeout}).fadeOut;
		return this.#_animate(animation);
	}
	
	/**
	 *
	 * @param timeout
	 * @return {Promise<Fuxcel>}
	 */
	fadein(timeout: number = 300): Promise<Fuxcel> {
		const animation: FXAnimation = animations({timeout: timeout}).fadeIn;
		return this.#_animate(animation);
	}
	
	/**
	 *
	 * @param timeout
	 * @return {Promise<Fuxcel>}
	 */
	slideindown(timeout: number = 300): Promise<Fuxcel> {
		const animation: FXAnimation = animations({timeout: timeout}).slideInDown;
		return this.#_animate(animation);
	}
	
	/**
	 *
	 * @param timeout
	 * @return {Promise<Fuxcel>}
	 */
	slideoutdown(timeout: number = 300): Promise<Fuxcel> {
		const animation: FXAnimation = animations({timeout: timeout}).slideOutDown;
		return this.#_animate(animation);
	}
	
	/**
	 *
	 * @param timeout
	 * @return {Promise<Fuxcel>}
	 */
	slideoutup(timeout: number = 300): Promise<Fuxcel> {
		const animation: FXAnimation = animations({timeout: timeout}).slideOutUp;
		return this.#_animate(animation);
	}
	
	/**
	 * Returns the class list of an element
	 */
	get classes(): DOMTokenList {
		const selected: ElementReturn = <HTMLElement[]>this.toArray;
		return selected[0].classList
	}
	
	/**
	 *  Return true if the given element has the mouse focus; false otherwise.
	 */
	get hasFocus(): Promise<any> {
		const selected: ElementReturn = this.toArray;
		const selector = Fuxcel.pointerIsTouch ? ':focus' : ':hover';
		
		return new Promise(async resolve => {
			await selected.forEach((element: HTMLElement) => resolve(fx(element).matchSelector(selector)));
		});
	}
	
	/**
	 * Returns the Inner HTML value of the given element.
	 */
	get innerHTML(): string {
		const selected: ElementReturn = <HTMLElement[]>this.toArray;
		return selected[0].innerHTML;
	}
	
	/**
	 * Returns the Outer HTML value of the given element.
	 */
	get outerHTML(): string {
		const selected: ElementReturn = <HTMLElement[]>this.toArray;
		return selected[0].outerHTML;
	}
	
	/**
	 * Returns a new instance of the Fuxcel Form Validator.
	 */
	get formValidator(): FuxcelValidator {
		return new FuxcelValidator(this);
	}
	
	/**
	 * Returns a new instance of the Fuxcel Modal
	 */
	get modal(): FuxcelModal {
		return new FuxcelModal(this)
	}
	
	/**
	 * Get the Plugin path.
	 */
	static get path() {
		return Fuxcel.#_pluginPath.replace(/\/$/, '');
	}
	
	/**
	 * Set the Plugin path globally.
	 *
	 * @param path {string} the relative path.
	 */
	static set path(path: string) {
		Fuxcel.#_pluginPath = path;
	}
	
	/**
	 * Add class(es) to the classlist of the selected element.
	 *
	 * @param tokenList {string[]} Comma separated strings of class(es) to add.
	 */
	putClass(...tokenList: string[]): Fuxcel {
		const selected: ElementReturn = this.toArray;
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
		const selected: ElementReturn = this.toArray;
		selected.forEach((element: HTMLElement) => (element.classList.contains(oldToken) ?
				element.classList.replace(oldToken, newToken) :
				element.classList.add(newToken)
		));
		return this;
	}
	
	/**
	 * Removes the given class(es) from the classlist of the given element.
	 *
	 * @param tokenList {string[]} Comma separated strings of class(es) to remove.
	 */
	removeClass(...tokenList: string[]): Fuxcel {
		const selected: ElementReturn = this.toArray;
		selected.forEach((element: HTMLElement) => tokenList.forEach(token => element.classList.remove(token)));
		return this;
	}
	
	/**
	 * Get or Set the given attribute(s) for the selected element (If a String is passed to the name param).
	 *
	 * _Gets the attribute if only the name is given as a String._
	 *
	 * _Sets the attribute if name and value is given as a String._
	 *
	 * _Sets the given attributes if name is given as an Object (Key-Value Pair)._
	 *
	 * @param name {string|Object} Name of the attribute or a Key-Value pair Object.
	 * @param value {string|null = null} Value to set for the attribute; Not required if an Object is passed as an argument to the name parameter.
	 * @return {FuxcelOrString}
	 */
	attrib<T extends string | object, U extends string | null = null>(name: T, value?: U): FuxcelOrString<T, U> {
		const selected: ElementReturn = this.toArray;
		
		// @ts-ignore
		return (name && !value && isString(name)) ?
			// @ts-ignore
			selected[0].getAttribute(name) :
			// @ts-ignore
			this.#_setAttrib(name, value);
	}
	
	/**
	 * Get or Set the given [data-*] attribute(s) for the selected element (If a String is passed to the name param).
	 *
	 * _Gets the [data-*] attribute if only the name is given as a String._
	 *
	 * _Sets the [data-*] attribute if name and value is given as a String._
	 *
	 * _Sets the given [data-*] attributes if name is given as an Object (Key-Value Pair)._
	 *
	 * @param name {string|Object} Name of the [data-*] attribute or a Key-Value pair Object.
	 * @param value {string|null = null} Value to set for the [data-*] attribute; Not required if an Object is passed as an argument to the name parameter.
	 * @return {FuxcelOrString}
	 */
	dataAttrib<T extends string | object, U extends string | null = null>(name: T, value?: U): FuxcelOrString<T, U> {
		const selected: ElementReturn = <HTMLElement[]>this.toArray;
		const formattedName: string = this.#_formatDataAttrib(<string>name);
		
		// @ts-ignore
		return (name && !value && isString(name)) ?
			selected[0].dataset[formattedName] :
			// @ts-ignore
			this.#_setDataAttrib(formattedName, value);
	}
	
	/**
	 * Get or Set the given property / properties for the selected element (If a String is passed to the name param).
	 *
	 * _Gets the property if only the name is given as a String._
	 *
	 * _Sets the property if name and value is given as a String or name is a String and value is a Boolean._
	 *
	 * _Sets the given property / properties if name is given as an Object (Key-Value Pair)._
	 *
	 * @param name {string|Object} Name of the property or a Key-Value pair Object.
	 * @param value {boolean|string|null = null} Value to set for the property; Not required if an Object is passed as an argument to the name parameter.
	 * @return {FuxcelOrString}
	 */
	prop<T extends string | object, U extends boolean | string | null>(name: T, value?: U): FuxcelOrString<T, U> {
		const selected: ElementReturn = this.toArray;
		
		// @ts-ignore
		return (name && !value && isString(name)) ?
			// @ts-ignore
			selected[0][name] :
			// @ts-ignore
			this.#_setProp(name, value);
	}
	
	/**
	 * Get or set the given CSS style(s) value of the selected element (If a String is passed to the name param).
	 *
	 * _Gets the given style if only the name is given as a String._
	 *
	 * _Sets the given style if name and value is given as a String._
	 *
	 * _Sets the given styles if name is given as a plain Object (Key-Value Pair)._
	 *
	 * @param name {string|Object} Name of the style or a Key-Value pair Object.
	 * @param value {boolean|string|null = null} Value to set for the style; Not required if an Object is passed as an argument to the name parameter.
	 * @return {FuxcelOrString}
	 */
	style<T extends string | object, U extends string | null>(name: T, value?: U): FuxcelOrString<T, U> {
		const selected: ElementReturn = this.toArray;
		
		// @ts-ignore
		return (name && !value && isString(name)) ?
			// @ts-ignore
			window.getComputedStyle(selected[0]).getPropertyValue(name) :
			// @ts-ignore
			this.#_setStyle(name, value);
	}
	
	/**
	 * Returns the attributes of the selected element as on Object.
	 *
	 * @return {Object} An object containing the attributes of the selected element.
	 */
	listAttrib(): object {
		const selected: ElementReturn = this.toArray;
		const list = {};
		// @ts-ignore
		Array.from(selected[0].attributes).forEach(attrib => list[attrib.name] = attrib.value);
		return list;
	}
	
	/**
	 * Returns the properties of the selected element as on Object.
	 *
	 * @return {Object} An object containing the properties of the selected element.
	 */
	listProp(): object {
		const selected: ElementReturn = this.toArray;
		const list = {};
		// @ts-ignore
		Object.keys(selected[0]).filter(prop => Number.isNaN(parseInt(prop) && selected[0][prop])).forEach(prop => list[prop] = selected[0][prop]);
		return list;
	}
	
	/**
	 * Removes the given [data-*] attribute(s) from the selected element.
	 *
	 * @param name {string[]} Comma separated strings of [data-*] attribute(s) to remove.
	 * @return {Fuxcel} Fuxcel Object of the selected element
	 */
	removeAttrib(...name: string[]): Fuxcel {
		const selected: ElementReturn = this.toArray;
		selected.length && name.length && selected.forEach((element: HTMLElement) => name.forEach(attr => element.removeAttribute(attr)));
		return this;
	}
	
	/**
	 * Removes the given [data-*] attribute(s) from the selected element.
	 *
	 * @param name {string[]} Comma separated strings of [data-*] attribute(s) to remove.
	 * @return {Fuxcel} Fuxcel Object of the selected element
	 */
	removeDataAttrib(...name: string[]): Fuxcel {
		const selected: ElementReturn = this.toArray;
		selected.length && name.length && selected.forEach((element: HTMLElement) => name.forEach(value => {
			const dataAttr = this.#_formatDataAttrib(value);
			// @ts-ignore
			delete element.dataset[dataAttr];
		}));
		return this;
	}
	
	/**
	 * Removes the given property / properties from the selected element.
	 *
	 * @param name {string[]} Comma separated strings of property / properties to remove.
	 * @return {Fuxcel} Fuxcel Object of the selected element
	 */
	removeProp(...name: string[]): Fuxcel {
		const selected: ElementReturn = this.toArray;
		// @ts-ignore
		selected.length && name.length && selected.forEach((element: HTMLElement) => name.forEach(prop => element[prop] = null));
		return this;
	}
	
	/**
	 * Returns the direct descendants (Children) of the selected element.
	 *
	 * _Returns the child that matches the selector if the selector parameter is passed._
	 *
	 * @param selector {Selector} Selectable string.
	 * @return {Fuxcel} Fuxcel Object of the selected child(ren)
	 */
	children(selector: Selector = null): Fuxcel {
		const selected: ElementReturn = this.toArray;
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
	
	/**
	 * Returns all the descendants of the selected element.
	 *
	 * _Returns the descendant that matches the selector if the selector parameter is passed._
	 *
	 * @param selector {Selector} Selectable string.
	 * @return {Fuxcel} Fuxcel Object of the selected descendant(s)
	 */
	descendants(selector: Selector = null): Fuxcel {
		const selected: ElementReturn = this.toArray;
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
	
	/**
	 * Returns the parents of the selected element.
	 *
	 * _Returns the parent that matches the selector if the selector parameter is passed._
	 *
	 * @param selector {Selector} Selectable string.
	 * @return {Fuxcel} Fuxcel Object of the selected parent(s)
	 */
	parents(selector: Selector = null): Fuxcel {
		const selected: ElementReturn = this.toArray;
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
	 * Returns the previous siblings of the selected element.
	 *
	 * _Returns the previous sibling that matches the selector if the selector parameter is passed._
	 *
	 * @param selector {Selector} Selectable string.
	 * @return {Fuxcel} Fuxcel Object of the selected previous sibling(s)
	 */
	prevSiblings(selector: Selector = null): Fuxcel {
		const selected: ElementReturn = <HTMLElement[]>this.toArray;
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
	 * Returns the direct descendants (Children) of the selected element.
	 *
	 * _Returns the descendant that matches the selector if the selector parameter is passed._
	 *
	 * @param selector {Selector} Selectable string.
	 * @return {Fuxcel} Fuxcel Object of the selected sibling(s)
	 */
	siblings(selector: Selector = null): Fuxcel {
		const selected: ElementReturn = this.toArray;
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
	
	/**
	 * Check if the selected element has a scrollbar in the given direction.
	 *
	 * @param direction {('vertical'|'horizontal')} Specific direction to check _[horizontal or vertical]_.
	 * @return {boolean} true if the selected element has a scrollbar in the specified direction; false otherwise.
	 */
	hasScrollBar(direction: string = 'vertical'): boolean {
		const selected: ElementReturn = this.toArray;
		let scrollType: { vertical: string, horizontal: string } = {vertical: 'scrollHeight', horizontal: 'scrollWidth'},
			clientType: { vertical: string, horizontal: string } = {vertical: 'clientHeight', horizontal: 'clientWidth'};
		
		// @ts-ignore
		if (isString(direction) && scrollType[direction])
			// @ts-ignore
			return selected[0][scrollType[direction]] > selected[0][clientType[direction]]
		throw (`Function \`asScrollBar()\` expects 1 argument. 0 given.`);
	}
	
	/**
	 * Inserts the given HTML string to the given position of the selected element.
	 *
	 * _Inserts the HTML string as inner HTML if no position is given._
	 *
	 * @param value {string} HTML string to insert
	 * @param position {('affix'|'prefix'|'postfix'|'suffix'|null)} Position to place given HTML string.
	 * @return {Fuxcel} Fuxcel Object of the selected element
	 */
	insertHTML(value: string, position: ('affix' | 'prefix' | 'postfix' | 'suffix' | null) = null): Fuxcel {
		const selected: ElementReturn = this.toArray;
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
	 * Checks if the selected element matches the given tag name.
	 *
	 * @param tagName {string} HTML tag name to check for.
	 * @return {boolean} true if the selected elements' tag name matches the given tag name; false otherwise.
	 */
	isElement(tagName: string): boolean {
		const selected: ElementReturn = <HTMLElement[]>this.toArray;
		if (isString(tagName))
			return selected[0].tagName.toLowerCase() === tagName.toLowerCase();
		throw (`Function \`matchSelector()\` expects 1 string argument. 0 given`);
	}
	
	/**
	 * Checks to see if the selected element would be selected by the provided selectorString _-- in other words --_ checks if the selected element "is" the selector.
	 *
	 * @param selector {Selector} Selector to check element against.
	 * @return {boolean} true if the selected element would be selected; false otherwise.
	 */
	matchSelector(selector: Selector): boolean {
		const selected: ElementReturn = <HTMLElement[]>this.toArray;
		if (isString(selector))
			return (selected[0].matches || selected[0].webkitMatchesSelector).call(selected[0], <string>selector);
		throw (`Function \`matchSelector()\` expects 1 argument. 0 given`);
	}
	
	// off(...event: string[]): Fuxcel
	/**
	 * Remove Event Listener(s) from the selected element.
	 *
	 * _Removes the given event(s) from the selected element if the event parameter is given._
	 *
	 * _Removes all previous Event Listeners from the selected element._
	 *
	 * @param events {string[]} Particular event to remove
	 * @return {Fuxcel} Fuxcel Object of the selected element
	 */
	off(...events: string[]): Fuxcel {
		const selected: ElementReturn = this.toArray;
		
		selected.forEach((element: HTMLElement) => {
			// @ts-ignore
			(element.listeners) && element.listeners.forEach((listener: { event: string, listener: any, option: any }, index) => {
				if (events.length) {
					events.forEach((event: string) => {
						if (listener.event.toLowerCase() === event?.toLowerCase()) {
							element.removeEventListener(listener.event, listener.listener, listener.option)
							// @ts-ignore
							element.listeners.splice(index, 1);
						}
					});
				} else {
					element.removeEventListener(listener.event, listener.listener, listener.option)
					// @ts-ignore
					delete element.listeners;
				}
			});
		});
		return this;
	}
	
	upon(events: string, listener: ((e: CustomEvent | KeyboardEvent | MouseEvent | TouchEvent | Event) => any), option?: boolean): Fuxcel
	upon(events: string[], listener: ((e: CustomEvent | KeyboardEvent | MouseEvent | TouchEvent | Event) => any), option?: boolean): Fuxcel
	upon(events: object, listener?: boolean): Fuxcel
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
	 * @param events {string} Event as a string.
	 * @param listener {((e: CustomEvent | KeyboardEvent | MouseEvent | TouchEvent | Event) => any)} Listener function to handle given event.
	 * @param {boolean} [option] Optional boolean parameter to set CAPTURING_PHASE of the event listener to either true or false.
	 * @return {Fuxcel} Fuxcel Object of the selected element
	 *
	 * @param events {Object} Events passed as a Key-Value pair with each event as the key and the listener functions as the values
	 * @param  {boolean} [listener] Optional boolean parameter to set CAPTURING_PHASE of the event listener to either true or false.
	 * @return {Fuxcel} Fuxcel Object of the selected element
	 */
	upon(events: string | string[] | object, listener?: ((e: CustomEvent | KeyboardEvent | MouseEvent | TouchEvent | Event) => any) | boolean, option: boolean = true): Fuxcel {
		const selected: ElementReturn = this.toArray;
		
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
				if (Array.isArray(events) && events.length)
					events.forEach((event: string) => {
						// @ts-ignore
						element.addEventListener(event, listener, option);
						// @ts-ignore
						element.listeners.push({element: element, listener: listener, event: event, option: option});
					});
				else {
					// @ts-ignore
					element.addEventListener(events, listener, option);
					// @ts-ignore
					element.listeners.push({element: element, listener: listener, event: events, option: option});
				}
			}
		});
		return this;
	}
	
	value(): string | null;
	value(value: string): Fuxcel;
	/**
	 * Get or set the value of the selected element.
	 *
	 * @param value {StringOrNull} Value to set for the given element (If available).
	 * @return {Fuxcel|string|null} The value of the selected element if no parameter is passed for value; Fuxcel object of the selected element otherwise.
	 */
	value(value: StringOrNull = null): Fuxcel | string | null {
		const selected: ElementReturn = this.toArray;
		
		if (value) {
			// @ts-ignore
			selected.forEach((element: HTMLElement) => element.value = value);
			return this;
		}
		// @ts-ignore
		return selected[0].value;
	}
	
	/**
	 *
	 * @param uri {StringOrNull=''}
	 * @param method {StringOrNull='get'}
	 * @param data {object|null=null}
	 * @param dataType {('html'|'json'|'jsonp'|'script'|'text'|'xml'|null)}
	 * @param beforeSend {Function|null = null}
	 */
	handleFormSubmit({uri = '', method = 'get', data = null, dataType = 'json', beforeSend = null}: FXFormSubmitType): Promise<any> {
		const selected: ElementReturn = this.toArray;
		let response: any;
		
		return new Promise((resolve, reject) =>
			selected.forEach((element: HTMLElement) => {
				if (fx(element).isElement('form')) {
					const form = fx(element).formValidator;
					const formData = new FormData(<HTMLFormElement>element);
					// @ts-ignore
					data && Object.keys(data).length && Object.keys(data).forEach(key => formData.append(key, data[key]));
					
					!form.errorCount ? typeof fx.areq === 'function' && fx.areq({
						uri: uri,
						method: method,
						data: formData,
						dataType: dataType,
						beforeSend() {
							// @ts-ignore
							isFunction(beforeSend) && beforeSend()
						},
						onError(err: any, status: number) {
							alert('Error');
							reject({response: err, status: status, form: form});
						},
						onComplete(xhr: ResponseData, status: number) {
							if (dataType === 'json') {
								response = xhr.responseJSON
								
								if ((status > 199 && status < 300) || status === 308) {
									if (status === 308)
										setTimeout(() => location.href = response.redirect, 2000);
									else
										resolve({JSON: response, text: xhr.responseText, form: form});
								} else {
									if (status === 419)
										setTimeout(() => location.href = response.redirect, 2000);
									else if (status === 422 || status === 501)
										!!response.errors && form.renderValidationErrors(response.errors)
									else {
										console.error('Server Failure', xhr);
										reject({response: xhr, status: status, form: form});
									}
								}
							} else {
								if ((status > 199 && status < 300) || status === 308)
									resolve({text: xhr.responseText, form: form});
								else
									reject({response: xhr, status: status, form: form});
							}
						}
					}) : form.renderValidationErrors(form.errorBag);
				}
			})
		);
	}
}

class FuxcelValidator extends Fuxcel implements FuxcelValidatorInterface {
	#_fxValidatorConfig: ValidatorConfigObject = FuxcelValidator.defaultValidatorConfig;
	
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
		stepForm: {
			use: false,
			plugin: false
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
	
	static #_initSteps: object = {};
	static #_stepsClass: string = '.fx-step';
	static #_validatorErrorBag: object = {};
	static #_validatorErrorCount: object = {};
	
	constructor(selector: string | Iterable<any> | any, context?: string | Iterable<any> | any) {
		super(selector, context);
	}
	
	/**
	 * Toggle given icons with a fadeout and fadein animation.
	 *
	 * @param oldIcon {Selector|Iterable<any>} Old Icon selector
	 * @param newIcon {Selector|Iterable<any>} New Icon selector
	 * @private
	 * @return void
	 */
	static #_toggleValidationIcons(oldIcon: string, newIcon: string): void {
		const _oldIcon: Fuxcel = fx(oldIcon);
		const _newIcon: Fuxcel = fx(newIcon);
		
		if (_oldIcon.length && _newIcon.length) {
			if (_oldIcon.style('display') !== 'none')
				_oldIcon.style({animation: 'fadeOut 500ms linear', display: 'none'});
			_newIcon.style({display: 'inline-block', animation: 'fadeIn 500ms linear'});
		}
	}
	
	/**
	 * Perform necessary action pre-validation.
	 *
	 * @param forms {HTMLElement[]} array of HTML Form Element(s).
	 * @private
	 * @return {FuxcelValidator} Fuxcel Validator Object of the forms.
	 */
	#_initValidateForms(forms: HTMLFormElement[]): FuxcelValidator {
		forms.forEach((form: HTMLFormElement, index) => {
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
								that,
								form,
								formGroup,
								expectedFieldElement,
								expectedLabelElement
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
	
	/**
	 * Initialize validation on selected step form(s).
	 *
	 * @param forms {HTMLElement[]} array of HTML Form Element(s).
	 * @return {FuxcelSteps} Fuxcel Steps Object of the forms.
	 */
	#_initValidateStepForms(forms: HTMLFormElement[]): FuxcelSteps {
		forms.forEach((form: HTMLFormElement, index: number) => {
			const configObject = this.validatorConfig;
			const _currentForm = fx(form).formValidator;
			
			if (!_currentForm.attrib('id'))
				_currentForm.attrib({id: `current-form-${index}`});
			
			let formId = _currentForm.attrib('id'),
				formSteps = fx(`#${formId} ${FuxcelValidator.stepsClass}`).formValidator;
			
			
			if (formSteps.length) {
				// @ts-ignore
				FuxcelValidator.#_initSteps[index] = formId;
				// @ts-ignore
				FuxcelValidator.#_validatorErrorBag[formId] = {};
				// @ts-ignore
				FuxcelValidator.#_validatorErrorCount[formId] = {};
				
				configObject.config.nativeValidation ? _currentForm.prop({noValidate: false}) : _currentForm.prop({noValidate: true});
				
				formSteps.toArray.forEach((step: HTMLElement, index: number) => {
					step.dataset.fxStep = `${index + 1}`
					const stepIndex = parseInt(<string>step.dataset.fxStep);
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
									
									formGroup = this.#_placeElements(
										this,
										form,
										formGroup,
										expectedFieldElement,
										expectedLabelElement
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
	
	/**
	 * Add or remove validation errors from the Validation Error Bag and also update the Error Count for the current form via its selected form field element.
	 *
	 * _If a string value is passed to the MessageOrRemove parameter, the message is added to the validation error bag for selected element._
	 *
	 * _If a boolean value is passed to the MessageOrRemove parameter, then previous error is removed from the validation error bag for the selected element._
	 *
	 * @param MessageOrRemove {string|boolean} String or boolean value indicating whether to add or remove error respectively.
	 * @private
	 * @return {void}
	 */
	#_manipulateErrorBag(MessageOrRemove: string | boolean): void {
		const fieldAttribs = this.fieldAttributes;
		
		if (isBool(MessageOrRemove) && MessageOrRemove)
			Object.keys(FuxcelValidator.#_validatorErrorBag).length && (Object.values(FuxcelValidator.#_initSteps).filter(value => fieldAttribs.formId === value).length ?
				// @ts-ignore
				(Object.keys(FuxcelValidator.#_validatorErrorBag[fieldAttribs.formId]).length && (delete FuxcelValidator.#_validatorErrorBag[fieldAttribs.formId][this.stepFromField][fieldAttribs.id])) :
				// @ts-ignore
				delete FuxcelValidator.#_validatorErrorBag[fieldAttribs.formId][fieldAttribs.id]);
		else {
			if (isString(MessageOrRemove))
				Object.keys(FuxcelValidator.#_validatorErrorBag).length && (Object.values(FuxcelValidator.#_initSteps).filter(value => fieldAttribs.formId === value).length ?
					// @ts-ignore
					(Object.keys(FuxcelValidator.#_validatorErrorBag[fieldAttribs.formId]).length && (FuxcelValidator.#_validatorErrorBag[fieldAttribs.formId][this.stepFromField][fieldAttribs.id] = MessageOrRemove)) :
					// @ts-ignore
					FuxcelValidator.#_validatorErrorBag[fieldAttribs.formId][fieldAttribs.id] = MessageOrRemove);
		}
		
		this.#_manipulateErrorCount();
	}
	
	/**
	 * Update the error count in the Validation Error Count Bag of the form by count the total number of errors in the Validation Error Bag for the current form.
	 *
	 * @private
	 * @return {void}
	 */
	#_manipulateErrorCount(): void {
		const fieldAttribs = this.fieldAttributes;
		
		Object.keys(FuxcelValidator.#_validatorErrorCount).length && (Object.values(FuxcelValidator.#_initSteps).filter(value => fieldAttribs.formId === value).length ?
			// @ts-ignore
			(Object.keys(FuxcelValidator.#_validatorErrorCount[fieldAttribs.formId]).length && (FuxcelValidator.#_validatorErrorCount[fieldAttribs.formId][this.stepFromField] = Object.keys(FuxcelValidator.#_validatorErrorBag[fieldAttribs.formId][this.stepFromField]).length)) :
			// @ts-ignore
			FuxcelValidator.#_validatorErrorCount[fieldAttribs.formId] = Object.keys(FuxcelValidator.#_validatorErrorBag[fieldAttribs.formId]).length);
	}
	
	/**
	 * Place all necessary elements in their required position pre-validation.
	 *
	 * @param that {FuxcelValidator} Current Form Validator instance.
	 * @param form {HTMLFormElement} Initialized form instance.
	 * @param formGroup {HTMLElement} Selected Form group.
	 * @param expectedFieldElement {HTMLElement} Expected field element in selected form group.
	 * @param expectedLabelElement {HTMLElement} Expected label element in selected form group.
	 * @private
	 * @return {HTMLElement}
	 */
	#_placeElements(that: FuxcelValidator, form: HTMLFormElement, formGroup: HTMLElement, expectedFieldElement: HTMLElement, expectedLabelElement: HTMLElement): HTMLElement {
		const configObject: ValidatorConfigObject = that.validatorConfig;
		const _fieldElement: Fuxcel = fx(expectedFieldElement);
		
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
					
					showPassword.src = `${Fuxcel.path}/images/eye-24.png`;
					hidePassword.src = `${Fuxcel.path}/images/invisible-24.png`;
					
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
			
			const label = document.createElement('span');
			
			label.innerHTML = expectedLabelElement.innerHTML;
			
			expectedLabelElement.innerHTML = '';
			expectedLabelElement.append(expectedFieldElement, label);
			
			newFieldGroup.append(/*expectedFieldElement, */expectedLabelElement);
			
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
				/*display: 'flex',
				alignItems: 'center'*/
			});
		} else
			formGroup.append(validationText);
		validationText.setAttribute('id', `${expectedFieldElement.id}Valid`);
		return formGroup;
	}
	
	/**
	 * Replace the current selected element(s) with the given one(s) in the Fuxcel Validator Object.
	 *
	 * @param elements {Fuxcel | FuxcelBase | FuxcelValidator}
	 * @private
	 * @return {FuxcelValidator} Fuxcel Validator Object of the selected element.
	 */
	#_resetFuxcelObject(elements: Fuxcel | FuxcelBase | FuxcelValidator): FuxcelValidator {
		const documentDOMArray: ElementReturn = <Document[]>fx(document).toArray;
		
		// @ts-ignore
		Object.keys(this).forEach(key => delete this[key]);
		this.length = 0;
		this.prev = {length: 0};
		
		documentDOMArray.forEach((value, key) => {
			// @ts-ignore
			this.prev[key] = value;
			this.prev.length++;
		});
		
		elements.toArray.forEach((value: HTMLElement, index: number) => {
			// @ts-ignore
			this[index] = value;
			this.length++;
		});
		return this;
	}
	
	/**
	 * Change initial default validator config with user config
	 *
	 * @param config {Object}
	 * @private
	 * @return {void}
	 */
	#_touchConfig(config: object): void {
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
	
	/**
	 * Perform validation on the form field elements.
	 *
	 * @param that {FuxcelValidator} Current Validator instance
	 * @param formGroup {HTMLElement} Current selected form group
	 * @private
	 * @return {void}
	 */
	#_validate(that: FuxcelValidator, formGroup: HTMLElement): void {
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
		
		const inputGroupWrapper = fx('.input-group-wrapper', formGroup);
		const labelElement = fx('label', inputGroupWrapper);
		
		_inputElement.length && _inputElement.off().upon({
			blur: function () {
				const _input = that.#_resetFuxcelObject(fx(this));
				
				if (inputGroupWrapper.length && labelElement.length) {
					labelElement.style({color: 'var(--fx-dark)'});
					inputGroupWrapper.style({borderColor: 'var(--fx-border-dark)'})
				}
				
				if (configObject.config.showPassword && _passwordToggle.length)
					if (_input.isPasswordField)
						_passwordToggle.hasFocus.then((focused: boolean) => {
							if (!focused && _input.value()?.length) {
								_input.attrib('type')?.toLowerCase() === 'password' && _passwordToggle.dataAttrib('require-refill', 'true')
								refillRequired = parseBool(_passwordToggle.dataAttrib('require-refill'));
								fx(`${showPasswordToggle}, ${hidePasswordToggle}`).style({animation: 'fadeOut 500ms linear', display: 'none'});
							}
						});
			},
			focus: function () {
				const _input = that.#_resetFuxcelObject(fx(this));
				
				if (inputGroupWrapper.length && labelElement.length) {
					labelElement.style({color: 'var(--fx-purple)'});
					inputGroupWrapper.style({borderColor: 'var(--fx-purple)'});
				}
				
				if (configObject.config.showPassword && _passwordToggle.length)
					if (_input.isPasswordField)
						_passwordToggle.hasFocus.then((focused: boolean) => {
							if (!focused && _input.value()?.length) {
								// TODO: Remove require refill if password is shown
								_input.attrib('type')?.toLowerCase() === 'password' && _passwordToggle.dataAttrib('require-refill', 'true')
								refillRequired = parseBool(_passwordToggle.dataAttrib('require-refill'));
							}
						});
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
			}
		});
		
		_selectElement.length && _selectElement.off().upon({
			blur: function () {
				if (inputGroupWrapper.length && labelElement.length) {
					labelElement.style({color: 'var(--fx-dark)'});
					inputGroupWrapper.style({borderColor: 'var(--fx-border-dark)'})
				}
			},
			focus: function () {
				if (inputGroupWrapper.length && labelElement.length) {
					labelElement.style({color: 'var(--fx-purple)'});
					inputGroupWrapper.style({borderColor: 'var(--fx-purple)'})
				}
			},
			change: function () {
				// @ts-ignore
				const _element = that.#_resetFuxcelObject(fx(this));
				_element.canBeValidated && _element.validateField();
			}
		});
		
		_textAreaElement.length && _textAreaElement.off().upon({
			blur: function () {
				if (inputGroupWrapper.length && labelElement.length) {
					labelElement.style({color: 'var(--fx-dark)'});
					inputGroupWrapper.style({borderColor: 'var(--fx-border-dark)'})
				}
			},
			focus: function () {
				if (inputGroupWrapper.length && labelElement.length) {
					labelElement.style({color: 'var(--fx-purple)'});
					inputGroupWrapper.style({borderColor: 'var(--fx-purple)'})
				}
			},
			input: function () {
				// @ts-ignore
				const _element = that.#_resetFuxcelObject(fx(this));
				_element.canBeValidated && _element.validateField();
			}
		});
		
		if (_element.length) {
			const elementId = _element.attrib('id');
			// @ts-ignore
			const fieldName = elementId.toString().toTitleCase().replaceAll(/[_-]/gi, ' ');
			
			if (_element.canBeValidated && (_element.isElement('input') || _element.isElement('select') || _element.isElement('textarea'))) {
				if (_element.isElement('input')) {
					const elementType = _element.attrib('type') && _element.attrib('type').toLowerCase();
					
					if (configObject.config.showPassword && _passwordToggle.length)
						_passwordToggle.off().upon('click', (e) => {
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
					
					if (elementType !== 'checkbox' && elementType !== 'radio' && !_element.value()?.length)
						this.#_manipulateErrorBag(`The ${fieldName} field is required.`);
				} else {
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
	#_validatePasswordFields(): void {
		const selected: ElementReturn = this.toArray;
		// @ts-ignore
		const form: HTMLFormElement = selected[0].form;
		const configObject = this.validatorConfig;
		
		if (configObject.config.validatePassword) {
			const pwdField = fx(`#${configObject.config.passwordId}`, form).formValidator;
			const pwdFieldName = pwdField.fieldAttributes.id.toString().toTitleCase().replaceAll(/[_-]/gi, ' ');
			const expectedCpwdField = fx(`#${configObject.config.passwordConfirmId}`, form);
			
			if (configObject.regExp.password) {
				if (expectedCpwdField.length) {
					const cpwdField = expectedCpwdField.formValidator;
					const cpwdFieldName = cpwdField.fieldAttributes.id.toString().toTitleCase().replaceAll(/[_-]/gi, ' ');
					
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
		} else
			this.validateField();
	}
	
	/**
	 * Checks if the selected field element can be validated by checking that the [data-fx-validate] is not set to false.
	 *
	 * @return {boolean} true if validation is possible; false otherwise
	 */
	get canBeValidated(): boolean {
		const selected: ElementReturn = this.toArray;
		return selected.length ? (this.dataAttrib('fx-validate') ? parseBool(this.dataAttrib('fx-validate')) : true) : false;
	}
	
	/**
	 * @return {object} The error bag for the current selected form.
	 */
	get errorBag(): object {
		// @ts-ignore
		return (this.length && this.isElement('form')) && Object.keys(FuxcelValidator.#_validatorErrorBag[this.attrib('id')]).length ? FuxcelValidator.#_validatorErrorBag[this.attrib('id')] : null;
	}
	
	/**
	 * @return {number} The error count for the current selected form.
	 */
	get errorCount(): number {
		// @ts-ignore
		return (this.length && this.isElement('form')) && Object.keys(FuxcelValidator.#_validatorErrorCount).length ? FuxcelValidator.#_validatorErrorCount[this.attrib('id')] : 0;
	}
	
	/**
	 * @return {object} An object containing the error bag and error count for the current selected form(s). Logs an error to the console if selected element(s) not form element(s).
	 */
	get getErrors(): object | void {
		const selected: ElementReturn = this.toArray;
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
	
	/**
	 * @return {object|void} An object containing all form field elements for the current selected form(s). Logs an error to the console if selected element(s) not form element(s).
	 */
	get formFieldElements(): object | void {
		const selected: ElementReturn = <HTMLElement[]>this.toArray;
		if (selected.length > 1) {
			const elements: object = {};
			selected.forEach((element) => {
				if (fx(element).isElement('form')) {
					const formElement = <HTMLFormElement>element;
					// @ts-ignore
					elements[formElement.id] = formElement.elements;
				}
			});
			return elements;
		}
		// @ts-ignore
		return this.isElement('form') ? <HTMLFormElement>selected[0].elements : console.error('Non form elements given', selected)
	}
	
	/**
	 * Checks if the selected form field element is an email field.
	 *
	 * @return {boolean} true if it is an email field; false otherwise
	 */
	get isEmailField(): boolean {
		const attributes = this.fieldAttributes;
		return attributes.type?.includes('email') || attributes.type?.includes('email') || attributes.id?.includes('email') || attributes.fxId?.includes('email') || attributes.fxRole?.includes('email');
	}
	
	/**
	 * Checks if the selected form field element is a name field.
	 *
	 * @return {boolean} true if it is a name field; false otherwise
	 */
	get isNameField(): boolean {
		const attributes = this.fieldAttributes;
		return !this.isUsernameField && attributes.id?.includes('name') || attributes.fxId?.includes('name') || attributes.fxRole?.includes('name');
	}
	
	/**
	 * Checks if the selected form field element is a password field.
	 *
	 * @return {boolean} true if it is a password field; false otherwise
	 */
	
	get isPasswordField(): boolean {
		const passwordId = this.#_fxValidatorConfig.config.passwordId;
		const attributes = this.fieldAttributes;
		return attributes.type === 'password' || attributes.id?.includes(passwordId.toLowerCase()) || attributes.fxId?.includes(passwordId.toLowerCase()) || attributes.fxRole?.includes(passwordId.toLowerCase());
	}
	
	/**
	 * Checks if the selected form field element is a phone field.
	 *
	 * @return {boolean} true if it is a phone field; false otherwise
	 */
	get isPhoneField(): boolean {
		const attributes = this.fieldAttributes;
		return attributes.type?.includes('tel') || attributes.type?.includes('phone') || attributes.id?.includes('phone') || attributes.fxId?.includes('phone') || attributes.fxRole?.includes('phone');
	}
	
	/**
	 * Checks if the selected form field element is a username field.
	 *
	 * @return {boolean} true if it is a username field; false otherwise
	 */
	get isUsernameField(): boolean {
		const attributes = this.fieldAttributes;
		return attributes.id?.includes('username') || attributes.fxId?.includes('username') || attributes.fxRole?.includes('username');
	}
	
	/**
	 * @return {number} the current step the form field belongs to if the form is a step form; -1 otherwise.
	 */
	get stepFromField(): number {
		const stepDiv = this.parents(FuxcelValidator.stepsClass);
		if (stepDiv.length)
			return parseInt(stepDiv.dataAttrib('fx-step') ?? 0);
		return -1;
	}
	
	/**
	 * @return {ValidationProps} Returns the [ValidationProps](ValidationProps) of the selected form field element.
	 */
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
		throw ('Non-Form field element given');
	}
	
	/**
	 * @return {ValidatorConfigObject} current validator config options object of selected form.
	 */
	get validatorConfig(): ValidatorConfigObject {
		return this.#_fxValidatorConfig;
	}
	
	/**
	 * @return {ValidatorConfigObject} the default validator config object.
	 */
	static get defaultValidatorConfig(): ValidatorConfigObject {
		return FuxcelValidator.#_defaultConfig;
	}
	
	/**
	 * @return {string} the password capslock alert class. Default is '.capslock-alert'.
	 */
	static get passwordCapslockAlertClass(): string {
		return '.capslock-alert'
	}
	
	/**
	 * @return {string} the password toggle icon class. Default is '.toggle-password-icons'.
	 */
	static get passwordTogglerIconClass(): string {
		return '.toggle-password-icons'
	}
	
	/**
	 * @return {string} steps class. Default is '.fx-step'.
	 */
	static get stepsClass(): string {
		return FuxcelValidator.#_stepsClass;
	}
	
	/**
	 * Change the default class for steps.
	 *
	 * @param stepClass {string} class to use for steps.
	 */
	static set stepsClass(stepClass: string) {
		FuxcelValidator.#_stepsClass = stepClass;
	}
	
	/**
	 * Initialize validation on selected form(s).
	 *
	 * _Throws an error if non form elements are selected_
	 *
	 * @param config {object} user config object.
	 * @return {FuxcelSteps | FuxcelValidator} Fuxcel Validator Object of the forms.
	 */
	init(config: object | null = null): FuxcelSteps | FuxcelValidator {
		const selected: ElementReturn = this.toArray;
		let forms = <HTMLFormElement[]>selected.filter((element: HTMLElement) => fx(element).isElement('form')),
			nonForms = selected.filter((element: HTMLElement) => !fx(element).isElement('form'));
		
		
		if (forms.length) {
			if (nonForms.length)
				console.error(`${nonForms.length} non form-element${nonForms.length === 1 ? '' : 's'} passed to validator:`, nonForms);
			config && isObject(config) && this.#_touchConfig(config);
			return this.validatorConfig.stepForm.use ? this.#_initValidateStepForms(forms) : this.#_initValidateForms(forms);
		} else {
			console.error(`Non form-elements passed to the validator`, nonForms);
			throw (`${nonForms.length} non form-element${nonForms.length === 1 ? '' : 's'} passed to validator.`);
		}
	}
	
	/**
	 * Display validation message.
	 *
	 * @param [message] {StringOrNull} message to display [optional]
	 * @param renderType {('error'|'success'|null)} validation type
	 * @return {FuxcelValidator} Fuxcel Validator Object of the current selected element.
	 */
	renderMessage(message: StringOrNull = null, renderType: StringOrNull = null): FuxcelValidator {
		this.insertHTML(`<small ${renderType ? 'class="' + renderType + '"' : ''}>${message ?? '&nbsp;'}</small>`);
		return this;
	}
	
	/**
	 * Display all validation errors for the selected form.
	 *
	 * @param errors {object} An object containing the errors. The keys are the form field ids and their values are the errors for the fields respectively.
	 * @param messageOrCallbackFn {((fx: FuxcelValidator, e?: CustomEvent) => any)|StringOrNull}
	 * @param callbackFn {((fx: FuxcelValidator, e?: CustomEvent) => any)}
	 */
	renderValidationErrors(errors: object, messageOrCallbackFn: ((fx: FuxcelValidator, e?: CustomEvent) => any) | StringOrNull = null, callbackFn: ((fx: FuxcelValidator, e?: CustomEvent) => any) | null = null): FuxcelValidator {
		const selected: FuxcelValidator = this;
		// @ts-ignore
		
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
		} else
			console.warn('Non form element given.');
		
		typeof messageOrCallbackFn === "string" ?
			// @ts-ignore
			fx.modal({
				type: 'error', content: messageOrCallbackFn, confirmButtonText: 'Ok', onConfirm: (e) => typeof callbackFn === 'function' && callbackFn(this, e)
			}) : typeof messageOrCallbackFn === 'function' && messageOrCallbackFn(this);
		
		return this;
	}
	
	/**
	 * Show validation error for the selected field.
	 *
	 * @param message {StringOrNull} Validation message.
	 * @return {void}
	 */
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
		// this.#_manipulateErrorCount();
	}
	
	/**
	 * Show validation success.
	 *
	 * @param message {StringOrNull} Validation message.
	 * @return {void}
	 */
	showSuccess(message: StringOrNull = null): void {
		const validationProps = this.validationProps;
		
		this.#_manipulateErrorBag(true);
		this.#_fxValidatorConfig.config.showIcons && FuxcelValidator.#_toggleValidationIcons(validationProps.invalidIcon, validationProps.validIcon);
		
		fx(validationProps.validationField).formValidator.renderMessage(message ?? null);
		
		if (this.#_fxValidatorConfig.config.useDefaultStyling)
			fx(`${validationProps.formGroup} .form-group-wrapper`).replaceClass('fx-valid-error', 'fx-valid-success');
		else
			fx(validationProps.formGroup).replaceClass('fx-valid-error', 'fx-valid-success');
		// this.#_manipulateErrorCount();
	}
	
	/**
	 * Toggle between validating and removing validation from the selected field.
	 *
	 * @return {FuxcelValidator} Fuxcel Validator Object of the forms.
	 */
	toggleValidation(): FuxcelValidator {
		return this.canBeValidated ? this.validateField() : this.undoValidation();
	}
	
	/**
	 * Remove validation from the selected field element. Also remove the error from the error bag if destroyValidation parameter is set tot true.
	 *
	 * @param destroyValidation {boolean = false}
	 * @return {FuxcelValidator} Fuxcel Validator Object of the forms.
	 */
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
	
	/**
	 * Returns the error bag for the given step of the current selected element.
	 *
	 * @param step {number|string} Given step.
	 * @return {object} The error bag for the given step of the current selected step form.
	 */
	stepErrorBag(step: number | string): object {
		// @ts-ignore
		return (this.length && this.isElement('form')) && Object.keys(FuxcelValidator.#_validatorErrorBag[this.attrib('id')][step]).length ? FuxcelValidator.#_validatorErrorBag[this.attrib('id')][step] : null;
	}
	
	/**
	 * Returns the error count for the given step of the current selected element.
	 *
	 * @param step {number|string} Given step.
	 * @return {object} The error count for the given step of the current selected step form.
	 */
	stepErrorCount(step: number | string): number {
		// @ts-ignore
		return (this.length && this.isElement('form')) && Object.keys(FuxcelValidator.#_validatorErrorCount[this.attrib('id')]).length ? FuxcelValidator.#_validatorErrorCount[this.attrib('id')][step] : 0;
	}
	
	/**
	 * Validate Card CVV field using Regular Expression
	 *
	 * @param regExp {RegExp} Regular expression to use.
	 * @param customFormatEx {StringOrNull = null} Custom format example to show user.
	 * @return {FuxcelValidator} Fuxcel Validator Object of the selected element.
	 */
	validateCardCVV(regExp: RegExp, customFormatEx: StringOrNull = null): FuxcelValidator {
		return this.validateRegex(regExp, `Invalid CVV.`);
	}
	
	/**
	 * Validate Card Number field using Regular Expression
	 *
	 * @param regExp {RegExp} Regular expression to use.
	 * @param customFormatEx {StringOrNull = null} Custom format example to show user
	 * @return {FuxcelValidator} Fuxcel Validator Object of the selected element.
	 */
	validateCardNumber(regExp: RegExp, customFormatEx: StringOrNull = null): FuxcelValidator {
		const selected: ElementReturn = this.toArray;
		// @ts-ignore
		const value: string = selected[0].value;
		
		return this.validateRegex(() => value.length ? (value.match(regExp) ?
			// @ts-ignore
			(fx.passLuhnAlgo(selected[0]) ? this.validateField() : this.validateField('Check Card Number and try again.', true)) :
			this.validateField(`${customFormatEx ?? 'Only numbers are allowed.'}`)) : this.toggleValidation());
	}
	
	/**
	 * Validate Email field using Regular Expression.
	 *
	 * @param regExp {RegExp} Regular expression to use.
	 * @param customFormatEx {StringOrNull = null} Custom format example to show user.
	 * @return {FuxcelValidator} Fuxcel Validator Object of the selected element.
	 **/
	validateEmail(regExp: RegExp, customFormatEx: StringOrNull = null): FuxcelValidator {
		return this.validateRegex(regExp, `Invalid E-Mail format: (eg. ${customFormatEx ?? 'johndoe@email.com'})`);
	}
	
	/**
	 * Validate the selected field.
	 *
	 * @param message {StringOrNull = null} Validation message to display.
	 * @param isError {boolean=false} If true and the message parameter is null, an automatic error message is generated.
	 * @return {FuxcelValidator} Fuxcel Validator Object of the selected element.
	 */
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
	
	/**
	 * Validate Name field using Regular Expression
	 *
	 * @param regExp {RegExp} Regular expression to use.
	 * @param customFormatEx {StringOrNull = null} Custom format example to show user.
	 * @return {FuxcelValidator} Fuxcel Validator Object of the selected element.
	 */
	validateName(regExp: RegExp, customFormatEx: StringOrNull = null): FuxcelValidator {
		return this.validateRegex(regExp, `Invalid Name format: (eg. ${customFormatEx ?? 'john doe, john doe woods'})`);
	}
	
	/**
	 * Validate Password field using Regular Expression
	 *
	 * @param regExp {RegExp} Regular expression to use
	 * @param customFormatEx {StringOrNull = null} Custom format example to show user.
	 * @return {FuxcelValidator} Fuxcel Validator Object of the selected element.
	 */
	validatePassword(regExp: RegExp, customFormatEx: StringOrNull = null): FuxcelValidator {
		return this.validateRegex(regExp, `Invalid Password format: (${customFormatEx ?? 'Password requires a minimum of 8 characters an must contain at least 1 uppercase and 1 special character'})`);
	}
	
	/**
	 * Validate Phone field using Regular Expression
	 *
	 * @param regExp {RegExp} Regular expression to use
	 * @param customFormatEx {StringOrNull = null} Custom format example to show user.
	 * @return {FuxcelValidator} Fuxcel Validator Object of the selected element.
	 */
	validatePhone(regExp: RegExp, customFormatEx: StringOrNull = null): FuxcelValidator {
		return this.validateRegex(regExp, `Invalid Phone format: (eg. ${customFormatEx ?? '+234 8156547099, +1 104 2198'})`);
	}
	
	/**
	 * Validate field using Regular Expression or a callback function
	 *
	 * @param regExpOrFn {Function|RegExp} Regular Expression or callback function to use.
	 * @return {FuxcelValidator} Fuxcel Validator Object of the selected element.
	 */
	validateRegex(regExpOrFn: Function): FuxcelValidator
	validateRegex(regExpOrFn: RegExp, message: string): FuxcelValidator
	validateRegex(regExpOrFn: Function | RegExp, message ?: StringOrNull): FuxcelValidator {
		const selected: ElementReturn = this.toArray;
		// @ts-ignore
		const value: string = selected[0].value;
		
		// @ts-ignore
		(regExpOrFn && isFunction(regExpOrFn)) ? regExpOrFn(this) :
			// @ts-ignore
			(regExpOrFn && isString(message) ? ((value.length) ? (value.match(regExpOrFn) ? this.validateField() : this.validateField(message, true)) : this.validateField()) : console.error('Function \`validateRegex()\` expects 2 arguments.'));
		return this;
	}
	
	/**
	 * Validate Username field using Regular Expression
	 *
	 * @param regExp {RegExp} Regular expression to use
	 * @param customFormatEx {StringOrNull = null} Custom format example to show user.
	 * @return {FuxcelValidator} Fuxcel Validator Object of the selected element.
	 */
	validateUsername(regExp: RegExp, customFormatEx: StringOrNull = null): FuxcelValidator {
		const selected: ElementReturn = this.toArray;
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
		
		try {
			if (Steps.constructor.name.length && selected.validatorConfig.stepForm.plugin)
				// @ts-ignore
				new Steps(selected[0]).init({step: '.fx-step'});
		} catch (e) {
		
		}
		
		return this;
	}
	
	/**
	 * @return {FuxcelSteps} Fuxcel Validator Object of the selected element.
	 */
	get context(): FuxcelSteps {
		return new FuxcelSteps(<any>FuxcelSteps.currentlySelected);
	}
	
	/**
	 * @return {object | (number | string)[]} If more than one selected form element - An Object containing all form steps in arrays respectively; else an array of all steps in the form.
	 */
	get formSteps(): object | (number | string)[] {
		const steps: (number | string)[] = [];
		
		if (this.length > 1) {
			const allSteps = {};
			this.toArray.forEach((form: HTMLElement) => {
				if (fx(form).isElement('form')) {
					// @ts-ignore
					allSteps[<HTMLFormElement>form.id] = [];
					const stepDivs: Fuxcel = fx(FuxcelValidator.stepsClass, form);
					
					stepDivs.length && stepDivs.toArray.forEach((stepDiv: HTMLElement) => {
						const step = stepDiv.dataset.fxStep;
						// @ts-ignore
						isString(step) && step !== undefined && (allSteps[<HTMLFormElement>form.id]).push(step)
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
	stepErrors(step: number | string | null = null): object | void {
		const selected: ElementReturn = this.context.toArray;
		let errors: object = {};
		
		if (step === null) {
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

class FuxcelModal extends Fuxcel implements FuxcelModalInterface {
	modalTriggers = fx('*[data-fx-target="modal"]');
	#_isHiding = false;
	
	static #_modalTarget: Fuxcel;
	static #_openModals: FuxcelModal[] = [];
	
	constructor(selector: string | Iterable<any> | any, context?: string | Iterable<any> | any) {
		super(selector, context);
		
		if (this.modalTriggers.length) {
			this.modalTriggers.off().upon('click', function (e) {
				e.preventDefault();
				const currentTrigger = fx(e.currentTarget);
				const modalAction = currentTrigger.dataAttrib('fx-action')?.toString().toLowerCase() ?? 'open';
				
				if (modalAction === 'close') {
					FuxcelModal.#_modalTarget = currentTrigger.parents('.fx-modal');
					FuxcelModal.#_modalTarget.modal.hide();
				} else {
					FuxcelModal.#_modalTarget = fx(`#${currentTrigger.dataAttrib('fx-modal')}`);
					FuxcelModal.#_modalTarget.modal.toggle()
				}
			});
		} else
			console.error('Target modal not found.');
	}
	
	/**
	 * @return {FuxcelModal | null} FuxcelModal object of Current open modal.
	 */
	static get currentModal(): FuxcelModal | null {
		return this.hasOpenModals ? this.#_openModals[this.#_openModals.length - 1] : null;
	}
	
	/**
	 * @return {boolean} true if any modal is open. False otherwise.
	 */
	static get hasOpenModals() {
		return !!this.#_openModals.length
	}
	
	/**
	 * Generate a simple Modal with required given parameters.
	 *
	 * @param title {string} The Modal title.
	 * @param content {string} The Content for the body of the Modal.
	 * @param id {string} id to use for the Modal.
	 * @param hasFooter {boolean} If the Modal should be created with a footer.
	 * @return {HTMLElement} Generated Modal.
	 */
	static init({title = null, content, id, hasFooter}: ModalInit): HTMLElement {
		const fxModal = document.createElement('div');
		const modalDialog = document.createElement('div');
		const modalContent = document.createElement('div');
		const modalHeader = document.createElement('div');
		const modalBody = document.createElement('div');
		const modalFooter = document.createElement('div');
		
		const modalTitle = document.createElement('div');
		const modalCloseButton = document.createElement('div');
		
		fxModal.id = id;
		fxModal.classList.add('fx-modal', 'filter');
		
		title && (modalTitle.innerHTML = title);
		modalBody.innerHTML = content;
		
		modalCloseButton.dataset.fxAction = 'close';
		modalCloseButton.dataset.fxTarget = 'modal';
		
		modalTitle.classList.add('title');
		modalCloseButton.classList.add('close');
		
		modalDialog.classList.add('fx-modal-dialog', 'fx-dialog-centered', 'fx-dialog-scrollable');
		modalContent.classList.add('fx-modal-content');
		modalHeader.classList.add('fx-modal-header');
		modalBody.classList.add('fx-modal-body');
		modalFooter.classList.add('fx-modal-footer');
		
		
		modalHeader.append(modalTitle, modalCloseButton);
		modalContent.append(modalHeader, modalBody, modalFooter);
		modalDialog.append(modalContent);
		fxModal.append(modalDialog);
		
		!title && modalContent.removeChild(modalHeader);
		!hasFooter && modalContent.removeChild(modalFooter);
		return fxModal;
	}
	
	/**
	 * Destroy selected modal.
	 */
	destroy(): void {
		// @ts-ignore
		this[0].remove()
	}
	
	/**
	 * Close selected modal.
	 *
	 * @param destroy {boolean}
	 */
	hide(destroy = false): void {
		const modalContent = fx('.fx-modal-content', this);
		
		if (!this.#_isHiding) {
			this.#_isHiding = true;
			modalContent.fadeout(500).then(() => this.fadeout(500).then(() => {
				const index = FuxcelModal.#_openModals.indexOf(this);
				
				if (index !== -1)
					FuxcelModal.#_openModals.splice(index, 1);
				
				// @ts-ignore
				this[0].dispatchEvent(fxModalHideEvent);
				destroy && this.destroy();
				
				this.#_isHiding = false;
			}));
		}
	}
	
	/**
	 * Open selected modal.
	 *
	 * @param escKey {boolean=true} Allow closing the modal using the Escape on the KeyBoard if set to true. True by default.
	 */
	show(escKey = true): void {
		const modalContent = fx('.fx-modal-content', this);
		
		this.style({pointerEvents: 'none'}).fadein(500).then(() => modalContent.fadein(500).then(() => {
			FuxcelModal.#_openModals.push(this);
			this.style({pointerEvents: 'unset'});
			
			if (!parseBool(this.dataAttrib('fx-static')))
				// Hide modal if mouse is left-clicked outside the modal content [Trigger clicking on either buttons if any is available].
				this.upon('click', () => modalContent.hasFocus.then((focused: boolean) => !focused ? this.hide() : null))
			
			if (escKey)
				fx(document).off('keyup').upon('keyup', (e) => {
					const event = <KeyboardEvent>e;
					const key = event.key.toLowerCase();
					
					if (key === 'escape' || key === 'esc')
						if (FuxcelModal.hasOpenModals)
							FuxcelModal.currentModal?.hide();
				});
			
			// @ts-ignore
			this[0].dispatchEvent(fxModalShowEvent)
		}));
	}
	
	/**
	 * Toggle between close and open of the selected modal.
	 */
	toggle(): void {
		if (this.style('display') === 'none')
			this.show()
		else
			this.hide();
	}
}

/**
 * Perform a fetch request using the [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API).
 *
 * @param uri {StringOrNull = null}
 * @param method {StringOrNull = null}
 * @param data {StringOrNull = null}
 * @param dataType {('html'|'json'|'jsonp'|'script'|'text'|'xml'|null)}
 * @param beforeSend {Function|null = null}
 * @param onComplete {((response: ResponseData, status: number, statusText: string) => void)|null = null}
 * @param onError {((error: any, status: number, statusText: string) => void)|null = null}
 * @param onSuccess {((response: ResponseData, status: number, statusText: string) => void)|null = null}
 */
fx.constructor.prototype.areq = function ({uri = '', method = 'get', data = null, dataType = 'json', beforeSend = null, onComplete = null, onError = null, onSuccess = null}: FXRequestType = {}) {
	const allowedErrorStatuses = new Set([401, 402, 422, 423, 426, 451, 511]);
	let status: number,
		statusText: string,
		responseData: ResponseData;
	// @ts-ignore
	isFunction(beforeSend) && beforeSend()
	
	// TODO: Abort request with timeout
	
	fetch(<string>uri, {
		method: <string>method,
		body: <BodyInit | null>data,
	}).then(response => {
		responseData = response;
		status = responseData.status;
		statusText = responseData.statusText
		
		try {
			// @ts-ignore
			const consumedData = response[dataType]()
			return (consumedData && responseData.ok || (status > 199 && status < 300) || allowedErrorStatuses.has(status)) ? consumedData : Promise.reject(response);
		} catch (e) {
			return Promise.reject(e);
		}
	}).then(data => {
		responseData.responseJSON = dataType === 'json' && data;
		responseData.responseText = dataType === 'json' ? JSON.stringify(data) : (dataType === 'text' && data);
		
		// @ts-ignore
		status > 199 && status < 300 && isFunction(onSuccess) && onSuccess(responseData, status, statusText);
		// @ts-ignore
		isFunction(onComplete) && onComplete(responseData, status, statusText);
		
		// @ts-ignore
	}).catch(error => isFunction(onError) && onError(error, status, statusText));
};

/**
 * Create quick simple modal with callbacks.
 *
 * @param title {StringOrNull}.
 * @param type {('success' | 'warning' | 'error')} Modal Type.
 * @param content {StringOrNull} Body Content of Modal.
 * @param confirmButtonText {StringOrNull} Text for Confirm Button.
 * @param cancelButtonText {StringOrNull} Text for Cancel Button.
 * @param html {boolean} Use HTML content? else use Text content.
 * @param onConfirm {((e: CustomEvent, modal: FuxcelModal) => void) | null} Callback on confirm button click.
 * @param onCancel {(e: CustomEvent, modal: FuxcelModal) => void | null} callback on cancel button click.
 * @param onEsc {(e: CustomEvent, modal: FuxcelModal) => void | null} callback on Escape key used. Only works when cancel button is not available. [i.e. cancelButtonText is null].
 */
fx.constructor.prototype.modal = function ({title = null, type = 'success', content = 'Alert Content', confirmButtonText = null, cancelButtonText = null, html = true, onConfirm = null, onCancel = null, onEsc = null}: FXModalType = {}) {
	let alertIconPath;
	const initialModal = FuxcelModal.init({title: title, content: <string>content, id: 'init', hasFooter: false});
	const modalBody = fx('.fx-modal-body', initialModal);
	const body = document.querySelector('body');
	
	alertIconPath = type === 'success' ?
		`${Fuxcel.path}/images/ok-24.svg` :
		(type === 'error' ? `${Fuxcel.path}/images/cancel-24.svg` : `${Fuxcel.path}/images/warning-24.svg`);
	
	const alertIcon = `<img src="${alertIconPath}" alt="${type}" class="fx-modal-alert-icon">`;
	const buttonsWrapper = (buttons: string): string => `<div class="fx-modal-alert-buttons">${buttons}</div>`;
	
	const buttons = confirmButtonText && cancelButtonText ?
		`<button type="button" id="fx-modal-cancel" class="fx-btn fx-btn-error">${cancelButtonText}</button><button type="button" id="fx-modal-confirm" class="fx-btn fx-btn-primary">${confirmButtonText}</button>` :
		(confirmButtonText ? `<button type="button" id="fx-modal-confirm" class="fx-btn fx-btn-primary">${confirmButtonText}</button>` : (cancelButtonText && `<button type="button" id="fx-modal-cancel" class="fx-btn fx-btn-error">${cancelButtonText}</button>`));
	
	modalBody.style({display: 'flex', flexDirection: 'column', alignItems: 'center'}).insertHTML(alertIcon, 'prefix')
	buttons && modalBody.insertHTML(buttonsWrapper(buttons), 'suffix');
	
	body?.append(initialModal);
	fx('.fx-modal-alert-icon', initialModal).style({visibility: 'visible'}).fadein(2000);
	
	const modal = new FuxcelModal(initialModal);
	modal.show(!cancelButtonText);
	
	if (cancelButtonText || confirmButtonText) {
		console.log(true)
		// Trigger the onEsc() function if available and cancel button is not displayed.
		if (!cancelButtonText)
			modal.off().upon('fx.modal.hide', (e) => typeof onEsc === 'function' ? onEsc(<CustomEvent>e, modal) : null);
		
		modal.off('click').upon('click', function (e) {
			const clickedTarget = fx(e.target);
			const isCancel = clickedTarget.matchSelector('#fx-modal-cancel');
			const isConfirm = clickedTarget.matchSelector('#fx-modal-confirm');
			
			// Hide modal if mouse is left-clicked outside the modal content [Trigger clicking on either buttons if any is available].
			fx('.fx-modal-content', modal).hasFocus.then((focused: boolean) => {
				if (!focused)
					cancelButtonText ?
						document.querySelector('#fx-modal-cancel')?.dispatchEvent(fxModalCancelButtonClick) :
						document.querySelector('#fx-modal-confirm')?.dispatchEvent(fxModalCancelButtonClick);
			});
			
			if (isCancel || isConfirm) {
				console.log(isCancel, isCancel)
				modal.hide(true);
				modal.off().upon('fx.modal.hide', (e) => isCancel && typeof onCancel === 'function' ? onCancel(<CustomEvent>e, modal) : (isConfirm && typeof onConfirm === 'function' ? onConfirm(<CustomEvent>e, modal) : null));
			}
		});
	} else {
		// Trigger the onEsc() function if available and cancel button is not displayed.
		if (!cancelButtonText)
			modal.off().upon('fx.modal.hide', (e) => typeof onEsc === 'function' ? onEsc(<CustomEvent>e, modal) : null);
	}
	
	return modal;
};

/**
 * Callback on DOMContentLoaded.
 *
 * @param listener {((e: Event) => void)}
 */
fx.constructor.prototype.onDocumentLoad = (listener: (e: Event) => void) => {
	fx(document).off().upon('DOMContentLoaded', listener)
}

/**
 * Check if given input passes the Luhn Algorithm Test.
 *
 * @param input {any | string | number} input to check.
 * @return {boolean} true if passed; false otherwise.
 */
fx.constructor.prototype.passLuhnAlgo = (input: any | string | number): boolean => {
	const digitSum = (c: any | number): number => (c < 10) ? c : digitSum(Math.trunc(c / 10) + (c % 10));
	
	return input.split('').reverse()
		.map(Number)
		.map((value: number, index: number) => index % 2 !== 0 ? digitSum(value * 2) : 2)
		.reduce((previous: number, current: number) => previous + current) % 10 === 0;
}

new FuxcelModal('*');
