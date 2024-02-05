import {ChangeDetectorRef, Directive, HostBinding, HostListener} from '@angular/core';
import {fromEvent, tap} from 'rxjs';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';

@UntilDestroy()
@Directive({
    selector: '[appFlyMenu]',
})
export class FlyMenuDirective {
    private offsetY!: number;
    constructor(private readonly cd: ChangeDetectorRef) {}

    @HostBinding('class') classFlyHeader: string = '';

    @HostListener('document:scroll') onMouseScrollTop() {
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
