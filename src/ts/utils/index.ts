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
