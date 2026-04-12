import { IterableElement, StringOrNull, ValidatorConfigObject, ValidationProps, FXModalType, FuxcelValidatorInstance } from '../types';
import { Fuxcel } from '../core/Fuxcel';
import { FuxcelSteps } from './FuxcelSteps';
/**
 * Form validation engine.
 * Extends `Fuxcel` with rich real-time validation, error-bag tracking,
 * field-type detection, and step-form support.
 */
export declare class FuxcelValidator extends Fuxcel implements FuxcelValidatorInstance {
    #private;
    /**
     * Injectable FuxcelSteps constructor.
     * Populated by index.ts to break the FuxcelValidator → FuxcelSteps circular dependency.
     * @internal
     */
    static _stepsFactory: (new (selected: FuxcelValidator) => any) | null;
    /**
     * Injectable fxModal function.
     * Populated by index.ts to break the FuxcelValidator → fxModal circular dependency.
     * @internal
     */
    static _fxModal: ((options?: FXModalType) => any) | null;
    constructor(selector: string | IterableElement | any, context?: string | IterableElement | any);
    validateFromGroup(formGroup: HTMLElement): void;
    /** Checks if the selected field element can be validated by checking thw value of `[data-fx-validate]` data-attribute or the parent form-group is not hidden. **/
    get canBeValidated(): boolean;
    /** Get the error bag for the current selected form. **/
    get errorBag(): object | null;
    /** Get the error count for the current selected form. **/
    get errorCount(): number;
    /** An object containing the error bag and error count for the current selected form(s). Logs an error to the console if selected element(s) not form element(s). **/
    get getErrors(): object | void;
    /** An object containing all form field elements for the current selected form(s). Logs an error to the console if selected element(s) not form element(s). **/
    get formFieldElements(): object | void;
    /** Checks if the selected form field element is an email field. **/
    get isEmailField(): boolean;
    /** Checks if the selected form field element is a name field. **/
    get isNameField(): boolean;
    /** Checks if the selected form field element is a password field. **/
    get isPasswordField(): boolean;
    /** Checks if the selected form field element is a phone field. **/
    get isPhoneField(): boolean;
    /** Checks if the selected form field element is a username field. **/
    get isUsernameField(): boolean;
    get stepFromField(): number;
    /** Returns the `ValidationProps` of the selected form field element. **/
    get validationProps(): ValidationProps;
    /** Returns the current `ValidatorConfigObject` options of selected form. **/
    get validatorConfig(): ValidatorConfigObject;
    /** Returns the default Form Validator Configuration Object. **/
    static get defaultValidatorConfig(): ValidatorConfigObject;
    /** Returns the Password capslock alert class selector **/
    static get passwordCapslockAlertClass(): string;
    /** Returns the Password toggler icon class selector **/
    static get passwordTogglerIconClass(): string;
    static get stepsClass(): string;
    static set stepsClass(selector: string);
    /**
     * Initialize validation on selected form(s) _[Must be an instance of FuxcelValidator]_.
     *
     * _Throws an error if non form elements are selected._
     *
     * @param config {ValidatorConfigObject} user config object.
     * @return {FuxcelSteps | FuxcelValidator} Fuxcel Validator Object of the forms.
     */
    init(config?: ValidatorConfigObject | null): FuxcelSteps | FuxcelValidator;
    /** Reset validation message. **/
    renderMessage(): FuxcelValidator;
    /**
     * Render validation message.
     *
     * @param message {StringOrNull} message to display.
     * @return {FuxcelValidator} Fuxcel Validator Object of the current selected element.
     */
    renderMessage(message?: StringOrNull): FuxcelValidator;
    /**
     * Render validation message.
     *
     * @param message {string} message to display.
     * @param renderClass {string} validation type.
     * @return {FuxcelValidator} Fuxcel Validator Object of the current selected element.
     */
    renderMessage(message: string, renderClass: string): FuxcelValidator;
    /**
     * Display all validation errors for the selected form.
     *
     * @param errors {{ [key: string]: any }}
     * @return FuxcelValidator
     */
    renderValidationErrors(errors: {
        [key: string]: any;
    }): FuxcelValidator;
    /**
     * Display all validation errors for the selected form.
     *
     * @param errors {null}
     * @param messageOrFn {((fx: FuxcelValidator, e?: CustomEvent) => any)}
     * @return FuxcelValidator
     */
    renderValidationErrors(errors: null, messageOrFn: ((fx: FuxcelValidator, e?: CustomEvent) => any)): FuxcelValidator;
    /**
     * Display all validation errors for the selected form.
     *
     * @param errors {null}
     * @param messageOrFn {string}
     * @return FuxcelValidator
     */
    renderValidationErrors(errors: null, messageOrFn: string): FuxcelValidator;
    /**
     * Display all validation errors for the selected form.
     *
     * @param errors {{ [key: string]: any }} An object containing the errors. The keys are the form field ids and their values are the errors for the fields respectively.
     * @param messageOrFn {((fx: FuxcelValidator, e?: CustomEvent) => any)}
     * @return FuxcelValidator
     */
    renderValidationErrors(errors: {
        [key: string]: any;
    }, messageOrFn: ((fx: FuxcelValidator, e?: CustomEvent) => any)): FuxcelValidator;
    /**
     * Display all validation errors for the selected form.
     *
     * @param errors {{ [key: string]: any }} An object containing the errors. The keys are the form field ids and their values are the errors for the fields respectively.
     * @param messageOrFn {string}
     * @return FuxcelValidator
     */
    renderValidationErrors(errors: {
        [key: string]: any;
    }, messageOrFn: string): FuxcelValidator;
    /**
     * Display all validation errors for the selected form.
     *
     * @param errors {{ [key: string]: any }} An object containing the errors. The keys are the form field ids and their values are the errors for the fields respectively.
     * @param messageOrFn {((fx: FuxcelValidator, e?: CustomEvent) => any)}
     * @param callbackFn {((fx: FuxcelValidator, e?: CustomEvent) => any)}
     * @return FuxcelValidator
     */
    renderValidationErrors(errors: {
        [key: string]: any;
    }, messageOrFn: ((fx: FuxcelValidator, e?: CustomEvent) => any), callbackFn: ((fx: FuxcelValidator, e?: CustomEvent) => any)): FuxcelValidator;
    /**
     * Display all validation errors for the selected form.
     *
     * @param errors {{ [key: string]: any }} An object containing the errors. The keys are the form field ids and their values are the errors for the fields respectively.
     * @param messageOrFn {string}
     * @param callbackFn {((fx: FuxcelValidator, e?: CustomEvent) => any)}
     * @return FuxcelValidator
     */
    renderValidationErrors(errors: {
        [key: string]: any;
    }, messageOrFn: string, callbackFn: ((fx: FuxcelValidator, e?: CustomEvent) => any)): FuxcelValidator;
    /**
     * Show validation error for the selected field.
     *
     * @return {void}
     */
    showError(): void;
    /**
     * Show validation error for the selected field.
     *
     * @param message {StringOrNull} Validation message.
     * @return {void}
     */
    showError(message: StringOrNull): void;
    /**
     * Show validation success.
     *
     * @return {void}
     */
    showSuccess(): void;
    /**
     * Show validation success.
     *
     * @param message {StringOrNull} Validation message.
     * @return {void}
     */
    showSuccess(message: StringOrNull): void;
    /**
     * Toggle between validating and removing validation from the selected field.
     *
     * @return {FuxcelValidator} Fuxcel Validator Object of the forms.
     */
    toggleValidation(): FuxcelValidator;
    /**
     * Remove validation from the selected field element. Also remove the error from the error bag if destroyValidation parameter is set tot true.
     *
     * @param destroyValidation {boolean = false}
     * @return {FuxcelValidator} Fuxcel Validator Object of the forms.
     */
    undoValidation(destroyValidation?: boolean): FuxcelValidator;
    stepErrorBag(step: number | string): object | null;
    stepErrorCount(step: number | string): number;
    /**
     * Validate Card CVV field using Regular Expression
     *
     * @param regExp {RegExp} Regular expression to use.
     * @return {FuxcelValidator} Fuxcel Validator Object of the selected element.
     */
    validateCardCVV(regExp: RegExp): FuxcelValidator;
    /**
     * Validate Card CVV field using Regular Expression
     *
     * @param regExp {RegExp} Regular expression to use.
     * @param customFormatEx {StringOrNull} Custom format example to show user.
     * @return {FuxcelValidator} Fuxcel Validator Object of the selected element.
     */
    validateCardCVV(regExp: RegExp, customFormatEx: StringOrNull): FuxcelValidator;
    /**
     * Validate Card Number field using Regular Expression
     *
     * @param regExp {RegExp} Regular expression to use.
     * @return {FuxcelValidator} Fuxcel Validator Object of the selected element.
     */
    validateCardNumber(regExp: RegExp): FuxcelValidator;
    /**
     * Validate Card Number field using Regular Expression
     *
     * @param regExp {RegExp} Regular expression to use.
     * @param customFormatEx {StringOrNull} Custom format example to show user
     * @return {FuxcelValidator} Fuxcel Validator Object of the selected element.
     */
    validateCardNumber(regExp: RegExp, customFormatEx: StringOrNull): FuxcelValidator;
    /**
     * Validate Email field using Regular Expression
     *
     * @param regExp {RegExp} Regular expression to use.
     * @return {FuxcelValidator} Fuxcel Validator Object of the selected element.
     */
    validateEmail(regExp: RegExp): FuxcelValidator;
    /**
     * Validate Email field using Regular Expression
     *
     * @param regExp {RegExp} Regular expression to use.
     * @param customFormatEx {StringOrNull} Custom format example to show user.
     * @return {FuxcelValidator} Fuxcel Validator Object of the selected element.
     */
    validateEmail(regExp: RegExp, customFormatEx: StringOrNull): FuxcelValidator;
    /** Validate the selected field. **/
    validateField(): FuxcelValidator;
    /**
     * Validate the selected field.
     *
     * _Automatically generates and displays an error message._
     *
     * @param isError {boolean=false} an automatic error message is generated.
     * @return {FuxcelValidator} Fuxcel Validator Object of the selected element.
     */
    validateField(isError: boolean): FuxcelValidator;
    /**
     * Validate the selected field.
     *
     * _Displays a success message._
     *
     * @param message {string} Validation message to display.
     * @returns {FuxcelValidator}
     */
    validateField(message: string): FuxcelValidator;
    /**
     * Validate the selected field.
     *
     * @param message {StringOrNull} Validation message to display.
     * @param isError {boolean=false} Is Validation message an error? _[defaults to false]._
     * @return {FuxcelValidator} Fuxcel Validator Object of the selected element.
     */
    validateField(message: StringOrNull, isError?: boolean): FuxcelValidator;
    /**
     * Validate Name field using Regular Expression
     *
     * @param regExp {RegExp} Regular expression to use.
     * @return {FuxcelValidator} Fuxcel Validator Object of the selected element.
     */
    validateName(regExp: RegExp): FuxcelValidator;
    /**
     * Validate Name field using Regular Expression
     *
     * @param regExp {RegExp} Regular expression to use.
     * @param customFormatEx {StringOrNull} Custom format example to show user.
     * @return {FuxcelValidator} Fuxcel Validator Object of the selected element.
     */
    validateName(regExp: RegExp, customFormatEx: StringOrNull): FuxcelValidator;
    /**
     * Validate Password field using Regular Expression
     *
     * @param regExp {RegExp} Regular expression to use
     * @return {FuxcelValidator} Fuxcel Validator Object of the selected element.
     */
    validatePassword(regExp: RegExp): FuxcelValidator;
    /**
     * Validate Password field using Regular Expression
     *
     * @param regExp {RegExp} Regular expression to use
     * @param customFormatEx {StringOrNull} Custom format example to show user.
     * @return {FuxcelValidator} Fuxcel Validator Object of the selected element.
     */
    validatePassword(regExp: RegExp, customFormatEx: StringOrNull): FuxcelValidator;
    /**
     * Validate Phone field using Regular Expression
     *
     * @param regExp {RegExp} Regular expression to use
     * @return {FuxcelValidator} Fuxcel Validator Object of the selected element.
     */
    validatePhone(regExp: RegExp): FuxcelValidator;
    /**
     * Validate Phone field using Regular Expression
     *
     * @param regExp {RegExp} Regular expression to use
     * @param customFormatEx {StringOrNull} Custom format example to show user.
     * @return {FuxcelValidator} Fuxcel Validator Object of the selected element.
     */
    validatePhone(regExp: RegExp, customFormatEx: StringOrNull): FuxcelValidator;
    /**
     * Validate field using a callback function.
     *
     * @param regExpOrFn {Function} Function to use.
     * @return {FuxcelValidator} Fuxcel Validator Object of the selected element.
     */
    validateRegex(regExpOrFn: Function): FuxcelValidator;
    /**
     * Validate field using Regular Expression.
     *
     * @param regExpOrFn {RegExp} Regular Expression to use.
     * @param message {StringOrNull} Validation message.
     * @return {FuxcelValidator} Fuxcel Validator Object of the selected element.
     */
    validateRegex(regExpOrFn: RegExp, message: StringOrNull): FuxcelValidator;
    /**
     * Validate Username field using Regular Expression
     *
     * @param regExp {RegExp} Regular expression to use
     * @return {FuxcelValidator} Fuxcel Validator Object of the selected element.
     */
    validateUsername(regExp: RegExp): FuxcelValidator;
    /**
     * Validate Username field using Regular Expression
     *
     * @param regExp {RegExp} Regular expression to use
     * @param customFormatEx {StringOrNull} Custom format example to show user.
     * @return {FuxcelValidator} Fuxcel Validator Object of the selected element.
     */
    validateUsername(regExp: RegExp, customFormatEx: StringOrNull): FuxcelValidator;
}
//# sourceMappingURL=FuxcelValidator.d.ts.map