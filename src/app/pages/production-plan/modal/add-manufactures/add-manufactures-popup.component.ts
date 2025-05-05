import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
	ButtonComponent,
	ButtonType,
	ExtraSize,
	IconType,
	ModalActionApplyComponent,
	ModalComponent,
	ModalRef,
	Shape,
} from '@front-library/components';

@Component({
	selector: 'app-add-manufactures-popup',
	standalone: true,
	imports: [ModalComponent, ModalActionApplyComponent, ButtonComponent],
	templateUrl: './add-manufactures-popup.component.html',
	styleUrl: './add-manufactures-popup.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddManufacturesPopupComponent {
	protected readonly ExtraSize = ExtraSize;
	protected readonly Shape = Shape;
	protected readonly IconType = IconType;
	private readonly popup = inject(ModalRef);

	protected add() {}

	protected close() {
		this.popup.close();
	}

	protected readonly ButtonType = ButtonType;
}
