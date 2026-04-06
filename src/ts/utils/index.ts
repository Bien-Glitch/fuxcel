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
 * Handles: true, 'true', 1, '1', 'on', 'yes' → true; everything else → false.
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

export function pushPropsToWindow(prop: Record<string, any>): void;
export function pushPropsToWindow(prop: string, value: any): void;
/**
 * Expose one or more properties onto the global `window` object.
 */
export function pushPropsToWindow(prop: string | Record<string, any>, value?: any): void {
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
		 * Convert string to title-cased string.
		 *
		 * @param separator {boolean=false} Preserve separators (spaces, hyphens, underscores) in output.
		 */
		toTitleCase(separator?: boolean): string;
	}
}

String.prototype.toTitleCase = function (separators: boolean = false): string {
	const value = this;
	let titleCased = '';
	const valueSplit = value.split(separators ? /([ _-])/gi : /[ _-]/gi);
	
	valueSplit.forEach((word: string, key: number) => {
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
	private status: number;
	private code: string;
	
	constructor(message = 'Request timed out', status = 408, code = 'ETIMEDOUT') {
		super(message);
		this.name = 'TimeoutError';
		this.status = status;
		this.code = code;
	}
}
