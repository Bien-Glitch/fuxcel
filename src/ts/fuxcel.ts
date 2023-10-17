type FuxcelOrString<T extends string | object, U extends boolean | string | null> = T extends object ? Fuxcel : (T extends string ? (U extends string ? Fuxcel : (U extends boolean ? Fuxcel : string)) : string);
type Selector = string | null;

interface FuxcelInterface {
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

/**
 *
 * @param selector {string|Iterable<any>|any}
 * @param context {string|Iterable<any>|any}
 */
const fx: fxInterface = (selector: string, context: string | null = null): Fuxcel => new Fuxcel(selector, context);

/**
 *
 * @param value {any}
 */
const isBool = (value: any): boolean => {
	return typeof value === 'boolean';
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

class FuxcelBase {
	private length: number;
	protected prev: object;
	
	/**
	 *
	 * @param selector {string|Iterable<any>|any}
	 * @param context {string|Iterable<any>|any}
	 */
	constructor(selector: string | Iterable<any> | any, context?: string | Iterable<any> | any) {
		const fuxcel: any = this;
		const selectedElements: [] | NodeListOf<any> | undefined = init();
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
			'jquery',
			'nodelist',
			'collection'
		];
		return {iterable: iterable, html: html};
	}
	
	#_isIterable(element: any): boolean {
		return !!this.#_constructors.iterable.filter(value => value === element.constructor.name.toLowerCase()).length || Array.isArray(element);
	}
	
	#_isHTMLElement(element: HTMLElement | any): boolean {
		return !!this.#_constructors.html.filter(value => element.constructor.name.toLowerCase().includes(value)).length;
	}
	
	#_toArray(element: any): any[] {
		return this.#_isIterable(element) ? Array.from(element) : [element];
	}
	
	#_setPrev(prevObj: Fuxcel) {
		this.prev = new Fuxcel(prevObj);
	}
	
	get prevObj() {
		return this.prev;
	}
	
	get toArray(): any[] {
		return this.#_toArray(this);
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
	
	/**
	 *
	 * @param name {string|Object}
	 * @param value {string|null}
	 * @return {Fuxcel|string}
	 */
	attrib<T extends string | object, U extends string | null>(name: T, value?: U): FuxcelOrString<T, U> {
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
	dataAttrib<T extends string | object, U extends string | null>(name: T, value?: U): FuxcelOrString<T, U> {
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
	
	hasFocus() {
		// const selected: HTMLElement[] = this.toArray;
		return this.matchSelector(':hover');
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
}

document.addEventListener('DOMContentLoaded', () => {
	const testDiv = fx('#div')
	console.log(testDiv.siblings());
});
// const input = document.querySelector('.test-input');
// input.setAttribute('type', 'password');
