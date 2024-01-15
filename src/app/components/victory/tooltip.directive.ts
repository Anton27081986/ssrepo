import {Directive, HostBinding, HostListener} from '@angular/core';

@Directive({
    selector: '[appTooltip]',
    standalone: true,
})
export class TooltipDirective {
    private fontWeight = 'normal';
    private opacity = '1';

    // constructor() { }
    @HostBinding('style.fontWeight') get getFontWeight() {
        return this.fontWeight;
    }

    @HostBinding('style.cursor') get getCursor() {
        return 'pointer';
    }

    @HostBinding('style.opacity') get getOpacity() {
        return this.opacity;
    }

    @HostListener('mouseenter') onMouseEnter() {
        this.fontWeight = 'bold';
        this.opacity = '0';
    }

    @HostListener('mouseleave') onMouseLeave() {
        this.fontWeight = 'normal';
        this.opacity = '1';
    }
}
