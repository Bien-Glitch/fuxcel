import type { FXModalType } from '../types';
import { FuxcelModal } from './FuxcelModal';
/**
 * Create a quick alert/confirm modal with callbacks.
 *
 * @param {StringOrNull} title Modal title.
 * @param {'success' | 'warning' | 'error'} type Visual type: 'success' | 'warning' | 'error'.
 * @param {StringOrNull} content Body content (HTML or text).
 * @param {StringOrNull} confirmButtonText Label for the confirm button.
 * @param {StringOrNull = null} cancelButtonText Label for the cancel button.
 * @param {boolean} html Render body as HTML (default true).
 * @param {boolean} isStatic Prevent closing on outside click.
 * @param {boolean} closeOnConfirm Auto-close on confirm when no `onConfirm` callback.
 * @param {((e: CustomEvent, modal: FuxcelModal) => void) | null} onConfirm Callback fired when confirm button is clicked.
 * @param {((e: CustomEvent, modal: FuxcelModal) => void) | null} onCancel Callback fired when cancel button is clicked.
 * @param {((e: CustomEvent, modal: FuxcelModal) => void) | null} onEsc Callback fired on Escape (only when no cancel button).
 * @return {FuxcelModal}
 */
export declare function fxModal({ title, type, content, confirmButtonText, cancelButtonText, html, isStatic, closeOnConfirm, onConfirm, onCancel, onEsc, }?: FXModalType): FuxcelModal;
//# sourceMappingURL=fxModal.d.ts.map