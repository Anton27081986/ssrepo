import {
	AfterViewChecked,
	AfterViewInit,
	ChangeDetectorRef,
	Component,
	ElementRef,
	EventEmitter,
	HostBinding,
	Input,
	Output,
	ViewChild,
} from '@angular/core';
import { ModalService } from '@app/core/modal/modal.service';
import { TableFullCellComponent } from '@app/shared/components/table-full-cell/table-full-cell.component';
import { environment } from '@environments/environment';
import { TooltipPosition, TooltipTheme } from '@app/shared/components/tooltip/tooltip.enums';

export type Cell = { text: string; pseudoLink: string } & { icon: string } & {
	text: string;
	url?: string;
} & Array<{
		text: string;
		url?: string;
	}> &
	string;

export interface ITableItem {
	[key: string]: Cell;
}

export interface ITableHead {
	title: string;
	field: string;
	sizeRatio?: number;
	isNumber?: boolean;
	tooltip?: string;
}

@Component({
	selector: 'ss-table',
	templateUrl: './table.component.html',
	styleUrls: ['./table.component.scss'],
})
export class TableComponent implements AfterViewInit, AfterViewChecked {
	@HostBinding('style.padding')
	@Input()
	public head: ITableHead[] = [];

	@Input() public items: ITableItem[] | undefined | null;
	@Input() public padding: string = '12px';
	@Input() public size: '1' | '2' | '3' | '4' = '3';

	@Output() public controlClick = new EventEmitter<{ row: ITableItem; icon: string }>();

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

	showText(cell: Cell, title: string) {
		this.modalService.open(TableFullCellComponent, {
			data: {
				cell,
				title,
			},
		});
	}

	onControlClick(row: ITableItem, icon: string) {
		this.controlClick.emit({ row, icon });
	}

	protected readonly environment = environment;
	protected readonly TooltipPosition = TooltipPosition;
	protected readonly TooltipTheme = TooltipTheme;
}
