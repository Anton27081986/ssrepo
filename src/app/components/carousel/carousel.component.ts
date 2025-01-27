import { ChangeDetectionStrategy, Component } from '@angular/core';
import {CarouselModule, OwlOptions} from 'ngx-owl-carousel-o';

@Component({
	selector: 'app-carousel',
	templateUrl: './carousel.component.html',
	styleUrls: ['./carousel.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		CarouselModule
	],
	standalone: true
})
export class CarouselComponent {
	public customOptions: OwlOptions = {
		loop: true,
		mouseDrag: false,
		touchDrag: false,
		pullDrag: false,
		dots: true,
		navSpeed: 700,
		navText: ['', ''],
		// autoWidth: true,
		items: 4,
		lazyLoad: true,
		responsive: {
			0: {
				items: 1,
			},
			400: {
				items: 2,
			},
			740: {
				items: 3,
			},
			940: {
				items: 4,
			},
		},
		nav: true,
	};
}
