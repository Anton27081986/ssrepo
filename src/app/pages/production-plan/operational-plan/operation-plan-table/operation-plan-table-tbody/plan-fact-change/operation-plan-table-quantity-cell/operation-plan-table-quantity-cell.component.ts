import {
	Component,
	ElementRef,
	inject,
	input,
	InputSignal,
	OnInit,
	Signal,
	viewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
	ActionBarComponent,
	ActionBarItemComponent,
	Colors,
	DropdownItemComponent,
	DropdownListComponent,
	ExtraSize,
	IconPosition,
	IconType,
	PopoverTriggerForDirective,
	SharedPopupService,
	SsTableState,
	TextType,
	TooltipPosition,
} from '@front-library/components';
import {
	OperationPlanItem,
	PlanDays,
} from '@app/core/models/production-plan/operation-plan';
import { OperationPlanPopupService } from '@app/pages/production-plan/service/operation-plan.popup.service';
import { OverlayModule } from '@angular/cdk/overlay';
import {
	AbstractControl,
	AsyncValidatorFn,
	FormControl,
	ReactiveFormsModule,
} from '@angular/forms';
import { map, Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ChangeQuantityPopoverComponent } from '@app/pages/production-plan/operational-plan/operation-plan-table/operation-plan-table-tbody/plan-fact-change/change-quantity-popover/change-quantity-popover.component';
import { ChangePlanFactData } from '@app/pages/production-plan/operational-plan/operation-plan-table/operation-plan-table-tbody/plan-fact-change/plan-fact-change.component';
import {
	OperationPlanService,
	OperationPlanState,
} from '@app/pages/production-plan';
import { BASE_COLUMN_MAP } from '@app/pages/production-plan/operational-plan/operation-plan-table/operation-plan-table-tbody/operation-plan-table-tbody.component';
import { PostponePopoverComponent } from '@app/pages/production-plan/operational-plan/operation-plan-table/operation-plan-table-tbody/plan-fact-change/postpone-popover/postpone-popover.component';

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
		OverlayModule,
		ReactiveFormsModule,
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

	protected readonly operationPlanService = inject(OperationPlanService);

	protected readonly sharedService: SharedPopupService =
		inject(SharedPopupService);

	public hasUtilityAccess: InputSignal<boolean> = input<boolean>(false);
	public hasViewAccess: InputSignal<boolean> = input<boolean>(false);
	public hasQuantityEditAccess: InputSignal<boolean> = input<boolean>(false);
	public hasTransferAccess: InputSignal<boolean> = input<boolean>(false);
	public columnIdSignal: InputSignal<string> = input.required();
	public value: InputSignal<string | number> = input.required();

	public rowSignal: InputSignal<OperationPlanItem> = input.required();

	public quantityInputControl!: FormControl<number | null>;

	protected operationPlanState: OperationPlanState =
		inject(OperationPlanState);

	public readonly popoverBtnElement = viewChild('popoverBtn', {
		read: ElementRef,
	});

	protected readonly ExtraSize = ExtraSize;
	protected readonly IconType = IconType;
	protected readonly TextType = TextType;
	protected readonly TooltipPosition = TooltipPosition;
	protected readonly Colors = Colors;
	protected readonly IconPosition = IconPosition;

	constructor() {}

	public ngOnInit() {
		this.quantityInputControl = new FormControl<number | null>(
			Number(this.value())
		);
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
		return this.getDayCell(this.rowSignal(), this.columnIdSignal());
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

	public openPostponeModal(): void {
		const day = this.getDay();

		if (day?.id && day?.date) {
			this.popupService.openPostponePlanModal(day.id, day.date);
		}
	}

	public openChangeQuantity() {
		this.sharedService.openPopover<ChangePlanFactData>(
			this.popoverBtnElement()!,
			ChangeQuantityPopoverComponent,
			{
				columnId: this.columnIdSignal(),
				row: this.rowSignal(),
				stateTable: this.tableStateService,
			},
			'364px',
			true,
			false,
			false
		);
	}

	protected editPlanFact(event: Event, columnId: string): void {
		const input = event.target as HTMLInputElement;
		const newValue = input.value.replace(' ', '').replace(',', '.') || null;
		const oldValue =
			this.getDayCell(
				this.rowSignal(),
				columnId.replace('fact', 'plan')
			) ||
			this.getDayCell(this.rowSignal(), columnId.replace('plan', 'fact'));

		if (columnId.startsWith('plan')) {
			if (oldValue?.id) {
				this.operationPlanService
					.updatePlanFact(this.rowSignal().id, {
						id: oldValue.id,
						planQuantity: newValue,
						factQuantity: oldValue.factQuantity,
					})
					.pipe(untilDestroyed(this))
					.subscribe((r) => {
						const items = this.data();

						if (items) {
							const isChanged = items.find((row, index) => {
								if (row.id === this.rowSignal().id) {
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
					});
			} else if (newValue) {
				this.operationPlanService
					.setPlanFact(this.rowSignal().id, {
						planDate: new Date(columnId.slice(-10)).toISOString(),
						planQuantity: newValue,
					})
					.pipe(untilDestroyed(this))
					.subscribe((r) => {
						const items = this.data();

						if (items) {
							const isChanged = items.find((row, index) => {
								if (row.id === this.rowSignal().id) {
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
					});
			}
		}

		if (columnId.startsWith('fact')) {
			if (oldValue?.id) {
				this.operationPlanService
					.updatePlanFact(this.rowSignal().id, {
						id: oldValue.id,
						factQuantity: newValue,
						planQuantity: oldValue.planQuantity,
					})
					.pipe(untilDestroyed(this))
					.subscribe((r) => {
						const items = this.data();

						if (items) {
							const isChanged = items.find((row, index) => {
								if (row.id === this.rowSignal().id) {
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
					});
			} else if (newValue) {
				this.operationPlanService
					.setPlanFact(this.rowSignal().id, {
						planDate: new Date(columnId.slice(-10)).toISOString(),
						factQuantity: newValue,
					})
					.pipe(untilDestroyed(this))
					.subscribe((r) => {
						const items = this.data();

						if (items) {
							const isChanged = items.find((row, index) => {
								if (row.id === this.rowSignal().id) {
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
					});
			}
		}
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

	protected openPostponeQuantityPopover() {
		this.sharedService.openPopover<ChangePlanFactData>(
			this.popoverBtnElement()!,
			PostponePopoverComponent,
			{
				columnId: this.columnIdSignal(),
				row: this.rowSignal(),
				stateTable: this.tableStateService,
			},
			'508px',
			true,
			false,
			false
		);
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
