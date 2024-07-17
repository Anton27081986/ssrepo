import {
	AfterViewChecked,
	ChangeDetectorRef,
	Component,
	ElementRef,
	Input,
	ViewChild,
} from '@angular/core';
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
export class TableComponent implements AfterViewChecked {
	@Input() public head: ITableHead[] | undefined;
	@Input() public items: ITableItem[] | undefined | null;
	@Input() public scroll: boolean = false;
	protected readonly Array = Array;
	@Input() public padding: string = '12px';

	@ViewChild('headEl') public headEl!: ElementRef;
	@ViewChild('pseudoHeadEl') public pseudoHeadEl!: ElementRef;

	constructor(
		private readonly changeDetectorRef: ChangeDetectorRef,
		private readonly modalService: ModalService,
	) {}

	ngAfterViewChecked() {
		this.changeDetectorRef.detectChanges();
		this.resizeHeader();
	}

	resizeHeader() {
		setTimeout(() => {
			const headItemsArr: HTMLElement[] = [...this.pseudoHeadEl.nativeElement.children];

			[...this.headEl.nativeElement.children].forEach((headItem: HTMLElement, index) => {
				headItemsArr[index].style.minWidth = `${Math.round(headItem.offsetWidth)}px`;
			});
		}, 0);
	}

	showText(cell: Cell) {
		this.modalService.open(TableFullCellComponent, {
			data: {
				cell,
			},
		});
	}
}
