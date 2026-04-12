/**
 * Checks if the given value is of type boolean.
 */
export declare const isBool: (value: any) => boolean;
/**
 * Checks if the given value is defined (not null, not undefined, not empty string).
 */
export declare const isDefined: (value: any) => boolean;
/**
 * Checks if the given value is of type function.
 */
export declare const isFunction: (value: any) => boolean;
/**
 * Checks if the given value is of type object.
 */
export declare const isObject: (value: any) => boolean;
/**
 * Checks if the given value is of type string.
 */
export declare const isString: (value: any) => boolean;
/**
 * Parse the given value and get its boolean equivalent.
 *
 * Handles: `true, 'true', 1, '1', 'on', 'yes'` → `true`
 *
 * Everything else → `false.`
 */
export declare const parseBool: (value: any) => boolean;
/**
 * Expose one or more properties onto the global `window` object.
 *
 * @param {Record<string, any>} prop Key-Value pair Properties to expose.
 */
export declare function pushPropsToWindow(prop: Record<string, any>): void;
/**
 * Expose a property onto the global `window` object.
 *
 * @param {string} prop Property to expose.
 * @param {any} value Value of the property.
 */
export declare function pushPropsToWindow(prop: string, value?: any): void;
declare global {
    interface String {
        /**
         * Convert string to title-cased string.
         *
         * @param separator {boolean=false} Preserve separators (spaces, hyphens, underscores) in output.
         */
        toTitleCase(separator?: boolean): string;
    }
}
export declare class TimeoutError extends Error {
    private status;
    private code;
    constructor(message?: string, status?: number, code?: string);
}
//# sourceMappingURL=index.d.ts.map