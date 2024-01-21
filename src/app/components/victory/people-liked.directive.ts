import {AfterViewInit, Directive, ElementRef, HostListener, Renderer2} from '@angular/core';

@Directive({
    standalone: true,
    selector: '[appPeopleLiked]',
})
export class PeopleLikedDirective implements AfterViewInit {
    private queryModalPeopleLikes: any;

    constructor(
        private readonly renderer: Renderer2,
        private readonly el: ElementRef, // доступ к окну для отображения
    ) {}

    ngAfterViewInit() {
        this.queryModalPeopleLikes = this.el.nativeElement.querySelector('.modal-people-likes');
    }

    // mouseenter
    @HostListener('mouseenter') onMouseEnter() {
        console.log('this.queryModalPeopleLikes', this.queryModalPeopleLikes);
        this.renderer.addClass(this.queryModalPeopleLikes, 'show');
    }

    // mouseleave
    @HostListener('mouseleave') onMouseLeave() {
        this.renderer.removeClass(this.queryModalPeopleLikes, 'show');
    }
}
