import {
	IDay,
	OperationPlanItem,
} from '@app/core/models/production-plan/operation-plan';
import { TableColumnConfig } from '@front-library/components/lib/components/table/models';

export function generateColumnOperationPlanConfig(
	data: OperationPlanItem[],
	days: IDay[],
): TableColumnConfig[] {
	// Базовые колонки, не зависящие от дат
	const baseColumns: TableColumnConfig[] = [
		{
			id: 'tov',
			name: 'Готовая продукция (ГП)',
			showInDropdown: false,
			showInHeader: true,
			visible: true,
			stickyColumn: true,
		},
		{
			id: 'tovCategory',
			name: 'Категория',
			showInDropdown: true,
			showInHeader: true,
			visible: true,
		},
		{
			id: 'productionSection',
			name: 'Участок',
			showInDropdown: true,
			showInHeader: true,
			visible: true,
		},
		{
			id: 'optimalBatch',
			name: 'Оптимальная партия, КГ',
			showInDropdown: true,
			showInHeader: true,
			visible: true,
		},
		{
			id: 'productionType',
			name: 'Тип продукции',
			showInDropdown: true,
			showInHeader: true,
			visible: true,
		},
		{
			id: 'productionCity',
			name: 'Город',
			showInDropdown: true,
			showInHeader: true,
			visible: true,
		},
		{
			id: 'productManagerUser',
			name: 'Менеджер ТМЗ',
			showInDropdown: true,
			showInHeader: true,
			visible: true,
		},
		{
			id: 'planEcomonicUser',
			name: 'Менеджер ПЭО',
			showInDropdown: true,
			showInHeader: true,
			visible: true,
		},
	];

	// Собираем уникальные даты из planDays
	const uniqueDates = new Set<string>();
	days.forEach((day) => {
		const newDate = new Date(day.day);
		newDate.setDate(newDate.getDate() + 1);
		const date = newDate.toISOString().split('T')[0]; // Формат MM-DD

		uniqueDates.add(date);
	});

	// Создаем группу колонок для недели
	const weekColumn: TableColumnConfig = {
		id: 'planDays',
		name: 'Неделя',
		showInDropdown: true,
		showInHeader: false,
		visible: true,
		subGroups: Array.from(uniqueDates).map((date) => `week-${date}`),
	};

	// Создаем колонки для каждой даты
	const dateColumns: TableColumnConfig[] = Array.from(uniqueDates).flatMap(
		(date) => [
			{
				id: `week-${date}`,
				name: date,
				showInDropdown: false,
				showInHeader: true,
				visible: true,
				subColumns: [`planQuantity-${date}`, `factQuantity-${date}`],
			},
			{
				id: `planQuantity-${date}`,
				name: 'План',
				showInDropdown: false,
				showInHeader: true,
				visible: true,
			},
			{
				id: `factQuantity-${date}`,
				name: 'Факт',
				showInDropdown: false,
				showInHeader: true,
				visible: true,
			},
		],
	);

	// Колонки для итогов по неделе и месяцу
	const summaryColumns: TableColumnConfig[] = [
		{
			id: 'weekPlanQuantity',
			name: 'План (нед)',
			showInDropdown: true,
			showInHeader: true,
			visible: true,
		},
		{
			id: 'weekFactQuantity',
			name: 'Факт (нед)',
			showInDropdown: true,
			showInHeader: true,
			visible: true,
		},
		{
			id: 'monthPlanQuantity',
			name: 'План (мес)',
			showInDropdown: true,
			showInHeader: true,
			visible: true,
		},
		{
			id: 'monthFactQuantity',
			name: 'Факт (мес)',
			showInDropdown: true,
			showInHeader: true,
			visible: true,
		},
	];

	return [...baseColumns, weekColumn, ...dateColumns, ...summaryColumns];
}
