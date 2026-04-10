/**
 * Re-exports all types from the single source of truth: global.d.ts
 *
 * Import types from here in all source files:
 *   import type { FXRequestType, ValidatorConfigObject } from '../types';
 */
export type { IterableElement, SingleElement, Direction, Position, Selector, StringOrNull, EventInterfaces, HTMLListenerArray, HTMLElementWithListenerArray, FieldAttributes, ValidationProps, ValidatorConfigObject, FXAnimationOptions, FXAnimationType, FXAnimationReturn, FXAnimation, ModalInit, FXModalType, FXRequestType, FXFormSubmitType, ResponseData, FuxcelInstance, FuxcelValidatorInstance, FuxcelStepsInstance, FuxcelModalInstance, FuxcelConstructor, FuxcelValidatorConstructor, FuxcelStepsConstructor, FuxcelModalConstructor, FXInterface, } from './types';
import { fx } from './core/Fuxcel';
export default fx;
