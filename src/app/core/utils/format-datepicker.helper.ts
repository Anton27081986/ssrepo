import { Injectable } from '@angular/core';
import { NativeDateAdapter } from '@angular/material/core';

@Injectable()
export class CustomDateAdapter extends NativeDateAdapter {
	// Метод для парсинга даты из строки
	override parse(value: any): Date | null {
		if (typeof value === 'string' && value.match(/^\d{2}\.\d{2}\.\d{4}$/)) {
			const [day, month, year] = value.split('.').map(Number);
			const date = new Date(year, month - 1, day);

			// Проверяем корректность даты
			if (
				date &&
				date.getFullYear() === year &&
				date.getMonth() === month - 1 &&
				date.getDate() === day
			) {
				return date;
			}
		}

		return null; // Если формат неправильный или дата некорректна
	}

	override getFirstDayOfWeek(): number {
		return 1; // 0 - воскресенье, 1 - понедельник
	}
}
