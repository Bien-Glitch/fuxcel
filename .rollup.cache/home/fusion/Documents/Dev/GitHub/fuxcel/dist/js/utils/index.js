// ─── Type Guards & Helpers ────────────────────────────────────────────────────
/**
 * Checks if the given value is of type boolean.
 */
export const isBool = (value) => typeof value === 'boolean';
/**
 * Checks if the given value is defined (not null, not undefined, not empty string).
 */
export const isDefined = (value) => value !== undefined && value !== null && value !== '';
/**
 * Checks if the given value is of type function.
 */
export const isFunction = (value) => typeof value === 'function';
/**
 * Checks if the given value is of type object.
 */
export const isObject = (value) => typeof value === 'object';
/**
 * Checks if the given value is of type string.
 */
export const isString = (value) => typeof value === 'string';
/**
 * Parse the given value and get its boolean equivalent.
 *
 * Handles: `true, 'true', 1, '1', 'on', 'yes'` → `true`
 *
 * Everything else → `false.`
 */
export const parseBool = (value) => {
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
};
/**
 * Expose one or more properties onto the global `window` object.
 *
 * @param prop {string | Record<string, any>} Property to expose.
 * @param value {any = null} Value of the property.
 */
export function pushPropsToWindow(prop, value = null) {
    if (typeof window !== 'undefined') {
        if (typeof prop === 'object' && prop !== null)
            Object.assign(window, prop);
        else
            window[prop] = value;
    }
}
String.prototype.toTitleCase = function (separators = false) {
    const value = this;
    let titleCased = '';
    const valueSplit = value.split(separators ? /([ _-])/gi : /[ _-]/gi);
    valueSplit.forEach((word, key) => {
        const wordSplit = word.toLowerCase().split('');
        const firstChar = wordSplit[0];
        wordSplit[0] = wordSplit[0] ? firstChar.toUpperCase() : '';
        titleCased += separators
            ? wordSplit.join('')
            : (wordSplit.join('') + (key <= valueSplit.length - 1 ? ' ' : ''));
    });
    return String(titleCased.trim());
};
// ─── Custom Error ─────────────────────────────────────────────────────────────
export class TimeoutError extends Error {
    status;
    code;
    constructor(message = 'Request timed out', status = 408, code = 'ETIMEDOUT') {
        super(message);
        this.name = 'TimeoutError';
        this.status = status;
        this.code = code;
    }
}
//# sourceMappingURL=index.js.map