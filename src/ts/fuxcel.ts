type FuxcelOrString<T extends string | object, U extends boolean | string | null = null> = T extends object ? Fuxcel : (T extends string ? (U extends string ? Fuxcel : (U extends boolean ? Fuxcel : string)) : string);
type FuxcelEventListener<T extends string | object, U = T extends object ? boolean : Function, V = U extends boolean ? null : boolean> = Fuxcel;
type StringOrNull = string | null;
type Selector = StringOrNull;
declare type ValidatorConfigObject = {
	regExp: {
		name: RegExp,
		username: RegExp,
		email: RegExp,
		phone: RegExp,
		cardCVV: RegExp,
		cardNumber: RegExp,
	},
	config: {
		showIcons: boolean,
		showPassword: boolean,
		capslockAlert: boolean,
		validateCard: boolean,
		validateName: boolean,
		validateEmail: boolean,
		validatePhone: boolean,
		validatePassword: boolean,
		validateUsername: boolean,
		nativeValidation: boolean,
		useDefaultStyling: boolean,
		passwordId: string,
		passwordConfirmId: string,
		initWrapper: string,
	},
	texts: {
		capslock: string,
	}
};

interface FuxcelInterface {
	get hasFocus(): Promise<any>
	
	attrib<T extends string | object, U extends string | null>(name: T, value?: U): FuxcelOrString<T, U>
	
	dataAttrib<T extends string | object, U extends string | null>(name: T, value?: U): FuxcelOrString<T, U>
	
	prop<T extends string | object, U extends string | null>(name: T, value?: U): FuxcelOrString<T, U>
	
	removeAttrib(...name: string[]): Fuxcel
	
	removeDataAttrib(...name: string[]): Fuxcel
	
	removeProp(...name: string[]): Fuxcel
}

interface fxInterface {
	(selector: string | Iterable<any> | any, context?: string | Iterable<any> | any): Fuxcel;
}

const listenerArray: any[] = [];
const listenerObject: Object = {};
const listenerObjectRemoveList: Object = {};

const validatorErrorBag: object = {}
const validatorErrorCount: object = {}

/**
 *
 * @param selector {string|Iterable<any>|any}
 * @param context {string|Iterable<any>|any}
 */
const fx: fxInterface = (selector: string | Iterable<any> | any, context: string | Iterable<any> | any = null): Fuxcel => new Fuxcel(selector, context);

/*const fxValidator = (selector: string | Iterable<any> | any, context: string | Iterable<any> | any = null): FuxcelValidator => new FuxcelValidator(selector, context);*/

/**
 *
 * @param value {any}
 */
const isBool = (value: any): boolean => {
	return typeof value === 'boolean';
}

const isFunction = (value: any): boolean => {
	return typeof value === 'function';
}

/**
 *
 * @param value {any}
 */
const isString = (value: any): boolean => {
	return typeof value === 'string' && true;
}

/**
 *
 * @param value
 */
const isObject = (value: any): boolean => {
	return typeof value === 'object';
}

const passLuhnAlgo = (input: any | string | number): boolean => {
	const digitSum = (c: any | number): number => (c < 10) ? c : digitSum(Math.trunc(c / 10) + (c % 10));
	
	return input.split('').reverse()
		.map(Number)
		.map((value: number, index: number) => index % 2 !== 0 ? digitSum(value * 2) : 2)
		.reduce((previous: number, current: number) => previous + current) % 10 === 0;
}

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

class FuxcelBase {
	length: number;
	protected prev: { length: number };
	
	/**
	 *
	 * @param selector {string|Iterable<any>|any}
	 * @param context {string|Iterable<any>|any}
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
				return context ? _context.querySelectorAll(selector) : document.querySelectorAll(selector);
			} catch (e) {
				throw (e);
			}
		}
		
		return fuxcel
	}
	
	get #_constructors(): { iterable: any[], html: any[] } {
		const html: any[] = ['html'];
		const iterable: any[] = [
			's',
			'fuxcel',
			'fuxcelvalidator',
			'jquery',
			'nodelist',
			'collection'
		];
		return {iterable: iterable, html: html};
	}
	
	get #_fuxcel(): Fuxcel {
		return new Fuxcel(this);
	}
	
	#_isIterable(element: any): boolean {
		return !!this.#_constructors.iterable.filter(value => value === element.constructor.name.toLowerCase()).length || Array.isArray(element);
	}
	
	#_isHTMLElement(element: HTMLElement | any): boolean {
		return !!this.#_constructors.html.filter(value => element.constructor.name.toLowerCase().includes(value)).length;
	}
	
	#_toArray(element: any): HTMLElement[] {
		return this.#_isIterable(element) ? Array.from(element) : [element];
	}
	
	get fieldAttributes(): { id: StringOrNull, type: StringOrNull, fxId: StringOrNull, fxRole: StringOrNull, formId: StringOrNull } {
		const selected: HTMLElement[] = this.toArray;
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
	
	get toArray(): HTMLElement[] {
		if (!this.length)
			throw ('No element selected');
		return this.#_toArray(this);
	}
	
	static eventListenerBag(): Object {
		return listenerObject;
	}
	
	static get isMobileDevice(): boolean {
		return navigator.userAgent.toLowerCase().includes('mobile');
	}
	
	static get pointerIsTouch(): boolean {
		return window.matchMedia("(pointer: coarse)").matches;
	}
}

class Fuxcel extends FuxcelBase implements FuxcelInterface {
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
			// @ts-ignore
			selected.forEach((element: HTMLElement) => element.setAttribute(name, value));
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
	
	#_setDataAttrib(name: string | object, value?: string) {
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
	
	#_setProp(name: string | object, value?: string) {
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
	
	#_setStyle(name: string | object, value?: string) {
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
	
	get resetFuxcelObject() {
		const selectedElements: any[] | NodeListOf<any> | undefined = this.toArray;
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
		
		selectedElements.forEach((value, index) => {
			// @ts-ignore
			this[index] = value;
			this.length++;
		});
		return this;
	}
	
	get classes(): DOMTokenList {
		const selected: HTMLElement[] = this.toArray;
		return selected[0].classList
	}
	
	get hasFocus(): Promise<any> {
		const selected: HTMLElement[] = this.toArray;
		const selector = Fuxcel.pointerIsTouch ? ':focus' : ':hover';
		
		return new Promise(async resolve => {
			await selected.forEach((element: HTMLElement) => resolve(fx(element).matchSelector(selector)));
		});
	}
	
	get innerHTML(): string {
		const selected: HTMLElement[] = this.toArray;
		return selected[0].innerHTML;
	}
	
	get outerHTML(): string {
		const selected: HTMLElement[] = this.toArray;
		return selected[0].outerHTML;
	}
	
	get formValidator(): FuxcelValidator {
		return new FuxcelValidator(this);
	}
	
	putClass(...tokenList: string[]) {
		const selected: HTMLElement[] = this.toArray;
		selected.forEach((element: HTMLElement) => tokenList.forEach(token => element.classList.add(token)));
		return this;
	}
	
	replaceClass(oldToken: string, newToken: string) {
		const selected: HTMLElement[] = this.toArray;
		selected.forEach((element: HTMLElement) => (element.classList.contains(oldToken) ?
				element.classList.replace(oldToken, newToken) :
				element.classList.add(newToken)
		));
		return this;
	}
	
	removeClass(...tokenList: string[]) {
		const selected: HTMLElement[] = this.toArray;
		selected.forEach((element: HTMLElement) => tokenList.forEach(token => element.classList.remove(token)));
		return this;
	}
	
	/**
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
}

class FuxcelValidator extends Fuxcel {
	_defaultConfig: ValidatorConfigObject = {
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
	}
	
	#_fxValidatorConfig = this._defaultConfig;
	
	constructor(selector: string | Iterable<any> | any, context?: string | Iterable<any> | any) {
		super(selector, context);
	}
	
	#_toggleValidationIcons(oldIcon: string, newIcon: string) {
		const _oldIcon: Fuxcel = fx(oldIcon);
		const _newIcon: Fuxcel = fx(newIcon);
		
		if (_oldIcon.length && _newIcon.length) {
			if (_oldIcon.style('display') !== 'none')
				_oldIcon.style({animation: 'fadeOut 500ms linear', display: 'none'});
			_newIcon.style({display: 'inline-block', animation: 'fadeIn 500ms linear'});
		}
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
					const showPassword: HTMLImageElement = new Image();
					const hidePassword: HTMLImageElement = new Image();
					
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
			
			newInputGroup.append(newInputGroupWrapper)
			newFormGroupWrapper.append(newInputGroup, validationText);
			formGroup.append(newFormGroupWrapper);
		} else {
			formGroup.append(validationText);
		}
		validationText.setAttribute('id', `${expectedFieldElement.id}Valid`);
		return formGroup;
	}
	
	#_initValidateForms(forms: HTMLElement[]): FuxcelValidator {
		forms.forEach((form: HTMLElement, index) => {
			const _currentForm = fx(form).formValidator;
			
			if (!_currentForm.attrib('id'))
				_currentForm.attrib({id: `current-form-${index}`});
			
			let formId = _currentForm.attrib('id'),
				formGroups = fx(`#${formId} .form-group`).formValidator;
			
			// @ts-ignore
			validatorErrorBag[formId] = {};
			// @ts-ignore
			validatorErrorCount[formId] = {};
			
			if (formGroups.length)
				formGroups.toArray.forEach((formGroup: HTMLElement) => {
					const configObject = this.#_fxValidatorConfig;
					const inputElement = 'input.form-field', selectElement = 'select.form-field', textAreaElement = 'textarea.form-field';
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
								_fieldElement.attrib({placeholder: _fieldElement.attrib('name').toString().replaceAll('-', '_')});
							
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
							
							let _inputElement = fx(inputElement, formGroup),
								_selectElement = fx(selectElement, formGroup),
								_textAreaElement = fx(textAreaElement, formGroup);
							
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
											if (_input.isPasswordField)
												_input.#_validatePasswordFields();
											else
												_input.validateField();
										
										if (_input.isEmailField)
											configObject.config.validateEmail ? _input.validateEmail(configObject.regExp.email) : _input.toggleValidation();
										
										if (_input.isNameField)
											!configObject.config.validateName ? _input.validateName(configObject.regExp.name) : _input.toggleValidation();
										
										if (_input.isPhoneField)
											configObject.config.validatePhone ? _input.validatePhone(configObject.regExp.phone) : _input.toggleValidation();
										
										if (_input.isUsernameField)
											configObject.config.validateUsername ? _input.validateUsername(configObject.regExp.username) : _input.toggleValidation();
										
										if (configObject.config.validateCard) {
											if (elementId?.includes('card_cvv') || fxRole?.includes('card_cvv') || fxId?.includes('card_cvv'))
												_input.validateCardCVV(configObject.regExp.cardCVV);
											if (elementId?.includes('card_number') || fxRole?.includes('card_number') || fxId?.includes('card_number'))
												_input.validateCardCVV(configObject.regExp.cardNumber);
										} else {
											if ((elementId?.includes('card_cvv') || fxRole?.includes('card_cvv') || fxId?.includes('card_cvv')) || (elementId?.includes('card_number') || fxRole?.includes('card_number') || fxId?.includes('card_number')))
												_input.toggleValidation();
										}
										filterFieldType.has(elementType) && elementType !== 'email' && _input.validateField();
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
	
	#_validatePasswordFields() {
	
	}
	
	init(config: Object | null = null): FuxcelValidator {
		const selected: HTMLElement[] = this.toArray;
		let forms = selected.filter((element: HTMLElement) => fx(element).isElement('form')),
			nonForms = selected.filter((element: HTMLElement) => !fx(element).isElement('form'));
		
		if (forms.length) {
			if (nonForms.length)
				console.error(`${nonForms.length} non form-element${nonForms.length === 1 ? '' : 's'} passed to validator:`, nonForms);
			
			return this.#_initValidateForms(forms);
		} else {
			console.error(`Non form-elements passed to the validator`, nonForms);
			throw (`${nonForms.length} non form-element${nonForms.length === 1 ? '' : 's'} passed to validator.`);
		}
	}
	
	get canBeValidated(): boolean {
		const selected: HTMLElement[] = this.toArray;
		return selected.length ? (this.dataAttrib('fx-validate') ? parseBool(this.dataAttrib('fx-validate')) : true) : false;
	}
	
	get formFieldElements() {
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
	
	get validationProps(): { id: string, formGroup: string, validationField: string, validIcon: string, invalidIcon: string, validationIconField: string } {
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
			}
		throw ('NonForm element given');
	}
	
	validateRegex(regExpOrFn: Function): FuxcelValidator
	validateRegex(regExpOrFn: RegExp, message: string): FuxcelValidator
	validateRegex(regExpOrFn: Function | RegExp, message?: StringOrNull): FuxcelValidator {
		const selected: HTMLElement[] = this.toArray;
		// @ts-ignore
		const value: string = selected[0].value;
		
		// @ts-ignore
		(regExpOrFn && isFunction(regExpOrFn)) ? regExpOrFn(this) :
			// @ts-ignore
			(regExpOrFn && isString(message) ? ((value.length) ? (value.match(regExpOrFn) ? this.validateField() : this.validateField(message, true)) : this.validateField()) : console.error('Function \`validateRegex()\` expects 2 arguments.'));
		return this;
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
	
	validateName(regExp: RegExp, customFormatEx: StringOrNull = null): FuxcelValidator {
		return this.validateRegex(regExp, `Invalid Name format: (eg. ${customFormatEx ?? 'john doe, john doe woods'})`);
	}
	
	validatePhone(regExp: RegExp, customFormatEx: StringOrNull = null): FuxcelValidator {
		return this.validateRegex(regExp, `Invalid Phone format: (eg. ${customFormatEx ?? '+234 8156547099, +1 104 2198'})`);
	}
	
	validateUsername(regExp: RegExp, customFormatEx: StringOrNull = null): FuxcelValidator {
		const selected: HTMLElement[] = this.toArray;
		// @ts-ignore
		const value: string = selected[0].value;
		const minLength = parseInt(this.attrib('minlength') ?? 2);
		// @ts-ignore
		const fieldName = selected[0].id.toString().toTitleCase().replaceAll(/[_-]/gi, ' ');
		
		return this.validateRegex(() => value.length ? (value.length > minLength ?
			(value.match(regExp) ? this.validateField() : this.validateField(`Invalid Username format: (eg. ${customFormatEx ?? 'Username must start and end with an alphabet, and can only contain alphabets and underscores.'})`)) :
			this.validateField(`${customFormatEx ?? 'The ' + fieldName + ' requires a minimum of 3' + ' characters.'}`)) : this.toggleValidation());
	}
	
	validateField(message: StringOrNull = null, isError: boolean = false): FuxcelValidator {
		const selected: FuxcelValidator = this;
		// @ts-ignore
		const target: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement = selected[0];
		
		// @ts-ignore
		const formId = selected[0].form.id, elementId = selected[0].id, tagName = selected[0].tagName.toLowerCase()
		
		let fieldValue = target.value,
			minLength = parseInt(selected.attrib('minlength')),
			fieldName = elementId.toString().toTitleCase().replaceAll(/[_-]/gi, ' '),
			finalMessage = minLength ?
				(!isString(message) && fieldValue.length && fieldValue.length < minLength ? `The ${fieldName} requires a minimum of ${minLength} characters.` : message) :
				(!isString(message) ? (selected.isPasswordField ? (fieldValue.length ? 'Ensure passwords.' : `The ${fieldName} field is required.`) : (!fieldValue.length ? `The ${fieldName} field is required.` : null)) : message);
		
		if (!fieldValue || !fieldValue.length || fieldValue.length < minLength || (selected.isPasswordField && (!fieldValue.length || finalMessage)) || isError)
			selected.showError(finalMessage);
		else
			selected.showSuccess(finalMessage);
		return this;
	}
	
	showError(message: StringOrNull = null) {
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
	
	showSuccess(message: StringOrNull = null) {
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
	
	undoValidation(destroyValidation: boolean = false): FuxcelValidator {
		const selected: FuxcelValidator = this;
		const fieldAttribs = selected.fieldAttributes;
		const validationProps = selected.validationProps;
		
		if (destroyValidation) {
			// @ts-ignore
			delete validatorErrorBag[fieldAttribs.formId][fieldAttribs.id];
			// @ts-ignore
			validatorErrorCount[fieldAttribs.formId] = Object.keys(validatorErrorCount[fieldAttribs.formId]).length
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
	
	renderMessage(message: StringOrNull = null, renderType: StringOrNull = null): FuxcelValidator {
		this.insertHTML(`<small class="${renderType}">${message ?? '&nbsp;'}</small>`);
		return this;
	}
	
	renderValidationErrors(errors: object, message: StringOrNull = null, callbackFn: Function | null = null) {
		const selected: FuxcelValidator = this;
		// @ts-ignore
		const target: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement = selected[0];
		
		if (selected.isElement('form')) {
			const fieldElements = this.formFieldElements;
			console.log(fieldElements, this);
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
}

document.addEventListener('DOMContentLoaded', () => {
	const body = document.querySelector('body');
	const testElement = fx('form');
	/*testElement.formValidator.isPasswordField;*/
	testElement.formValidator.init({
		config: {
			useDefaultStyling: false
		}
	});
	fx('#test-form-1').formValidator.renderValidationErrors({password: 'Hello'});
});
