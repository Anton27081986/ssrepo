import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { ModalRef } from '@app/core/modal/modal.ref';

@UntilDestroy()
@Component({
	selector: 'app-add-victory-modal-result',
	templateUrl: './add-victory-modal-result.component.html',
	styleUrls: ['./add-victory-modal-result.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddVictoryModalResultComponent {
	constructor(private readonly modalRef: ModalRef) {}

	protected close() {
		this.modalRef.close();
	}
}
