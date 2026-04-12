import { fx } from '../core/Fuxcel';
import { FuxcelValidator } from './FuxcelValidator';
import { isString } from '../utils';
/**
 * Extends `FuxcelValidator` with multi-step form support.
 * Tracks per-step error bags and exposes step-level error queries.
 */
export class FuxcelSteps extends FuxcelValidator {
    static currentlySelected = {};
    constructor(selected) {
        super(selected);
        try {
            // @ts-ignore – optional external Steps plugin integration
            if (Steps.constructor.name.length && selected.validatorConfig.stepForm?.plugin)
                // @ts-ignore
                new Steps(selected[0]).init(selected.validatorConfig.stepForm.config);
        }
        catch (_) { /* Steps plugin not present — silently skip */
        }
        return this;
    }
    // ─── Getters ──────────────────────────────────────────────────────────────
    /** Re-instantiated context of the currently selected forms. */
    get context() {
        return new FuxcelSteps(FuxcelSteps.currentlySelected);
    }
    /**
     * Returns all step identifiers for the selected form(s).
     * - Single form → `(number | string)[]`
     * - Multiple forms → `{ [formId]: (number | string)[] }`
     */
    get formSteps() {
        const steps = [];
        if (this.length > 1) {
            const allSteps = {};
            this.toArray.forEach((form) => {
                if (fx(form).isElement('form')) {
                    allSteps[form.id] = [];
                    const stepDivs = fx(FuxcelValidator.stepsClass, form);
                    stepDivs.length && stepDivs.toArray.forEach((stepDiv) => {
                        const step = stepDiv.dataset.fxStep;
                        isString(step) && step !== undefined && allSteps[form.id].push(step);
                    });
                }
            });
            return allSteps;
        }
        if (this.isElement('form')) {
            const stepDivs = fx(FuxcelValidator.stepsClass, this);
            stepDivs.length && stepDivs.toArray.forEach((stepDiv) => {
                const step = stepDiv.dataset.fxStep;
                isString(step) && step !== undefined && steps.push(step);
            });
        }
        return steps;
    }
    // ─── Public Methods ───────────────────────────────────────────────────────
    /**
     * Returns the error bag and error count for the current selected step form(s).
     *
     * @param step {number|string|null=null} Specific step to query. If null, returns errors for all steps.
     */
    stepErrors(step = null) {
        const selected = this.context.toArray;
        let errors = {};
        if (step === null) {
            selected.forEach((element) => {
                const _element = new FuxcelSteps(element);
                if (element.tagName && _element.isElement('form')) {
                    errors[element.id] = {};
                    const steps = _element.formSteps;
                    steps.length && steps.forEach(s => {
                        errors[element.id][s] = {
                            count: _element.stepErrorCount(s),
                            errors: _element.stepErrorBag(s),
                        };
                    });
                }
            });
            return errors;
        }
        return this.context.isElement('form')
            ? {
                count: this.context.stepErrorCount(step),
                errors: this.context.stepErrorBag(step),
            }
            : console.error('Non form element given.');
    }
}
//# sourceMappingURL=FuxcelSteps.js.map