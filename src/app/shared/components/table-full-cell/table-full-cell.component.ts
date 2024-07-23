import { Component, Inject } from '@angular/core';
import { ModalRef } from '@app/core/modal/modal.ref';
import { DIALOG_DATA } from '@app/core/modal/modal-tokens';
import { Cell } from '@app/shared/components/table/table.component';

interface DialogData {
	cell: Cell;
	arr: string[];
}

@Component({
	selector: 'ss-table-full-cell',
	templateUrl: './table-full-cell.component.html',
	styleUrls: ['./table-full-cell.component.scss'],
})
export class TableFullCellComponent {
	public cell:
		| ({ text: string; url?: string } & Array<{ text: string; url?: string }> & string)
		| undefined;

	constructor(
		private readonly modalRef: ModalRef,
		@Inject(DIALOG_DATA) private readonly data: DialogData,
	) {
		if (!data.cell) {
			return;
		}

		this.cell = data.cell;
	}

	close() {
		this.modalRef.close();
	}

	protected readonly Array = Array;
}
