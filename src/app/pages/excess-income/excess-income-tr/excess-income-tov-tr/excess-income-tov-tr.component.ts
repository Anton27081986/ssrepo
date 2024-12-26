import { ChangeDetectionStrategy, Component, input, InputSignal, OnDestroy } from '@angular/core';
import { ColumnsStateService } from '@app/core/columns.state.service';
import { rotateAnimation } from '@app/core/animations';
import { TovNodeState } from '@app/pages/excess-income/excess-income-state/tov-node-state';
import { ExcessIncomeClientRowItemField } from '@app/pages/excess-income/excess-income-tr/excess-income-client-tr/excess-income-client-tr.component';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { numberInputTextMask } from '@app/core/utils/mask';
import { ModalService } from '@app/core/modal/modal.service';
import { SalesHistoryComponent } from '@app/pages/excess-income/excess-income-history/sales-history/sales-history.component';
import { CommentsHistoryComponent } from '@app/pages/excess-income/excess-income-history/comments-history/comments-history.component';
import {
	ButtonType,
	IconPosition,
	IconType,
	InputType,
	Size,
	TextType,
	TextWeight,
	TooltipPosition,
	TooltipTheme,
} from '@front-components/components';
import { PriceHistoryComponent } from '@app/pages/excess-income/excess-income-history/price-history/price-history.component';
import { ExcessIncomeEditCommentPopoverComponent } from '@app/pages/excess-income/excess-income-edit-comment-card/excess-income-edit-comment-popover.component';

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

	get differentCurrentFinalPrice(): boolean {
		return (
			this.tovNode().currentParams.controls.finalPrice.value !==
			this.tovNode().tovSignal().currentParams.finalPrice
		);
	}

	get differentNextFinalPrice(): boolean {
		return (
			this.tovNode().tovSignal().nextParams.finalPrice !==
			this.tovNode().tovSignal().paramsGroup.controls.nextParams.controls.finalPrice.value
		);
	}

	get canEditComment(): boolean {
		return this.tovNode().canEditComment;
	}

	protected readonly ExcessIncomeClientRowItemField = ExcessIncomeClientRowItemField;

	protected readonly numberInputTextMask = numberInputTextMask;

	ngOnDestroy() {
		this.tovNode().subscription.unsubscribe();
	}

	protected openPriceHistory() {
		this.modalService
			.open(PriceHistoryComponent, {
				data: {
					title: 'История изменения цены ТП',
					objectId: `${this.tovNode().tovSignal().client.id}:${this.tovNode().tovSignal().contractor.id}:${this.tovNode().tovSignal().tovSubgroup.id}:${this.tovNode().tovSignal().tov.id}`,
				},
			})
			.afterClosed()
			.pipe(untilDestroyed(this))
			.subscribe();
	}

	protected openSalesHistory() {
		this.modalService
			.open(SalesHistoryComponent, {
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

	protected openCommentsHistory() {
		this.modalService
			.open(CommentsHistoryComponent, {
				data: {
					clientId: this.tovNode().tovSignal().client.id,
					contractorId: this.tovNode().tovSignal().contractor.id,
					tovGroupId: this.tovNode().tovSignal().tovSubgroup.id,
					tovId: this.tovNode().tovSignal().tov.id,
				},
			})
			.afterClosed()
			.pipe(untilDestroyed(this))
			.subscribe();
	}

	protected openModalEditComment() {
		this.modalService.open(ExcessIncomeEditCommentPopoverComponent, {
			data: { tovNode: this.tovNode() },
		});
	}

	protected readonly TextType = TextType;
	protected readonly ButtonType = ButtonType;
	protected readonly IconType = IconType;
	protected readonly IconPosition = IconPosition;
	protected readonly InputType = InputType;
	protected readonly Size = Size;
	protected readonly TooltipTheme = TooltipTheme;
	protected readonly TooltipPosition = TooltipPosition;
	protected readonly TextWeight = TextWeight;
}
