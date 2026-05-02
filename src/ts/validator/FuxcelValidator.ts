import {
	IterableElement,
	StringOrNull,
	ValidatorConfigObject,
	ValidationProps, FXModalType, FuxcelValidatorInstance, FormValidationRegistryBag, CustomEventType, ExtractedRule,
	StrengthResult,
} from '../types';
import {Fuxcel, fx} from '../core/Fuxcel';
import {isDefined, isObject, isString, parseBool} from '../utils';
import {FuxcelSteps} from './FuxcelSteps';
import {parseRegExpLiteral, visitRegExpAST} from 'regexpp';
import {LookaheadAssertion} from 'regexpp/ast';

/**
 * Form validation engine.
 * Extends `Fuxcel` with rich real-time validation, error-bag tracking,
 * field-type detection, and step-form support.
 */
export class FuxcelValidator extends Fuxcel implements FuxcelValidatorInstance {
	#_fxValidatorConfig: ValidatorConfigObject = FuxcelValidator.defaultValidatorConfig;
	
	// ─── Custom Events ─────────────────────────────────────────────
	/**
	 * On Validator Init
	 *
	 * @type {CustomEventType}
	 */
	static fxValidatorInitEvent: CustomEventType = new CustomEvent('fx.validator.init', {
		bubbles: true,
		cancelable: true,
		detail: {plugin: 'Fuxcel', interface: 'FuxcelValidatorInterface', timestamp: Date.now()},
	});
	
	/**
	 * On Validator Loading
	 *
	 * @type {CustomEventType}
	 */
	static fxValidatorLoadingEvent: CustomEventType = new CustomEvent('fx.validator.loading', {
		bubbles: true,
		cancelable: true,
		detail: {plugin: 'Fuxcel', interface: 'FuxcelValidatorInterface', timestamp: Date.now()},
	});
	
	/**
	 * On Validator Ready
	 *
	 * @type {CustomEventType}
	 */
	static fxValidatorReadyEvent: CustomEventType = new CustomEvent('fx.validator.ready', {
		bubbles: true,
		detail: {plugin: 'Fuxcel', interface: 'FuxcelValidatorInterface', timestamp: Date.now()},
	});
	
	/**
	 * On Validator Init failed
	 *
	 * @type {CustomEventType}
	 */
	static fxValidatorFailedEvent: CustomEventType = new CustomEvent('fx.validator.failed', {
		bubbles: true,
		detail: {plugin: 'Fuxcel', interface: 'FuxcelValidatorInterface', timestamp: Date.now()},
	});
	
	/**
	 * Default Validator configuration.
	 *
	 * @type {ValidatorConfigObject}
	 * @private
	 */
	static #_defaultConfig: ValidatorConfigObject = {
		regExp: {
			cardCVV: /^\d{3,4}$/gi,
			cardNumber: /^(?=.{12,19}$)\d{12,19}$/gi,
			email: /^[a-zA-Z][a-zA-Z0-9._%+\-]{0,63}@[a-zA-Z][a-zA-Z0-9.\-]{0,253}\.[a-zA-Z]{2,}$/gi,
			name: /^([a-zA-Z]{2,255})(\s[a-zA-Z]{2,255}){1,2}$/gi,
			phone: /^\+?(\d{1,3})?[-.\s]?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/g,
			username: /^(?=.{2,255}$)[a-zA-Z][a-zA-Z0-9]*(_[a-zA-Z0-9]+)*[a-zA-Z0-9]?$/gi,
			password: /^(?=.*[a-z]).{8,32}$/gi,
		},
		config: {
			capslockAlert: true,
			showIcons: true,
			showPassword: true,
			validateCard: false,
			validateEmail: true,
			validateName: false,
			validatePassword: true,
			validatePhone: false,
			validateUsername: false,
			nativeValidation: false,
			useDefaultStyling: false,
			showPasswordStrength: false,
			passwordConfirmId: 'password_confirmation',
			passwordId: 'password',
			initWrapper: '.form-group',
		},
		stepForm: {
			use: false,
			plugin: false,
			config: {step: '.fx-step', slides: false, switch: '[data-step]'},
		},
		texts: {
			capslockFormat: '⚠ Caps Lock is on.',
			emailFormat: null,
			nameFormat: null,
			passwordFormat: 'Password requires between 8-32 characters.',
			phoneFormat: null,
			usernameFormat: null,
		},
	};
	
	static #_initSteps: { [key: string]: any } = {};
	static #_stepsClass: string = '.fx-step';
	
	/**
	 * Form Validation Registry.
	 *
	 * @type {FormValidationRegistryBag}
	 * @private
	 */
	static #_registry: FormValidationRegistryBag = {};
	
	/**
	 * Injectable FuxcelSteps constructor.
	 * Populated by index.ts to break the FuxcelValidator → FuxcelSteps circular dependency.
	 * @internal
	 */
	static _stepsFactory: (new (selected: FuxcelValidator) => any) | null = null;
	
	/**
	 * Injectable fxModal function.
	 * Populated by index.ts to break the FuxcelValidator → fxModal circular dependency.
	 * @internal
	 */
	static _fxModal: ((options?: FXModalType) => any) | null = null;
	
	constructor(selector: string | IterableElement | any, context?: string | IterableElement | any) {
		super(selector, context);
	}
	
	// ─── Private Static Helpers ───────────────────────────────────────────────
	/**
	 * Resets the registry slot for a given formId.
	 * Called only on explicit re-init, not on every instance creation.
	 */
	static #_clearFormRegistry(formId: string) {
		FuxcelValidator.#_registry[formId] = {configObject: FuxcelValidator.defaultValidatorConfig, bag: {}, count: 0, steps: {}};
	}
	
	/**
	 * Returns the registry slot for a given formId, creating it if absent.
	 * Never resets an existing slot — use #_clearFormRegistry to do that explicitly.
	 */
	static #_getFormRegistry(formId: string) {
		if (!FuxcelValidator.#_registry[formId])
			FuxcelValidator.#_registry[formId] = {configObject: FuxcelValidator.defaultValidatorConfig, bag: {}, count: 0, steps: {}};
		return FuxcelValidator.#_registry[formId];
	}
	
	static #_calcPasswordStrength(password: string, userRegex?: RegExp | null): StrengthResult | null {
		if (!userRegex) return null;
		
		const rules = FuxcelValidator.#_extractRulesFromRegex(userRegex);
		const passed: string[] = [];
		const failed: string[] = [];
		let score = 0;
		
		for (const rule of rules) {
			if (rule.regex.test(password)) {
				passed.push(rule.name);
				score += rule.weight;
			} else {
				failed.push(rule.name);
			}
		}
		
		// Length bonus — rewards going beyond the minimum
		const lengthRule = rules.find(r => r.name.includes('characters'));
		if (lengthRule) {
			const minMatch = lengthRule.name.match(/\d+/);
			const min = minMatch ? parseInt(minMatch[0]) : 8;
			const bonus = Math.min(Math.floor((password.length - min) / 4), 3) * 3;
			score = Math.min(score + (password.length >= min ? bonus : 0), 100);
		}
		
		const label = score >= 80 ? 'strong' : score >= 60 ? 'good' : score >= 35 ? 'fair' : 'weak';
		const color = label === 'strong' ? '#1D9E75' : label === 'good' ? '#185FA5' : label === 'fair' ? '#BA7517' : '#E24B4A';
		
		return {
			score,
			color,
			label,
			passed,
			failed,
			rules,
		};
	}
	
	static #_extractRulesFromRegex(userRegex: RegExp, flags = 'u'): ExtractedRule[] {
		const ast = parseRegExpLiteral(userRegex.toString());
		const lookaheads: LookaheadAssertion[] = [];
		
		visitRegExpAST(ast, {
			onAssertionEnter(node) {
				if (node.kind === 'lookahead' && !node.negate) {
					lookaheads.push(node);
				}
			}
		});
		
		// Distribute weight evenly across all lookaheads
		// Reserve 20 points for length, split the rest equally
		const lookaheadWeight = lookaheads.length ?
			Math.floor(80 / lookaheads.length) : 0;
		
		const rules: ExtractedRule[] = lookaheads.map(node => ({
			name: FuxcelValidator.#_inferRuleName(node.raw),
			// Reconstruct lookahead body as a standalone testable regex
			regex: new RegExp(node.alternatives.map(a => a.raw).join('|'), flags),
			weight: lookaheadWeight,
		}));
		
		// Always add length rule — extracted from the {min,max} quantifier on the dot
		const lengthRule = FuxcelValidator.#_extractLengthRule(ast);
		if (lengthRule) rules.push(lengthRule);
		
		return rules;
	}
	
	static #_extractLengthRule(ast: ReturnType<typeof parseRegExpLiteral>): ExtractedRule | null {
		let min = 8;  // sensible fallback
		let max = Infinity;
		
		visitRegExpAST(ast, {
			onQuantifierEnter(node) {
				// Looking for the .{min,max} or .{min,} pattern
				if (node.element.type === 'CharacterSet' && node.element.kind === 'any') {
					min = node.min;
					max = node.max ?? Infinity;
				}
			}
		});
		
		return {
			name: max === Infinity ? `min ${min} characters` : `${min}–${max} characters`,
			regex: max === Infinity ? new RegExp(`^.{${min},}$`, 's') : new RegExp(`^.{${min},${max}}$`, 's'),
			weight: 20,
		};
	}
	
	static #_inferRuleName(raw: string): string {
		if (/\[a-zA-Z]|\[A-Za-z]/.test(raw)) return 'letter';
		if (/\[A-Z]/.test(raw)) return 'uppercase';
		if (/\[a-z]/.test(raw)) return 'lowercase';
		if (/\\d|\[0-9]/.test(raw)) return 'number';
		if (/\\W|\[\^A-Za-z0-9]/.test(raw)) return 'special character';
		if (/\\s/.test(raw)) return 'whitespace';
		return `pattern(${raw.slice(0, 20)})`;
	}
	
	static #_toggleValidationIcons(oldIcon: string, newIcon: string): void {
		const _old = fx(oldIcon);
		const _new = fx(newIcon);
		if (_old.length && _new.length) {
			if (_old.style('display') !== 'none') _old.style({display: 'none'});
			if (_new.style('display') === 'none') _new.style({display: 'inline-block'});
		}
	}
	
	// ─── Private Instance Helpers ─────────────────────────────────────────────
	/**
	 *
	 * @param {string | boolean} message
	 * @param {string} step
	 * @private
	 */
	#_manipulateErrorBag(message: string | boolean, step?: string): void {
		const fieldAttribs = this.fieldAttributes;
		const formId = fieldAttribs.formId;
		const fieldId = fieldAttribs?.id;
		
		if (!formId || !fieldId) return;
		
		const formRegistry = FuxcelValidator.#_getFormRegistry(formId);
		
		if (step) {
			// Step-level bag
			if (!formRegistry.steps[step])
				formRegistry.steps[step] = {bag: {}, count: 0};
			
			if (message === true)
				delete formRegistry.steps[step].bag[fieldId];
			else
				formRegistry.steps[step].bag[fieldId] = message as string;
			formRegistry.steps[step].count = Object.keys(formRegistry.steps[step].bag).length;
		} else {
			// Form-level bag
			if (message === true)
				delete formRegistry.bag[fieldId];
			else
				formRegistry.bag[fieldId] = message as string;
			formRegistry.count = Object.keys(formRegistry.bag).length;
		}
	}
	
	/**
	 * Wraps a Fuxcel selector result as a FuxcelValidator instance,
	 * carrying both the validator config and the error bags forward
	 * so that sub-instances created during event handling share the
	 * exact same validation state as the parent init instance.
	 *
	 * Uses `new FuxcelValidator()` so all private class fields are
	 * properly initialized — `Object.assign()` cannot copy private fields
	 * and causes "object is not the right class" errors at runtime.
	 */
	#_resetFuxcelObject(fuxcelObj: Fuxcel | FuxcelValidator): FuxcelValidator {
		/*const instance = new FuxcelValidator(fuxcelObj);
		instance.#_fxValidatorConfig = this.#_fxValidatorConfig;
		instance.#_validatorErrorBag = this.#_validatorErrorBag;
		instance.#_validatorErrorCount = this.#_validatorErrorCount;
		return instance;*/
		const instance = new FuxcelValidator(fuxcelObj);
		instance.#_fxValidatorConfig = this.#_fxValidatorConfig;
		return instance;
	}
	
	#_touchConfig(config: ValidatorConfigObject | null = null): void {
		const defaults = FuxcelValidator.defaultValidatorConfig;
		
		if (config)
			this.#_fxValidatorConfig = {
				regExp: {...defaults.regExp, ...(config.regExp ?? {})},
				config: {...defaults.config, ...(config.config ?? {})},
				stepForm: {...defaults.stepForm, ...(config.stepForm ?? {}), config: {...defaults.stepForm?.config, ...(config.stepForm?.config ?? {})}},
				texts: {...defaults.texts, ...(config.texts ?? {})},
			};
		
		this.each((form, index) => {
			// Programmatically add an id to the for if there is non.
			// Clear this form's registry slot on every explicit .init() call
			// so stale field errors from a previous init don't linger.
			!form.attrib('id') && form.attrib({id: `fx-current-form-${index}`});
			FuxcelValidator.#_clearFormRegistry(form.attrib('id'));
			FuxcelValidator.#_getFormRegistry(form.attrib('id')).configObject = this.#_fxValidatorConfig;
		});
	}
	
	// ─── Initialisation ───────────────────────────────────────────────────────
	/**
	 *
	 * @param {HTMLElement} formGroup
	 */
	validateFromGroup(formGroup: HTMLElement) {
		return this.#_validate(formGroup);
	}
	
	#_initValidateForms(): FuxcelValidator {
		let initialized: HTMLFormElement[] = [];
		
		this.each(currentForm => {
			const form = currentForm[0] as HTMLFormElement;
			const configObject = currentForm.validatorConfig;
			
			let formId = currentForm.attrib('id');
			let formGroups = fx(`#${formId} .form-group`).formValidator;
			
			if (form.dispatchEvent(FuxcelValidator.fxValidatorInitEvent)) {
				configObject.config?.nativeValidation ?
					currentForm.prop({noValidate: false}) :
					currentForm.prop({noValidate: true});
				
				if (formGroups.length) {
					if (form.dispatchEvent(FuxcelValidator.fxValidatorLoadingEvent)) {
						formGroups.each(wrappedFormGroup => {
							let formGroup = wrappedFormGroup[0] as HTMLElement;
							const _field = fx('.form-field', formGroup).formValidator;
							const _label = fx('label', formGroup).formValidator;
							
							if (_field.length && _label.length && _field.length < 2 && _label.length < 2) {
								if (!_field.attrib('id'))
									if (_field.attrib('name'))
										_field.attrib({id: _field.attrib('name').toString().replaceAll('-', '_')});
									else {
										console.error(`${_field[0].tagName} has no id or name attribute`, _field);
										throw `Field element does not have an \`id\` or \`name\` attribute`;
									}
								
								const fieldId = _field.attrib('id');
								if (_field.prop('tagName').toString().toLowerCase() === 'input' && !_field.attrib('placeholder'))
									_field.attrib({placeholder: _field.fieldAttributes.fxName?.toTitleCase()});
								
								if (!_label.attrib('for') || _label.attrib('for').toLowerCase() !== fieldId.toLowerCase())
									_label.attrib('for', fieldId);
								
								formGroup = currentForm.#_placeElements(formGroup, _field[0], _label[0]);
								currentForm.#_validate(formGroup);
							}
						});
						initialized.push(form);
					} else
						console.warn(`Initialization interrupted while loading for form: #${formId}`);
				} else
					console.error(`init-wrapper element not found in form: #${formId}`);
			} else
				console.warn(`Initialization cancelled for form: #${formId}`);
		});
		
		initialized.forEach(form => (this.toArray as HTMLFormElement[]).includes(form) ?
			form.dispatchEvent(FuxcelValidator.fxValidatorReadyEvent) :
			form.dispatchEvent(FuxcelValidator.fxValidatorFailedEvent));
		
		return this/*.#_resetFuxcelObject(this)*/;
	}
	
	#_initValidateStepForms(): any /* FuxcelSteps */ {
		this.each((currentForm, index) => {
			const configObject = currentForm.validatorConfig;
			
			const formId = currentForm.attrib('id');
			const formSteps = fx(`#${formId} ${FuxcelValidator.stepsClass}`).formValidator;
			
			if (formSteps.length) {
				FuxcelValidator.#_initSteps[index] = formId;
				
				configObject.config?.nativeValidation ?
					currentForm.prop({noValidate: false}) :
					currentForm.prop({noValidate: true});
				
				formSteps.each(wrappedStepDiv => {
					const stepDiv = wrappedStepDiv[0] as HTMLElement;
					const step = stepDiv.dataset.fxStep ?? '0';
					const formRegistry = FuxcelValidator.#_getFormRegistry(formId);
					
					if (!formRegistry.steps[step])
						formRegistry.steps[step] = {bag: {}, count: 0};
					
					const formGroups = fx('.form-group', stepDiv).formValidator;
					formGroups.length && formGroups.each(wrappedFormGroup => {
						let formGroup = wrappedFormGroup[0] as HTMLElement;
						const _field = fx('.form-field', formGroup).formValidator;
						const _label = fx('label', formGroup).formValidator;
						
						if (_field.length && _label.length && _field.length < 2 && _label.length < 2) {
							if (!_field.attrib('id'))
								if (_field.attrib('name'))
									_field.attrib({id: _field.attrib('name').toString().replaceAll('-', '_')});
								else throw `Field element does not have an \`id\` or \`name\` attribute`;
							
							const fieldId = _field.attrib('id');
							if (_field.prop('tagName').toString().toLowerCase() === 'input' && !_field.attrib('placeholder'))
								_field.attrib({placeholder: _field.fieldAttributes.fxName?.toTitleCase()});
							if (!_label.attrib('for') || _label.attrib('for').toLowerCase() !== fieldId.toLowerCase())
								_label.attrib('for', fieldId);
							
							formGroup = currentForm.#_placeElements(formGroup, _field[0], _label[0]);
							currentForm.#_validate(formGroup);
						}
					});
				});
			} else
				console.error(`Step elements not found in form: #${formId}`);
		});
		
		const FuxcelSteps = FuxcelValidator._stepsFactory;
		if (!FuxcelSteps)
			throw new Error('[FuxcelValidator] FuxcelSteps is not registered. Ensure fuxcel/src/index.ts has been loaded.');
		
		// @ts-ignore
		Object.keys(this).forEach(key => FuxcelSteps.currentlySelected[key] = this[key]);
		return new FuxcelSteps(this);
	}
	
	#_placeElements(formGroup: HTMLElement, fieldEl: HTMLElement, labelEl: HTMLElement): HTMLElement {
		const SVG_NS = 'http://www.w3.org/2000/svg';
		const formField: FuxcelValidator = fx(fieldEl).formValidator;
		const configObject: ValidatorConfigObject = this.validatorConfig;
		const isPasswordField = formField.isPasswordField;
		const formFieldGroupId: string = `${fieldEl.id}_group`;
		
		const validationText: HTMLDivElement = document.createElement('div');
		const passwordStrength: HTMLDivElement = document.createElement('div');
		const capslockAlertText: HTMLDivElement = document.createElement('div');
		
		validationText.classList.add('validation-text');
		validationText.innerHTML = '<small>&nbsp;</small>';
		
		capslockAlertText.classList.add(FuxcelValidator.passwordCapslockAlertClass.replace(/^\./, '') ?? 'capslock-alert');
		capslockAlertText.setAttribute('id', `${fieldEl.id}CapsAlert`);
		capslockAlertText.innerHTML = '<small>&nbsp;</small>';
		
		passwordStrength.setAttribute('id', `${fieldEl.id}Strength`);
		passwordStrength.classList.add('password-strength');
		passwordStrength.innerHTML = `
			<div class="strength-track">
				<div class="strength-bar"></div>
			</div>
			<small class="strength-label"></small>
		`;
		
		formGroup.setAttribute('id', formFieldGroupId);
		
		if (configObject.config?.useDefaultStyling) {
			const newInputGroup: HTMLDivElement = document.createElement('div');
			// const newFormGroupWrapper: HTMLDivElement = document.createElement('div');
			
			const validationIcons: HTMLDivElement = document.createElement('div');
			const togglePasswordIcons: HTMLDivElement = document.createElement('div');
			
			newInputGroup.classList.add('input-group');
			formGroup.classList.add('fx-default-style');
			
			if (configObject.config?.showIcons) {
				const imageCheck: SVGElement = document.createElementNS(SVG_NS, 'svg');
				const imageClose: SVGElement = document.createElementNS(SVG_NS, 'svg');
				const sharedAttributes: { [key: string]: any, width: string, height: string, viewBox: string } = {
					width: '18px',
					height: '18px',
					viewBox: '0 0 24 24',
				};
				
				Object.keys(sharedAttributes).forEach((attr) => {
					imageCheck.setAttribute(attr, sharedAttributes[attr]);
					imageClose.setAttribute(attr, sharedAttributes[attr]);
				});
				
				imageCheck.innerHTML = `
					<path fill="#12B886" d="M 12 2 C 6.4889971 2 2 6.4889971 2 12 C 2 17.511003 6.4889971 22 12 22 C 17.511003 22 22 17.511003 22 12 C 22 6.4889971 17.511003 2 12 2 z M 12 4 C 16.430123 4 20 7.5698774 20 12 C 20 16.430123 16.430123 20 12 20 C 7.5698774 20 4 16.430123 4 12 C 4 7.5698774 7.5698774 4 12 4 z M 16.292969 8.2929688 L 10 14.585938 L 7.7070312 12.292969 L 6.2929688 13.707031 L 10 17.414062 L 17.707031 9.7070312 L 16.292969 8.2929688 z"></path>
				`;
				imageClose.innerHTML = `
					<path fill="#FA5252" d="M 12 2 C 6.4889971 2 2 6.4889971 2 12 C 2 17.511003 6.4889971 22 12 22 C 17.511003 22 22 17.511003 22 12 C 22 6.4889971 17.511003 2 12 2 z M 12 4 C 16.430123 4 20 7.5698774 20 12 C 20 16.430123 16.430123 20 12 20 C 7.5698774 20 4 16.430123 4 12 C 4 7.5698774 7.5698774 4 12 4 z M 8.7070312 7.2929688 L 7.2929688 8.7070312 L 10.585938 12 L 7.2929688 15.292969 L 8.7070312 16.707031 L 12 13.414062 L 15.292969 16.707031 L 16.707031 15.292969 L 13.414062 12 L 16.707031 8.7070312 L 15.292969 7.2929688 L 12 10.585938 L 8.7070312 7.2929688 z"></path>
				`;
				
				imageCheck.classList.add('fx-valid-icon');
				imageClose.classList.add('fx-invalid-icon');
				
				validationIcons.classList.add('validation-icons');
				validationIcons.append(imageCheck, imageClose);
			}
			
			if (configObject.config?.showPassword) {
				if (isPasswordField) {
					const showPassword: SVGElement = document.createElementNS(SVG_NS, 'svg');
					const hidePassword: SVGElement = document.createElementNS(SVG_NS, 'svg');
					const sharedAttributes: { [key: string]: any, width: string, height: string, fill: string, viewBox: string, stroke: string, 'stroke-width': string, 'stoke-linecap': string, 'stoke-linejoin': string } = {
						width: '16px',
						height: '16px',
						fill: 'none',
						viewBox: '0 0 24 24',
						stroke: 'currentColor',
						'stroke-width': '1.8',
						'stoke-linecap': 'round',
						'stoke-linejoin': 'round',
					};
					
					Object.keys(sharedAttributes).forEach((attr) => {
						showPassword.setAttribute(attr, sharedAttributes[attr]);
						hidePassword.setAttribute(attr, sharedAttributes[attr]);
					});
					
					showPassword.innerHTML = `
						<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
						<circle cx="12" cy="12" r="3"></circle>
					`;
					hidePassword.innerHTML = `
						<path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"></path>
						<line x1="1" y1="1" x2="23" y2="23"/>
					`;
					
					showPassword.classList.add('fx-show-password-icon');
					hidePassword.classList.add('fx-hide-password-icon');
					
					togglePasswordIcons.classList.add('toggle-password-icons');
					togglePasswordIcons.append(showPassword, hidePassword);
				}
			}
			
			const label = document.createElement('span');
			
			label.innerHTML = <string>(labelEl.innerText.length ? labelEl.innerHTML : fieldEl.getAttribute('placeholder'));
			
			labelEl.innerHTML = '';
			labelEl.append(fieldEl, label);
			
			newInputGroup.append(labelEl);
			
			if (configObject.config?.showPassword && configObject.config?.showIcons)
				if (isPasswordField)
					newInputGroup.append(togglePasswordIcons, validationIcons);
				else
					newInputGroup.append(validationIcons);
			else {
				if (isPasswordField && configObject.config?.showPassword)
					newInputGroup.append(togglePasswordIcons);
				else if (configObject.config?.showIcons)
					newInputGroup.append(validationIcons);
			}
			
			configObject.config?.capslockAlert && isPasswordField ?
				(configObject.config?.showPasswordStrength && fieldEl.id === configObject.config?.passwordId ?
					formGroup.append(newInputGroup, passwordStrength, validationText, capslockAlertText) :
					formGroup.append(newInputGroup, validationText, capslockAlertText)) :
				(configObject.config?.showPasswordStrength && fieldEl.id === configObject.config?.passwordId ?
					formGroup.append(newInputGroup, passwordStrength, validationText) :
					formGroup.append(newInputGroup, validationText))
		} else {
			if (!labelEl.innerText.length)
				labelEl.innerHTML = <string>fieldEl.getAttribute('placeholder');
			configObject.config?.capslockAlert && formField.isPasswordField ?
				(configObject.config?.showPasswordStrength && fieldEl.id === configObject.config?.passwordId ?
					formGroup.append(passwordStrength, validationText, capslockAlertText) :
					formGroup.append(validationText, capslockAlertText)) :
				formGroup.append(validationText);
		}
		validationText.setAttribute('id', `${fieldEl.id}Valid`);
		return formGroup;
	}
	
	#_validate(formGroup: HTMLElement): void {
		let refillRequired: boolean,
			isCapsOn: boolean;
		
		const that = this;
		const inputElement = 'input.form-field';
		const selectElement = 'select.form-field';
		const textAreaElement = 'textarea.form-field';
		const configObject = that.validatorConfig;
		const passwordToggle = FuxcelValidator.passwordTogglerIconClass;
		const passwordCapsAlert = FuxcelValidator.passwordCapslockAlertClass;
		
		const _inputElement = fx(inputElement, formGroup);
		const _selectElement = fx(selectElement, formGroup);
		const _textAreaElement = fx(textAreaElement, formGroup);
		const _element = that.#_resetFuxcelObject(_inputElement.length ? _inputElement : (_selectElement.length ? _selectElement : _textAreaElement));
		const _passwordToggle = fx(passwordToggle, formGroup);
		const _passwordCapsAlert = fx(passwordCapsAlert, formGroup);
		const showPasswordToggle = `#${formGroup.id} ${passwordToggle} > .fx-show-password-icon`;
		const hidePasswordToggle = `#${formGroup.id} ${passwordToggle} > .fx-hide-password-icon`;
		
		const inputGroup = fx('.input-group', formGroup);
		const labelElement = fx('label', inputGroup);
		
		// Input events
		_inputElement.length && _inputElement.attrib('id')?.length && _inputElement.upon({
			blur: function () {
				const _input = that.#_resetFuxcelObject(fx(this));
				
				if (inputGroup.length && labelElement.length) {
					labelElement.style({color: 'var(--fx-dark)'});
					inputGroup.style({borderColor: 'var(--fx-border-light)'});
				}
				if (configObject.config?.showPassword && _passwordToggle.length)
					if (_input.isPasswordField)
						_passwordToggle.hasFocus.then((focused: boolean) => {
							if (!focused && _input.value()?.length) {
								_input.attrib('type')?.toLowerCase() === 'password' && _passwordToggle.dataAttrib('require-refill', 'true');
								refillRequired = parseBool(_passwordToggle.dataAttrib('require-refill'));
								_input.attrib('type')?.toLowerCase() === 'password' && fx(`${showPasswordToggle}, ${hidePasswordToggle}`).style({display: 'none'});
							}
						});
				_passwordCapsAlert.insertHTML('<small>&nbsp</small>');
			},
			focus: function () {
				const _input = that.#_resetFuxcelObject(fx(this));
				
				if (inputGroup.length && labelElement.length) {
					labelElement.style({color: 'var(--fx-purple)'});
					inputGroup.style({borderColor: 'var(--fx-purple)'});
				}
				
				if (_input.isPasswordField) {
					if (configObject.config?.showPassword && _passwordToggle.length)
						_passwordToggle.hasFocus.then((focused: boolean) => {
							if (!focused && _input.value()?.length) {
								_input.attrib('type')?.toLowerCase() === 'password' && _passwordToggle.dataAttrib('require-refill', 'true');
								refillRequired = parseBool(_passwordToggle.dataAttrib('require-refill'));
							}
						});
				}
			},
			input: function () {
				const _input = that.#_resetFuxcelObject(fx(this));
				
				const elementId = _input.attrib('id')?.toLowerCase();
				const elementType = _input.attrib('type')?.toLowerCase();
				const fxId = _input.dataAttrib('fx-id') && _input.dataAttrib('id').toLowerCase();
				const fxRole = _input.dataAttrib('fx-role') && _input.dataAttrib('role').toLowerCase();
				
				const filterField = new Set(['name', 'username', 'card_cvv', 'card_number']);
				const filterFieldType = new Set(['date', 'datetime', 'email', 'month']);
				
				if (_input.canBeValidated) {
					if (!filterFieldType.has(elementType) && !filterFieldType.has(fxRole) && !filterField.has(elementId) && !filterField.has(fxRole) && !filterField.has(fxId))
						_input.isPasswordField ? _input.#_validatePasswordFields() : _input.validateField();
					
					if (_input.isEmailField)
						configObject.config?.validateEmail ?
							_input.validateEmail(<RegExp>configObject.regExp?.email, configObject.texts?.emailFormat ?? null) :
							_input.toggleValidation();
					
					if (_input.isNameField)
						configObject.config?.validateName ?
							_input.validateName(<RegExp>configObject.regExp?.name, configObject.texts?.nameFormat ?? null) :
							_input.toggleValidation();
					
					if (_input.isPhoneField)
						configObject.config?.validatePhone ?
							_input.validatePhone(<RegExp>configObject.regExp?.phone, configObject.texts?.phoneFormat ?? null) :
							_input.toggleValidation();
					
					if (_input.isUsernameField)
						configObject.config?.validateUsername ?
							_input.validateUsername(<RegExp>configObject.regExp?.username, configObject.texts?.usernameFormat ?? null) :
							_input.toggleValidation();
					
					if (configObject.config?.validateCard) {
						if (elementId?.includes('card_cvv') || fxRole?.includes('card_cvv') || fxId?.includes('card_cvv'))
							_input.validateCardCVV(<RegExp>configObject.regExp?.cardCVV);
						if (elementId?.includes('card_number') || fxRole?.includes('card_number') || fxId?.includes('card_number'))
							_input.validateCardNumber(<RegExp>configObject.regExp?.cardNumber);
					} else {
						if ((elementId?.includes('card_cvv') || fxRole?.includes('card_cvv') || fxId?.includes('card_cvv')) ||
							(elementId?.includes('card_number') || fxRole?.includes('card_number') || fxId?.includes('card_number')))
							_input.toggleValidation();
					}
					filterFieldType.has(elementType) && elementType !== 'email' && _input.validateField();
				}
			},
			keydown: function (e: KeyboardEvent) {
				const _input = that.#_resetFuxcelObject(fx(this));
				
				if (_input.isPasswordField && configObject.config?.capslockAlert) {
					isCapsOn = e.getModifierState('CapsLock');
					
					if (e.key.toLowerCase() === 'capslock')
						isCapsOn = !isCapsOn;
					
					isCapsOn ?
						_passwordCapsAlert.insertHTML(`<small>${configObject.texts?.capslockFormat ?? '⚠ Caps Lock is on.'}</small>`) :
						_passwordCapsAlert.insertHTML('<small>&nbsp;</small>');
				}
			},
			keyup: function () {
				const _input = that.#_resetFuxcelObject(fx(this));
				
				if (_input.isPasswordField && _input.length && configObject.config?.showPassword && _passwordToggle.length) {
					if (refillRequired && !_input.value()?.length) {
						_passwordToggle.dataAttrib('require-refill', 'false');
						refillRequired = parseBool(_passwordToggle.dataAttrib('require-refill'));
					} else {
						if (!refillRequired && _input.value()?.length)
							_input.attrib('type').toLowerCase() === 'password' ?
								FuxcelValidator.#_toggleValidationIcons(hidePasswordToggle, showPasswordToggle) :
								FuxcelValidator.#_toggleValidationIcons(showPasswordToggle, hidePasswordToggle);
						else {
							refillRequired = parseBool(_passwordToggle.dataAttrib('require-refill'));
							fx(`${showPasswordToggle}, ${hidePasswordToggle}`).style({display: 'none'});
						}
					}
				}
			},
		});
		
		// Select events
		_selectElement.length && _selectElement.attrib('id')?.length && _selectElement.upon({
			blur: function () {
				if (inputGroup.length && labelElement.length) {
					labelElement.style({color: 'var(--fx-dark)'});
					inputGroup.style({borderColor: 'var(--fx-border-light)'});
				}
			},
			focus: function () {
				if (inputGroup.length && labelElement.length) {
					labelElement.style({color: 'var(--fx-purple)'});
					inputGroup.style({borderColor: 'var(--fx-purple)'});
				}
			},
			change: function () {
				const _el = that.#_resetFuxcelObject(fx(this));
				_el.canBeValidated && _el.validateField();
			},
		});
		
		// Textarea events
		_textAreaElement.length && _textAreaElement.attrib('id')?.length && _textAreaElement.upon({
			blur: function () {
				if (inputGroup.length && labelElement.length) {
					labelElement.style({color: 'var(--fx-dark)'});
					inputGroup.style({borderColor: 'var(--fx-border-light)'});
				}
			},
			focus: function () {
				if (inputGroup.length && labelElement.length) {
					labelElement.style({color: 'var(--fx-purple)'});
					inputGroup.style({borderColor: 'var(--fx-purple)'});
				}
			},
			input: function () {
				const _el = that.#_resetFuxcelObject(fx(this));
				_el.canBeValidated && _el.validateField();
			},
		});
		
		// Password toggle & initial required check
		if (_element.length && _element.attrib('id')?.length) {
			const fieldName = _element.fieldAttributes.fxName?.toTitleCase();
			
			if (_element.canBeValidated && (_element.isElement('input') || _element.isElement('select') || _element.isElement('textarea'))) {
				if (_element.isElement('input')) {
					const elementType = _element.attrib('type')?.toLowerCase();
					
					if (configObject.config?.showPassword && _passwordToggle.length) {
						_passwordToggle.off('touchstart', 'click').upon(['touchstart', 'click'], (e: Event) => {
							const target = e.target as HTMLElement;
							
							// @ts-ignore
							const _showPasswordToggle = fx(showPasswordToggle)[0] as HTMLElement;
							const _formGroup = _passwordToggle.parents('.form-group');
							const _passwordField = fx(_element, _formGroup);
							const _clicked = (target.tagName.toLowerCase() !== 'svg' && target.tagName.toLowerCase() !== 'div') ? target.parentElement : target;
							
							// @ts-ignore
							if (_clicked === _passwordToggle[0])
								if (window.getComputedStyle(_showPasswordToggle)?.display.toLowerCase() === 'none') {
									FuxcelValidator.#_toggleValidationIcons(hidePasswordToggle, showPasswordToggle);
									_passwordField.attrib({type: 'password'});
								} else {
									FuxcelValidator.#_toggleValidationIcons(showPasswordToggle, hidePasswordToggle);
									_passwordField.attrib({type: 'text'});
								}
							else if (_clicked === _showPasswordToggle) {
								FuxcelValidator.#_toggleValidationIcons(showPasswordToggle, hidePasswordToggle);
								_passwordField.attrib({type: 'text'});
							} else {
								FuxcelValidator.#_toggleValidationIcons(hidePasswordToggle, showPasswordToggle);
								_passwordField.attrib({type: 'password'});
							}
							// @ts-ignore
							_passwordField[0].focus({preventScroll: false});
						});
					}
					
					if (elementType !== 'checkbox' && elementType !== 'radio' && !_element.value()?.length)
						this.#_manipulateErrorBag(`The ${fieldName} field is required.`);
				} else {
					if (!_element.value()?.length)
						this.#_manipulateErrorBag(`The ${fieldName} field is required.`);
				}
				// @ts-ignore
				_element.#_resetFuxcelObject(fx(_element[0].form));
			}
		}
	}
	
	/**
	 * Perform validation on password fields.
	 *
	 * @private
	 * @return {void}
	 */
	#_validatePasswordFields(): void {
		const selected: IterableElement = <HTMLElement[]>this.toArray;
		// @ts-ignore
		const form: HTMLFormElement = selected[0].form;
		const configObject = this.validatorConfig;
		
		if (configObject.config?.validatePassword) {
			const pwdField = fx(`#${configObject.config?.passwordId}`, form).formValidator;
			const pwdFieldName = pwdField.fieldAttributes.fxName?.toTitleCase();
			const expectedCpwdField = fx(`#${configObject.config?.passwordConfirmId}`, form);
			
			if (configObject.regExp?.password) {
				if (expectedCpwdField.length) {
					const cpwdField = expectedCpwdField.formValidator;
					const cpwdFieldName = cpwdField.fieldAttributes.fxName?.toTitleCase();
					if (!pwdField.value()?.length) {
						pwdField.validateField();
						cpwdField.validateField('Check Password.', true);
					} else {
						if (!cpwdField.value()?.length) cpwdField.validateField(`The ${cpwdFieldName} field is required.`, true);
						else cpwdField.validateField();
						pwdField.validatePassword(configObject.regExp?.password, configObject.texts?.passwordFormat ?? null);
					}
				} else
					pwdField.validatePassword(configObject.regExp?.password, configObject.texts?.passwordFormat ?? null);
			} else {
				const minLength = parseInt(pwdField.attrib('minlength') ?? '0');
				const maxLength = parseInt(pwdField.attrib('maxlength') ?? '0');
				
				if (expectedCpwdField.length) {
					const cpwdField = expectedCpwdField.formValidator;
					const cpwdFieldName = cpwdField.fieldAttributes.fxName?.toTitleCase();
					
					if (pwdField.value()?.length || cpwdField.value()?.length) {
						if (minLength && maxLength) {
							if (minLength === maxLength) {
								if (!pwdField.value()?.length) {
									pwdField.validateField();
									cpwdField.validateField('Check Password.', true);
								}
								// @ts-ignore
								else if (pwdField.value()?.length !== maxLength) {
									pwdField.validateField(`The ${pwdFieldName} field requires ${maxLength} characters.`, true);
									if (!cpwdField.value()?.length) cpwdField.validateField(`The ${cpwdFieldName} field is required.`, true);
									else cpwdField.validateField('Check Password.');
								} else {
									if (!cpwdField.value()?.length) cpwdField.validateField(`The ${cpwdFieldName} field is required.`, true);
									else cpwdField.validateField();
									pwdField.validateField();
								}
							} else {
								// @ts-ignore
								if (pwdField.value()?.length < minLength || pwdField.value()?.length > maxLength) {
									pwdField.validateField(`The ${pwdFieldName} field must be between ${minLength} and ${maxLength} characters.`, true);
									cpwdField.validateField('Check Password.');
								} else {
									if (!cpwdField.value()?.length) cpwdField.validateField(`The ${cpwdFieldName} field is required.`, true);
									else cpwdField.validateField();
									pwdField.validateField();
								}
							}
						} else if (minLength) {
							// @ts-ignore
							if (pwdField.value()?.length < minLength) {
								pwdField.validateField(`The ${pwdFieldName} field requires ${minLength} characters.`, true);
								cpwdField.validateField('Check Password.', true);
							} else {
								pwdField.validateField();
								cpwdField.validateField();
							}
						} else {
							if (!cpwdField.value()?.length) cpwdField.validateField(`The ${cpwdFieldName} field is required.`, true);
							else cpwdField.validateField();
							pwdField.validateField();
						}
					} else {
						pwdField.validateField();
						cpwdField.validateField();
					}
				} else {
					if (minLength && maxLength && pwdField.value()?.length)
						// @ts-ignore
						if (pwdField.value()?.length < minLength || pwdField.value()?.length > maxLength)
							pwdField.validateField(`The ${pwdFieldName} field must be between ${minLength} and ${maxLength} characters.`, true);
						else pwdField.validateField();
					else pwdField.validateField();
				}
			}
			FuxcelValidator.#_registry[form.id].passwordStrength = FuxcelValidator.#_calcPasswordStrength(pwdField.value() as string, configObject.regExp?.password);
		} else
			this.validateField();
	}
	
	// ─── Public Getters ───────────────────────────────────────────────────────
	/** Checks if the selected field element can be validated by checking thw value of `[data-fx-validate]` data-attribute or the parent form-group is not hidden. **/
	get canBeValidated(): boolean {
		const selected = <HTMLElement[]>this.toArray;
		return selected.length ?
			(this.dataAttrib('fx-validate') ?
					parseBool(this.dataAttrib('fx-validate')) :
					(this.parents('.form-group').length ?
							this.parents('.form-group').style('display') !== 'none' :
							this.style('display') !== 'none'
					)
			) :
			false;
	}
	
	/** Get the error bag for the current selected form. **/
	get errorBag(): object | null {
		if (!this.length || !this.isElement('form')) return null!;
		const registry = FuxcelValidator.#_registry[this.attrib('id')];
		return registry && Object.keys(registry.bag).length ? registry.bag : null!;
	}
	
	/** Get the error count for the current selected form. **/
	get errorCount(): number {
		if (!this.length || !this.isElement('form')) return 0;
		return FuxcelValidator.#_registry[this.attrib('id')]?.count ?? 0;
	}
	
	/** Get the password strength for the current selected form of password field. **/
	get passwordStrength(): StrengthResult | null {
		if (!this.length && !this.isPasswordField && !this.isElement('form')) return null;
		
		if (!this.isElement('form'))
			// @ts-ignore
			return FuxcelValidator.#_registry[this[0].form.id]?.passwordStrength ?? null;
		return FuxcelValidator.#_registry[this.attrib('id')]?.passwordStrength ?? null;
	}
	
	/** An object containing the error bag and error count for the current selected form(s). Logs an error to the console if selected element(s) not form element(s). **/
	get getErrors(): object | void {
		const selected = <HTMLElement[]>this.toArray;
		let errors: { [key: string]: any } = {};
		if (selected.length > 1) {
			selected.forEach((el: HTMLElement) => {
				const _el = fx(el).formValidator;
				if (el.tagName && _el.isElement('form'))
					errors[el.id] = {count: _el.errorCount, errors: _el.errorBag};
			});
			return errors;
		}
		return this.isElement('form') ?
			{count: this.errorCount, errors: this.errorBag} :
			console.error('Non form element given.');
	}
	
	/** An object containing all form field elements for the current selected form(s). Logs an error to the console if selected element(s) not form element(s). **/
	get formFieldElements(): object | void {
		const selected = <HTMLElement[]>this.toArray;
		if (selected.length > 1) {
			const elements: { [key: string]: any } = {};
			selected.forEach((el: HTMLElement) => {
				if (fx(el).isElement('form'))
					elements[(<HTMLFormElement>el).id] = (<HTMLFormElement>el).elements;
			});
			return elements;
		}
		return this.isElement('form') ? (<HTMLFormElement>selected[0]).elements : console.error('Non form elements given', selected);
	}
	
	/** Checks if the selected form field element is an email field. **/
	get isEmailField(): boolean {
		const a = this.fieldAttributes;
		return !!(a.type?.includes('email') || a.id?.includes('email') || a.fxId?.includes('email') || a.fxRole?.includes('email'));
	}
	
	/** Checks if the selected form field element is a name field. **/
	get isNameField(): boolean {
		const a = this.fieldAttributes;
		return !this.isUsernameField && (a.id === 'name' || a.fxId === 'name' || a.fxRole === 'name');
	}
	
	/** Checks if the selected form field element is a password field. **/
	get isPasswordField(): boolean {
		const a = this.fieldAttributes;
		const registry = FuxcelValidator.#_registry[this.isElement('form') ? a?.id : a?.formId];
		const passwordId: string = registry.configObject.config?.passwordId as string;
		return <boolean>(a.type === 'password' || a.id?.includes(passwordId.toLowerCase()) ||
			a.fxId?.includes(passwordId.toLowerCase()) ||
			a.fxRole?.includes(passwordId.toLowerCase())
		);
	}
	
	/** Checks if the selected form field element is a phone field. **/
	get isPhoneField(): boolean {
		const a = this.fieldAttributes;
		return !!(a.type?.includes('tel') || a.type?.includes('phone') || a.id?.includes('phone') || a.fxId?.includes('phone') || a.fxRole?.includes('phone'));
	}
	
	/** Checks if the selected form field element is a username field. **/
	get isUsernameField(): boolean {
		const a = this.fieldAttributes;
		return !!(a.id?.includes('username') || a.fxId?.includes('username') || a.fxRole?.includes('username'));
	}
	
	get stepFromField(): number {
		const stepDiv = this.parents(FuxcelValidator.stepsClass);
		return stepDiv.length ? parseInt(stepDiv.dataAttrib('fx-step') ?? '0') : -1;
	}
	
	/** Returns the `ValidationProps` of the selected form field element. **/
	get validationProps(): ValidationProps {
		const configObject = this.validatorConfig;
		const a = this.fieldAttributes;
		const formGroup = <string>configObject.config?.initWrapper;
		const formId = `#${a.formId}`;
		const elementId = `#${a.id}`;
		
		if (formId) return {
			id: elementId,
			formGroup: `${formId} ${formGroup + elementId}_group`,
			validationField: `${formId} ${elementId}Valid`,
			validIcon: `${formId} ${formGroup + elementId}_group .validation-icons > .fx-valid-icon`,
			invalidIcon: `${formId} ${formGroup + elementId}_group .validation-icons > .fx-invalid-icon`,
			validationIconField: `${formId} ${formGroup + elementId}_group .validation-icons`,
		};
		throw 'Non-Form field element given';
	}
	
	/** Returns the current `ValidatorConfigObject` options of the selected form. _If any element other than a form or its element (input, select, ...) is selected, the default `ValidatorConfigObject` is returned._ **/
	get validatorConfig(): ValidatorConfigObject {
		if (this.length) {
			const getFormId = (element: this): StringOrNull | undefined => {
				const isForm = element.isElement('form');
				if (element.isFormElement || isForm) {
					const fieldAttribs = element.fieldAttributes;
					return isForm ? fieldAttribs?.id : fieldAttribs?.formId;
				}
				return null;
			}
			
			if (this.length > 1) {
				const configObjects: { [key: string]: ValidatorConfigObject } = {};
				this.each(element => {
					const formId = getFormId(element);
					if (formId?.length)
						configObjects[formId] = FuxcelValidator.#_registry[formId].configObject;
				});
				return Object.keys(configObjects).length ? configObjects : FuxcelValidator.defaultValidatorConfig;
			} else {
				const formId = getFormId(this);
				return formId?.length ?
					FuxcelValidator.#_registry[formId].configObject :
					FuxcelValidator.defaultValidatorConfig;
			}
		}
		return FuxcelValidator.defaultValidatorConfig;
	}
	
	// ─── Static Getters / Setters ─────────────────────────────────────────────
	/** Returns the default Form Validator Configuration Object. **/
	static get defaultValidatorConfig(): ValidatorConfigObject {
		return FuxcelValidator.#_defaultConfig;
	}
	
	/** Returns the Password capslock alert class selector **/
	static get passwordCapslockAlertClass(): string {
		return '.capslock-alert';
	}
	
	/** Returns the Password toggler icon class selector **/
	static get passwordTogglerIconClass(): string {
		return '.toggle-password-icons';
	}
	
	static get stepsClass(): string {
		return FuxcelValidator.#_stepsClass;
	}
	
	static set stepsClass(selector: string) {
		FuxcelValidator.#_stepsClass = selector;
	}
	
	// ─── Public Methods ───────────────────────────────────────────────────────
	/**
	 * Initialize validation on selected form(s) _[Must be an instance of FuxcelValidator]_.
	 *
	 * _Throws an error if non form elements are selected._
	 *
	 * @param config {ValidatorConfigObject} user config object.
	 * @return {FuxcelSteps | FuxcelValidator} Fuxcel Validator Object of the forms.
	 */
	init(config: ValidatorConfigObject | null = null): FuxcelSteps | FuxcelValidator | void {
		const forms = this.filter(el => el.isElement('form'));
		const nonForms = this.filter(el => !el.isElement('form'));
		
		if (forms.length) {
			if (nonForms.length)
				console.error(`${nonForms.length} non-form element(s) passed to validator:`, nonForms);
			
			forms.#_touchConfig(config);
			return this.validatorConfig.stepForm?.use ?
				forms.#_initValidateStepForms() :
				forms.#_initValidateForms();
		} else {
			console.error(`Non form-elements passed to validator`, nonForms);
			throw `${nonForms.length} non-form element(s) passed to validator.`;
		}
	}
	
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
	 * Render validation message.
	 *
	 * @param message {StringOrNull = null} message to display [optional]
	 * @param renderClass {StringOrNull} validation type
	 * @return {FuxcelValidator} Fuxcel Validator Object of the current selected element.
	 */
	renderMessage(message: StringOrNull = null, renderClass: StringOrNull = null): FuxcelValidator {
		this.insertHTML(`<small ${renderClass ? `class="${renderClass}"` : ''}>${message ?? '&nbsp;'}</small>`);
		return this;
	}
	
	/**
	 * Display all validation errors for the selected form.
	 *
	 * @param errors {{ [key: string]: any }}
	 * @return FuxcelValidator
	 */
	renderValidationErrors(errors: { [key: string]: any }): FuxcelValidator;
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
	renderValidationErrors(errors: { [key: string]: any }, messageOrFn: ((fx: FuxcelValidator, e?: CustomEvent) => any)): FuxcelValidator;
	/**
	 * Display all validation errors for the selected form.
	 *
	 * @param errors {{ [key: string]: any }} An object containing the errors. The keys are the form field ids and their values are the errors for the fields respectively.
	 * @param messageOrFn {string}
	 * @return FuxcelValidator
	 */
	renderValidationErrors(errors: { [key: string]: any }, messageOrFn: string): FuxcelValidator;
	
	/**
	 * Display all validation errors for the selected form.
	 *
	 * @param errors {{ [key: string]: any }} An object containing the errors. The keys are the form field ids and their values are the errors for the fields respectively.
	 * @param messageOrFn {((fx: FuxcelValidator, e?: CustomEvent) => any)}
	 * @param callbackFn {((fx: FuxcelValidator, e?: CustomEvent) => any)}
	 * @return FuxcelValidator
	 */
	renderValidationErrors(errors: { [key: string]: any }, messageOrFn: ((fx: FuxcelValidator, e?: CustomEvent) => any), callbackFn: ((fx: FuxcelValidator, e?: CustomEvent) => any)): FuxcelValidator;
	/**
	 * Display all validation errors for the selected form.
	 *
	 * @param errors {{ [key: string]: any }} An object containing the errors. The keys are the form field ids and their values are the errors for the fields respectively.
	 * @param messageOrFn {string}
	 * @param callbackFn {((fx: FuxcelValidator, e?: CustomEvent) => any)}
	 * @return FuxcelValidator
	 */
	renderValidationErrors(errors: { [key: string]: any }, messageOrFn: string, callbackFn: ((fx: FuxcelValidator, e?: CustomEvent) => any)): FuxcelValidator;
	/**
	 * Display all validation errors for the selected form.
	 *
	 * @param errors {{ [key: string]: any } | null = null} An object containing the errors. The keys are the form field ids and their values are the errors for the fields respectively.
	 * @param messageOrFn {((fx: FuxcelValidator, e?: CustomEvent) => any)|StringOrNull}
	 * @param callbackFn {((fx: FuxcelValidator, e?: CustomEvent) => any)}
	 * @return FuxcelValidator
	 */
	renderValidationErrors(errors: { [key: string]: any } | null = null, messageOrFn: ((fx: FuxcelValidator, e?: CustomEvent) => any) | StringOrNull = null, callbackFn: ((fx: FuxcelValidator, e?: CustomEvent) => any) | null = null): FuxcelValidator {
		if (this.isElement('form')) {
			if (isObject(errors) && Object.keys(<{ [key: string]: any }>errors).length) {
				const fieldElements: object = <object>this.formFieldElements;
				const givenErrors = <{ [key: string]: any }>errors;
				Object.keys(givenErrors).forEach((elementId: string) => {
					const fieldName = elementId.toString().toTitleCase();
					const element = fx(`#${elementId}`, this).formValidator;
					if (elementId in fieldElements && isDefined(givenErrors[elementId]))
						element.validateField(givenErrors[elementId], true);
					else if (isString(givenErrors[elementId]) && givenErrors[elementId] !== undefined)
						element.validateField(`Verify ${fieldName} and try again.`, true);
				});
				(fx('.fx-valid-error') as any)[0]?.scrollIntoView({behavior: 'smooth', block: 'center'});
			}
		} else
			console.warn('Non form element given.');
		
		typeof messageOrFn === 'string' ?
			(typeof callbackFn === 'function' ?
				fx.modal({type: 'error', content: messageOrFn, confirmButtonText: 'Ok', onConfirm: (e: any) => callbackFn(this, e)}) :
				fx.modal({type: 'error', closeOnConfirm: true, content: messageOrFn, confirmButtonText: 'Ok'}))
			: (typeof messageOrFn === 'function' && messageOrFn(this));
		return this;
	}
	
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
	 * Show validation error for the selected field.
	 *
	 * @param message {StringOrNull = null} Validation message.
	 * @return {void}
	 */
	showError(message: StringOrNull = null): void {
		const fieldAttribs = this.fieldAttributes;
		const validationProps = this.validationProps;
		const finalMessage = message ?? `The ${fieldAttribs.fxName?.toTitleCase()} field is required`;
		const registry = FuxcelValidator.#_registry[this.isElement('form') ? fieldAttribs?.id : fieldAttribs?.formId];
		
		this.#_manipulateErrorBag(finalMessage);
		registry.configObject.config?.showIcons && FuxcelValidator.#_toggleValidationIcons(validationProps.validIcon, validationProps.invalidIcon);
		
		fx(validationProps.validationField).length && fx(validationProps.validationField).formValidator.renderMessage(finalMessage);
		fx(validationProps.formGroup).replaceClass('fx-valid-success', 'fx-valid-error');
		
	}
	
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
	 * Show validation success.
	 *
	 * @param message {StringOrNull = null} Validation message.
	 * @return {void}
	 */
	showSuccess(message: StringOrNull = null): void {
		const validationProps = this.validationProps;
		const fieldAttribs = this.fieldAttributes;
		const registry = FuxcelValidator.#_registry[this.isElement('form') ? fieldAttribs?.id : fieldAttribs?.formId];
		
		this.#_manipulateErrorBag(true);
		registry.configObject.config?.showIcons && FuxcelValidator.#_toggleValidationIcons(validationProps.invalidIcon, validationProps.validIcon);
		
		fx(validationProps.validationField).length && fx(validationProps.validationField).formValidator.renderMessage(message);
		fx(validationProps.formGroup).replaceClass('fx-valid-error', 'fx-valid-success');
	}
	
	/**
	 * Toggle between validating and removing validation from the selected field.
	 *
	 * @return {FuxcelValidator} Fuxcel Validator Object of the forms.
	 */
	toggleValidation(): FuxcelValidator {
		return this.canBeValidated ? this.validateField() : this.undoValidation();
	}
	
	/**
	 * Remove validation from the selected field element. Also remove the error from the error bag if destroyValidation parameter is set tot true.
	 *
	 * @param destroyValidation {boolean = false}
	 * @return {FuxcelValidator} Fuxcel Validator Object of the forms.
	 */
	undoValidation(destroyValidation: boolean = false): FuxcelValidator {
		const fieldAttribs = this.fieldAttributes;
		const validationProps = this.validationProps;
		const registry = FuxcelValidator.#_registry[this.isFormElement ? validationProps?.id : fieldAttribs?.formId];
		
		if (registry) {
			if (destroyValidation && fieldAttribs.id) {
				delete registry.bag[fieldAttribs.id];
				registry.count = Object.keys(registry.bag).length;
			}
			
			if (registry.configObject.config?.useDefaultStyling)
				fx(`${validationProps.formGroup} .form-group-wrapper`).removeClass('fx-valid-error', 'fx-valid-success');
			else
				fx(validationProps.formGroup).removeClass('fx-valid-error', 'fx-valid-success');
			
			!fx(`${validationProps.validationIconField} > *`)?.length ?
				fx(validationProps.validationField).formValidator.renderMessage() :
				fx(`${validationProps.validationIconField} > *`).fadeout().then(() => fx(validationProps.validationField).formValidator.renderMessage());
		}
		return this;
	}
	
	stepErrorBag(step: number | string): object | null {
		if (!this.length || !this.isElement('form')) return null!;
		const stepReg = FuxcelValidator.#_registry[this.attrib('id')]?.steps[step];
		return stepReg && Object.keys(stepReg.bag).length ? stepReg.bag : null!;
	}
	
	stepErrorCount(step: number | string): number {
		if (!this.length || !this.isElement('form')) return 0;
		return FuxcelValidator.#_registry[this.attrib('id')]?.steps[step]?.count ?? 0;
	}
	
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
	 * Validate Card CVV field using Regular Expression
	 *
	 * @param regExp {RegExp} Regular expression to use.
	 * @param customFormatEx {StringOrNull = null} Custom format example to show user.
	 * @return {FuxcelValidator} Fuxcel Validator Object of the selected element.
	 */
	validateCardCVV(regExp: RegExp, customFormatEx: StringOrNull = null): FuxcelValidator {
		return this.validateRegex(regExp, `${customFormatEx ?? 'Invalid CVV.'}`);
	}
	
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
	 * Validate Card Number field using Regular Expression
	 *
	 * @param regExp {RegExp} Regular expression to use.
	 * @param customFormatEx {StringOrNull = null} Custom format example to show user
	 * @return {FuxcelValidator} Fuxcel Validator Object of the selected element.
	 */
	validateCardNumber(regExp: RegExp, customFormatEx: StringOrNull = null): FuxcelValidator {
		const selected = this.toArray as HTMLInputElement[];
		const value: string = selected[0].value;
		return this.validateRegex(() =>
			// @ts-ignore
			value.length ?
				(value.match(regExp) ? (passLuhnAlgo(value) ? this.validateField() : this.validateField('Check Card Number and try again.', true)) : this.validateField(`${customFormatEx ?? 'Only numbers are allowed.'}`)) :
				this.toggleValidation()
		);
	}
	
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
	/**
	 * Validate Email field using Regular Expression
	 *
	 * @param regExp {RegExp} Regular expression to use.
	 * @param customFormatEx {StringOrNull = null} Custom format example to show user.
	 * @return {FuxcelValidator} Fuxcel Validator Object of the selected element.
	 */
	validateEmail(regExp: RegExp, customFormatEx: StringOrNull = null): FuxcelValidator {
		return this.validateRegex(regExp, `Invalid E-Mail format: (eg. ${customFormatEx ?? 'johndoe@email.com'})`);
	}
	
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
	 * Validate the selected field.
	 *
	 * _Displays an error message if the `message` parameter is null or if `isError` parameter is true._
	 *
	 * @param message {StringOrNull} Validation message to display.
	 * @param isError {boolean=false} If true and the message parameter is null, an automatic error message is generated.
	 * @returns {FuxcelValidator}
	 */
	validateField(message: StringOrNull | boolean = null, isError: boolean = false): FuxcelValidator {
		if (typeof message === 'boolean') {
			isError = message;
			message = null;
		}
		
		if (this.attrib('id')?.length) {
			let errorMessage: StringOrNull = null,
				finalMessage: StringOrNull = message;
			const fieldAttribs = this.fieldAttributes;
			const registry = FuxcelValidator.#_registry[this.isElement('form') ? fieldAttribs?.id : fieldAttribs?.formId];
			const configObject = registry.configObject.config;
			// @ts-ignore
			const target: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement = this[0];
			
			const fieldValue = target.value;
			const fieldName = fieldAttribs.fxName?.toTitleCase();
			
			const minLength = parseInt(this.attrib('minlength'));
			const maxLength = parseInt(this.attrib('maxlength'));
			const min = parseInt(this.attrib('min'));
			const max = parseInt(this.attrib('max'));
			
			if (!isString(finalMessage))
				if (fieldValue?.length || (fieldAttribs.id === configObject?.passwordConfirmId && configObject?.validatePassword)) {
					if (maxLength && fieldValue.length > maxLength)
						errorMessage = `The ${fieldName} field requires a maximum of ${maxLength} characters.`;
					else if (minLength && fieldValue.length < minLength)
						errorMessage = `The ${fieldName} field requires a minimum of ${minLength} characters.`;
					else
						switch (fieldAttribs.type) {
							case 'number':
								errorMessage = ((max && min) && (parseInt(fieldValue) > max && parseInt(fieldValue) < min)) ?
									`The ${fieldName} field requires a value between ${min} and ${max}.` :
									((max && parseInt(fieldValue) > max) ?
										`The maximum required value for ${fieldName} is ${max}.` :
										((min && parseInt(fieldValue) < min) ? `The minimum required value for ${fieldName} is ${min}.` : message));
								break;
							default:
								if (this.isPasswordField)
									errorMessage = (Array.isArray(message) ? message :
										((fieldAttribs.id === configObject?.passwordConfirmId && configObject?.validatePassword) ?
											((!fieldValue.length || fieldValue !== fx(`#${configObject.passwordId}`).value()) ?
													(fx(`#${configObject.passwordId}`).value()?.length ? 'Ensure passwords.' : `The ${fieldName} field is required.`) :
													message
											) : message));
								break;
						}
				} else
					errorMessage = `The ${fieldName} field is required.`;
			
			(errorMessage || isError) ?
				this.showError(errorMessage ?? finalMessage) :
				this.showSuccess(finalMessage);
		} else
			console.warn('Selected element has no ID', this);
		return this;
	}
	
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
	 * Validate Name field using Regular Expression
	 *
	 * @param regExp {RegExp} Regular expression to use.
	 * @param customFormatEx {string|null=null} Custom format example to show user.
	 * @return {FuxcelValidator} Fuxcel Validator Object of the selected element.
	 */
	validateName(regExp: RegExp, customFormatEx: StringOrNull = null): FuxcelValidator {
		return this.validateRegex(regExp, `Invalid Name format: (eg. ${customFormatEx ?? 'john doe, john doe woods'})`);
	}
	
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
	 * Validate Password field using Regular Expression
	 *
	 * @param regExp {RegExp} Regular expression to use
	 * @param customFormatEx {string|null=null} Custom format example to show user.
	 * @return {FuxcelValidator} Fuxcel Validator Object of the selected element.
	 */
	validatePassword(regExp: RegExp, customFormatEx: StringOrNull = null): FuxcelValidator {
		return this.validateRegex(regExp, `Invalid Password format: (${customFormatEx ?? 'Password requires a minimum of 8 characters and must contain at least 1 uppercase and 1 special character'})`);
	}
	
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
	 * Validate Phone field using Regular Expression
	 *
	 * @param regExp {RegExp} Regular expression to use
	 * @param customFormatEx {string|null=null} Custom format example to show user.
	 * @return {FuxcelValidator} Fuxcel Validator Object of the selected element.
	 */
	validatePhone(regExp: RegExp, customFormatEx: StringOrNull = null): FuxcelValidator {
		return this.validateRegex(regExp, `Invalid Phone format: (eg. ${customFormatEx ?? '+234 8156547099, +1 104 2198'})`);
	}
	
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
	 * Validate field using Regular Expression or a callback function.
	 *
	 * @param regExpOrFn {Function|RegExp} Regular Expression or callback function to use.
	 * @param message {string|null=null} Validation message.
	 * @return {FuxcelValidator} Fuxcel Validator Object of the selected element.
	 */
	validateRegex(regExpOrFn: Function | RegExp, message?: StringOrNull): FuxcelValidator {
		const selected: IterableElement = <HTMLElement[]>this.toArray;
		// @ts-ignore
		const value: string = selected[0].value;
		
		typeof regExpOrFn === 'function' ?
			regExpOrFn(this) :
			(regExpOrFn && isString(message) ?
				(value.length ? (value.match(<RegExp>regExpOrFn) ? this.validateField() : this.validateField(message as string, true)) : this.validateField()) :
				console.error('`validateRegex()` expects 2 arguments.'));
		return this;
	}
	
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
	/**
	 * Validate Username field using Regular Expression
	 *
	 * @param regExp {RegExp} Regular expression to use
	 * @param customFormatEx {string|null=null} Custom format example to show user.
	 * @return {FuxcelValidator} Fuxcel Validator Object of the selected element.
	 */
	validateUsername(regExp: RegExp, customFormatEx: StringOrNull = null): FuxcelValidator {
		const selected: IterableElement = <HTMLElement[]>this.toArray;
		// @ts-ignore
		const value: string = selected[0].value;
		const minLength = parseInt(<string>this.attrib('minlength') ?? '2');
		// @ts-ignore
		const fieldName = this.fieldAttributes.fxName?.toTitleCase();
		
		return this.validateRegex(() =>
			value.length
				? (value.length > minLength
					? (value.match(regExp)
						? this.validateField()
						: this.validateField(`Invalid Username format: (${customFormatEx ?? 'Username must start and end with an alphabet, and can only contain alphabets and underscores.'})`))
					: this.validateField(customFormatEx ?? `The ${fieldName} requires a minimum of 3 characters.`))
				: this.toggleValidation()
		);
	}
}
