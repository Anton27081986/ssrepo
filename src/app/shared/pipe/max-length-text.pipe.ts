import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'maxLengthText',
	standalone: true,
})
export class MaxLengthTextPipe implements PipeTransform {
	public transform(value?: string, number?: number | undefined): string {
		return `${value?.slice(0, number)} ...`;
	}
}
