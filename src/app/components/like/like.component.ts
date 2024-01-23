import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {ApiService} from '@app/shared/services/api/api.service';

@Component({
    selector: 'app-like',
    templateUrl: './like.component.html',
    styleUrls: ['./like.component.scss'],
    changeDetection: ChangeDetectionStrategy.Default,
})
export class LikeComponent implements OnInit {
    @Input('isUserLiked') isUserLikedProps!: boolean;
    @Input('likesCount') likesCountProps!: number;
    @Input('objectId') objectIdProps!: number;
    @Input('typeObject') typeObject!: number;

    isUserLiked!: boolean;
    likesCount!: number;

    public isClickLike!: boolean; // Начальное состояние клика

    constructor(private readonly apiService: ApiService) {}

    ngOnInit(): void {
        this.likesCount = this.likesCountProps;
        this.isUserLiked = this.isUserLikedProps;

        this.isClickLike = this.isUserLikedProps; // Начальное состояние клика

        console.log('this.isClickLike onInit', this.isUserLikedProps);
    }
    setLike(isUserLiked: any, objectId: number, type = this.typeObject) {
        // Изменить колличество лайкой
        // Добавить стейт

        console.log('setLike click');

        console.log('this.isClickLike SetLike', this.isClickLike);

        // Лайкнули или кликнули

        console.log('!item.isUserLiked && !this.isClickLike', !isUserLiked && !this.isClickLike);
        console.log('!this.isClickLike', !this.isClickLike);
        console.log('!item.isUserLiked', !isUserLiked);

        // isUserLiked
        /*        if(this.isClickLike) {
            console.log('this.isClickLike -1,', this.isClickLike)
            this.likesCount = this.likesCount - 1;
        } else {
            this.likesCount = this.likesCount + 1;
            console.log('this.isClickLike +1,', this.isClickLike)
        }*/

        //  && !this.isClickLike нужно хранить стей иначе после перезагрузки не работает
        // !isUserLiked // при повторном клике не обновляется и не ставиться
        if (!this.isClickLike) {
            console.log('setLike objectId !isUserLiked', objectId);
            console.log('Установить лайк');

            this.likesCount = this.likesCount + 1;

            this.apiService.setLike(objectId, type).subscribe({
                next: () => {
                    // console.log('data', data);
                    this.isClickLike = true;
                    // this.likesCount = this.likesCount + 1;
                },
                error: (error: unknown) => console.log(error),
            });
        }

        console.log('item.isUserLiked && this.isClickLike', isUserLiked && this.isClickLike);
        console.log('this.isClickLike', this.isClickLike);
        console.log('item.isUserLiked', isUserLiked);

        // Лайкнули или кликнули
        // && this.isClickLike
        // isUserLiked // при повторном клике не обновляется и не удаляется
        if (this.isClickLike) {
            console.log('deleteLike objectId isUserLiked', objectId);
            console.log('Удалить лайк');

            // this.isClickLike = false;
            this.likesCount = this.likesCount - 1;

            this.apiService.deleteLike(objectId, type).subscribe({
                next: () => {
                    // console.log('data', data);
                    this.isClickLike = false;
                    // this.likesCount = this.likesCount - 1;
                },
                error: (error: unknown) => console.log(error),
            });
        }

        // Обновить количество лайков
        // this.winsList = this.apiService.getWins();
    }
}
