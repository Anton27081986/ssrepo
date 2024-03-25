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
	selector: 'app-super-like',
	templateUrl: './super-like.component.html',
	styleUrls: ['./super-like.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SuperLikeComponent implements AfterViewInit {
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
		this.isUserLiked = this.isUserLikedProps;
		this.isClickLike = this.isUserLikedProps; // Начальное состояние клика
	}

	public setSuperLike($event: any, item: any, objectId: number, type: number, award?: number) {
		$event.stopPropagation();

		if (!this.isClickLike) {
			this.apiService
				.setLike(objectId, type, award)
				.pipe(untilDestroyed(this))
				.subscribe({
					next: () => {
						this.award = award;
						this.likesCount += 1;
						this.isClickLike = true; // true Если тут то лайк долго ставится
						this.chDRef.markForCheck();
					},
				});
		}

		if (this.isClickLike) {
			this.apiService
				.deleteLike(objectId, type)
				.pipe(untilDestroyed(this))
				.subscribe({
					next: () => {
						this.award = 0;
						this.likesCount -= 1;
						this.isClickLike = false;
						this.chDRef.markForCheck();
					},
				});
		}
	}
}
