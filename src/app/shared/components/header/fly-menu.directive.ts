import { ChangeDetectorRef, Directive, HostBinding, HostListener } from '@angular/core';
import { fromEvent, tap } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Directive({
	selector: '[appFlyMenu]',
})
export class FlyMenuDirective {
	private offsetY!: number;
	public constructor(private readonly cd: ChangeDetectorRef) {}

	@HostBinding('class') public classFlyHeader: string = '';

	@HostListener('document:scroll') public onMouseScrollTop() {
		fromEvent(window, 'scroll')
			.pipe(
				untilDestroyed(this),
				tap(() => {
					setTimeout(() => {
						this.offsetY = window.scrollY;
					}, 0);

					if (this.offsetY > window.scrollY || window.scrollY > 5) {
						this.classFlyHeader = 'fly-header';
					}

					if (this.offsetY <= window.scrollY || window.scrollY < 5) {
						this.classFlyHeader = '';
						this.cd.detectChanges();
					}
				}),
			)
			.subscribe();
	}
}
