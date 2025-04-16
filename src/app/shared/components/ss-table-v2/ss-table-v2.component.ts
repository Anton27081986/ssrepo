import {
	ChangeDetectionStrategy,
	Component,
	EventEmitter,
	HostBinding,
	Input,
	Output,
} from '@angular/core';
import { ColumnsStateService } from '@app/core/columns.state.service';
import {
	TooltipPosition,
	TooltipTheme,
} from '@app/shared/components/tooltip/tooltip.enums';
import { AsyncPipe, CommonModule, NgForOf, NgStyle } from '@angular/common';
import { TooltipDirective } from '@app/shared/components/tooltip/tooltip.directive';

@Component({
	selector: 'ss-table-v2',
	templateUrl: 'ss-table-v2.component.html',
	styleUrls: ['ss-table-v2.component.scss'],
	// encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [CommonModule, NgForOf, AsyncPipe, NgStyle, TooltipDirective],
	standalone: true,
})
export class TableV2Component {
	@HostBinding('class.ss-table-v2')
	protected readonly addHostClass = true;

	@Input()
	public padding = '12px';

	@Input()
	public mini = false;

	@Input()
	public shadowed = false;

	@Input()
	public bordered = false;

	@Input()
	public sticky = true;

	@Output()
	protected readonly changeSortByOn: EventEmitter<string> =
		new EventEmitter<string>();

	protected readonly TooltipTheme = TooltipTheme;
	protected readonly TooltipPosition = TooltipPosition;
	constructor(protected readonly stateColumn: ColumnsStateService) {}
}
