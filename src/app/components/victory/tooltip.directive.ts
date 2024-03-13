import { AfterViewInit, Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
	selector: '[appTooltip]',
	standalone: true,
})
export class TooltipDirective implements AfterViewInit {
	// ModalUsersWinGroups
	private queryModalUsersWinGroups: any;

	constructor(
		private readonly renderer: Renderer2,
		private readonly el: ElementRef,
	) {}

	ngAfterViewInit() {
		this.queryModalUsersWinGroups =
			this.el.nativeElement.querySelector('.modal-users-win-groups');
	}

	@HostListener('mouseenter') onMouseEnter() {
		this.renderer.addClass(this.queryModalUsersWinGroups, 'show');
	}

	@HostListener('mouseleave') onMouseLeave() {
		this.renderer.removeClass(this.queryModalUsersWinGroups, 'show');
	}
}
