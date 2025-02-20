import { Pipe, PipeTransform } from '@angular/core';
import { Converter } from 'showdown';

@Pipe({
	name: 'mdToHtml',
	standalone: true,
})
export class MdToHtmlPipe implements PipeTransform {
	transform(content: string): string {
		const converter = new Converter();

		return converter.makeHtml(content);
	}
}
