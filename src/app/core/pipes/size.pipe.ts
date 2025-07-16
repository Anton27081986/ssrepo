import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'ssFileSize',
	standalone: true,
})
export class FileSizePipe implements PipeTransform {
	public transform(value: number | string | null | undefined): string {
		const numValue = Number.parseInt(<string>value, 10);

		if (numValue > 1048576) {
			return value ? `${(numValue / 1048576).toFixed(2)} Мб` : '';
		}

		if (numValue > 1024) {
			return value ? `${(numValue / 1024).toFixed(2)} Кб` : '';
		}

		return `${value} байт`;
	}
}
