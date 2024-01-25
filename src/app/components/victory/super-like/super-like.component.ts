import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Input,
} from '@angular/core';
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
    @Input() award: any;
    @Input() isExtendedMode: any;

    isUserLiked!: boolean;
    likesCount!: number;

    public isClickLike!: boolean; // Начальное состояние клика

    constructor(
        private readonly apiService: ApiService,
        private readonly chDRef: ChangeDetectorRef,
    ) {}

    ngAfterViewInit(): void {
        this.likesCount = this.likesCountProps;
        this.isUserLiked = this.isUserLikedProps;
        this.isClickLike = this.isUserLikedProps; // Начальное состояние клика
    }

    setSuperLike($event: any, item: any, objectId: number, type: number, award?: number) {
        $event.stopPropagation();

        if (!this.isClickLike) {
            this.apiService.setLike(objectId, type, award).subscribe({
                next: () => {
                    this.award = award;
                    this.likesCount += 1;
                    this.isClickLike = true; // true Если тут то лайк долго ставится
                    this.chDRef.markForCheck();
                },
                error: (error: unknown) => console.log(error),
            });
        }

        if (this.isClickLike) {
            this.apiService.deleteLike(objectId, type).subscribe({
                next: () => {
                    this.award = null;
                    this.likesCount -= 1;
                    this.isClickLike = false;
                    this.chDRef.markForCheck();
                },
                error: (error: unknown) => console.log(error),
            });
        }
    }
}
