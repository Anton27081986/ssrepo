import {AfterViewInit, Directive, ElementRef, HostListener, Renderer2} from '@angular/core';

@Directive({
    standalone: true,
    selector: '[appSuperLike]',
})
export class SuperLikeDirective implements AfterViewInit {
    private queryModalSuperLike: any;

    constructor(
        private readonly renderer: Renderer2,
        private readonly el: ElementRef, // доступ к окну для отображения
    ) {}

    ngAfterViewInit() {
        this.queryModalSuperLike = this.el.nativeElement.querySelector('.modal-appSuper-like');
    }

    // mouseenter
    @HostListener('click') onMouseEnter() {
        this.renderer.addClass(this.queryModalSuperLike, 'show');
    }

    @HostListener('document:click', ['$event'])
    onClick(event: Event) {
        if (!this.el.nativeElement.contains(event.target)) {
            this.renderer.removeClass(this.queryModalSuperLike, 'show');
        }
    }
}
