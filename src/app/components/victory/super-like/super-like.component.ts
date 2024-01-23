import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {ApiService} from '@app/shared/services/api/api.service';

@Component({
    selector: 'app-super-like',
    templateUrl: './super-like.component.html',
    styleUrls: ['./super-like.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SuperLikeComponent implements OnInit {
    @Input() isUserLikedProps!: boolean;
    @Input() likesCountProps!: number;
    @Input() objectIdProps!: number;
    @Input() typeObject!: number;
    @Input() awardId!: number;

    isUserLiked!: boolean;
    likesCount!: number;

    private isClickSuperLike = false;

    constructor(private readonly apiService: ApiService) {}

    ngOnInit(): void {
        this.likesCount = this.likesCountProps;
        this.isUserLiked = this.isUserLikedProps;
    }

    setSuperLike(item: any, objectId: number, type?: 1, award?: number) {
        // Изменить колличество лайкой
        // Добавить стейт

        console.log('setSuperLike click');

        // Лайкнули или кликнули

        console.log(
            '!item.isUserLiked && !this.isClickLike',
            !item.isUserLiked && !this.isClickSuperLike,
        );
        console.log('!this.isClickLike', !this.isClickSuperLike);
        console.log('!item.isUserLiked', !item.isUserLiked);

        //  && !this.isClickSuperLike нужно хранить стей иначе после перезагрузки не работает
        if (!item.isUserLiked) {
            console.log('setSuperLike objectId !isUserLiked', objectId);
            console.log('Установить SuperLike');

            this.isClickSuperLike = true;

            this.apiService.setLike(objectId, type, award).subscribe({
                next: data => {
                    console.log('data', data);
                    this.isClickSuperLike = true;
                },
                error: (error: unknown) => console.log(error),
            });
        }

        console.log(
            'item.isUserLiked && this.isClickSuperLike',
            item.isUserLiked && this.isClickSuperLike,
        );
        console.log('this.isClickSuperLike', this.isClickSuperLike);
        console.log('item.isUserLiked', item.isUserLiked);

        // Лайкнули или кликнули
        // && this.isClickSuperLike
        if (item.isUserLiked) {
            console.log('deleteSuperLike objectId isUserLiked', objectId);
            console.log('Удалить SuperLike');

            // this.isClickSuperLike = false;

            this.apiService.deleteLike(objectId, type, award).subscribe({
                next: data => {
                    console.log('data', data);
                    this.isClickSuperLike = false;
                },
                error: (error: unknown) => console.log(error),
            });
        }

        // Обновить количество лайков
        // this.winsList = this.apiService.getWins();
    }
}
