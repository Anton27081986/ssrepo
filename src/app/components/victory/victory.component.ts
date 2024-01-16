import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    HostListener,
    OnInit,
    ViewContainerRef,
} from '@angular/core';
import {NzIconService} from 'ng-zorro-antd/icon';
import {AppIcons} from '@app/common/icons';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ApiService} from '@app/shared/services/api/api.service';
import {Observable, map} from 'rxjs';
import {NzModalService} from 'ng-zorro-antd/modal';
import {ModalInfoComponent} from '@app/components/modal/modal-info/modal-info.component';
import {AddVictoryModalComponent} from '@app/components/victory/modal/add-victory-modal/add-victory-modal.component';
import {CommentsModalComponent} from '@app/components/modal/comments-modal/comments-modal.component';
import {PeopleLikeModalComponent} from '@app/components/victory/modal/people-like-modal/people-like-modal.component';

@Component({
    selector: 'app-victory',
    templateUrl: './victory.component.html',
    styleUrls: ['./victory.component.scss'],
    changeDetection: ChangeDetectionStrategy.Default,
})
export class VictoryComponent implements OnInit {
    @HostListener('mouseover', ['$event.target']) onMouseHover() {
        // console.log();
    }

    @HostListener('mouseleave') hideTooltip() {
        // console.log();
    }

    peoplelikesOpen = false;
    isVisibleComments = false;
    isVisibleOpenOut = false;
    loginForm!: FormGroup;

    checked = true;

    winsList!: Observable<any>;
    winsUrl!: Observable<any>;

    winsGroupsList!: Observable<any>;

    pageSize = 6;
    pageIndex = 1;

    searchPanelVisible = false;
    // isClickLike = false;

    isVisibleAdd = false; // Переделать

    constructor(
        private readonly apiService: ApiService,
        private readonly formBuilder: FormBuilder,
        private readonly iconService: NzIconService,
        public modalCreate: NzModalService,
        private readonly viewContainerRef: ViewContainerRef,
        private readonly _ef: ElementRef,
    ) {
        this.iconService.addIconLiteral('ss:arrowBottom', AppIcons.arrowBottom);
        this.iconService.addIconLiteral('ss:calendar', AppIcons.calendar);
        this.iconService.addIconLiteral('ss:medalGold', AppIcons.medalGold);
        this.iconService.addIconLiteral('ss:medalSilver', AppIcons.medalSilver);
        this.iconService.addIconLiteral('ss:medalBronze', AppIcons.medalBronze);
        this.iconService.addIconLiteral('ss:like', AppIcons.like);
        this.iconService.addIconLiteral('ss:comment', AppIcons.comment);
        this.iconService.addIconLiteral('ss:plus', AppIcons.plus);
        this.iconService.addIconLiteral('ss:medal', AppIcons.medal);
        this.iconService.addIconLiteral('ss:openOut', AppIcons.openOut);
        this.iconService.addIconLiteral('ss:onePeople', AppIcons.onePeople);
        this.iconService.addIconLiteral('ss:twoPeople', AppIcons.twoPeople);
        this.iconService.addIconLiteral('ss:iconClose', AppIcons.iconClose);
        this.iconService.addIconLiteral('ss:attach', AppIcons.attach);
    }

    ngOnInit() {
        this.winsList = this.apiService.getWins().pipe(map(({items}) => items));
        this.winsUrl = this.apiService.getWins();
        this.winsGroupsList = this.apiService.getWinsGroups().pipe(map(({items}) => items));

        this.loginForm = this.formBuilder.group({
            login: [
                '',
                [
                    Validators.required,
                    // Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
                ],
            ],
            password: ['', Validators.required],
        });
    }

    // Модальное окно раскрытой карточки
    showModalOpenOut(item: any): void {
        this.modalCreate
            .create({
                nzClosable: false,
                nzFooter: null,
                nzTitle: 'Информация о пользователе',
                nzNoAnimation: false,
                nzWidth: '365px',
                nzContent: ModalInfoComponent,
                nzViewContainerRef: this.viewContainerRef,
                nzData: {
                    data: item,
                },
            })
            .afterClose.subscribe();
    }

    // Модальное окно добавления победы
    showModaAddWin(): void {
        this.modalCreate
            .create({
                nzClosable: false,
                nzFooter: null,
                nzTitle: 'Делитесь вашими победами, ведь успех заразителен!',
                nzNoAnimation: false,
                nzWidth: '560px',
                nzContent: AddVictoryModalComponent,
                nzViewContainerRef: this.viewContainerRef,
            })
            .afterClose.subscribe();
    }

    // Модальное окно комментариев
    showModalComments(item: any): void {
        console.log('Победы комент', item);

        this.modalCreate
            .create({
                nzClosable: false,
                nzFooter: null,
                nzTitle: `${item.user.name} Победа № ${item.user.id}`,
                nzNoAnimation: false,
                nzWidth: '560px',
                nzContent: CommentsModalComponent,
                nzViewContainerRef: this.viewContainerRef,
                nzData: {
                    data: item,
                },
            })
            .afterClose.subscribe();
    }

    // Модальное окно тех кто лайкнул
    showPeopleLikeModel(): void {
        this.modalCreate
            .create({
                nzClosable: false,
                nzFooter: null,
                nzNoAnimation: false,
                nzContent: PeopleLikeModalComponent,
                nzViewContainerRef: this.viewContainerRef,
            })
            .afterClose.subscribe();
    }

    handleCancelComments(): void {
        this.isVisibleComments = false;
    }

    setLike(item: any, objectId: number, type = 1) {
        //  && !this.isClickLike
        if (!item.isUserLiked) {
            console.log('objectId', objectId);
            this.apiService.setLike(objectId, type).subscribe({
                next: () => {
                    // console.log('data', data);
                    // this.isClickLike = true;
                },
                error: (error: unknown) => console.log(error),
            });
        }
    }

    onSubmit() {}

    search() {}
}
