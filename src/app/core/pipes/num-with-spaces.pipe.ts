import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'numWithSpaces',
})
export class NumWithSpacesPipe implements PipeTransform {
	transform(value: unknown, digits = 2, sep = ' '): string {
		if (typeof value === 'number') {
			return this.numberWithSpaces(value, digits, sep);
		}

		if (typeof value === 'string') {
			return value;
		}

		return '';
	}

	numberWithSpaces(num: number, digits = 2, sep = ' '): string {
		const number = num % 1 > 0 ? num.toFixed(digits) : num;
		const separate = number.toString().split('.');

		separate[0] = separate[0].replace(/\B(?=(\d{3})+(?!\d))/g, sep);

		if (separate.length === 1) {
			separate.push('00');
		}

		return separate.join(',');
	}
}
