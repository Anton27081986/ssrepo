import {
	ChangeDetectionStrategy,
	Component,
	EventEmitter,
	HostBinding,
	Input,
	Output,
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
export class TableV2Component {
	@HostBinding('class.ss-table-v2') protected readonly addHostClass = true;
	@Input() public padding: string = '12px';

	@Input() public mini: boolean = false;
	@Input() public shadowed: boolean = false;
	@Input() public bordered: boolean = false;
	@Input() public sticky: boolean = false;

	@Output() protected readonly changeSortByOn: EventEmitter<string> = new EventEmitter<string>();

	constructor(protected readonly stateColumn: ColumnsStateService) {}
}
