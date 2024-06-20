import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import { AppIcons } from '@app/core/icons';

@Directive({
	// eslint-disable-next-line @angular-eslint/directive-selector
	selector: '[loader]',
})
export class LoaderDirective {
	@Input('loader') set isLoading(condition: boolean) {
		if (this.timer) {
			clearTimeout(this.timer);
		}

		if (this.loader) {
			this.timer = setTimeout(() => {
				this.loader.className = condition ? 'loader' : 'loader hidden';
			}, 500);
		}
	}

	private timer: ReturnType<typeof setTimeout> | undefined;
	private readonly loader: HTMLElement;
	constructor(
		private readonly elementRef: ElementRef,
		private readonly renderer: Renderer2,
	) {
		this.elementRef.nativeElement.style.position = 'relative';
		this.loader = document.createElement('div');
		this.loader.innerHTML = AppIcons.loader;
		this.renderer.appendChild(this.elementRef.nativeElement, this.loader);
	}
}
