import type { FuxcelStepsInstance } from '../types';
import { FuxcelValidator } from './FuxcelValidator';
/**
 * Extends `FuxcelValidator` with multi-step form support.
 * Tracks per-step error bags and exposes step-level error queries.
 */
export declare class FuxcelSteps extends FuxcelValidator implements FuxcelStepsInstance {
    static currentlySelected: object;
    constructor(selected: FuxcelValidator);
    /** Re-instantiated context of the currently selected forms. */
    get context(): FuxcelSteps;
    /**
     * Returns all step identifiers for the selected form(s).
     * - Single form → `(number | string)[]`
     * - Multiple forms → `{ [formId]: (number | string)[] }`
     */
    get formSteps(): object | (number | string)[];
    /**
     * Returns the error bag and error count for the current selected step form(s).
     *
     * @param step {number|string|null=null} Specific step to query. If null, returns errors for all steps.
     */
    stepErrors(step?: number | string | null): object | void;
}
//# sourceMappingURL=FuxcelSteps.d.ts.map