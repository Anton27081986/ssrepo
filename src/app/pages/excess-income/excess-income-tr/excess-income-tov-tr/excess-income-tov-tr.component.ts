import {
	ChangeDetectionStrategy,
	Component,
	input,
	InputSignal,
	OnDestroy,
} from '@angular/core';
import { ColumnsStateService } from '@app/core/columns.state.service';
import { rotateAnimation } from '@app/core/animations';
import { TovNodeState } from '@app/pages/excess-income/excess-income-state/tov-node-state';
import { ExcessIncomeClientRowItemField } from '@app/pages/excess-income/excess-income-tr/excess-income-client-tr/excess-income-client-tr.component';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ModalService } from '@app/core/modal/modal.service';
import { SalesHistoryComponent } from '@app/pages/excess-income/excess-income-history/sales-history/sales-history.component';
import { CommentsHistoryComponent } from '@app/pages/excess-income/excess-income-history/comments-history/comments-history.component';
import {
	ButtonComponent,
	ButtonType,
	DropdownButtonComponent,
	DropdownItemComponent,
	FieldCtrlDirective,
	FormFieldComponent,
	IconPosition,
	IconType,
	InputComponent,
	InputType,
	LinkComponent,
	Size,
	TextComponent,
	TextType,
	TextWeight,
	TooltipDirective,
	TooltipPosition,
	TooltipTheme,
} from '@front-components/components';
import { ProductPriceHistoryComponent } from '@app/pages/excess-income/excess-income-history/product-price-history/product-price-history.component';
import { ExcessIncomeEditCommentPopoverComponent } from '@app/pages/excess-income/excess-income-edit-comment-card/excess-income-edit-comment-popover.component';
import { NumWithSpacesPipe } from '@app/core/pipes/num-with-spaces.pipe';
import { ReactiveFormsModule } from '@angular/forms';
import {
	AsyncPipe,
	CommonModule,
	NgIf,
	NgSwitch,
	NgSwitchCase,
} from '@angular/common';

@UntilDestroy()
@Component({
	selector: 'tr[excess-income-tov-tr]',
	templateUrl: './excess-income-tov-tr.component.html',
	styleUrls: ['./excess-income-tov-tr.component.scss'],
	animations: [rotateAnimation],
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		CommonModule,
		LinkComponent,
		ButtonComponent,
		DropdownButtonComponent,
		DropdownItemComponent,
		TextComponent,
		FormFieldComponent,
		InputComponent,
		TooltipDirective,
		NumWithSpacesPipe,
		ReactiveFormsModule,
		AsyncPipe,
		NgSwitch,
		NgSwitchCase,
		NgIf,
		FieldCtrlDirective,
	],
	standalone: true,
})
export class ExcessIncomeTovTrComponent implements OnDestroy {
	public tovNode: InputSignal<TovNodeState> = input.required<TovNodeState>();

	protected readonly ExcessIncomeClientRowItemField =
		ExcessIncomeClientRowItemField;

	protected readonly TextType = TextType;
	protected readonly ButtonType = ButtonType;
	protected readonly IconType = IconType;
	protected readonly IconPosition = IconPosition;
	constructor(
		private readonly modalService: ModalService,
		protected readonly columnsStateService: ColumnsStateService,
	) {}

	protected readonly InputType = InputType;
	get differentCurrentFinalPrice(): boolean {
		return (
			this.tovNode().currentParams.controls.finalPrice.value !==
			this.tovNode().tovSignal().currentParams.finalPrice
		);
	}

	get differentNextFinalPrice(): boolean {
		return (
			this.tovNode().tovSignal().nextParams.finalPrice !==
			this.tovNode().tovSignal().paramsGroup.controls.nextParams.controls
				.finalPrice.value
		);
	}

	protected readonly Size = Size;
	get canEditComment(): boolean {
		return this.tovNode().canEditComment;
	}

	ngOnDestroy() {
		this.tovNode().subscription.unsubscribe();
	}

	protected readonly TooltipTheme = TooltipTheme;
	protected openPriceHistory() {
		this.modalService
			.open(ProductPriceHistoryComponent, {
				data: { tov: this.tovNode().tovSignal() },
			})
			.afterClosed()
			.pipe(untilDestroyed(this))
			.subscribe();
	}

	protected openSalesHistory() {
		this.modalService
			.open(SalesHistoryComponent, {
				data: {
					clientId: this.tovNode().tovSignal().client
						? this.tovNode().tovSignal().client.id
						: null,
					contractorId: this.tovNode().tovSignal().contractor
						? this.tovNode().tovSignal().contractor.id
						: null,
					tov: this.tovNode().tovSignal(),
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
					contractorId: this.tovNode().tovSignal().contractor
						? this.tovNode().tovSignal().contractor.id
						: null,
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

	protected readonly TooltipPosition = TooltipPosition;
	protected readonly TextWeight = TextWeight;
}
