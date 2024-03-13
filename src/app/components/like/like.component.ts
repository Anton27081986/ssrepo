import {
	AfterViewInit,
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	Input,
} from '@angular/core';
import { LikesApiService } from '@app/core/api/likes-api.service';

@Component({
	selector: 'app-like',
	templateUrl: './like.component.html',
	styleUrls: ['./like.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LikeComponent implements AfterViewInit {
	@Input() isUserLikedProps!: boolean;
	@Input() likesCountProps!: number;
	@Input() objectIdProps!: number;
	@Input() typeObject!: number;
	@Input() award: any;

	public isUserLiked!: boolean;
	public likesCount!: number;

	public isClickLike!: boolean; // Начальное состояние клика

	public constructor(
		private readonly apiService: LikesApiService,
		private readonly chDRef: ChangeDetectorRef,
		// private readonly ngZone: NgZone,
	) {}

	public ngAfterViewInit(): void {
		this.likesCount = this.likesCountProps;
		this.isUserLiked = this.isUserLikedProps; // Используется в шаблоне ипользуется
		this.isClickLike = this.isUserLikedProps; // Начальное состояние клика
	}

	public setLike(isUserLiked: boolean, objectId: number, type = this.typeObject) {
		if (!this.isClickLike) {
			this.apiService.setLike(objectId, type).subscribe({
				next: () => {
					this.likesCount += 1;
					this.isClickLike = true;
					this.chDRef.markForCheck();
				},
				error: (error: unknown) => console.log(error),
			});
		}

		if (this.isClickLike) {
			this.apiService.deleteLike(objectId, type).subscribe({
				next: () => {
					this.likesCount -= 1;
					this.isClickLike = false;
					this.chDRef.markForCheck();
				},
			});
		}
	}
}
