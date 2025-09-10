import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Component } from '@angular/core';
import {
	ButtonComponent,
	Colors,
	ExtraSize,
	FieldCtrlDirective,
	IconType,
	NumberPickerComponent,
	Status,
	StatusIconComponent,
	TextComponent,
	TextType,
	ToastTypeEnum,
	TooltipDirective,
	TooltipPosition,
} from '@front-library/components';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { PlanFactChangeComponent } from '@app/pages/production-plan/operational-plan/operation-plan-table/operation-plan-table-tbody/plan-fact-change/plan-fact-change.component';
import { Subscription } from 'rxjs';

@UntilDestroy()
@Component({
	selector: 'app-change-quantity-popover',
	templateUrl: './change-quantity-popover.component.html',
	styleUrls: ['./change-quantity-popover.component.scss'],
	imports: [
		ButtonComponent,
		TextComponent,
		StatusIconComponent,
		NumberPickerComponent,
		TooltipDirective,
		FieldCtrlDirective,
		ReactiveFormsModule,
	],
	standalone: true,
})
export class ChangeQuantityPopoverComponent extends PlanFactChangeComponent {
	protected readonly Colors = Colors;
	protected readonly Status = Status;
	protected readonly TooltipPosition = TooltipPosition;
	protected readonly TextType = TextType;
	protected readonly ExtraSize = ExtraSize;
	protected readonly IconType = IconType;

	protected quantityInputControl: FormControl<number | null> =
		new FormControl<number | null>(null);

	protected oldValue = this.getDayCell(this.row, this.columnId)!;

	protected backDrop = this.popover.overlayRef.backdropClick();

	protected subscription: Subscription = new Subscription();

	constructor() {
		super();
	}

	override ngOnInit() {
		super.ngOnInit();
		this.quantityInputControl.setValue(this.oldValue.planQuantity);
		this.subscribeBackDrop();
	}

	protected subscribeBackDrop(): void {
		this.subscription.add(
			this.backDrop.subscribe(() => {
				this.popover.close();
			})
		);
	}

	protected changePlan(): void {
		const newValue = this.quantityInputControl.getRawValue();
		if (this.columnId.startsWith('plan')) {
			if (this.oldValue.id) {
				this.operationPlanService
					.changePlan(this.row.id, this.oldValue.id, newValue)
					.pipe(untilDestroyed(this))
					.subscribe((r) => {
						const items = this.data();

						if (items) {
							const isChanged = items.find((row, index) => {
								if (row.id === this.row.id) {
									items[index] = r;

									return true;
								}

								return false;
							});

							if (isChanged) {
								this.tableStateService.initialize(items, [
									...this.tableStateService.visibleColumns(),
								]);
							}
							this.popover.close();
							this.sharedService.openToast({
								type: ToastTypeEnum.Success,
								text: 'Плановое значение успешно обновлено',
							});
						}
					});
			}
		}
	}
}
