import { IterableElement, StringOrNull, Selector, Direction, Position, FXInterface, FXFormSubmitType, FuxcelInstance, FXFormResponse } from '../types';
import { FuxcelBase } from './FuxcelBase';
import { FuxcelValidator } from '../validator/FuxcelValidator';
import { FuxcelModal } from '../modal/FuxcelModal';
/**
 * Core Fuxcel class.
 * Wraps one or more DOM elements and exposes a fluent, chainable API for
 * DOM manipulation, traversal, event handling, and animations.
 */
export declare class Fuxcel extends FuxcelBase implements FuxcelInstance {
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
     * @param {string} event
     * @param {"mouse" | "keyboard" | "custom" | null} type
     * @returns {Fuxcel}
     */
    trigger(event: string, type?: ('mouse' | 'keyboard' | 'custom' | null)): Fuxcel;
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
    testValidateAfter(formGroup: any): void;
}
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
export declare const fx: FXInterface;
//# sourceMappingURL=Fuxcel.d.ts.map