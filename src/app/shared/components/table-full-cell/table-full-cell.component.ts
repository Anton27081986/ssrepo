import { Component, Inject } from '@angular/core';
import { ModalRef } from '@app/core/modal/modal.ref';
import { DIALOG_DATA } from '@app/core/modal/modal-tokens';
import { Cell } from '@app/shared/components/table/table.component';
import {CardComponent} from "@app/shared/components/card/card.component";
import {IconComponent} from "@app/shared/components/icon/icon.component";
import {HeadlineComponent} from "@app/shared/components/typography/headline/headline.component";
import {TextComponent} from "@app/shared/components/typography/text/text.component";

interface DialogData {
	cell: Cell;
	title?: string;
}

@Component({
	selector: 'ss-table-full-cell',
	templateUrl: './table-full-cell.component.html',
	styleUrls: ['./table-full-cell.component.scss'],
	imports: [
		CardComponent,
		IconComponent,
		HeadlineComponent,
		TextComponent
	],
	standalone: true
})
export class TableFullCellComponent {
	public cell: Cell | undefined;
	public title: string | undefined;

	constructor(
		private readonly modalRef: ModalRef,
		@Inject(DIALOG_DATA) private readonly data: DialogData,
	) {
		if (!data.cell) {
			return;
		}

		if (data.title) {
			this.title = data.title;
		}

		this.cell = data.cell;
	}

	close() {
		this.modalRef.close();
	}

	protected readonly Array = Array;
}
