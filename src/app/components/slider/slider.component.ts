import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { NzCarouselComponent } from 'ng-zorro-antd/carousel';
import { map, Observable } from 'rxjs';
import { BannersApiService } from '@app/core/api/banners-api.service';

@Component({
	selector: 'app-slider',
	templateUrl: './slider.component.html',
	styleUrls: ['./slider.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SliderComponent implements OnInit {
	@ViewChild(NzCarouselComponent, { static: false }) public myCarousel:
		| NzCarouselComponent
		| undefined;

	public banners!: Observable<any>;

	public constructor(private readonly apiService: BannersApiService) {}

	public ngOnInit(): any {
		this.banners = this.apiService.getBanners().pipe(map(({ banners }) => banners));
	}

	public next() {
		if (this.myCarousel) {
			this.myCarousel.next();
		}
	}

	public prev() {
		if (this.myCarousel) {
			this.myCarousel.pre();
		}
	}
}
