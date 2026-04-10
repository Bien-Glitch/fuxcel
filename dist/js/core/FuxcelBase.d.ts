import type { IterableElement } from '../types';
/**
 * Base class for the Fuxcel selector engine.
 * Handles element selection, array conversion, and static device helpers.
 */
export declare class FuxcelBase {
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
    /** `true` if the current device is a mobile device. **/
    static get isMobileDevice(): boolean;
    /** `true` if the pointer is coarse (touch). **/
    static get pointerIsTouch(): boolean;
}
