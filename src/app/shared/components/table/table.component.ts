import { AfterViewInit, ChangeDetectorRef, Component, Input } from '@angular/core';
import { ModalService } from '@app/core/modal/modal.service';
import { TableFullCellComponent } from '@app/shared/components/table-full-cell/table-full-cell.component';

export type Cell = { text: string; url?: string } & Array<{ text: string; url?: string }> & string;

export interface ITableItem {
	[key: string]: Cell;
}

export interface ITableHead {
	title: string;
	field: string;
}

@Component({
	selector: 'ss-table',
	templateUrl: './table.component.html',
	styleUrls: ['./table.component.scss'],
})
export class TableComponent implements AfterViewInit {
	@Input() public head: ITableHead[] | undefined;
	@Input() public items: ITableItem[] | undefined;
	@Input() public scroll: boolean = false;
	protected readonly Array = Array;

	constructor(
		private readonly changeDetectorRef: ChangeDetectorRef,
		private readonly modalService: ModalService,
	) {}

	ngAfterViewInit() {
		this.changeDetectorRef.detectChanges();
	}

	showText(cell: Cell) {
		this.modalService.open(TableFullCellComponent, {
			data: {
				cell,
			},
		});
	}
}
