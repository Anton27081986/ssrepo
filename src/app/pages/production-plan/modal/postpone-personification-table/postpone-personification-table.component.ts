import {
	ChangeDetectionStrategy,
	Component, inject,
	Input,
} from '@angular/core';
import {NgFor, NgIf, DatePipe, NgSwitch, NgSwitchCase, NgSwitchDefault} from '@angular/common';
import {
	TableDirective,
	TableHeadDirective,
	TableThGroupComponent,
	TableCellDirective,
	TrComponent,
	TdComponent,
	TextComponent,
	ThComponent,
	Colors,
	TextWeight,
	Align,
	TextType,
	FormFieldComponent,
	InputComponent,
	DatepickerComponent,
	FieldCtrlDirective,
	InputType, ExtraSize,
} from '@front-library/components';
import { TransferProductionPlanMap } from '@app/core/models/production-plan/transfer-production-plan-from-backend';
import {ReactiveFormsModule} from "@angular/forms";

@Component({
	selector: 'app-postpone-personification-table',
	standalone: true,
	imports: [
		NgFor,
		NgIf,
		TableDirective,
		TableHeadDirective,
		TableThGroupComponent,
		TableCellDirective,
		TrComponent,
		TdComponent,
		TextComponent,
		ThComponent,
		DatePipe,
		FormFieldComponent,
		InputComponent,
		DatepickerComponent,
		NgSwitch,
		ReactiveFormsModule,
		FieldCtrlDirective,
		NgSwitchCase,
		NgSwitchDefault,
	],
	templateUrl: './postpone-personification-table.component.html',
	styleUrl: './postpone-personification-table.component.scss',
	providers: [DatePipe],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostponePersonificationTableComponent {
	@Input() data!: TransferProductionPlanMap[];

	private readonly datePipe = inject(DatePipe);

	protected readonly Colors = Colors;
	protected readonly TextWeight = TextWeight;
	protected readonly Align = Align;
	protected readonly TextType = TextType;
	protected readonly InputType = InputType;
	protected readonly Now = new Date;
	protected readonly ExtraSize = ExtraSize;

	public readonly columns = [
		'orderId',
		'customerUser',
		'quantity',
		'countForPostpone',
		'productionDateControl',
	] as const;

	public getColumnName(columnId: string): string {
		switch (columnId) {
			case 'orderId':
				return 'Номер заказа';
			case 'customerUser':
				return 'Заказчик';
			case 'quantity':
				return 'Количество';
			case 'countForPostpone':
				return 'Кол-во для переноса';
			case 'productionDateControl':
				return 'Перенести на дату';
			default:
				return columnId;
		}
	}

	public getCellValue(
		item: TransferProductionPlanMap,
		column: keyof TransferProductionPlanMap,
	): string | number {
		switch (column) {
			case 'orderId':
				return item.orderId;
			case 'customerUser':
				return item.customerUser.name;
			case 'quantity':
				return item.quantity;
			default:
				return '';
		}
	}

	public isInputColumn(column: typeof this.columns[number]): boolean {
		return column === 'countForPostpone' || column === 'productionDateControl';
	}

}
