import {
	ChangeDetectionStrategy,
	Component,
	effect,
	input,
	InputSignal,
	Signal,
} from '@angular/core';
import { ColumnsStateService } from '@app/core/columns.state.service';
import { rotateAnimation } from '@app/core/animations';
import { GroupNodeState } from '@app/pages/excess-income/excess-income-state/group-node-state';
import { ExcessIncomeClientRowItemField } from '@app/pages/excess-income/excess-income-tr/excess-income-client-tr/excess-income-client-tr.component';
import { numberInputTextMask } from '@app/core/utils/mask';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ModalService } from '@app/core/modal/modal.service';
import {
	ButtonType,
	IconPosition,
	IconType,
	InputType,
	Size,
	TextType,
	TooltipPosition,
	TooltipTheme,
} from '@front-components/components';
import { PriceHistoryComponent } from '@app/pages/excess-income/excess-income-history/price-history/price-history.component';

@UntilDestroy()
@Component({
	selector: 'tr[excess-income-group-tr]',
	templateUrl: './excess-income-group-tr.component.html',
	styleUrls: ['./excess-income-group-tr.component.scss'],
	animations: [rotateAnimation],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExcessIncomeGroupTrComponent {
	public group: InputSignal<GroupNodeState> = input.required<GroupNodeState>();

	constructor(
		protected readonly columnsStateService: ColumnsStateService,
		private readonly modalService: ModalService,
	) {}

	public openPriceHistory() {
		this.modalService
			.open(PriceHistoryComponent, {
				data: {
					clientId: this.group().groupSignal().client.id,
					contractorId: this.group().groupSignal().contractor.id,
					tovGroupId: this.group().groupSignal().tovSubgroup.id,
					title: 'История изменения цены ТПГ',
					objectId: `${this.group().groupSignal().client.id}:${this.group().groupSignal().contractor.id}:${this.group().groupSignal().tovSubgroup.id}`,
				},
			})
			.afterClosed()
			.pipe(untilDestroyed(this))
			.subscribe();
	}

	protected readonly ExcessIncomeClientRowItemField = ExcessIncomeClientRowItemField;
	protected readonly numberInputTextMask = numberInputTextMask;
	protected readonly Size = Size;
	protected readonly IconType = IconType;
	protected readonly TextType = TextType;
	protected readonly ButtonType = ButtonType;
	protected readonly IconPosition = IconPosition;
	protected readonly InputType = InputType;
	protected readonly TooltipTheme = TooltipTheme;
	protected readonly TooltipPosition = TooltipPosition;
}
