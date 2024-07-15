import {
	AfterViewChecked,
	ChangeDetectionStrategy,
	Component,
	ElementRef,
	EventEmitter,
	HostBinding,
	Input,
	Output,
	ViewChild,
	ViewEncapsulation,
} from '@angular/core';
import { ColumnsStateService } from '@app/core/columns.state.service';

@Component({
	selector: 'ss-table-v2',
	templateUrl: 'ss-table-v2.component.html',
	styleUrls: ['ss-table-v2.component.scss'],
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableV2Component implements AfterViewChecked {
	@HostBinding('class.ss-table-v2') protected readonly addHostClass = true;
	@Input() public padding: string = '12px';

	@Input() public mini: boolean = false;
	@Input() public shadowed: boolean = false;
	@Input() public bordered: boolean = false;
	@Input() public sticky: boolean = false;

	@Output() protected readonly changeSortByOn: EventEmitter<string> = new EventEmitter<string>();

	@ViewChild('headEl') public headEl!: ElementRef;
	@ViewChild('pseudoHeadEl') public pseudoHeadEl!: ElementRef;

	constructor(protected readonly stateColumn: ColumnsStateService) {
		stateColumn.visibleCols$.subscribe(item => console.log(item));
	}

	ngAfterViewChecked() {
		// this.changeDetectorRef.detectChanges();
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
}
