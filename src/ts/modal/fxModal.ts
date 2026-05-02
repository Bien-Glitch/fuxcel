import type {FXModalType} from '../types';
import {fx} from '../core/Fuxcel';
import {FuxcelModal} from './FuxcelModal';
import {parseBool} from '../utils';

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
	
	const SVG_NS = 'http://www.w3.org/2000/svg';
	const imageSuccess: SVGElement = document.createElementNS(SVG_NS, 'svg');
	const imageError: SVGElement = document.createElementNS(SVG_NS, 'svg');
	const imageWarning: SVGElement = document.createElementNS(SVG_NS, 'svg');
	const sharedSVGAttributes: { [key: string]: any, width: string, height: string, viewBox: string } = {
		width: '24px',
		height: '24px',
		viewBox: '0 0 24 24',
	};
	
	Object.keys(sharedSVGAttributes).forEach((attr) => {
		imageSuccess.setAttribute(attr, sharedSVGAttributes[attr]);
		imageError.setAttribute(attr, sharedSVGAttributes[attr]);
		imageWarning.setAttribute(attr, sharedSVGAttributes[attr]);
	});
	
	imageSuccess.innerHTML = `
		<path fill="#12B886" d="M 12 2 C 6.4889971 2 2 6.4889971 2 12 C 2 17.511003 6.4889971 22 12 22 C 17.511003 22 22 17.511003 22 12 C 22 6.4889971 17.511003 2 12 2 z M 12 4 C 16.430123 4 20 7.5698774 20 12 C 20 16.430123 16.430123 20 12 20 C 7.5698774 20 4 16.430123 4 12 C 4 7.5698774 7.5698774 4 12 4 z M 16.292969 8.2929688 L 10 14.585938 L 7.7070312 12.292969 L 6.2929688 13.707031 L 10 17.414062 L 17.707031 9.7070312 L 16.292969 8.2929688 z"></path>
	`;
	imageError.innerHTML = `
		<path fill="#FA5252" d="M 12 2 C 6.4889971 2 2 6.4889971 2 12 C 2 17.511003 6.4889971 22 12 22 C 17.511003 22 22 17.511003 22 12 C 22 6.4889971 17.511003 2 12 2 z M 12 4 C 16.430123 4 20 7.5698774 20 12 C 20 16.430123 16.430123 20 12 20 C 7.5698774 20 4 16.430123 4 12 C 4 7.5698774 7.5698774 4 12 4 z M 8.7070312 7.2929688 L 7.2929688 8.7070312 L 10.585938 12 L 7.2929688 15.292969 L 8.7070312 16.707031 L 12 13.414062 L 15.292969 16.707031 L 16.707031 15.292969 L 13.414062 12 L 16.707031 8.7070312 L 15.292969 7.2929688 L 12 10.585938 L 8.7070312 7.2929688 z"></path>
	`;
	imageWarning.innerHTML = `
		<path fill="#ff8503" d="M12 5.99L19.53 19H4.47L12 5.99M12 2L1 21h22L12 2zm1 14h-2v2h2v-2zm0-6h-2v4h2v-4z"></path>
	`;
	
	// Alert icon
	const alertIcon = type === 'success' ? imageSuccess : (type === 'error' ? imageError : imageWarning);
	// @ts-ignore
	(<HTMLElement>modalBody[0]).prepend(alertIcon);
	
	
	// Buttons
	const buttonsWrapper = (btns: string) => `<div class="fx-modal-alert-buttons">${btns}</div>`;
	const cancelButton = (label: string) => `<button type="button" id="fx-modal-cancel" class="fx-btn fx-btn-error" data-fx-action="close" data-fx-target="modal">${label}</button>`;
	const confirmButton = (label: string) => `<button type="button" id="fx-modal-confirm" class="fx-btn fx-btn-primary" data-fx-target="modal" data-fx-modal="init">${label}</button>`;
	
	const buttons = confirmButtonText && cancelButtonText ?
		cancelButton(cancelButtonText) + confirmButton(confirmButtonText) :
		(confirmButtonText ? confirmButton(confirmButtonText) : (cancelButtonText && cancelButton(cancelButtonText)));
	
	modalBody.style({display: 'flex', flexDirection: 'column', alignItems: 'center'})/*.insertHTML(alertIcon, 'prefix')*/;
	buttons && modalBody.insertHTML(buttonsWrapper(buttons), 'prepend');
	
	body?.append(initialModal);
	fx('.fx-modal-alert-icon', initialModal).style({visibility: 'visible'}).fadein(2000).then();
	
	const modal = new FuxcelModal(initialModal);
	modal.show(!cancelButtonText);
	
	if (cancelButtonText || confirmButtonText) {
		if (!cancelButtonText)
			modal.off().upon('fx.modal.hide', (e) => typeof onEsc === 'function' ? onEsc(<CustomEvent>e, modal) : null);
		
		modal.off('click').upon('click', function (e) {
			const clickedTarget = fx(e.target as HTMLElement);
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
