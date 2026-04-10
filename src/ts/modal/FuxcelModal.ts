import type {FuxcelModalInstance, IterableElement, ModalInit} from '../types';
import {Fuxcel, fx} from '../core/Fuxcel';
import {parseBool} from '../utils';

/**
 * Modal engine.
 * Handles showing, hiding, toggling, and constructing modals.
 * Auto-wires `[data-fx-target="modal"]` triggers on construction.
 */
export class FuxcelModal extends Fuxcel implements FuxcelModalInstance {
	#_isHiding = false;
	
	static #_modalTarget: Fuxcel;
	static #_openModals: FuxcelModal[] = [];
	
	static fxModalCancelButtonClick = new Event('click');
	
	static fxModalShowEvent = new CustomEvent('fx.modal.show', {
		bubbles: true,
		detail: {plugins: 'Fuxcel', interface: 'FuxcelModalInterface'},
	});
	
	static fxModalHideEvent = new CustomEvent('fx.modal.hide', {
		bubbles: true,
		detail: {plugins: 'Fuxcel', interface: 'FuxcelModalInterface'},
	});
	
	constructor(
		selector: string | IterableElement | any,
		context?: string | IterableElement | any,
		autoActions: boolean = true
	) {
		super(selector, context);
		
		if (FuxcelModal.modalTriggers.length) {
			FuxcelModal.modalTriggers.off('click').upon('click', function (e) {
				e.preventDefault();
				const currentTrigger = fx((e as any).currentTarget);
				const modalAction = currentTrigger.dataAttrib('fx-action')?.toLowerCase() ?? 'open';
				const modalTarget = currentTrigger.dataAttrib('fx-action')?.length
					? (currentTrigger.parents('.fx-modal').length ? currentTrigger.parents('.fx-modal') : null)
					: fx(`#${currentTrigger.dataAttrib('fx-modal')}`);
				
				const triggerModal = () => {
					if (modalTarget) {
						FuxcelModal.#_modalTarget = modalTarget;
						if (autoActions) {
							if (modalAction === 'close') FuxcelModal.#_modalTarget.modal.hide();
							else FuxcelModal.#_modalTarget.modal.toggle();
						}
					}
				};
				
				(currentTrigger.parents('.fx-modal').length &&
					!currentTrigger.parents('.fx-modal').attrib('id')?.includes('init'))
					? triggerModal()
					: (!currentTrigger.parents('.fx-modal').length && triggerModal());
			});
		} else
			console.error('Target modal action triggers not found.');
	}
	
	// ─── Static Getters ───────────────────────────────────────────────────────
	
	/** The most recently opened modal, or `null` if none is open. **/
	static get currentModal(): FuxcelModal | null {
		return FuxcelModal.hasOpenModals
			? FuxcelModal.#_openModals[FuxcelModal.#_openModals.length - 1]
			: null;
	}
	
	/** `true` if any modals are currently open. **/
	static get hasOpenModals(): boolean {
		return !!FuxcelModal.#_openModals.length;
	}
	
	/** All elements with `[data-fx-target="modal"]`. **/
	static get modalTriggers(): Fuxcel {
		return fx('*[data-fx-target="modal"]');
	}
	
	// ─── Static Factory ───────────────────────────────────────────────────────
	/**
	 * Builds a modal DOM structure and returns the root element.
	 *
	 * @param {ModalInit} options
	 * @returns {HTMLElement}
	 */
	static init({title = null, html = true, isStatic = false, content, id, hasFooter}: ModalInit): HTMLElement {
		const fxModal = document.createElement('div');
		const modalDialog = document.createElement('div');
		const modalContent = document.createElement('div');
		const modalHeader = document.createElement('div');
		const modalBody = document.createElement('div');
		const modalFooter = document.createElement('div');
		const modalTitle = document.createElement('div');
		const closeButton = document.createElement('div');
		
		fxModal.id = id;
		isStatic && (fxModal.dataset.fxStatic = 'true');
		fxModal.classList.add('fx-modal', 'filter');
		
		title && (modalTitle.innerHTML = title);
		html ? (modalBody.innerHTML = content) : (modalBody.innerText = content);
		
		closeButton.dataset.fxAction = 'close';
		closeButton.dataset.fxTarget = 'modal';
		
		modalTitle.classList.add('title');
		closeButton.classList.add('close');
		
		modalDialog.classList.add('fx-modal-dialog', 'fx-dialog-centered', 'fx-dialog-scrollable');
		modalContent.classList.add('fx-modal-content');
		modalHeader.classList.add('fx-modal-header');
		modalBody.classList.add('fx-modal-body');
		modalFooter.classList.add('fx-modal-footer');
		
		modalHeader.append(modalTitle, closeButton);
		modalContent.append(modalHeader, modalBody, modalFooter);
		modalDialog.append(modalContent);
		fxModal.append(modalDialog);
		
		!title && modalContent.removeChild(modalHeader);
		!hasFooter && modalContent.removeChild(modalFooter);
		return fxModal;
	}
	
	// ─── Instance Methods ─────────────────────────────────────────────────────
	
	/** Remove the selected modal element from the DOM entirely. **/
	destroy(): void {
		// @ts-ignore
		this[0].remove();
	}
	
	/**
	 * Hide (and optionally destroy) the selected modal.
	 *
	 * @param destroy {boolean=false} Whether to remove the element from the DOM after hiding.
	 */
	hide(destroy: boolean = false): void {
		const modalContent = fx('.fx-modal-content', this);
		if (!this.#_isHiding) {
			this.#_isHiding = true;
			modalContent.fadeout(200).then(() =>
				this.fadeout(200).then(() => {
					const index = FuxcelModal.#_openModals.indexOf(this);
					if (index !== -1) FuxcelModal.#_openModals.splice(index, 1);
					
					// @ts-ignore
					this[0].dispatchEvent(FuxcelModal.fxModalHideEvent);
					destroy && this.destroy();
					this.#_isHiding = false;
				})
			);
		}
	}
	
	/**
	 * Open selected modal.
	 *
	 * @param escKey {boolean=true} Allow closing the modal using the Escape on the KeyBoard if set to true. True by default.
	 */
	show(escKey: boolean | undefined = true): void {
		const modalContent = fx('.fx-modal-content', this);
		
		this.style({pointerEvents: 'none'}).fadein(0).then(() =>
			modalContent.fadein(0, 'flex').then(() => {
				FuxcelModal.#_openModals.push(this);
				this.style({pointerEvents: 'unset'});
				
				if (!parseBool(this.dataAttrib('fx-static'))) {
					this.upon('click', () =>
						modalContent.hasFocus.then((focused: boolean) => !focused ? this.hide() : null)
					);
					
					if (escKey)
						fx(document).upon('keyup', (e: Event) => {
							const key = (<KeyboardEvent>e).key.toLowerCase();
							if ((key === 'escape' || key === 'esc') && FuxcelModal.hasOpenModals)
								FuxcelModal.currentModal?.hide();
						});
				}
				
				// @ts-ignore
				this[0].dispatchEvent(FuxcelModal.fxModalShowEvent);
			})
		);
	}
	
	/** Toggle between hide and show state of the selected modal. **/
	toggle(): void {
		this.style('display') === 'none' ? this.show() : this.hide();
	}
}
