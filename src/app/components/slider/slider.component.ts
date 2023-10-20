import {ChangeDetectionStrategy, Component} from '@angular/core';

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
}
