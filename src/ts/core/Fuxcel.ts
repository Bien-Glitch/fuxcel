import {
	IterableElement,
	SingleElement,
	Selector,
	Direction,
	Position,
	EventInterfaces,
	HTMLElementWithListenerArray,
	FXInterface,
	FXAnimationOptions,
	FXFormSubmitType,
	HTTPRequestMethod,
	FuxcelInstance,
} from '../types';
import {FuxcelBase} from './FuxcelBase';
import {animations} from '../animations';
import {isBool, isDefined, isFunction, isObject, isString, parseBool} from '../utils';
import {FuxcelValidator} from '../validator/FuxcelValidator';
import {FuxcelModal} from '../modal/FuxcelModal';

/**
 * Core Fuxcel class.
 * Wraps one or more DOM elements and exposes a fluent, chainable API for
 * DOM manipulation, traversal, event handling, and animations.
 */
export class Fuxcel extends FuxcelBase implements FuxcelInstance {
	static #_buttonLoaderClass: string = '.btn-loader';
	static #_pluginPath: string | null = FuxcelBase.guessPath;
	
	/**
	 * Injectable factory for FuxcelValidator.
	 * Populated by index.ts after all modules are loaded, avoiding circular imports.
	 * @internal
	 */
	static _validatorFactory: ((el: any) => any) | null = null;
	
	/**
	 * Injectable factory for FuxcelModal.
	 * Populated by index.ts after all modules are loaded, avoiding circular imports.
	 * @internal
	 */
	static _modalFactory: ((el: any) => any) | null = null;
	
	/**
	 * Injectable fxFetch function.
	 * Populated by index.ts — avoids circular imports between Fuxcel and http/fxFetch.
	 * @internal
	 */
	static _fxFetch: ((options: any) => void) | null = null;
	
	constructor(selector: string | IterableElement | any, context?: string | IterableElement | any) {
		super(selector, context);
	}
	
	// ─── Private Helpers ──────────────────────────────────────────────────────
	
	#_formatDataAttrib(name: string): string {
		let replaced = '';
		const nameSplit = name.toString().split('-');
		nameSplit.forEach((split, idx) => {
			if (idx) {
				const chars = split.split('');
				chars[0] = chars[0].toUpperCase();
				replaced += chars.join('');
			}
		});
		return `${nameSplit[0]}${replaced}`;
	}
	
	#_setAttrib(name: string | object, value?: string): Fuxcel {
		const selected: IterableElement = <HTMLElement[]>this.toArray;
		if (isString(name) && (isString(value) || isDefined(value))) {
			selected.forEach((el: HTMLElement) => el.setAttribute(<string>name, <string>value));
		} else if (isObject(name)) {
			Object.keys(name).forEach(k =>
				selected.forEach((el: HTMLElement) => el.setAttribute(k, (<any>name)[k])));
		} else {
			throw (isString(name)
				? `Argument for \`name\` expects a String or an Object in \`attrib()\`. ${typeof name} given.`
				: `\`attrib()\` expects 1-2 arguments. None given.`);
		}
		return this;
	}
	
	#_setDataAttrib(name: string | object, value?: string): Fuxcel {
		const selected: IterableElement = <HTMLElement[]>this.toArray;
		if (isString(name) && (isString(value) || isDefined(value))) {
			selected.forEach((el: HTMLElement) => (el.dataset[<any>name] = value));
		} else if (isObject(name)) {
			Object.keys(name).forEach(k =>
				selected.forEach((el: HTMLElement) => (el.dataset[k] = (<any>name)[k])));
		} else {
			throw (isString(name)
				? `Argument for \`name\` expects a String or an Object in \`dataAttrib()\`. ${typeof name} given.`
				: `\`dataAttrib()\` expects 1-2 arguments. None given.`);
		}
		return this;
	}
	
	#_setPrev(prevObj: Fuxcel): Fuxcel {
		this.prev = new Fuxcel(prevObj);
		return this;
	}
	
	#_setProp(name: string | object, value?: string): Fuxcel {
		const selected: IterableElement = <HTMLElement[]>this.toArray;
		if (isString(name) && (isString(value) || isBool(value) || isDefined(value))) {
			selected.forEach((el: HTMLElement) => ((<any>el)[<any>name] = value));
		} else if (isObject(name)) {
			Object.keys(name).forEach(k =>
				selected.forEach((el: HTMLElement) => ((<any>el)[k] = (<any>name)[k])));
		} else {
			throw (isString(name)
				? `Argument for \`name\` expects a String or an Object in \`prop()\`. ${typeof name} given.`
				: `\`prop()\` expects 1-2 arguments. None given.`);
		}
		return this;
	}
	
	#_setStyle(name: string | object, value?: string): Fuxcel {
		const selected: IterableElement = <HTMLElement[]>this.toArray;
		if (isString(name) && (isString(value) || isBool(value) || isDefined(value))) {
			selected.forEach((el: HTMLElement) => ((<any>el.style)[<any>name] = value));
		} else if (isObject(name)) {
			Object.keys(name).forEach(k =>
				selected.forEach((el: HTMLElement) => (el.style[<any>k] = (<any>name)[k])));
		} else {
			throw (isString(name)
				? `Argument for \`name\` expects a String or an Object in \`prop()\`. ${typeof name} given.`
				: `\`prop()\` expects 1-2 arguments. None given.`);
		}
		return this;
	}
	
	// ─── Animation Engine ─────────────────────────────────────────────────────
	/**
	 * Perform given animation.
	 *
	 * @param animation
	 * @private
	 * @return {Promise<Fuxcel>}
	 */
	#_animate(animation: FXAnimationOptions): Promise<Fuxcel> {
		const selected: IterableElement = <HTMLElement[]>this.toArray;
		return new Promise(resolve =>
			selected.forEach((element: Element) => {
				Object.keys(animation.onBegin).length && fx(element).style(animation.onBegin);
				element.animate(animation.options.keyFrames, animation.options.timing).finished.then(() => {
					Object.keys(animation.onFinished).length && fx(element).style(animation.onFinished);
					resolve(this);
				});
			})
		);
	}
	
	// ─── Animation Methods ────────────────────────────────────────────────────
	fadeout(timeout?: number): Promise<Fuxcel>;
	fadeout(display?: string): Promise<Fuxcel>;
	fadeout(timeout: number, display?: string): Promise<Fuxcel>;
	fadeout(timeout: number, iteration: number, display: string): Promise<Fuxcel>;
	/**
	 * Perform Fadeout animation on selected element.
	 *
	 * @param timeout {number} Animation duration.
	 * @param iteration
	 * @param display
	 * @return {Promise<Fuxcel>}
	 */
	fadeout(timeout?: number | string, iteration?: number | string, display?: string): Promise<Fuxcel> {
		if (typeof timeout === 'string') {
			display = timeout;
			timeout = 300;
		} else if (timeout && typeof iteration === 'string') {
			display = iteration;
			iteration = 1;
		}
		return this.#_animate(animations({timeout, iterations: <number>iteration, display}).fadeOut);
	}
	
	fadein(timeout?: number): Promise<Fuxcel>;
	fadein(display?: string): Promise<Fuxcel>;
	fadein(timeout: number, display: string): Promise<Fuxcel>;
	fadein(timeout: number, iteration: number, display: string): Promise<Fuxcel>;
	/**
	 * Perform Fadein animation on selected element.
	 *
	 * @param timeout {number|string} Animation duration.
	 * @param iteration {number|string}
	 * @param display {string}
	 * @return {Promise<Fuxcel>}
	 */
	fadein(timeout?: number | string, iteration?: number | string, display?: string): Promise<Fuxcel> {
		if (typeof timeout === 'string') {
			display = timeout;
			timeout = 300;
		} else if (isDefined(timeout) && typeof iteration === 'string') {
			display = iteration;
			iteration = 1;
		}
		return this.#_animate(animations({timeout, iterations: <number>iteration, display}).fadeIn);
	}
	
	slideindown(timeout?: number): Promise<Fuxcel>;
	slideindown(display?: string): Promise<Fuxcel>;
	slideindown(timeout: number, display: string): Promise<Fuxcel>;
	slideindown(timeout: number, iteration: number, display: string): Promise<Fuxcel>;
	/**
	 * Perform a Slidein-down animation on selected element.
	 *
	 * @param timeout {number|string} Animation duration.
	 * @param iteration {number|string}
	 * @param display {string}
	 * @return {Promise<Fuxcel>}
	 */
	slideindown(timeout?: number | string, iteration?: number | string, display?: string): Promise<Fuxcel> {
		if (typeof timeout === 'string') {
			display = timeout;
			timeout = 300;
		} else if (timeout && typeof iteration === 'string') {
			display = iteration;
			iteration = 1;
		}
		return this.#_animate(animations({timeout, iterations: <number>iteration, display}).slideInDown);
	}
	
	slideinup(timeout?: number): Promise<Fuxcel>;
	slideinup(display?: string): Promise<Fuxcel>;
	slideinup(timeout: number, display: string): Promise<Fuxcel>;
	slideinup(timeout: number, iteration: number, display: string): Promise<Fuxcel>;
	/**
	 * Perform a Slidein-up animation on selected element.
	 *
	 * @param timeout {number|string} Animation duration.
	 * @param iteration {number|string}
	 * @param display {string}
	 * @return {Promise<Fuxcel>}
	 */
	slideinup(timeout?: number | string, iteration?: number | string, display?: string): Promise<Fuxcel> {
		if (typeof timeout === 'string') {
			display = timeout;
			timeout = 300;
		} else if (timeout && typeof iteration === 'string') {
			display = iteration;
			iteration = 1;
		}
		return this.#_animate(animations({timeout, iterations: <number>iteration, display}).slideInUp);
	}
	
	slideoutdown(timeout?: number): Promise<Fuxcel>;
	slideoutdown(display?: string): Promise<Fuxcel>;
	slideoutdown(timeout: number, display: string): Promise<Fuxcel>;
	slideoutdown(timeout: number, iteration: number, display: string): Promise<Fuxcel>;
	/**
	 * Perform a Slideout-down animation on selected element.
	 *
	 * @param timeout {number|string} Animation duration.
	 * @param iteration {number|string}
	 * @param display {string}
	 * @return {Promise<Fuxcel>}
	 */
	slideoutdown(timeout?: number | string, iteration?: number | string, display?: string): Promise<Fuxcel> {
		if (typeof timeout === 'string') {
			display = timeout;
			timeout = 300;
		} else if (timeout && typeof iteration === 'string') {
			display = iteration;
			iteration = 1;
		}
		return this.#_animate(animations({timeout, iterations: <number>iteration, display}).slideOutDown);
	}
	
	slideoutup(timeout?: number): Promise<Fuxcel>;
	slideoutup(display?: string): Promise<Fuxcel>;
	slideoutup(timeout: number, display: string): Promise<Fuxcel>;
	slideoutup(timeout: number, iteration: number, display: string): Promise<Fuxcel>;
	/**
	 *
	 * Perform a Slideout-up animation on selected element.
	 *
	 * @param timeout {number|string} Animation duration.
	 * @param iteration {number|string}
	 * @param display {string}
	 * @return {Promise<Fuxcel>}
	 */
	slideoutup(timeout?: number | string, iteration?: number | string, display?: string): Promise<Fuxcel> {
		if (typeof timeout === 'string') {
			display = timeout;
			timeout = 300;
		} else if (timeout && typeof iteration === 'string') {
			display = iteration;
			iteration = 1;
		}
		return this.#_animate(animations({timeout, iterations: <number>iteration, display}).slideOutUp);
	}
	
	slideinleft(timeout?: number): Promise<Fuxcel>;
	slideinleft(display?: string): Promise<Fuxcel>;
	slideinleft(timeout: number, display: string): Promise<Fuxcel>;
	slideinleft(timeout: number, iteration: number, display: string): Promise<Fuxcel>;
	/**
	 * Perform a Slidein-left animation on selected element.
	 *
	 * @param timeout {number|string} Animation duration.
	 * @param iteration {number|string}
	 * @param display {string}
	 * @return {Promise<Fuxcel>}
	 */
	slideinleft(timeout?: number | string, iteration?: number | string, display?: string): Promise<Fuxcel> {
		if (typeof timeout === 'string') {
			display = timeout;
			timeout = 300;
		} else if (timeout && typeof iteration === 'string') {
			display = iteration;
			iteration = 1;
		}
		return this.#_animate(animations({timeout, iterations: <number>iteration, display}).slideInLeft);
	}
	
	slideoutleft(timeout?: number): Promise<Fuxcel>;
	slideoutleft(display?: string): Promise<Fuxcel>;
	slideoutleft(timeout: number, display: string): Promise<Fuxcel>;
	slideoutleft(timeout: number, iteration: number, display: string): Promise<Fuxcel>;
	/**
	 * Perform a Slideout-left animation on selected element.
	 *
	 * @param timeout {number|string} Animation duration.
	 * @param iteration {number|string}
	 * @param display {string}
	 * @return {Promise<Fuxcel>}
	 */
	slideoutleft(timeout?: number | string, iteration?: number | string, display?: string): Promise<Fuxcel> {
		if (typeof timeout === 'string') {
			display = timeout;
			timeout = 300;
		} else if (timeout && typeof iteration === 'string') {
			display = iteration;
			iteration = 1;
		}
		return this.#_animate(animations({timeout, iterations: <number>iteration, display}).slideOutLeft);
	}
	
	slideinright(timeout?: number): Promise<Fuxcel>;
	slideinright(display?: string): Promise<Fuxcel>;
	slideinright(timeout: number, display: string): Promise<Fuxcel>;
	slideinright(timeout: number, iteration: number, display: string): Promise<Fuxcel>;
	/**
	 * Perform a Slidein-right animation on selected element.
	 *
	 * @param timeout {number|string} Animation duration.
	 * @param iteration {number|string}
	 * @param display {string}
	 * @return {Promise<Fuxcel>}
	 */
	slideinright(timeout?: number | string, iteration?: number | string, display?: string): Promise<Fuxcel> {
		if (typeof timeout === 'string') {
			display = timeout;
			timeout = 300;
		} else if (timeout && typeof iteration === 'string') {
			display = iteration;
			iteration = 1;
		}
		return this.#_animate(animations({timeout, iterations: <number>iteration, display}).slideInRight);
	}
	
	slideoutright(timeout?: number): Promise<Fuxcel>;
	slideoutright(display?: string): Promise<Fuxcel>;
	slideoutright(timeout: number, display: string): Promise<Fuxcel>;
	slideoutright(timeout: number, iteration: number, display: string): Promise<Fuxcel>;
	/**
	 * Perform a Slideout-right animation on selected element.
	 *
	 * @param timeout {number|string} Animation duration.
	 * @param iteration {number|string}
	 * @param display {string}
	 * @return {Promise<Fuxcel>}
	 */
	slideoutright(timeout?: number | string, iteration?: number | string, display?: string): Promise<Fuxcel> {
		if (typeof timeout === 'string') {
			display = timeout;
			timeout = 300;
		} else if (timeout && typeof iteration === 'string') {
			display = iteration;
			iteration = 1;
		}
		return this.#_animate(animations({timeout, iterations: <number>iteration, display}).slideOutRight);
	}
	
	blink(timeout?: number): Promise<Fuxcel>;
	blink(display?: string): Promise<Fuxcel>;
	blink(timeout: number, display: string): Promise<Fuxcel>;
	blink(timeout: number, iteration: number, display: string): Promise<Fuxcel>;
	/**
	 * Perform a blink animation on selected element.
	 *
	 * @param timeout {number|string} Animation duration.
	 * @param iteration {number|string}
	 * @param display {string}
	 * @return {Promise<Fuxcel>}
	 */
	blink(timeout?: number | string, iteration?: number | string, display?: string): Promise<Fuxcel> {
		if (typeof timeout === 'string') {
			display = timeout;
			timeout = 300;
		} else if (timeout && typeof iteration === 'string') {
			display = iteration;
			iteration = 1;
		}
		return this.#_animate(animations({timeout, iterations: <number>iteration, display}).blink);
	}
	
	zoomin(timeout?: number): Promise<Fuxcel>;
	zoomin(display?: string): Promise<Fuxcel>;
	zoomin(timeout: number, display: string): Promise<Fuxcel>;
	zoomin(timeout: number, iteration: number, display: string): Promise<Fuxcel>;
	/**
	 * Perform a Zoom-in animation on selected element.
	 *
	 * @param timeout {number|string} Animation duration.
	 * @param iteration {number|string}
	 * @param display {string}
	 * @return {Promise<Fuxcel>}
	 */
	zoomin(timeout?: number | string, iteration?: number | string, display?: string): Promise<Fuxcel> {
		if (typeof timeout === 'string') {
			display = timeout;
			timeout = 300;
		} else if (timeout && typeof iteration === 'string') {
			display = iteration;
			iteration = 1;
		}
		return this.#_animate(animations({timeout, iterations: <number>iteration, display}).zoomIn);
	}
	
	// ─── Getters ──────────────────────────────────────────────────────────────
	/**
	 * @return {DOMTokenList} The class list of an element.
	 */
	get classes(): DOMTokenList {
		return (<HTMLElement[]>this.toArray)[0].classList;
	}
	
	/**
	 *  @return {Promise<boolean>} A promise with a boolean argument; true if the given element has the mouse focus; false otherwise.
	 */
	get hasFocus(): Promise<boolean> {
		const selected: IterableElement = <HTMLElement[]>this.toArray;
		const selector = FuxcelBase.pointerIsTouch ? ':focus' : ':hover';
		return new Promise(resolve =>
			selected.forEach((el: HTMLElement) => resolve(fx(el).matchSelector(selector)))
		);
	}
	
	/**
	 * @return {string} The Inner Text value of the given element.
	 */
	get innerText(): string {
		return (<HTMLElement[]>this.toArray)[0].innerText;
	}
	
	/**
	 * Set The Inner Text value of the given element.
	 *
	 * @param text {string} Text to set
	 */
	set innerText(text: string) {
		(<HTMLElement>(<HTMLElement[]>this.toArray)[0]).innerText = text;
	}
	
	/**
	 * @return {string} The Outer Text value of the given element.
	 */
	get outerText(): string {
		return (<HTMLElement[]>this.toArray)[0].outerText;
	}
	
	/**
	 * Set The Outer Text value of the given element.
	 *
	 * @param text {string} Text to set
	 */
	set outerText(text: string) {
		(<HTMLElement>(<HTMLElement[]>this.toArray)[0]).outerText = text;
	}
	
	/**
	 * @return {string} The Inner HTML value of the given element.
	 */
	get innerHTML(): string {
		return (<HTMLElement[]>this.toArray)[0].innerHTML;
	}
	
	/**
	 * @return {string} The Outer HTML value of the given element.
	 */
	get outerHTML(): string {
		return (<HTMLElement[]>this.toArray)[0].outerHTML;
	}
	
	/**
	 * @return {boolean} Returns true if the selected element has the disabled property; false otherwise.
	 */
	get isDisabled(): boolean {
		return !!this.prop('disabled') || this.hasClass('disabled');
	}
	
	/**
	 * @return {boolean} Returns true if the selected element is a form element.
	 */
	get isFormElement(): boolean {
		const selected: IterableElement = <HTMLElement[]>this.toArray;
		if (typeof selected[0].cloneNode !== 'function') return false;
		try {
			const form = document.createElement('form');
			form.style.display = 'none';
			form.appendChild(selected[0].cloneNode(true));
			return form.elements.length > 0;
		} catch {
			return false;
		}
	}
	
	/**
	 * Injectable fxModal function.
	 * Populated by index.ts — avoids circular imports between Fuxcel and modal/fxModal.
	 * @internal
	 */
	static _fxModal: ((options?: any) => any) | null = null;
	
	/** Returns a new `FuxcelValidator` bound to this element. */
	get formValidator(): FuxcelValidator /* FuxcelValidator — resolved at runtime to avoid circular import */ {
		/*const {FuxcelValidator} = require('../validator/FuxcelValidator');
		return new FuxcelValidator(this);*/
		if (!Fuxcel._validatorFactory)
			throw new Error('[Fuxcel] formValidator is not available yet. Ensure fuxcel/src/index.ts has been loaded.');
		return Fuxcel._validatorFactory(this);
	}
	
	/** Returns a new `FuxcelModal` bound to this element. */
	get modal(): FuxcelModal /* FuxcelModal — resolved at runtime to avoid circular import */ {
		/*const {FuxcelModal} = require('../modal/FuxcelModal');
		return new FuxcelModal(this);*/
		if (!Fuxcel._modalFactory)
			throw new Error('[Fuxcel] modal is not available yet. Ensure fuxcel/src/index.ts has been loaded.');
		return Fuxcel._modalFactory(this);
	}
	
	// ─── Static Config ────────────────────────────────────────────────────────
	/**
	 * @return {string} The global Button Loader class.
	 */
	static get buttonLoaderClass(): string {
		return Fuxcel.#_buttonLoaderClass;
	}
	
	/**
	 * Set the Button Loader class globally.
	 *
	 * @param token {string} Class selector of button loader.
	 */
	static set buttonLoaderClass(token: string) {
		Fuxcel.#_buttonLoaderClass = token;
	}
	
	/**
	 * @return {string|null} The Plugin path.
	 */
	static get path(): string | null {
		return `${Fuxcel.#_pluginPath?.replace(/\/$/, '')}/..`;
	}
	
	/**
	 * Set the Plugin path globally.
	 *
	 * @param path {string} the relative path.
	 */
	static set path(path: string) {
		Fuxcel.#_pluginPath = path;
	}
	
	// ─── Class Manipulation ───────────────────────────────────────────────────
	/**
	 * Checks if selected element contains given class.
	 *
	 * @param {string} token
	 * @return {boolean} true if element contains given class; false otherwise.
	 */
	hasClass(token: string): boolean {
		return (<HTMLElement[]>this.toArray)[0].classList.contains(token);
	}
	
	/**
	 * Add class(es) to the classlist of the selected element.
	 *
	 * @param tokenList {...string} Comma separated strings of class(es) to add.
	 */
	putClass(...tokenList: string[]): Fuxcel {
		(<HTMLElement[]>this.toArray).forEach(el => tokenList.forEach(t => el.classList.add(t)));
		return this;
	}
	
	/**
	 * Replace an existing class with the given class.
	 *
	 * _Add the new class old class if not found._
	 *
	 * @param oldToken {string} Old class token.
	 * @param newToken {string} New class token.
	 */
	replaceClass(oldToken: string, newToken: string): Fuxcel {
		(<HTMLElement[]>this.toArray).forEach(el =>
			el.classList.contains(oldToken) ?
				el.classList.replace(oldToken, newToken) :
				el.classList.add(newToken)
		);
		return this;
	}
	
	/**
	 * Removes the given class(es) from the classlist of the given elements.
	 *
	 * @param tokenList {...string} Comma separated strings of class(es) to remove.
	 */
	removeClass(...tokenList: string[]): Fuxcel {
		(<HTMLElement[]>this.toArray).forEach(el => tokenList.forEach(t => el.classList.remove(t)));
		return this;
	}
	
	/**
	 * Toggle the given classin the classlist of the given element.
	 *
	 * @param token {string} Class to toggle.
	 */
	toggleClass(token: string): Fuxcel {
		(<HTMLElement[]>this.toArray).forEach(el => el.classList.toggle(token));
		return this;
	}
	
	// ─── Iteration ────────────────────────────────────────────────────────────
	/**
	 * Perform callback on each selected item
	 *
	 * @param callback {((element: Fuxcel, index: number) => void)}
	 */
	each(callback: ((element: Fuxcel, index: number) => void)): void {
		(<[]>this.toArray).forEach((el, i) => callback(fx(el), i));
	}
	
	// ─── Attribute / Property / Style Accessors ───────────────────────────────
	attrib(name: object): Fuxcel;
	attrib(name: string): string;
	attrib(name: string, value: string | boolean): Fuxcel;
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
	 * @return {Fuxcel|string}
	 */
	attrib(name: string | object, value?: boolean | string | null): Fuxcel | string | null {
		const selected: IterableElement = <HTMLElement[]>this.toArray;
		return selected.length ? <Fuxcel | string>(name && !value && isString(name) ?
				<string>selected[0].getAttribute(<string>name) :
				<Fuxcel>(isObject(name) ?
					this.#_setAttrib(name) :
					this.#_setAttrib(name, <string>value))
		) : null;
	}
	
	dataAttrib(name: object): Fuxcel;
	dataAttrib(name: string): string;
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
	 * @param name {string|Object} Name of the [data-*] attribute or a Key-Value pair Object.
	 * @param value {string|null = null} Value to set for the [data-*] attribute; Not required if an Object is passed as an argument to the name parameter.
	 * @return {Fuxcel|string}
	 */
	dataAttrib(name: string | object, value?: boolean | string | null): Fuxcel | string {
		const selected: IterableElement = <HTMLElement[]>this.toArray;
		const formatted = this.#_formatDataAttrib(<string>name);
		return <Fuxcel | string>(
			name && !value && isString(name)
				? <string>selected[0].dataset[formatted]
				: <Fuxcel>(isObject(name) ? this.#_setDataAttrib(name) : this.#_setDataAttrib(formatted, <string>value))
		);
	}
	
	prop(name: object): Fuxcel;
	prop(name: string): string;
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
	 * @param name {string|Object} Name of the property or a Key-Value pair Object.
	 * @param value {boolean|string|null = null} Value to set for the property; Not required if an Object is passed as an argument to the name parameter.
	 * @return {Fuxcel|string}
	 */
	prop(name: string | object, value?: boolean | string | null): Fuxcel | string {
		const selected: IterableElement = <HTMLElement[]>this.toArray;
		return <Fuxcel | string>(
			name && !value && isString(name)
				? <string>selected[0][<keyof HTMLElement>name]
				: <Fuxcel>(isObject(name) ? this.#_setProp(name) : this.#_setProp(name, <string>value))
		);
	}
	
	style(name: object): Fuxcel;
	style(name: string): string;
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
	 * @param name {string|Object} Name of the style or a Key-Value pair Object.
	 * @param value {boolean|string|null = null} Value to set for the style; Not required if an Object is passed as an argument to the name parameter.
	 * @return {Fuxcel|string}
	 */
	style(name: string | object, value?: boolean | string | null): Fuxcel | string {
		const selected: IterableElement = <HTMLElement[]>this.toArray;
		return <Fuxcel | string>(
			name && !value && isString(name)
				? <string>window.getComputedStyle(selected[0]).getPropertyValue(<string>name)
				: <Fuxcel>(isObject(name) ? this.#_setStyle(name) : this.#_setStyle(name, <string>value))
		);
	}
	
	/**
	 * Returns the attributes of the selected element as on Object.
	 *
	 * @return {Object} An object containing the attributes of the selected element.
	 */
	listAttrib(): object {
		const selected: IterableElement = <HTMLElement[]>this.toArray;
		const list: Record<string, string> = {};
		Array.from((<HTMLElement>selected[0]).attributes).forEach((a: Attr) => (list[a.name] = a.value));
		return list;
	}
	
	/**
	 * Returns the properties of the selected element as on Object.
	 *
	 * @return {Object} An object containing the properties of the selected element.
	 */
	listProp(): object {
		const selected: IterableElement = <HTMLElement[]>this.toArray;
		const list: Record<string, string> = {};
		Object.keys(<HTMLElement>selected[0])
			.filter(p => Number.isNaN(parseInt(p)) && (<any>selected[0])[p])
			.forEach(p => (list[p] = (<any>selected[0])[p]));
		return list;
	}
	
	// ─── DOM Mutation ─────────────────────────────────────────────────────────
	/**
	 * Remove selected element(s) from DOM.
	 *
	 * @return void
	 */
	remove(): void {
		(<HTMLElement[]>this.toArray).forEach(el => el.remove());
	}
	
	/**
	 * Disables or enables the selected element(s).
	 *
	 * @param disabled {boolean} Switch between disabling and enabling the selected element(s).
	 * @return {Fuxcel} Fuxcel Object of the selected element.
	 */
	disable(disabled: boolean = true): Fuxcel {
		this.each(el => {
			if (!el.isFormElement)
				disabled ? el.putClass('disabled') : el.removeClass('disabled');
			else
				disabled ? el.prop({disabled: true}) : el.removeProp('disabled');
		});
		return this;
	}
	
	/**
	 * Removes the given attribute(s) from the selected element.
	 *
	 * @param name {...string} Comma separated strings of [data-*] attribute(s) to remove.
	 * @return {Fuxcel} Fuxcel Object of the selected element
	 */
	removeAttrib(...name: string[]): Fuxcel {
		const selected: IterableElement = <HTMLElement[]>this.toArray;
		selected.length && name.length &&
		selected.forEach((el: HTMLElement) => name.forEach(a => el.removeAttribute(a)));
		return this;
	}
	
	/**
	 * Removes the given [data-*] attribute(s) from the selected element.
	 *
	 * @param name {...string} Comma separated strings of [data-*] attribute(s) to remove.
	 * @return {Fuxcel} Fuxcel Object of the selected element
	 */
	removeDataAttrib(...name: string[]): Fuxcel {
		const selected: IterableElement = <HTMLElement[]>this.toArray;
		selected.length && name.length &&
		selected.forEach((el: HTMLElement) =>
			name.forEach(n => {
				const k = this.#_formatDataAttrib(n);
				delete el.dataset[k];
			}));
		return this;
	}
	
	/**
	 * Removes the given property / properties from the selected element.
	 *
	 * @param name {...string} Comma separated strings of property / properties to remove.
	 * @return {Fuxcel} Fuxcel Object of the selected element
	 */
	removeProp(...name: string[]): Fuxcel {
		const selected: IterableElement = <HTMLElement[]>this.toArray;
		selected.length && name.length &&
		selected.forEach((el: HTMLElement) => name.forEach(p => ((<any>el)[p] = null)));
		return this;
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
	insertHTML(value: string, position: (Position | null) = null): Fuxcel {
		const selected: IterableElement = <HTMLElement[]>this.toArray;
		const positions: Record<string, InsertPosition> = {
			affix: 'beforebegin', prefix: 'afterbegin',
			postfix: 'afterend', suffix: 'beforeend',
		};
		if (isString(position) && !positions[<string>position])
			throw `Invalid position option. Valid: 'affix', 'prefix', 'postfix', 'suffix'`;
		selected.forEach((el: HTMLElement) =>
			isString(position)
				? el.insertAdjacentHTML(positions[<string>position], value)
				: (el.innerHTML = value)
		);
		return this;
	}
	
	// ─── Traversal ────────────────────────────────────────────────────────────
	/**
	 * Returns the direct descendants (Children) of the selected element.
	 *
	 * _Returns the child that matches the selector if the selector parameter is passed._
	 *
	 * @param selector {Selector} Selectable string.
	 * @return {Fuxcel} Fuxcel Object of the selected child(ren)
	 */
	children(selector: Selector = null): Fuxcel {
		const selected: IterableElement = <HTMLElement[]>this.toArray;
		const result: HTMLElement[] = [];
		(<HTMLElement[]>Array.from(selected[0].children)).forEach((child: HTMLElement) => {
			if (isString(selector)) {
				if (fx(child).matchSelector(selector)) result.push(child);
			} else result.push(child);
		});
		return fx(result).#_setPrev(this);
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
		const selected: IterableElement = <HTMLElement[]>this.toArray;
		const result: HTMLElement[] = [];
		(<HTMLElement[]>fx('*', selected[0]).toArray).forEach((d: HTMLElement) => {
			if (isString(selector)) {
				if (fx(d).matchSelector(selector)) result.push(d);
			} else result.push(d);
		});
		return fx(result).#_setPrev(this);
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
		const selected: IterableElement = <HTMLElement[]>this.toArray;
		const result: HTMLElement[] = [];
		let parentNode = selected[0].parentNode;
		while (parentNode) {
			if (isString(selector)) {
				if (parentNode.constructor.name.toLowerCase().includes('element')) {
					if (fx(parentNode).matchSelector(selector)) {
						result.push(<HTMLElement>parentNode);
						break;
					}
				} else break;
			} else {
				if (parentNode !== selected[0]) result.push(<HTMLElement>parentNode);
			}
			parentNode = parentNode.parentNode;
		}
		return fx(result).#_setPrev(this);
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
		const selected: IterableElement = <HTMLElement[]>this.toArray;
		const result: HTMLElement[] = [];
		let prev = selected[0].previousElementSibling;
		while (prev) {
			if (isString(selector)) {
				if (fx(prev).matchSelector(selector)) {
					result.push(<HTMLElement>prev);
					break;
				}
			} else {
				if (prev !== selected[0]) result.push(<HTMLElement>prev);
			}
			prev = prev.previousElementSibling;
		}
		return fx(result).#_setPrev(this);
	}
	
	/**
	 * Returns the siblings of the selected element.
	 *
	 * _Returns the siblings that matches the selector if the selector parameter is passed._
	 *
	 * @param selector {Selector} Selectable string.
	 * @return {Fuxcel} Fuxcel Object of the selected sibling(s)
	 */
	siblings(selector: Selector = null): Fuxcel {
		const selected: IterableElement = <HTMLElement[]>this.toArray;
		const result: HTMLElement[] = [];
		Array.from(<ArrayLike<any>>selected[0].parentNode?.children).forEach((sib: HTMLElement) => {
			if (isString(selector)) {
				if (fx(sib).matchSelector(selector) && sib !== selected[0]) result.push(sib);
			} else {
				if (sib !== selected[0]) result.push(sib);
			}
		});
		return fx(result).#_setPrev(this);
	}
	
	// ─── Element Checks ───────────────────────────────────────────────────────
	/**
	 * Checks if the selected element matches the given tag name.
	 *
	 * @param tagName {string|HTMLElementTagNameMap} HTML tag name to check for.
	 * @return {boolean} true if the selected elements' tag name matches the given tag name; false otherwise.
	 */
	isElement(tagName: string | HTMLElementTagNameMap): boolean {
		const selected: IterableElement = <HTMLElement[]>this.toArray;
		if (isString(tagName)) return selected[0].tagName.toLowerCase() === tagName.toString().toLowerCase();
		throw `\`isElement()\` expects 1 string argument.`;
	}
	
	/**
	 * Checks to see if the selected element would be selected by the provided selectorString _-- in other words --_ checks if the selected element "is" the selector.
	 *
	 * @param selector {Selector} Selector to check element against.
	 * @return {boolean} true if the selected element would be selected; false otherwise.
	 */
	matchSelector(selector: Selector): boolean {
		const selected: IterableElement = <HTMLElement[]>this.toArray;
		if (isString(selector)) return (selected[0].matches).call(selected[0], <string>selector);
		throw `\`matchSelector()\` expects 1 argument. 0 given`;
	}
	
	/**
	 * Check if the selected element has a scrollbar in the given direction.
	 *
	 * @param direction {('vertical'|'horizontal'|null)} Specific direction to check _[horizontal or vertical]_.
	 * @return {boolean} true if the selected element has a scrollbar in the specified direction; false otherwise.
	 */
	hasScrollBar(direction: (Direction | null) = 'vertical'): boolean {
		const selected: IterableElement = <HTMLElement[]>this.toArray;
		const scroll: Record<string, string> = {vertical: 'scrollHeight', horizontal: 'scrollWidth'};
		const client: Record<string, string> = {vertical: 'clientHeight', horizontal: 'clientWidth'};
		if (isString(direction) && scroll[<string>direction])
			return <number>(selected[0][<keyof HTMLElement>scroll[<string>direction]]) > <number>(selected[0][<keyof HTMLElement>client[<string>direction]]);
		throw `\`hasScrollBar()\` expects 1 argument. 0 given.`;
	}
	
	// ─── Form Helpers ─────────────────────────────────────────────────────────
	/**
	 * Toggle the disabled state (property) of the selected element [a button preferably].
	 *
	 * @param isLoading {boolean} Determines the state of the button.
	 * @return {Promise<Fuxcel>} Promise of Fuxcel Object of the selected element.
	 */
	toggleButtonLoadState(isLoading: boolean = true): Promise<Fuxcel> {
		return new Promise(resolve => {
			const selected: IterableElement = <HTMLElement[]>this.toArray;
			const button = fx(selected[0]);
			const loaderElement = fx(Fuxcel.buttonLoaderClass, button);
			const resolveDisable = (disabled = true) => {
				button.disable(disabled);
				resolve(button);
			};
			
			if (isLoading) {
				if (!button.prop('disabled') || !button.attrib('disabled'))
					if (loaderElement.length && loaderElement.style('display') === 'none')
						loaderElement.fadein().then(() => resolveDisable());
					else resolveDisable();
			} else {
				if (loaderElement.length && loaderElement.style('display') !== 'none')
					loaderElement.fadeout().then(() => resolveDisable(false));
				else resolveDisable(false);
			}
		});
	}
	
	/**
	 * Toggles the submit button state of the selected form.
	 *
	 * @param isLoading {boolean} Determines the state of the button.
	 * @return {Promise<Fuxcel>} Promise of Fuxcel Object of the selected element.
	 */
	toggleFormSubmitButtonState(isLoading: boolean = true): Promise<Fuxcel> {
		return new Promise(resolve => {
			const selected: IterableElement = <HTMLFormElement[]>this.toArray;
			if (this.isElement('form')) {
				const submitButton = fx('button[type="submit"]', <SingleElement>selected[0]).length
					? fx('button[type="submit"]', <SingleElement>selected[0])
					: fx(`button[form="${(<HTMLFormElement>(<SingleElement>selected[0])).id}"]`);
				submitButton.toggleButtonLoadState(isLoading).then(btn => resolve(btn));
			} else
				console.warn('Non form element given.');
		});
	}
	
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
	handleFormSubmit({uri = '', method = null, data = null, dataType = 'json', headers = null, beforeSend = null, timeout = 10000, handleError = false,}: FXFormSubmitType = {}): Promise<any> {
		const selected: IterableElement = <HTMLElement[]>this.toArray;
		
		return new Promise((resolve, reject) =>
			selected.forEach((element: HTMLElement) => {
				if (fx(element).isElement('form')) {
					const form = fx(element).formValidator;
					const formData = new FormData(<HTMLFormElement>element);
					// @ts-ignore
					data && Object.keys(data).length && Object.keys(data).forEach(k => Array.isArray((<any>data)[k]) ?
						formData.append((<any>data)[k][0], (<any>data)[k][1], (<any>data)[k][2]) :
						formData.append(k, (<any>data)[k])
					);
					
					if (!uri?.length && form.attrib('action')) uri = form.attrib('action');
					if (!method && form.attrib('method')) method = <HTTPRequestMethod>form.attrib('method');
					
					!form.errorCount ?
						isFunction(fx.fetch) && fx.fetch({
							uri: <string>uri,
							method: <HTTPRequestMethod>method,
							headers: headers,
							data: formData,
							dataType: dataType,
							timeout: timeout,
							beforeSend() {
								isFunction(beforeSend) && (<Function>beforeSend)(form);
							},
							onError(err: any, status: number) {
								reject({response: err, status, form});
							},
							onComplete(xhr: any, status: number) {
								if (dataType === 'json') {
									const response = xhr.responseJSON;
									if ((status > 199 && status < 300) || status === 308) {
										resolve({JSON: response, text: xhr.responseText, status, form});
									} else {
										// const {fxModal} = require('../modal/fxModal');
										// const fxModal = Fuxcel._fxModal;
										if (status === 401)
											fx.modal({type: 'error', content: response.message ?? 'Unauthorized Request', cancelButtonText: 'Cancel', onCancel: () => form.toggleFormSubmitButtonState(false)});
										if (status === 419)
											setTimeout(() => response.redirect ? (location.href = response.redirect) : location.reload(), 2000);
										else if (status === 422 || status === 500)
											form.toggleFormSubmitButtonState(false).then(() => {
												if (handleError && status === 422)
													response.errors ?
														(response.message ? form.renderValidationErrors(response.errors, response.message) : form.renderValidationErrors(response.errors)) :
														(response.message && form.renderValidationErrors({}, response.message));
												else resolve({JSON: response, status, form});
											});
										else {
											console.error('Server Failure', xhr);
											reject({response: xhr, status, form});
										}
									}
								} else {
									if ((status > 199 && status < 300) || status === 308)
										resolve({text: xhr.responseText, form});
									else reject({response: xhr, status, form});
								}
							},
						}) : form.renderValidationErrors(<{ [key: string]: any; }>form.errorBag);
				}
			})
		);
	}
	
	// ─── Events ───────────────────────────────────────────────────────────────
	/**
	 * _Remove the given Event Listener(s) from the selected element._
	 *
	 * _Removes all previous Event Listeners from the selected element if no event is given._
	 *
	 * @param events {...string} Particular event to remove.
	 * @return {Fuxcel} Fuxcel Object of the selected element.
	 */
	off(...events: string[]): Fuxcel {
		const selected: IterableElement = <HTMLElement[]>this.toArray;
		selected.forEach((element: HTMLElementWithListenerArray) => {
			element.listeners && element.listeners.forEach((listener, index) => {
				if (events?.length) {
					events.forEach(event => {
						if (listener.event.toLowerCase() === event?.toLowerCase()) {
							element.removeEventListener(listener.event, <any>listener.listener, listener.option);
							(<[]>element.listeners).splice(index, 1);
						}
					});
				} else {
					element.removeEventListener(listener.event, <any>listener.listener, listener.option);
					delete element.listeners;
				}
			});
		});
		return this;
	}
	
	/**
	 * Add given Event Listener to the selected element.
	 *
	 * @param events {string} Event
	 * @param listener {((e: EventInterfaces)=>any)}
	 * @param option {boolean}
	 */
	upon(events: string, listener: ((e: EventInterfaces) => any), option?: boolean): Fuxcel
	upon(events: string[], listener: ((e: EventInterfaces) => any), option?: boolean): Fuxcel
	upon(events: EventListenerOrEventListenerObject | object, listener?: boolean): Fuxcel
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
	 * @param listener {((e: EventInterfaces) => any)} Listener function to handle given event.
	 * @param {boolean} [option] Optional boolean parameter to set CAPTURING_PHASE of the event listener to either true or false.
	 * @return {Fuxcel} Fuxcel Object of the selected element
	 *
	 * @param events {Object} Events passed as a Key-Value pair with each event as the key and the listener functions as the values
	 * @param  {boolean} [listener] Optional boolean parameter to set CAPTURING_PHASE of the event listener to either true or false.
	 * @return {Fuxcel} Fuxcel Object of the selected element
	 */
	upon(events: EventInterfaces | string | string[] | object, listener?: ((e: EventInterfaces) => any) | boolean, option: boolean = true): Fuxcel {
		const selected: IterableElement = <HTMLElement[]>this.toArray;
		if (isObject(events) && listener === undefined) listener = true;
		
		selected.forEach((element: HTMLElementWithListenerArray) => {
			if (!element.listeners) element.listeners = [];
			
			if (Array.isArray(events) && events.length) {
				events.forEach((event: keyof HTMLElementEventMap) => {
					element.addEventListener(event, <any>listener, option);
					(<any>element.listeners).push({element, listener, event, option});
				});
			} else if (isObject(events)) {
				Object.keys(events).forEach(event => {
					element.addEventListener(<any>event, (<any>events)[event], <any>listener);
					(<any>element.listeners).push({element, listener: (<any>events)[event], event, option: listener});
				});
			} else {
				const event = <string>events;
				element.addEventListener(event, <any>listener, option);
				element.listeners.push({element, listener: <any>listener, event, option});
			}
		});
		return this;
	}
	
	/**
	 * Trigger a new event on the selected element(s).
	 *
	 * @param {string} event
	 * @param {"mouse" | "keyboard" | "custom" | null} type
	 * @returns {Fuxcel}
	 */
	trigger(event: string, type: ('mouse' | 'keyboard' | 'custom' | null) = null): Fuxcel {
		const selected: IterableElement = <HTMLElement[]>this.toArray;
		const match: Record<string, any> = {mouse: MouseEvent, custom: CustomEvent, keyboard: KeyboardEvent};
		const InitEvent = !type ? Event : match[type.toLowerCase()];
		const newEvent = new InitEvent(event, {bubbles: true, cancelable: true});
		selected.forEach((el: HTMLElement) => el.dispatchEvent(newEvent));
		return this;
	}
	
	// ─── Value ────────────────────────────────────────────────────────────────
	value(): string | null;
	value(value: any): Fuxcel;
	/**
	 * Get or set the value of the selected element.
	 *
	 * @param value {string|null=null} Value to set for the given element (If available).
	 * @return {Fuxcel|string|null} The value of the selected element if no parameter is passed for value; Fuxcel object of the selected element otherwise.
	 */
	value(value: any = null): Fuxcel | string | null {
		const selected: IterableElement = <HTMLFormElement[]>this.toArray;
		if (isString(value) || isDefined(value)) {
			selected.forEach((el: HTMLElement) =>
				parseBool(el.contentEditable)
					? (el.innerText = value.toString())
					: ((<HTMLFormElement>el).value = value.toString())
			);
			return this;
		}
		return parseBool((<HTMLElement>selected[0]).contentEditable)
			? (<HTMLElement>selected[0]).innerText
			: (<HTMLFormElement>selected[0]).value;
	}
	
	testValidateAfter(formGroup: any) {
		const form = this.formValidator;
		const group = fx(formGroup).toArray;
		return form.validateFromGroup(<HTMLElement>group[0]);
	}
}

// ─── fx() Factory Function ────────────────────────────────────────────────────

/**
 * Creates a new `Fuxcel` object wrapping the selected element(s).
 *
 * Equivalent to `$(selector)` in jQuery. Also available as `fuxcel()`.
 *
 * Static helpers (`.fetch`, `.modal`, `.onDocumentLoad`, `.passLuhnAlgo`)
 * are attached in `src/index.ts` during bootstrap.
 *
 * @param selector {string | IterableElement | SingleElement} CSS selector or element(s).
 * @param context  {string | IterableElement | SingleElement | null} Optional scoping context.
 * @returns {Fuxcel}
 *
 * @example
 * fx('#btn').upon('click', fn);
 * fx('#btn').fadein(300);
 * fx.fetch({ uri: '/api', method: 'post' });
 * fx.modal({ type: 'success', content: 'Done!' });
 */
export const fx = function (
	selector: string | IterableElement | SingleElement,
	context: string | IterableElement | SingleElement | null = null
): Fuxcel {
	return new Fuxcel(selector, context);
} as FXInterface;
