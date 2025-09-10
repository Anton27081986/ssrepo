import { UntilDestroy } from '@ngneat/until-destroy';
import {
	Component,
	inject,
	OnInit,
	Signal,
	signal,
	WritableSignal,
} from '@angular/core';
import {
	OperationPlanItem,
	PlanDays,
} from '@app/core/models/production-plan/operation-plan';
import {
	ModalRef,
	SharedPopupService,
	SsTableState,
} from '@front-library/components';
import { OperationPlanService } from '@app/pages/production-plan';

export interface ChangePlanFactData {
	columnId: string;
	row: OperationPlanItem;
	stateTable: SsTableState<OperationPlanItem>;
}

@UntilDestroy()
@Component({ template: '' })
export abstract class PlanFactChangeComponent implements OnInit {
	protected readonly sharedService: SharedPopupService =
		inject(SharedPopupService);
	protected readonly operationPlanService = inject(OperationPlanService);
	protected row: OperationPlanItem;
	protected columnId: string;
	protected tableStateService: SsTableState<OperationPlanItem>;
	protected popover: ModalRef<ChangePlanFactData> = inject(ModalRef);

	public data: Signal<OperationPlanItem[]>;
	protected isLoader: WritableSignal<boolean> = signal(false);

	public minDate!: Date;

	constructor() {
		this.row = this.popover.data.row;
		this.columnId = this.popover.data.columnId;
		this.tableStateService = this.popover.data.stateTable;
		this.data = this.tableStateService.data;
	}

	ngOnInit() {
		this.minDate = new Date(this.getDay()?.date!);
		this.minDate.setDate(this.minDate.getDate() + 1);
	}

	public getDay(): PlanDays | null {
		return this.getDayCell(this.row, this.columnId);
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
}
