import {
	ChangeDetectionStrategy,
	Component,
	computed,
	effect,
	input,
	InputSignal,
	OnDestroy,
} from '@angular/core';
import { ColumnsStateService } from '@app/core/columns.state.service';
import { rotateAnimation } from '@app/core/animations';
import { TovNodeState } from '@app/pages/excess-income/excess-income-state/tov-node-state';
import { ExcessIncomeClientRowItemField } from '@app/pages/excess-income/excess-income-tr/excess-income-client-tr/excess-income-client-tr.component';
import { UntilDestroy } from '@ngneat/until-destroy';
import { numberInputTextMask } from '@app/core/utils/mask';
import { untilDestroyed } from '@ngneat/until-destroy';
import { ProductPriceHistoryComponent } from '@app/pages/excess-income/excess-income-history/product-price-history/product-price-history.component';
import { ModalService } from '@app/core/modal/modal.service';
@UntilDestroy()
@Component({
	selector: 'tr[excess-income-tov-tr]',
	templateUrl: './excess-income-tov-tr.component.html',
	styleUrls: ['./excess-income-tov-tr.component.scss'],
	animations: [rotateAnimation],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExcessIncomeTovTrComponent implements OnDestroy {
	public tovNode: InputSignal<TovNodeState> = input.required<TovNodeState>();

	constructor(
		private readonly modalService: ModalService,
		protected readonly columnsStateService: ColumnsStateService,
	) {}
	protected readonly ExcessIncomeClientRowItemField = ExcessIncomeClientRowItemField;

	protected readonly numberInputTextMask = numberInputTextMask;

	ngOnDestroy() {
		this.tovNode().subscription.unsubscribe();
	}

	protected openHistory() {
		this.modalService
			.open(ProductPriceHistoryComponent, {
				data: {
					clientId: this.tovNode().tovSignal().client.id,
					contractorId: this.tovNode().tovSignal().contractor.id,
					tovId: this.tovNode().tovSignal().tov.id,
				},
			})
			.afterClosed()
			.pipe(untilDestroyed(this))
			.subscribe();
	}
}
