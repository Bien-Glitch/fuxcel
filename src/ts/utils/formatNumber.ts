import {FxFormatNumber} from '../types';

/**
 * Format a number or numeric string as a locale-aware string with grouped
 * thousands separators and a fixed number of decimal places.
 *
 * This is the unified signature that encompasses all narrower overloads above.
 * String input is coerced to a `number` before formatting — this signature does
 * NOT fall back to `String.prototype.toLocaleString`, which would otherwise
 * silently ignore all formatting options.
 *
 * @param value {number | string} The number, or numeric string, to format.
 * @param fractionDigits {number=2} Number of decimal places to show _(applied as
 *   both `minimumFractionDigits` and `maximumFractionDigits`, so the output
 *   always has exactly this many decimal places)_. Defaults to `2` if omitted.
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
export const formatNumber: FxFormatNumber = function (value: number | string, fractionDigits: number = 2): string {
	const num = typeof value === 'string' ? Number(value) : value;
	
	return num.toLocaleString('en-US', {
		minimumFractionDigits: fractionDigits,
		maximumFractionDigits: fractionDigits,
	});
}
