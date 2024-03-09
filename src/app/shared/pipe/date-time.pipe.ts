import { Pipe, PipeTransform } from '@angular/core';
import { formatDate } from '@angular/common';

@Pipe({
	standalone: true,
	name: 'dateTime',
})
export class DateTimePipe implements PipeTransform {
	private todayDate!: string;
	private currentDate!: string;
	transform(value: number): string {
		this.todayDate = formatDate(new Date(), 'dd', 'ru-RU');
		this.currentDate = formatDate(value, 'dd', 'ru-RU');

		if (this.todayDate === this.currentDate) {
			const dateCreated = formatDate(value, 'HH:mm', 'ru-RU', 'UTC+6');

			return `Сегодня ${dateCreated}`;
		}

		return formatDate(value, 'dd.MM.yyyy HH:mm', 'ru-RU', 'UTC+6');
	}
}
