import {
	Component,
	inject,
	input,
	InputSignal,
	OnInit,
	Signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
	ActionBarComponent,
	ActionBarItemComponent,
	ButtonComponent,
	Colors,
	DatepickerComponent,
	DropdownItemComponent,
	DropdownListComponent,
	ExtraSize,
	FieldCtrlDirective,
	FormFieldComponent,
	IconPosition,
	IconType,
	NumberPickerComponent,
	PopoverTriggerForDirective,
	SsTableState,
	Status,
	StatusIconComponent,
	TextComponent,
	TextType,
	TooltipDirective,
	TooltipPosition,
} from '@front-library/components';
import {
	OperationPlanItem,
	PlanDays,
} from '@app/core/models/production-plan/operation-plan';
import { OperationPlanPopupService } from '@app/pages/production-plan/service/operation-plan.popup.service';
import { OperationPlanState } from '@app/pages/production-plan/service/operation-plan.state';
import { ConnectionPositionPair, OverlayModule } from '@angular/cdk/overlay';
import { OperationPlanService } from '@app/pages/production-plan/service/operation-plan.service';
import {
	AbstractControl,
	AsyncValidatorFn,
	FormControl,
	ReactiveFormsModule,
	Validators,
} from '@angular/forms';
import { BASE_COLUMN_MAP } from '@app/pages/production-plan/operational-plan/operation-plan-table/operation-plan-table-tbody/operation-plan-table-tbody.component';
import { map, Observable, of, tap } from 'rxjs';
import { catchError, delay } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
	selector: 'app-operation-plan-table-quantity-cell',
	templateUrl: './operation-plan-table-quantity-cell.component.html',
	styleUrls: ['./operation-plan-table-quantity-cell.component.scss'],
	imports: [
		CommonModule,
		PopoverTriggerForDirective,
		DropdownListComponent,
		DropdownItemComponent,
		TextComponent,
		OverlayModule,
		StatusIconComponent,
		TooltipDirective,
		NumberPickerComponent,
		ButtonComponent,
		ReactiveFormsModule,
		FieldCtrlDirective,
		FormFieldComponent,
		DatepickerComponent,
		ActionBarComponent,
		ActionBarItemComponent,
	],
	standalone: true,
})
export class OperationalPlanTableQuantityCellComponent implements OnInit {
	private readonly popupService: OperationPlanPopupService = inject(
		OperationPlanPopupService
	);

	private readonly tableStateService =
		inject<SsTableState<OperationPlanItem>>(SsTableState);

	public data: Signal<OperationPlanItem[] | undefined> =
		this.tableStateService.data;

	private readonly operationPlanService = inject(OperationPlanService);

	protected readonly operationPlanState = inject(OperationPlanState);

	public hasUtilityAccess: InputSignal<boolean> = input<boolean>(false);
	public hasViewAccess: InputSignal<boolean> = input<boolean>(false);
	public hasQuantityEditAccess: InputSignal<boolean> = input<boolean>(false);
	public hasTransferAccess: InputSignal<boolean> = input<boolean>(false);
	public columnId: InputSignal<string> = input.required();
	public value: InputSignal<string | number> = input.required();

	public row: InputSignal<OperationPlanItem> = input.required();

	public minDate!: Date;

	public quantityInputControl!: FormControl<number | null>;
	public postponeDateControl!: FormControl<Date | null>;

	protected isChangeQuantityOpen = false;
	protected isPostponeOpen = false;
	protected isChangedDisabled = false;

	protected positionPairs: ConnectionPositionPair[] = [
		{
			offsetY: 200,
			originX: 'end',
			originY: 'bottom',
			overlayX: 'center',
			overlayY: 'bottom',
		},
	];

	protected readonly ExtraSize = ExtraSize;
	protected readonly IconType = IconType;
	protected readonly TextType = TextType;
	protected readonly TooltipPosition = TooltipPosition;
	protected readonly Status = Status;
	protected readonly Colors = Colors;
	protected readonly IconPosition = IconPosition;

	public ngOnInit() {
		this.minDate = new Date(this.getDay()?.date!);
		this.minDate.setDate(this.minDate.getDate() + 1);
		this.quantityInputControl = new FormControl<number | null>(
			Number(this.value())
		);
		this.postponeDateControl = new FormControl<Date | null>(
			this.minDate,
			Validators.required,
			dateNotInPastValidator(this.minDate)
		);
	}

	protected changePlan(): void {
		const newValue = this.quantityInputControl.getRawValue();
		const oldValue = this.getDayCell(this.row(), this.columnId());

		if (this.columnId().startsWith('plan')) {
			if (oldValue?.id) {
				this.isChangedDisabled = true;
				this.isChangeQuantityOpen = false;
				this.operationPlanService
					.changePlan(this.row().id, oldValue.id, newValue)
					.pipe(untilDestroyed(this))
					.subscribe((r) => {
						const items = this.data();

						if (items) {
							const isChanged = items.find((row, index) => {
								if (row.id === this.row().id) {
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
						}

						this.isChangedDisabled = false;
					});
			}
		}
	}

	protected editPlanFact(event: Event, columnId: string): void {
		// eslint-disable-next-line @typescript-eslint/no-shadow
		const input = event.target as HTMLInputElement;
		const newValue = input.value.replace(' ', '').replace(',', '.') || null;
		const oldValue =
			this.getDayCell(this.row(), columnId.replace('fact', 'plan')) ||
			this.getDayCell(this.row(), columnId.replace('plan', 'fact'));

		if (columnId.startsWith('plan')) {
			if (oldValue?.id) {
				this.operationPlanService
					.updatePlanFact(this.row().id, {
						id: oldValue.id,
						planQuantity: newValue,
						factQuantity: oldValue.factQuantity,
					})
					.pipe(untilDestroyed(this))
					.subscribe((r) => {
						const items = this.data();

						if (items) {
							const isChanged = items.find((row, index) => {
								if (row.id === this.row().id) {
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
						}

						this.isChangedDisabled = false;
					});
			} else if (newValue) {
				this.operationPlanService
					.setPlanFact(this.row().id, {
						planDate: new Date(columnId.slice(-10)).toISOString(),
						planQuantity: newValue,
					})
					.pipe(untilDestroyed(this))
					.subscribe((r) => {
						const items = this.data();

						if (items) {
							const isChanged = items.find((row, index) => {
								if (row.id === this.row().id) {
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
						}

						this.isChangedDisabled = false;
					});
			}
		}

		if (columnId.startsWith('fact')) {
			if (oldValue?.id) {
				this.operationPlanService
					.updatePlanFact(this.row().id, {
						id: oldValue.id,
						factQuantity: newValue,
						planQuantity: oldValue.planQuantity,
					})
					.pipe(untilDestroyed(this))
					.subscribe((r) => {
						const items = this.data();

						if (items) {
							const isChanged = items.find((row, index) => {
								if (row.id === this.row().id) {
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
						}

						this.isChangedDisabled = false;
					});
			} else if (newValue) {
				this.operationPlanService
					.setPlanFact(this.row().id, {
						planDate: new Date(columnId.slice(-10)).toISOString(),
						factQuantity: newValue,
					})
					.pipe(untilDestroyed(this))
					.subscribe((r) => {
						const items = this.data();

						if (items) {
							const isChanged = items.find((row, index) => {
								if (row.id === this.row().id) {
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
						}

						this.isChangedDisabled = false;
					});
			}
		}
	}

	public getDayCell(
		row: OperationPlanItem,
		columnId: string
	): PlanDays | null {
		const planMatch = columnId.match(
			/^planQuantity-(\d{4})-(\d{2})-(\d{2})$/
		);
		const factMatch = columnId.match(
			/^factQuantity-(\d{4})-(\d{2})-(\d{2})$/
		);

		if (planMatch || factMatch) {
			const [, , month, day] = planMatch || factMatch!;

			const planDay = row.planDays?.find((dayObj) => {
				const [, m, d] = dayObj.date.slice(0, 10).split('-');

				return m === month && d === day;
			});

			if (!planDay) {
				return null;
			}

			if (planMatch) {
				return planDay;
			}

			if (factMatch) {
				return planDay;
			}
		}

		return null;
	}

	public getCellValue(
		row: OperationPlanItem,
		columnId: string
	): string | number {
		// 1. Базовые колонки
		const baseFieldHandler =
			BASE_COLUMN_MAP[columnId as keyof typeof BASE_COLUMN_MAP];

		if (baseFieldHandler) {
			return baseFieldHandler(row);
		}

		// 2. Динамические колонки по дням
		const planMatch = columnId.match(
			/^planQuantity-(\d{4})-(\d{2})-(\d{2})$/
		);
		const factMatch = columnId.match(
			/^factQuantity-(\d{4})-(\d{2})-(\d{2})$/
		);

		if (planMatch || factMatch) {
			const [, , month, day] = planMatch || factMatch!;

			const planDay = row.planDays?.find((dayObj) => {
				const [, m, d] = dayObj.date.slice(0, 10).split('-');

				return m === month && d === day;
			});

			if (!planDay) {
				return '';
			}

			if (planMatch) {
				return planDay.planQuantity;
			}

			if (factMatch) {
				return planDay.factQuantity;
			}
		}

		// 3. Если не попали ни в одну категорию — пусто
		return '';
	}

	public transferPlan(): void {
		this.postponeDateControl.markAllAsTouched();

		if (this.postponeDateControl.errors) {
			return;
		}

		const oldValue =
			this.getDayCell(
				this.row(),
				this.columnId().replace('fact', 'plan')
			) ||
			this.getDayCell(
				this.row(),
				this.columnId().replace('plan', 'fact')
			);

		if (oldValue) {
			this.isChangedDisabled = true;
			this.isPostponeOpen = false;
			this.operationPlanService
				.transferProductionPlan(this.row().id, {
					id: oldValue.id,
					productionDate: this.getFormatDate(
						this.postponeDateControl.value?.toString()!
					).toString()!,
					quantity: this.quantityInputControl.value,
				})
				.pipe(
					catchError((err: unknown) => {
						this.isChangedDisabled = false;
						throw err;
					})
				)
				.subscribe(() => {
					this.isChangedDisabled = false;
				});
		}
	}

	public getFormatDate(dateStr: string): string {
		// Создаем объект Date
		const date = new Date(dateStr);

		// Получаем день, месяц и год
		const day = date.getDate();
		const month = date.getMonth() + 1; // месяцы с 0, добавляем 1
		const year = date.getFullYear();

		// Форматируем с добавлением ведущих нулей для дня и месяца
		const formattedDay = day.toString().padStart(2, '0');
		const formattedMonth = month.toString().padStart(2, '0');

		return `${year}-${formattedMonth}-${formattedDay}`;
	}

	public checkPlanFactValue(event: Event): void {
		// eslint-disable-next-line @typescript-eslint/no-shadow
		const input = event.target as HTMLInputElement;

		const value = input.value.replace(/[^0-9.,]/g, '');

		const firstPunctuationIndex = value.search(/[.,]/);

		if (firstPunctuationIndex !== -1) {
			const withoutPunctuation = value.replace(/[.,]/g, '');
			const start = withoutPunctuation.slice(0, firstPunctuationIndex);
			const end = withoutPunctuation.slice(firstPunctuationIndex);

			input.value = `${start},${end}`;
		} else {
			input.value = value;
		}
	}

	public getDay(): PlanDays | null {
		return this.getDayCell(this.row(), this.columnId());
	}

	public openPostponeModal(): void {
		const day = this.getDay();

		if (day?.id && day?.date) {
			this.popupService.openPostponePlanModal(day.id, day.date);
		}
	}
}

export function dateNotInPastValidator(targetDate: Date): AsyncValidatorFn {
	return (
		control: AbstractControl
	): Observable<{ [key: string]: true } | null> => {
		const selectedDate = control.value as Date;

		if (!selectedDate) {
			return of(null);
		}

		return of(selectedDate).pipe(
			delay(100),
			map((date) => {
				const selectedTime = new Date(date).setHours(0, 0, 0, 0);
				const targetTime = new Date(targetDate).setHours(0, 0, 0, 0);

				if (selectedTime < targetTime) {
					control.setValue(targetDate);

					return { dateInPast: true };
				}

				return null;
			})
		);
	};
}
