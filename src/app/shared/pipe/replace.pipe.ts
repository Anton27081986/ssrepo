import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'replace',
	standalone: true
})
export class ReplacePipe implements PipeTransform {
	transform(value: any, strToReplace: string, replacementStr: string): string {
		if (!value || !strToReplace || !replacementStr) {
			return value;
		}

		return value.toString().replace(strToReplace, replacementStr);
	}
}
