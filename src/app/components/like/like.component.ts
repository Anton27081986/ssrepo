import {
	AfterViewInit,
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	Input,
} from '@angular/core';
import { LikesApiService } from '@app/core/api/likes-api.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
	selector: 'app-like',
	templateUrl: './like.component.html',
	styleUrls: ['./like.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LikeComponent implements AfterViewInit {
	@Input() public isUserLikedProps!: boolean;
	@Input() public likesCountProps!: number;
	@Input() public objectIdProps!: number;
	@Input() public typeObject!: number;
	@Input() public award: any;

	public isUserLiked!: boolean;
	public likesCount!: number;

	public isClickLike!: boolean; // Начальное состояние клика

	public constructor(
		private readonly apiService: LikesApiService,
		private readonly chDRef: ChangeDetectorRef,
	) {}

	public ngAfterViewInit(): void {
		this.likesCount = this.likesCountProps;
		this.isUserLiked = this.isUserLikedProps; // Используется в шаблоне ипользуется
		this.isClickLike = this.isUserLikedProps; // Начальное состояние клика
	}

	public setLike(objectId: number, type = this.typeObject) {
		if (!this.isClickLike) {
			this.apiService
				.setLike(objectId, type)
				.pipe(untilDestroyed(this))
				.subscribe({
					next: () => {
						this.likesCount += 1;
						this.isClickLike = true;
						this.chDRef.markForCheck();
					},
					error: (error: unknown) => console.error(error),
				});
		}

		if (this.isClickLike) {
			this.apiService
				.deleteLike(objectId, type)
				.pipe(untilDestroyed(this))
				.subscribe({
					next: () => {
						this.likesCount -= 1;
						this.isClickLike = false;
						this.chDRef.markForCheck();
					},
				});
		}
	}
}
