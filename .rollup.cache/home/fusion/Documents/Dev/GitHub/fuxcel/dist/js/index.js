/**
 * Re-exports all types from the single source of truth: global.d.ts
 *
 * Import types from here in all source files:
 *   import type { FXRequestType, ValidatorConfigObject } from '../types';
 */
// ─── Bootstrap imports ────────────────────────────────────────────────────────
import { pushPropsToWindow, isBool, isDefined, isFunction, isObject, isString, parseBool } from './utils';
import { FuxcelBase } from './core/FuxcelBase';
import { Fuxcel, fx } from './core/Fuxcel';
import { FuxcelValidator } from './validator/FuxcelValidator';
import { FuxcelSteps } from './validator/FuxcelSteps';
import { FuxcelModal } from './modal/FuxcelModal';
import { fxModal } from './modal/fxModal';
import { fxFetch } from './http/fxFetch';
import { passLuhnAlgo } from './utils/luhn';
// ─── Resolve circular dependencies via static slot injection ──────────────────
// All modules are now fully loaded. We connect the inter-class references here
// rather than inside the classes themselves, which keeps every file free of
// require() and circular import statements.
// Fuxcel ← FuxcelValidator / FuxcelModal / fxFetch / fxModal
Fuxcel._validatorFactory = (el) => new FuxcelValidator(el);
Fuxcel._modalFactory = (el) => new FuxcelModal(el);
Fuxcel._fxFetch = fxFetch;
Fuxcel._fxModal = fxModal;
// FuxcelValidator ← FuxcelSteps / fxModal
FuxcelValidator._stepsFactory = FuxcelSteps;
FuxcelValidator._fxModal = fxModal;
// ─── Attach static helpers directly onto fx ───────────────────────────────────
// Using direct assignment (not Object.assign) preserves the fx() call signature
// so both `fx('#el').fadein()` and `fuxcel('#el').fadein()` work correctly,
// and IDEs surface the full interface including .fetch, .modal etc.
fx.fetch = fxFetch;
fx.modal = fxModal;
fx.onDocumentLoad = (listener) => fx(document).off().upon('DOMContentLoaded', listener);
fx.passLuhnAlgo = passLuhnAlgo;
/**
 * Alias of `fx`. Identical in every way — selector function + static helpers.
 *
 * @example
 * fuxcel('#btn').fadein();
 * fuxcel.fetch({ uri: '/api', method: 'post' });
 */
const fuxcel = fx;
// ─── Expose everything to window for script-tag / non-module usage ───────────
pushPropsToWindow({
    // Core selector — both names work identically
    fx,
    fuxcel,
    // Classes — usable as `new FuxcelValidator(...)` etc. in plain scripts
    FuxcelBase,
    Fuxcel,
    FuxcelValidator,
    FuxcelSteps,
    FuxcelModal,
    // Standalone functions
    fxFetch,
    fxModal,
    passLuhnAlgo,
    // Type-guard / utility helpers
    isBool,
    isDefined,
    isFunction,
    isObject,
    isString,
    parseBool,
});
// Auto-init modals if triggers are present in the DOM
FuxcelModal.modalTriggers.length && new FuxcelModal('*');
export default fx;
//# sourceMappingURL=index.js.map