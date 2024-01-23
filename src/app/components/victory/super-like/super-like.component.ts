import {AfterViewInit, ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {ApiService} from '@app/shared/services/api/api.service';

@Component({
    selector: 'app-super-like',
    templateUrl: './super-like.component.html',
    styleUrls: ['./super-like.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SuperLikeComponent implements AfterViewInit {
    @Input() isUserLikedProps!: boolean;
    @Input() likesCountProps!: number;
    @Input() objectIdProps!: number;
    @Input() typeObject!: number;
    @Input() awardId!: number;

    isUserLiked!: boolean;
    likesCount!: number;

    public isClickLike!: boolean; // Начальное состояние клика

    constructor(private readonly apiService: ApiService) {}

    ngAfterViewInit(): void {
        this.likesCount = this.likesCountProps;
        this.isUserLiked = this.isUserLikedProps; // Используется в шаблоне ипользуется
        this.isClickLike = this.isUserLikedProps; // Начальное состояние клика
    }

    setSuperLike(item: any, objectId: number, type: number, award?: number) {
        if (!this.isClickLike) {
            this.apiService.setLike(objectId, type, award).subscribe({
                next: () => {
                    this.likesCount += 1;
                    this.isClickLike = true; // true Если тут то лайк долго ставится
                },
                error: (error: unknown) => console.log(error),
            });
        }

        if (this.isClickLike) {
            this.apiService.deleteLike(objectId, type, award).subscribe({
                next: () => {
                    this.likesCount -= 1;
                    this.isClickLike = false;
                },
                error: (error: unknown) => console.log(error),
            });
        }
    }
}
