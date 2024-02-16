import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Input,
} from '@angular/core';
import {ApiService} from '@app/core/services/api.service';

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

    isUserLiked!: boolean;
    likesCount!: number;

    public isClickLike!: boolean; // Начальное состояние клика

    constructor(
        private readonly apiService: ApiService,
        private readonly chDRef: ChangeDetectorRef,
        // private readonly ngZone: NgZone,
    ) {}

    ngAfterViewInit(): void {
        this.likesCount = this.likesCountProps;
        this.isUserLiked = this.isUserLikedProps; // Используется в шаблоне ипользуется
        this.isClickLike = this.isUserLikedProps; // Начальное состояние клика
    }

    setLike(isUserLiked: boolean, objectId: number, type = this.typeObject) {
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
