import { Component, OnInit, ViewChild } from '@angular/core';
import { NzCarouselComponent } from 'ng-zorro-antd/carousel';
import { map } from 'rxjs';
import { BannersApiService } from '@app/core/api/banners-api.service';
import { IBannerDto } from '@app/core/models/banners/banner-dto';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import {LoaderComponent} from "@app/shared/components/loader/loader.component";
import {EmptyDataPageComponent} from "@app/shared/components/empty-data-page/empty-data-page.component";

@UntilDestroy()
@Component({
	selector: 'app-slider',
	templateUrl: './slider.component.html',
	styleUrls: ['./slider.component.scss'],
	imports: [
		LoaderComponent,
		EmptyDataPageComponent
	],
	standalone: true
})
export class SliderComponent implements OnInit {
	@ViewChild(NzCarouselComponent, { static: false }) public myCarousel:
		| NzCarouselComponent
		| undefined;

	public banners: IBannerDto[] = [];
	public isLoading: boolean = true;

	public constructor(private readonly apiService: BannersApiService) {}

	public ngOnInit(): any {
		this.apiService
			.getBanners()
			.pipe(
				map(({ banners }) => {
					if (banners) {
						this.banners = banners;
					}
				}),
				untilDestroyed(this),
			)
			.subscribe(() => {
				this.isLoading = false;
			});
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
