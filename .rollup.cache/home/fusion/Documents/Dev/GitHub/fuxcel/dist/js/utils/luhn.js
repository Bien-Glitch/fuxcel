/**
 * Check if the given input passes the Luhn Algorithm test.
 * Commonly used to validate credit card numbers.
 *
 * @param input {string | number} The number to validate.
 * @example
 * fx.passLuhnAlgo('4532015112830366'); // true
 * @returns {boolean} `true` if the number passes the Luhn check; `false` otherwise.
 */
export const passLuhnAlgo = (input) => {
    const digitSum = (c) => c < 10 ? c : digitSum(Math.trunc(c / 10) + (c % 10));
    return String(input)
        .split('')
        .reverse()
        .map(Number)
        .map((value, index) => index % 2 !== 0 ? digitSum(value * 2) : value)
        .reduce((prev, curr) => prev + curr) % 10 === 0;
};
//# sourceMappingURL=luhn.js.map