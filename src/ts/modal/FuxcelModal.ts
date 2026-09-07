import type {CustomEventType, FuxcelModalInstance, IterableElement, ModalInit} from '../types';
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
	
	// ─── Custom Events ─────────────────────────────────────────────
	/**
	 * On Modal showing
	 *
	 * @type {CustomEventType}
	 */
	static fxModalShowEvent: CustomEventType = new CustomEvent('fx.modal.show', {
		bubbles: true,
		detail: {plugin: 'Fuxcel', interface: 'FuxcelModalInterface', timestamp: Date.now()},
	});
	
	/**
	 * On Modal shown
	 *
	 * @type {CustomEventType}
	 */
	static fxModalShownEvent: CustomEventType = new CustomEvent('fx.modal.shown', {
		bubbles: true,
		detail: {plugin: 'Fuxcel', interface: 'FuxcelModalInterface', timestamp: Date.now()},
	});
	
	/**
	 * On Modal hidding
	 *
	 * @type {CustomEventType}
	 */
	static fxModalHideEvent: CustomEventType = new CustomEvent('fx.modal.hide', {
		bubbles: true,
		detail: {plugin: 'Fuxcel', interface: 'FuxcelModalInterface', timestamp: Date.now()},
	});
	
	/**
	 * On Modal hidden
	 *
	 * @type {CustomEventType}
	 */
	static fxModalHiddenEvent: CustomEventType = new CustomEvent('fx.modal.hidden', {
		bubbles: true,
		detail: {plugin: 'Fuxcel', interface: 'FuxcelModalInterface', timestamp: Date.now()},
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
				const modalTarget = currentTrigger.dataAttrib('fx-action')?.length ?
					(currentTrigger.parents('.fx-modal').length ? currentTrigger.parents('.fx-modal') : null) :
					fx(`#${currentTrigger.dataAttrib('fx-modal')}`);
				
				if (modalTarget) {
					FuxcelModal.#_modalTarget = modalTarget;
					if (autoActions) {
						if (currentTrigger.parents('.fx-modal').attrib('id')?.includes('init')) {
							if (modalAction === 'close')
								FuxcelModal.#_modalTarget.modal.hide()
						} else if (modalAction === 'close')
							FuxcelModal.#_modalTarget.modal.hide();
						else
							FuxcelModal.#_modalTarget.modal.toggle();
					}
				}
			});
		} else
			console.error('Target modal action triggers not found.');
	}
	
	// ─── Static Getters ───────────────────────────────────────────────────────
	/** The most recently opened modal, or `null` if none is open. **/
	static get currentModal(): FuxcelModal | null {
		return FuxcelModal.hasOpenModals ?
			FuxcelModal.#_openModals[FuxcelModal.#_openModals.length - 1] : null;
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
	static init({id, content, title = null, html = true, isStatic = false, hasFooter = false}: ModalInit): HTMLElement {
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
		
		if (!content)
			content = html ? '<h2>This is a new FuxcelModal!</h2>' : 'This is a new FuxcelModal!';
		
		title && (modalTitle.innerHTML = title);
		html ? (modalBody.innerHTML = content) : (modalBody.innerText = content);
		
		closeButton.innerHTML = `
			<svg width="24px" height="24px" viewBox="0 0 24 24" style="display: inline-block;">
				<path fill="#FA5252" d="M 12 2 C 6.4889971 2 2 6.4889971 2 12 C 2 17.511003 6.4889971 22 12 22 C 17.511003 22 22 17.511003 22 12 C 22 6.4889971 17.511003 2 12 2 z M 12 4 C 16.430123 4 20 7.5698774 20 12 C 20 16.430123 16.430123 20 12 20 C 7.5698774 20 4 16.430123 4 12 C 4 7.5698774 7.5698774 4 12 4 z M 8.7070312 7.2929688 L 7.2929688 8.7070312 L 10.585938 12 L 7.2929688 15.292969 L 8.7070312 16.707031 L 12 13.414062 L 15.292969 16.707031 L 16.707031 15.292969 L 13.414062 12 L 16.707031 8.7070312 L 15.292969 7.2929688 L 12 10.585938 L 8.7070312 7.2929688 z"></path>
			</svg>
		`;
		
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
			this[0].dispatchEvent(FuxcelModal.fxModalHideEvent);
			modalContent.fadeout(200).then(() =>
				this.fadeout(200).then(() => {
					const index = FuxcelModal.#_openModals.indexOf(this);
					if (index !== -1) FuxcelModal.#_openModals.splice(index, 1);
					
					this[0].dispatchEvent(FuxcelModal.fxModalHiddenEvent);
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
		
		if (modalContent.length) {
			this[0].dispatchEvent(FuxcelModal.fxModalShowEvent);
			this.style({pointerEvents: 'none'}).fadein(0).then(() =>
				modalContent.fadein(0, 'flex').then(() => {
					FuxcelModal.#_openModals.push(this);
					this.style({pointerEvents: 'unset'});
					
					this.upon('click', () => modalContent.hasFocus.then((focused: boolean) => {
						!focused ? (!parseBool(this.dataAttrib('fx-static')) ? this.hide() : modalContent.shake(500, 2)) : null
					}));
					
					if (escKey)
						fx(document).upon('keyup', (e: Event) => {
							const key = (<KeyboardEvent>e).key.toLowerCase();
							if ((key === 'escape' || key === 'esc') && FuxcelModal.hasOpenModals)
								!parseBool(this.dataAttrib('fx-static')) ?
									FuxcelModal.currentModal?.hide() :
									modalContent.shake(500, 2);
						});
					this[0].dispatchEvent(FuxcelModal.fxModalShownEvent);
				})
			);
		}
	}
	
	/** Toggle between hide and show state of the selected modal. **/
	toggle(): void {
		this.style('display') === 'none' ? this.show() : this.hide();
	}
}
