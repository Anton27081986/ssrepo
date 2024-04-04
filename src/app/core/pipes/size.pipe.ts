import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'ssFileSize',
})
export class FileSizePipe implements PipeTransform {
	public transform(value: number | string | null | undefined): string {
		// @ts-ignore
		if (value > 1048576) {
			return value ? `${(Number.parseInt(<string>value, 10) / 1048576).toFixed(2)} Мб` : '';
		}

		// @ts-ignore
		if (value > 1024) {
			return value ? `${(Number.parseInt(<string>value, 10) / 1024).toFixed(2)} Кб` : '';
		}

		return `${value} байт`;
	}
}
