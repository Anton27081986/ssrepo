import {
	ChangeDetectionStrategy,
	Component,
	EventEmitter,
	HostBinding,
	Input,
	Output,
	ViewEncapsulation,
} from '@angular/core';
import { IStoreTableBaseColumn } from '@app/core/store';
import { ColumnsStateService } from '@app/core/columns.state.service';

@Component({
	selector: 'ss-table-v2',
	templateUrl: 'ss-table-v2.component.html',
	styleUrls: ['ss-table-v2.component.scss'],
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableV2Component {
	@HostBinding('class.hc-table') protected readonly addHostClass = true;
	public cols: IStoreTableBaseColumn[] = [];
	// @Input() public getRequest: IPaginationBaseRequest | null = null;

	@Input() public mini: boolean = false;
	@Input() public shadowed: boolean = false;
	@Input() public bordered: boolean = false;
	@Input() public sticky: boolean = false;

	@Output() protected readonly changeSortByOn: EventEmitter<string> = new EventEmitter<string>();

	constructor(protected readonly stateColumn: ColumnsStateService) {}
}
