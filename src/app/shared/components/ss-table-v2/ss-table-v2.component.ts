import {
	ChangeDetectionStrategy,
	Component,
	EventEmitter,
	HostBinding,
	Input,
	Output,
} from '@angular/core';
import { ColumnsStateService } from '@app/core/columns.state.service';
import { TooltipPosition, TooltipTheme } from '@app/shared/components/tooltip/tooltip.enums';
import {AsyncPipe, NgForOf, NgStyle} from "@angular/common";
import {TooltipDirective} from "@app/shared/components/tooltip/tooltip.directive";

@Component({
	selector: 'ss-table-v2',
	templateUrl: 'ss-table-v2.component.html',
	styleUrls: ['ss-table-v2.component.scss'],
	// encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		NgForOf,
		AsyncPipe,
		NgStyle,
		TooltipDirective
	],
	standalone: true
})
export class TableV2Component {
	@HostBinding('class.ss-table-v2') protected readonly addHostClass = true;
	@Input() public padding: string = '12px';

	@Input() public mini: boolean = false;
	@Input() public shadowed: boolean = false;
	@Input() public bordered: boolean = false;
	@Input() public sticky: boolean = true;

	@Output() protected readonly changeSortByOn: EventEmitter<string> = new EventEmitter<string>();

	constructor(protected readonly stateColumn: ColumnsStateService) {}

	protected readonly TooltipTheme = TooltipTheme;
	protected readonly TooltipPosition = TooltipPosition;
}
