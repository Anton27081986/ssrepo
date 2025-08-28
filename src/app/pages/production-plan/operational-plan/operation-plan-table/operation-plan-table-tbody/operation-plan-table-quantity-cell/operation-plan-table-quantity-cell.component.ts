import {
	ChangeDetectorRef,
	Component,
	inject,
	input,
	InputSignal,
	OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
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
	Status,
	StatusIconComponent,
	TextComponent,
	TextType,
	TooltipDirective,
	TooltipPosition,
	UtilityButtonComponent,
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
import { map, Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Component({
	selector: 'app-operation-plan-table-quantity-cell',
	templateUrl: './operation-plan-table-quantity-cell.component.html',
	styleUrls: ['./operation-plan-table-quantity-cell.component.scss'],
	imports: [
		CommonModule,
		UtilityButtonComponent,
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
	],
	standalone: true,
})
export class OperationalPlanTableQuantityCellComponent implements OnInit {
	private readonly popupService: OperationPlanPopupService = inject(
		OperationPlanPopupService
	);

	private readonly changeDetectorRef: ChangeDetectorRef =
		inject(ChangeDetectorRef);

	private readonly operationPlanService = inject(OperationPlanService);

	protected readonly operationPlanState = inject(OperationPlanState);

	public hasUtilityAccess: InputSignal<boolean> = input<boolean>(false);
	public hasViewAccess: InputSignal<boolean> = input<boolean>(false);
	public hasQuantityEditAccess: InputSignal<boolean> = input<boolean>(false);
	public hasTransferAccess: InputSignal<boolean> = input<boolean>(false);
	public row: InputSignal<OperationPlanItem> = input.required();
	public columnId: InputSignal<string> = input.required();
	public value: InputSignal<string | number> = input.required();

	public minDate!: Date;

	public quantityInputControl!: FormControl<number | null>;
	public postponeDateControl!: FormControl<Date | null>;

	protected isChangeQuantityOpen = false;
	protected isPostponeOpen = false;

	protected positionPairs: ConnectionPositionPair[] = [
		{
			offsetY: 180,
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
			+this.value()
		);
		this.postponeDateControl = new FormControl<Date | null>(
			null,
			Validators.required,
			dateNotInPastValidator(this.minDate)
		);
	}

	protected changePlan(): void {
		const newValue = this.quantityInputControl.getRawValue();
		const oldValue = this.getDayCell(this.row(), this.columnId());

		if (this.columnId().startsWith('plan')) {
			if (oldValue?.id) {
				this.operationPlanService
					.changePlan(this.row().id, oldValue.id, newValue)
					.subscribe((r: OperationPlanItem) => {
						this.row().weekPlanQuantity = r.weekPlanQuantity;
						this.row().monthPlanQuantity = r.monthPlanQuantity;
						this.row().planDays = r.planDays;
						this.isChangeQuantityOpen = false;
						this.changeDetectorRef.detectChanges();
					});
			}
		}
	}

	protected editPlanFact(
		event: Event,
		row: OperationPlanItem,
		columnId: string
	): void {
		// eslint-disable-next-line @typescript-eslint/no-shadow
		const input = event.target as HTMLInputElement;
		const newValue = input.value.replace(' ', '').replace(',', '.') || null;
		const oldValue =
			this.getDayCell(row, columnId.replace('fact', 'plan')) ||
			this.getDayCell(row, columnId.replace('plan', 'fact'));

		if (columnId.startsWith('plan')) {
			if (oldValue?.id) {
				this.operationPlanService
					.updatePlanFact(row.id, {
						id: oldValue.id,
						planQuantity: newValue,
						factQuantity: oldValue.factQuantity,
					})
					.subscribe((r: OperationPlanItem) => {
						row.weekPlanQuantity = r.weekPlanQuantity;
						row.monthPlanQuantity = r.monthPlanQuantity;
						row.planDays = r.planDays;
						this.changeDetectorRef.detectChanges();
					});
			} else if (newValue) {
				this.operationPlanService
					.setPlanFact(row.id, {
						planDate: new Date(columnId.slice(-10)).toISOString(),
						planQuantity: newValue,
					})
					.subscribe((r: OperationPlanItem) => {
						row.weekPlanQuantity = r.weekPlanQuantity;
						row.monthPlanQuantity = r.monthPlanQuantity;
						row.planDays = r.planDays;
						this.changeDetectorRef.detectChanges();
					});
			}
		}

		if (columnId.startsWith('fact')) {
			if (oldValue?.id) {
				this.operationPlanService
					.updatePlanFact(row.id, {
						id: oldValue.id,
						factQuantity: newValue,
						planQuantity: oldValue.planQuantity,
					})
					.subscribe((r: OperationPlanItem) => {
						row.weekFactQuantity = r.weekFactQuantity;
						row.monthFactQuantity = r.monthFactQuantity;
						row.planDays = r.planDays;
						this.changeDetectorRef.detectChanges();
					});
			} else if (newValue) {
				this.operationPlanService
					.setPlanFact(row.id, {
						planDate: new Date(columnId.slice(-10)).toISOString(),
						factQuantity: newValue,
					})
					.subscribe((r: OperationPlanItem) => {
						row.weekFactQuantity = r.weekFactQuantity;
						row.monthFactQuantity = r.monthFactQuantity;
						row.planDays = r.planDays;
						this.changeDetectorRef.detectChanges();
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
			this.operationPlanService
				.transferProductionPlan(this.row().id, {
					id: oldValue.id,
					productionDate: this.getFormatDate(
						this.postponeDateControl.value?.toString()!
					).toString()!,
					quantity: this.quantityInputControl.value,
				})
				.pipe()
				.subscribe(() => {
					this.isPostponeOpen = false;
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
