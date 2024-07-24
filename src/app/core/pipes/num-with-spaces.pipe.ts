import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'numWithSpaces',
})
export class NumWithSpacesPipe implements PipeTransform {
	transform(value: unknown): string {
		if (typeof value === 'number') {
			return this.numberWithSpaces(value);
		}

		if (typeof value === 'string') {
			return value;
		}

		return '';
	}

	numberWithSpaces(num: number, sep = ' '): string {
		const number = num % 1 > 0 ? num.toFixed(2) : num;

		return number
			.toString()
			.replace(/\B(?=(\d{3})+(?!\d))/g, sep)
			.replace('.', ',');
	}
}
