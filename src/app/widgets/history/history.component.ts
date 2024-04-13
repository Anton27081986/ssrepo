import { Component } from '@angular/core';

@Component({
	selector: 'ss-history',
	templateUrl: './history.component.html',
	styleUrls: ['./history.component.scss'],
})
export class HistoryComponent {
	testData: Array<Array<{ name: string; value: string }>> = [
		[
			{ name: 'Автор:', value: 'Петров В.Н., 20.20.2024' },
			{ name: 'Действие:', value: 'Удалено' },
			{ name: 'Старое значение:', value: 'Категория К2' },
			{ name: 'Новое значение:', value: 'Категория К2 (Д)' },
			{
				name: 'Комментарий:',
				value: 'Ultrices arcu gravida arcu semper et et cras suspendisse aliquam. Cras interdum nec sagittis eget pretium integer neque mattis.',
			},
		],
		[
			{ name: 'Автор:', value: 'Петров В.Н., 20.20.2024' },
			{ name: 'Действие:', value: 'Удалено' },
			{ name: 'Старое значение:', value: 'Категория К2' },
			{ name: 'Новое значение:', value: 'Категория К2 (Д)' },
			{
				name: 'Комментарий:',
				value: 'Ultrices arcu gravida arcu semper et et cras suspendisse aliquam. Cras interdum nec sagittis eget pretium integer neque mattis.',
			},
		],
		[
			{ name: 'Автор:', value: 'Петров В.Н., 20.20.2024' },
			{ name: 'Действие:', value: 'Удалено' },
			{ name: 'Старое значение:', value: 'Категория К2' },
			{ name: 'Новое значение:', value: 'Категория К2 (Д)' },
			{
				name: 'Комментарий:',
				value: 'Ultrices arcu gravida arcu semper et et cras suspendisse aliquam. Cras interdum nec sagittis eget pretium integer neque mattis.',
			},
		],
	];
}
