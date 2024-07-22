import {
	AfterViewChecked,
	AfterViewInit,
	ChangeDetectorRef,
	Component,
	ElementRef,
	Input,
	ViewChild,
} from '@angular/core';
import { ModalService } from '@app/core/modal/modal.service';
import { TableFullCellComponent } from '@app/shared/components/table-full-cell/table-full-cell.component';
import { TooltipTheme } from '@app/shared/components/tooltip/tooltip.enums';

export type Cell = { text: string; url?: string } & Array<{ text: string; url?: string }> & string;

export interface ITableItem {
	[key: string]: Cell;
}

export interface ITableHead {
	title: string;
	field: string;
	sizeRatio?: number;
}

@Component({
	selector: 'ss-table',
	templateUrl: './table.component.html',
	styleUrls: ['./table.component.scss'],
})
export class TableComponent implements AfterViewInit, AfterViewChecked {
	@Input() public head: ITableHead[] = [];
	@Input() public items: ITableItem[] | undefined | null;
	@Input() public padding: string = '12px';

	protected gridTemplateColumns = '';
	protected scroll: boolean = false;

	protected readonly Array = Array;

	@ViewChild('headerEl') public headerEl!: ElementRef;
	@ViewChild('bodyEl') public bodyEl!: ElementRef;

	constructor(
		private readonly changeDetectorRef: ChangeDetectorRef,
		private readonly modalService: ModalService,
	) {}

	ngAfterViewInit() {
		this.gridTemplateColumns = this.head
			.map(el => (el.sizeRatio ? `${el.sizeRatio}fr` : '1fr'))
			.join(' ');
	}

	ngAfterViewChecked() {
		setTimeout(() => {
			this.scroll =
				this.bodyEl.nativeElement.clientHeight < this.bodyEl.nativeElement.scrollHeight;
			this.changeDetectorRef.detectChanges();
		}, 1);
	}

	showText(cell: Cell) {
		this.modalService.open(TableFullCellComponent, {
			data: {
				cell,
			},
		});
	}

	protected readonly TooltipTheme = TooltipTheme;
}
