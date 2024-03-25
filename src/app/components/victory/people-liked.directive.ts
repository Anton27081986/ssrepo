import { AfterViewInit, Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
	standalone: true,
	selector: '[appPeopleLiked]',
})
export class PeopleLikedDirective implements AfterViewInit {
	private queryModalPeopleLikes: any;

	public constructor(
		private readonly renderer: Renderer2,
		private readonly el: ElementRef, // доступ к окну для отображения
	) {}

	public ngAfterViewInit() {
		this.queryModalPeopleLikes = this.el.nativeElement.querySelector('.modal-people-likes');
	}

	// mouseenter
	@HostListener('mouseenter') public onMouseEnter() {
		this.renderer.addClass(this.queryModalPeopleLikes, 'show');
	}

	// mouseleave
	@HostListener('mouseleave') public onMouseLeave() {
		this.renderer.removeClass(this.queryModalPeopleLikes, 'show');
	}
}
