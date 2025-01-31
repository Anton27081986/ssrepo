import {Component, ElementRef, OnInit} from '@angular/core';
import { map } from 'rxjs';
import { BannersApiService } from '@app/core/api/banners-api.service';
import { IBannerDto } from '@app/core/models/banners/banner-dto';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ButtonType, IconPosition, IconType } from "@front-components/components";
import { BannerImports } from "@app/widgets/banner/banner.imports";

@UntilDestroy()
@Component({
	selector: 'app-banner',
	templateUrl: './banner.component.html',
	styleUrls: ['./banner.component.scss'],
	imports: BannerImports,
	standalone: true
})
export class BannerComponent implements OnInit {
	public banners: IBannerDto[] = [];
	public currentIndex: number = 0;
	public isLoading: boolean = true;
	public width: number = 0;

	public constructor(protected readonly el:ElementRef, private readonly apiService: BannersApiService) {}

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

		this.width = this.el.nativeElement.offsetWidth;
	}

	public next() {
		this.width = this.el.nativeElement.offsetWidth;
		this.currentIndex += 1
	}

	public prev() {
		this.width = this.el.nativeElement.offsetWidth;
		this.currentIndex -= 1
	}

	protected readonly ButtonType = ButtonType;
	protected readonly IconType = IconType;
	protected readonly IconPosition = IconPosition;
}
