import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { finalize, map, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BannersApiService } from '@app/core/api/banners-api.service';
import { IResponseItems } from '@app/core/utils/response-items';
import { IBannerDto } from '@app/core/models/banners/banner-dto';
import { bannerImports } from '@app/widgets/banner/banner.imports';

@Component({
	selector: 'app-banner',
	standalone: true,
	templateUrl: './banner.component.html',
	styleUrls: ['./banner.component.scss'],
	imports: [bannerImports],
})
export class BannerComponent {
	private readonly bannersApi = inject(BannersApiService);
	public carouselIndex = signal(0);
	public isLoading = signal(true);

	public readonly banners = toSignal(
		this.bannersApi.getBanners().pipe(
			map((request: IResponseItems<IBannerDto>) =>
				request.items.sort(
					(a: IBannerDto, b: IBannerDto) => a.order - b.order,
				),
			),
			catchError(() => of([] as IBannerDto[])),
			finalize(() => this.isLoading.set(false)),
		),
		{ initialValue: [] as IBannerDto[] },
	);
}
