import { inject, Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
	standalone: true,
	name: 'bypassSecurityTrustHtml',
})
export class BypassSecurityTrustHtmlPipe implements PipeTransform {
	private readonly sanitizer = inject(DomSanitizer);

	public transform(text: string | null | undefined): SafeHtml {
		return this.sanitizer.bypassSecurityTrustHtml(text || '');
	}
}
