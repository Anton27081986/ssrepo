import {
	Directive,
	ElementRef,
	EventEmitter,
	Output,
	Renderer2,
	OnDestroy,
	OnInit,
	NgZone,
} from '@angular/core';

@Directive({
	selector: '[clickOutside]',
	standalone: true,
})
export class ClickOutsideDirective implements OnInit, OnDestroy {
	@Output()
	public clickOutside = new EventEmitter<void>();

	private documentClickListener!: () => void;

	constructor(
		private readonly elementRef: ElementRef,
		private readonly renderer: Renderer2,
		private readonly ngZone: NgZone,
	) {}

	public ngOnInit() {
		this.ngZone.runOutsideAngular(() => {
			this.documentClickListener = this.renderer.listen(
				'document',
				'click',
				(event: Event) => {
					this.handleClick(event);
				},
			);
		});
	}

	public ngOnDestroy() {
		if (this.documentClickListener) {
			this.documentClickListener();
		}
	}

	private handleClick(event: Event) {
		const target = event.target as HTMLElement;

		if (target && !this.elementRef.nativeElement.contains(target)) {
			this.ngZone.run(() => this.clickOutside.emit());
		}
	}
}
