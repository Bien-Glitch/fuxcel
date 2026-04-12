import { Fuxcel, fx } from '../core/Fuxcel';
import { FuxcelModal } from './FuxcelModal';
import { parseBool } from '../utils';
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
export function fxModal({ title = null, type = 'success', content = 'Alert Content', confirmButtonText = null, cancelButtonText = null, html = true, isStatic = false, closeOnConfirm = false, onConfirm = null, onCancel = null, onEsc = null, } = {}) {
    const initialModal = FuxcelModal.init({ title: title, html: html, isStatic: isStatic, content: content, id: 'init', hasFooter: false });
    const modalBody = fx('.fx-modal-body', initialModal);
    const body = document.querySelector('body');
    // Alert icon
    const alertIconPath = type === 'success' ?
        `${Fuxcel.path}/images/ok-24.svg` :
        (type === 'error' ? `${Fuxcel.path}/images/cancel-24.svg` : `${Fuxcel.path}/images/warning-24.svg`);
    const altAlertIcon = type === 'success' ? '✅' : (type === 'error' ? '❌' : '⚠️');
    const alertIcon = `<img src="${alertIconPath}" alt="${altAlertIcon}" class="fx-modal-alert-icon">`;
    // Buttons
    const buttonsWrapper = (btns) => `<div class="fx-modal-alert-buttons">${btns}</div>`;
    const cancelButton = (label) => `<button type="button" id="fx-modal-cancel" class="fx-btn fx-btn-error" data-fx-action="close" data-fx-target="modal">${label}</button>`;
    const confirmButton = (label) => `<button type="button" id="fx-modal-confirm" class="fx-btn fx-btn-primary" data-fx-target="modal" data-fx-modal="init">${label}</button>`;
    const buttons = confirmButtonText && cancelButtonText ?
        cancelButton(cancelButtonText) + confirmButton(confirmButtonText) :
        (confirmButtonText ? confirmButton(confirmButtonText) : (cancelButtonText && cancelButton(cancelButtonText)));
    modalBody.style({ display: 'flex', flexDirection: 'column', alignItems: 'center' }).insertHTML(alertIcon, 'prefix');
    buttons && modalBody.insertHTML(buttonsWrapper(buttons), 'suffix');
    body?.append(initialModal);
    fx('.fx-modal-alert-icon', initialModal).style({ visibility: 'visible' }).fadein(2000).then();
    const modal = new FuxcelModal(initialModal);
    modal.show(!cancelButtonText);
    if (cancelButtonText || confirmButtonText) {
        if (!cancelButtonText)
            modal.off().upon('fx.modal.hide', (e) => typeof onEsc === 'function' ? onEsc(e, modal) : null);
        modal.off('click').upon('click', function (e) {
            const clickedTarget = fx(e.target);
            const isCancel = clickedTarget.matchSelector('#fx-modal-cancel') || clickedTarget.matchSelector('#fx-modal-cancel *');
            const isConfirm = clickedTarget.matchSelector('#fx-modal-confirm') || clickedTarget.matchSelector('#fx-modal-confirm *');
            const isClose = clickedTarget.matchSelector(`.close[data-fx-action="close"]`) ||
                clickedTarget.matchSelector(`.close[data-fx-action="close"] *`);
            fx('.fx-modal-content', modal).hasFocus.then((focused) => {
                if (!focused && !parseBool(modal.dataAttrib('fx-static'))) {
                    modal.hide(true);
                    modal.off().upon('fx.modal.hide', (e) => cancelButtonText && typeof onCancel === 'function'
                        ? onCancel(e, modal)
                        : (!closeOnConfirm && typeof onConfirm === 'function' ? onConfirm(e, modal) : null));
                }
                else {
                    if (isConfirm && !closeOnConfirm && typeof onConfirm === 'function') {
                        onConfirm(e, modal);
                    }
                    else if (isCancel || isConfirm || isClose) {
                        modal.hide(true);
                        modal.off().upon('fx.modal.hide', (e) => (isCancel || isClose) && typeof onCancel === 'function'
                            ? onCancel(e, modal)
                            : (isConfirm && typeof onConfirm === 'function' ? onConfirm(e, modal) : null));
                    }
                }
            });
        });
    }
    else {
        if (!cancelButtonText)
            modal.off().upon('fx.modal.hide', (e) => typeof onEsc === 'function' ? onEsc(e, modal) : null);
    }
    return modal;
}
//# sourceMappingURL=fxModal.js.map