import {ChangeDetectionStrategy, Component, ViewChild} from '@angular/core';
import {NzCarouselComponent} from 'ng-zorro-antd/carousel';

@Component({
    selector: 'app-slider',
    templateUrl: './slider.component.html',
    styleUrls: ['./slider.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SliderComponent {
    array = [
        'assets/images/slider/1.png',
        'assets/images/slider/2.png',
        'assets/images/slider/3.png',
    ];

    @ViewChild(NzCarouselComponent, {static: false}) myCarousel: NzCarouselComponent | undefined;

    next() {
        // @ts-ignore
        this.myCarousel.next();
    }

    prev() {
        // @ts-ignore
        this.myCarousel.pre();
    }
}
