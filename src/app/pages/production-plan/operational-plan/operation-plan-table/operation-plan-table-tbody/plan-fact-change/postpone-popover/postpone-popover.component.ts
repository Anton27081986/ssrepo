import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Component, OnInit } from '@angular/core';
import { PlanFactChangeComponent } from '@app/pages/production-plan/operational-plan/operation-plan-table/operation-plan-table-tbody/plan-fact-change/plan-fact-change.component';
import {
	ButtonComponent,
	Colors,
	DatepickerComponent,
	ExtraSize,
	FieldCtrlDirective,
	FormFieldComponent,
	IconPosition,
	IconType,
	NumberPickerComponent,
	SpinnerComponent,
	TextComponent,
	TextType,
	ToastTypeEnum,
} from '@front-library/components';
import { NgIf } from '@angular/common';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription, take, tap } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { dateNotInPastValidator } from '@app/pages/production-plan/operational-plan/operation-plan-table/operation-plan-table-tbody/plan-fact-change/operation-plan-table-quantity-cell/operation-plan-table-quantity-cell.component';

@UntilDestroy()
@Component({
	selector: '',
	templateUrl: './postpone-popover.component.html',
	styleUrls: ['./postpone-popover.component.scss'],
	imports: [
		ButtonComponent,
		TextComponent,
		NumberPickerComponent,
		FieldCtrlDirective,
		FormFieldComponent,
		DatepickerComponent,
		NgIf,
		SpinnerComponent,
		ReactiveFormsModule,
	],
	standalone: true,
})
export class PostponePopoverComponent
	extends PlanFactChangeComponent
	implements OnInit
{
	protected postponeDateControl: FormControl<Date | null> =
		new FormControl<Date | null>(
			null,
			Validators.required,
			dateNotInPastValidator(this.minDate)
		);

	protected quantityControl: FormControl<number | null> = new FormControl<
		number | null
	>(null);
	protected oldValue =
		this.getDayCell(this.row, this.columnId.replace('fact', 'plan')) ||
		this.getDayCell(this.row, this.columnId.replace('plan', 'fact'))!;

	protected subscription: Subscription = new Subscription();

	protected backDrop = this.popover.overlayRef.backdropClick();

	constructor() {
		super();
	}

	override ngOnInit() {
		super.ngOnInit();
		this.postponeDateControl.setValue(this.minDate);
		this.quantityControl.setValue(this.oldValue.planQuantity);
		this.subscribeBackDrop();
	}

	protected subscribeBackDrop(): void {
		this.subscription.add(
			this.backDrop.subscribe(() => {
				this.popover.close();
			})
		);
	}

	public transferPlan(): void {
		this.postponeDateControl.markAllAsTouched();

		if (this.postponeDateControl.errors) {
			return;
		}

		if (this.oldValue) {
			this.isLoader.set(true);
			this.subscription.unsubscribe();
			this.operationPlanService
				.transferProductionPlan(this.row.id, {
					id: this.oldValue.id,
					productionDate: this.getFormatDate(
						this.postponeDateControl.value?.toString()!
					).toString()!,
					quantity: this.quantityControl.value!,
				})
				.pipe(
					untilDestroyed(this),
					catchError(() => {
						this.isLoader.set(false);
						return this.backDrop.pipe(
							tap(() => {
								this.popover.close();
							}),
							take(1)
						);
					})
				)
				.subscribe({
					next: () => {
						this.isLoader.set(false);
						this.subscribeBackDrop();
						this.popover.close();
						this.sharedService.openToast({
							type: ToastTypeEnum.Success,
							text: 'Плановое значение успешно перенесено',
						});
					},
					error: (err) => {
						console.error('Ошибка при переносе плана:', err);
						this.isLoader.set(false);
					},
				});
		}
	}

	protected readonly Colors = Colors;
	protected readonly TextType = TextType;
	protected readonly IconPosition = IconPosition;
	protected readonly ExtraSize = ExtraSize;
	protected readonly IconType = IconType;
}
