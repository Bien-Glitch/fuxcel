import type { FuxcelModalInstance, IterableElement, ModalInit } from '../types';
import { Fuxcel } from '../core/Fuxcel';
/**
 * Modal engine.
 * Handles showing, hiding, toggling, and constructing modals.
 * Auto-wires `[data-fx-target="modal"]` triggers on construction.
 */
export declare class FuxcelModal extends Fuxcel implements FuxcelModalInstance {
    #private;
    static fxModalCancelButtonClick: Event;
    static fxModalShowEvent: CustomEvent<{
        plugins: string;
        interface: string;
    }>;
    static fxModalHideEvent: CustomEvent<{
        plugins: string;
        interface: string;
    }>;
    constructor(selector: string | IterableElement | any, context?: string | IterableElement | any, autoActions?: boolean);
    /** The most recently opened modal, or `null` if none is open. **/
    static get currentModal(): FuxcelModal | null;
    /** `true` if any modals are currently open. **/
    static get hasOpenModals(): boolean;
    /** All elements with `[data-fx-target="modal"]`. **/
    static get modalTriggers(): Fuxcel;
    /**
     * Builds a modal DOM structure and returns the root element.
     *
     * @param {ModalInit} options
     * @returns {HTMLElement}
     */
    static init({ title, html, isStatic, content, id, hasFooter }: ModalInit): HTMLElement;
    /** Remove the selected modal element from the DOM entirely. **/
    destroy(): void;
    /**
     * Hide (and optionally destroy) the selected modal.
     *
     * @param destroy {boolean=false} Whether to remove the element from the DOM after hiding.
     */
    hide(destroy?: boolean): void;
    /**
     * Open selected modal.
     *
     * @param escKey {boolean=true} Allow closing the modal using the Escape on the KeyBoard if set to true. True by default.
     */
    show(escKey?: boolean | undefined): void;
    /** Toggle between hide and show state of the selected modal. **/
    toggle(): void;
}
