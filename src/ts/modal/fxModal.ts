import type {FXModalType} from '../types';
import {Fuxcel, fx} from '../core/Fuxcel';
import {FuxcelModal} from './FuxcelModal';
import {parseBool} from '../utils';

/**
 * Create a quick alert/confirm modal with callbacks.
 *
 * @param title               Modal title.
 * @param type                Visual type: 'success' | 'warning' | 'error'.
 * @param content             Body content (HTML or text).
 * @param confirmButtonText   Label for the confirm button.
 * @param cancelButtonText    Label for the cancel button.
 * @param html                Render body as HTML (default true).
 * @param isStatic            Prevent closing on outside click.
 * @param closeOnConfirm      Auto-close on confirm when no `onConfirm` callback.
 * @param onConfirm           Callback fired when confirm button is clicked.
 * @param onCancel            Callback fired when cancel button is clicked.
 * @param onEsc               Callback fired on Escape (only when no cancel button).
 */
export function fxModal({
	title = null,
	type = 'success',
	content = 'Alert Content',
	confirmButtonText = null,
	cancelButtonText = null,
	html = true,
	isStatic = false,
	closeOnConfirm = false,
	onConfirm = null,
	onCancel = null,
	onEsc = null,
}: FXModalType = {}): FuxcelModal {
	const initialModal = FuxcelModal.init({title: title, html: html, isStatic: isStatic, content: <string>content, id: 'init', hasFooter: false});
	
	const modalBody = fx('.fx-modal-body', initialModal);
	const body = document.querySelector('body');
	
	// Alert icon
	const alertIconPath = type === 'success' ?
		`${Fuxcel.path}/images/ok-24.svg` :
		(type === 'error' ? `${Fuxcel.path}/images/cancel-24.svg` : `${Fuxcel.path}/images/warning-24.svg`);
	
	const altAlertIcon = type === 'success' ? '✅' : (type === 'error' ? '❌' : '⚠️');
	const alertIcon = `<img src="${alertIconPath}" alt="${altAlertIcon}" class="fx-modal-alert-icon">`;
	
	// Buttons
	const buttonsWrapper = (btns: string) => `<div class="fx-modal-alert-buttons">${btns}</div>`;
	const cancelButton = (label: string) => `<button type="button" id="fx-modal-cancel" class="fx-btn fx-btn-error" data-fx-action="close" data-fx-target="modal">${label}</button>`;
	const confirmButton = (label: string) => `<button type="button" id="fx-modal-confirm" class="fx-btn fx-btn-primary" data-fx-target="modal" data-fx-modal="init">${label}</button>`;
	
	const buttons = confirmButtonText && cancelButtonText ?
		cancelButton(cancelButtonText) + confirmButton(confirmButtonText) :
		(confirmButtonText ? confirmButton(confirmButtonText) : (cancelButtonText && cancelButton(cancelButtonText)));
	
	modalBody.style({display: 'flex', flexDirection: 'column', alignItems: 'center'}).insertHTML(alertIcon, 'prefix');
	buttons && modalBody.insertHTML(buttonsWrapper(buttons), 'suffix');
	
	body?.append(initialModal);
	fx('.fx-modal-alert-icon', initialModal).style({visibility: 'visible'}).fadein(2000).then();
	
	const modal = new FuxcelModal(initialModal);
	modal.show(!cancelButtonText);
	
	if (cancelButtonText || confirmButtonText) {
		if (!cancelButtonText)
			modal.off().upon('fx.modal.hide', (e) => typeof onEsc === 'function' ? onEsc(<CustomEvent>e, modal) : null);
		
		modal.off('click').upon('click', function (e) {
			const clickedTarget = fx((e as any).target);
			const isCancel = clickedTarget.matchSelector('#fx-modal-cancel') || clickedTarget.matchSelector('#fx-modal-cancel *');
			const isConfirm = clickedTarget.matchSelector('#fx-modal-confirm') || clickedTarget.matchSelector('#fx-modal-confirm *');
			const isClose = clickedTarget.matchSelector(`.close[data-fx-action="close"]`) ||
				clickedTarget.matchSelector(`.close[data-fx-action="close"] *`);
			
			fx('.fx-modal-content', modal).hasFocus.then((focused: boolean) => {
				if (!focused && !parseBool(modal.dataAttrib('fx-static'))) {
					modal.hide(true);
					modal.off().upon('fx.modal.hide', (e) =>
						cancelButtonText && typeof onCancel === 'function'
							? onCancel(<CustomEvent>e, modal)
							: (!closeOnConfirm && typeof onConfirm === 'function' ? onConfirm(<CustomEvent>e, modal) : null)
					);
				} else {
					if (isConfirm && !closeOnConfirm && typeof onConfirm === 'function') {
						onConfirm(<CustomEvent>e as any, modal);
					} else if (isCancel || isConfirm || isClose) {
						modal.hide(true);
						modal.off().upon('fx.modal.hide', (e) =>
							(isCancel || isClose) && typeof onCancel === 'function'
								? onCancel(<CustomEvent>e, modal)
								: (isConfirm && typeof onConfirm === 'function' ? onConfirm(<CustomEvent>e, modal) : null)
						);
					}
				}
			});
		});
	} else {
		if (!cancelButtonText)
			modal.off().upon('fx.modal.hide', (e) =>
				typeof onEsc === 'function' ? onEsc(<CustomEvent>e, modal) : null
			);
	}
	
	return modal;
}
