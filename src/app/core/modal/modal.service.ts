import { ComponentType, Overlay } from '@angular/cdk/overlay';
import { Injectable, Injector } from '@angular/core';
import { ComponentPortal } from '@angular/cdk/portal';

import { DIALOG_DATA } from '@app/core/modal/modal-tokens';
import { ModalRef } from '@app/core/modal/modal.ref';

export interface DialogConfig {
	data?: any;
}

@Injectable({
	providedIn: 'root',
})
export class ModalService {
	constructor(
		private readonly overlay: Overlay,
		private readonly injector: Injector,
	) {}

	open<T>(component: ComponentType<T>, config?: DialogConfig) {
		const positionStrategy = this.overlay
			.position()
			.global()
			.centerHorizontally()
			.centerVertically();

		const overlayRef = this.overlay.create({
			positionStrategy,
			hasBackdrop: true,
			backdropClass: 'overlay-backdrop',
			panelClass: 'overlay-panel',
		});

		const dialogRef = new ModalRef(overlayRef);

		const injector = Injector.create({
			parent: this.injector,
			providers: [
				{ provide: ModalRef, useValue: dialogRef },
				{ provide: DIALOG_DATA, useValue: config?.data },
			],
		});

		const portal = new ComponentPortal(component, null, injector);

		overlayRef.attach(portal);

		return dialogRef;
	}
}
