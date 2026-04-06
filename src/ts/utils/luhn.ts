/**
 * Check if the given input passes the Luhn Algorithm test.
 * Commonly used to validate credit card numbers.
 *
 * @param input {string | number} The number to validate.
 * @returns {boolean} `true` if the number passes the Luhn check; `false` otherwise.
 */
export const passLuhnAlgo = (input: any | string | number): boolean => {
	const digitSum = (c: number): number => c < 10 ? c : digitSum(Math.trunc(c / 10) + (c % 10));

	return String(input)
		.split('')
		.reverse()
		.map(Number)
		.map((value: number, index: number) => index % 2 !== 0 ? digitSum(value * 2) : value)
		.reduce((prev: number, curr: number) => prev + curr) % 10 === 0;
};
