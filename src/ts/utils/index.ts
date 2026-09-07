// ─── Type Guards & Helpers ────────────────────────────────────────────────────
/**
 * Checks if the given value is of type boolean.
 */
export const isBool = (value: any): boolean =>
	typeof value === 'boolean';

/**
 * Checks if the given value is defined (not null, not undefined, not empty string).
 */
export const isDefined = (value: any): boolean =>
	value !== undefined && value !== null && value !== '';

/**
 * Checks if the given value is of type function.
 */
export const isFunction = (value: any): boolean =>
	typeof value === 'function';

/**
 * Checks if the given value is of type object.
 */
export const isObject = (value: any): boolean =>
	typeof value === 'object';

/**
 * Checks if the given value is of type string.
 */
export const isString = (value: any): boolean =>
	typeof value === 'string';

/**
 * Parse the given value and get its boolean equivalent.
 *
 * Handles: `true, 'true', 1, '1', 'on', 'yes'` → `true`
 *
 * Everything else → `false.`
 */
export const parseBool = (value: any): boolean => {
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
 * Format a number as a locale-aware string with grouped thousands separators
 * and a fixed number of decimal places.
 *
 * _Accepts a `number`
 * before formatting to avoid silently falling back to `String.prototype.toLocaleString`,
 * which ignores formatting options entirely._
 *
 * @param value {number} The number to format.
 * @return {string} The formatted number string — with a default value of 2 for the decimal places.
 *
 * @example
 * formatNumber(1234.5);        // '1,234.500'
 *
 * @since 2.2.0
 */
export function formatNumber(value: number): string;
/**
 * Format a number as a locale-aware string with grouped thousands separators
 * and a fixed number of decimal places.
 *
 * _Accepts a numeric `string`
 * before formatting to avoid silently falling back to `String.prototype.toLocaleString`,
 * which ignores formatting options entirely._
 *
 * @param value {number | string} The number (or numeric string) to format.
 * @return {string} The formatted number string — with a default value of 2 for the decimal places.
 *
 * @example
 * formatNumber('1234.5');      // '1,234.500'
 *
 * @since 2.2.0
 */
export function formatNumber(value: string): string;
/**
 * Format a number as a locale-aware string with grouped thousands separators
 * and a fixed number of decimal places.
 *
 * _Accepts a `number`
 * before formatting to avoid silently falling back to `String.prototype.toLocaleString`,
 * which ignores formatting options entirely._
 *
 * @param value {number} The number to format.
 * @param fractionDigits {number=2} Number of decimal places to show _(applied as both
 *   `minimumFractionDigits` and `maximumFractionDigits`)_.
 * @return {string} The formatted number string.
 *
 * @example
 * formatNumber(1234.567, 3);   // '1,234.567'
 *
 * @since 2.2.0
 */
export function formatNumber(value: number, fractionDigits: number): string;
/**
 * Format a number as a locale-aware string with grouped thousands separators
 * and a fixed number of decimal places.
 *
 * _Accepts a numeric `string`
 * before formatting to avoid silently falling back to `String.prototype.toLocaleString`,
 * which ignores formatting options entirely._
 *
 * @param value {string} The numeric string to format.
 * @param fractionDigits {number=2} Number of decimal places to show _(applied as both
 *   `minimumFractionDigits` and `maximumFractionDigits`)_.
 * @return {string} The formatted number string.
 *
 * @example
 * formatNumber('1234.5', 3);      // '1,234.500'
 *
 * @since 2.2.0
 */
export function formatNumber(value: string, fractionDigits: number): string;
/**
 * Format a number as a locale-aware string with grouped thousands separators
 * and a fixed number of decimal places.
 *
 * _Accepts a `number` or numeric `string` — string input is coerced to a number
 * before formatting to avoid silently falling back to `String.prototype.toLocaleString`,
 * which ignores formatting options entirely._
 *
 * @param value {number | string} The number (or numeric string) to format.
 * @param fractionDigits {number=2} Number of decimal places to show _(applied as both
 *   `minimumFractionDigits` and `maximumFractionDigits`)_.
 * @return {string} The formatted number string.
 *
 * @example
 * formatNumber(1234.5);        // '1,234.50'
 * formatNumber('1234.5');      // '1,234.50'
 * formatNumber(1234.567, 3);   // '1,234.567'
 * formatNumber(1234, 0);       // '1,234'
 *
 * @since 2.2.0
 */
export function formatNumber(value: number | string, fractionDigits: number = 2): string {
	const num = typeof value === 'string' ? Number(value) : value;
	
	return num.toLocaleString('en-US', {
		minimumFractionDigits: fractionDigits,
		maximumFractionDigits: fractionDigits,
	});
}

// ─── Window Helper ────────────────────────────────────────────────────────────
/**
 * Expose one or more properties onto the global `window` object.
 *
 * @param {Record<string, any>} prop Key-Value pair Properties to expose.
 */
export function pushPropsToWindow(prop: Record<string, any>): void;
/**
 * Expose a property onto the global `window` object.
 *
 * @param {string} prop Property to expose.
 * @param {any} value Value of the property.
 */
export function pushPropsToWindow(prop: string, value?: any): void;
/**
 * Expose one or more properties onto the global `window` object.
 *
 * @param prop {string | Record<string, any>} Property to expose.
 * @param value {any = null} Value of the property.
 */
export function pushPropsToWindow(prop: string | Record<string, any>, value: any = null): void {
	if (typeof window !== 'undefined') {
		if (typeof prop === 'object' && prop !== null)
			Object.assign(window as any, prop);
		else
			(window as any)[<string>prop] = value;
	}
}

// ─── String Prototype Extension ───────────────────────────────────────────────

declare global {
	interface String {
		/**
		 * Convert string to camel-cased string.
		 */
		toCamelCase(): string;
		
		/**
		 * Convert string to kebab-cased string.
		 */
		toKebabCase(): string;
		
		/**
		 * Convert string to title-cased string.
		 *
		 * @param separator {boolean=false} Preserve separators (spaces, hyphens, underscores) in output.
		 */
		toTitleCase(separator?: boolean): string;
	}
}

String.prototype.toCamelCase = function (): string {
	const value = this;
	let camelCased = '';
	const valueSplit = value.split(/(?=[A-Z _-])/);
	valueSplit.forEach((word: string, key: number) => {
		const replaced = word.replace(/[ _-]/, '');
		if (!key)
			camelCased += replaced.toLowerCase();
		else {
			const wordSplit = replaced.toLowerCase().split('');
			const firstChar = wordSplit[0];
			wordSplit[0] = wordSplit[0].length ? firstChar.toUpperCase() : '';
			camelCased += wordSplit.join('');
		}
	});
	return String(camelCased.trim());
};

String.prototype.toKebabCase = function (): string {
	const value = this;
	const kebabArray: string[] = [];
	const nameSplit = value.toString().split(/(?=[A-Z])/);
	
	nameSplit.forEach(split => kebabArray.push(split.toLowerCase()));
	return kebabArray.join('-');
};

String.prototype.toTitleCase = function (separators: boolean = false): string {
	const value = this;
	let titleCased = '';
	const valueSplit = value.split(separators ? /([ _-])/gi : /[ _-]/gi);
	
	valueSplit.forEach((word: string, key: number) => {
		const wordSplit = word.toLowerCase().split('');
		const firstChar = wordSplit[0];
		wordSplit[0] = wordSplit[0].length ? firstChar.toUpperCase() : '';
		titleCased += separators ?
			wordSplit.join('') :
			(wordSplit.join('') + (key <= valueSplit.length - 1 ? ' ' : ''));
	});
	return String(titleCased.trim());
};

// ─── Custom Error ─────────────────────────────────────────────────────────────

export class TimeoutError extends Error {
	private status: number;
	private code: string;
	
	constructor(message = 'Request timed out', status = 408, code = 'ETIMEDOUT') {
		super(message);
		this.name = 'TimeoutError';
		this.status = status;
		this.code = code;
	}
}
