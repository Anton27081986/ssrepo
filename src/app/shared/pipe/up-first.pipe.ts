import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'upFirst',
	standalone: true,
})
export class UpFirstPipe implements PipeTransform {
	transform(value: string): string {
		return value.charAt(1).toUpperCase();
	}
}
