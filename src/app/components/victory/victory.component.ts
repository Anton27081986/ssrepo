import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    OnChanges,
    OnInit,
    ViewChild,
    ViewContainerRef,
} from '@angular/core';
import {NzIconService} from 'ng-zorro-antd/icon';
import {AppIcons} from '@app/common/icons';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ApiService} from '@app/shared/services/api/api.service';
import {map, Observable, tap} from 'rxjs';
import {NzModalService} from 'ng-zorro-antd/modal';
import {ModalInfoComponent} from '@app/components/modal/modal-info/modal-info.component';
import {AddVictoryModalComponent} from '@app/components/victory/modal/add-victory-modal/add-victory-modal.component';
import {CommentsModalComponent} from '@app/components/modal/comments-modal/comments-modal.component';

@Component({
    selector: 'app-victory',
    templateUrl: './victory.component.html',
    styleUrls: ['./victory.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VictoryComponent implements OnInit, OnChanges {
    @ViewChild('liked') likedPeople!: ElementRef;

    victoryForm!: FormGroup;

    winsList!: Observable<any>;
    winsUrl!: Observable<any>;

    winsGroupsList!: Observable<any>;

    pageSize = 6;
    pageIndex = 1;
    offset = 7;

    public getExtendedMode!: Observable<any>;

    constructor(
        private readonly apiService: ApiService,
        private readonly formBuilder: FormBuilder,
        private readonly iconService: NzIconService,
        public modalCreate: NzModalService,
        private readonly viewContainerRef: ViewContainerRef,
        private readonly chDRef: ChangeDetectorRef,
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
        this.iconService.addIconLiteral('ss:goldLike', AppIcons.goldLike);
        this.iconService.addIconLiteral('ss:silverLike', AppIcons.silverLike);
        this.iconService.addIconLiteral('ss:bronzeLike', AppIcons.bronzeLike);
    }

    ngOnChanges() {
        console.log('OnChanges');
    }

    ngOnInit() {
        console.log('ngOnInit');

        this.winsList = this.apiService.getWins(this.pageSize, this.offset);

        this.apiService
            .getWins(this.pageSize, this.offset)
            .pipe(
                map(({isExtendedMode}) => isExtendedMode),
            )
            .subscribe(value => {
                this.getExtendedMode = value;
            });

        this.winsUrl = this.apiService.getWins(this.pageSize, this.offset);

        this.winsGroupsList = this.apiService.getWinsGroups().pipe(map(({items}) => items));

        this.victoryForm = this.formBuilder.group({
            search: ['', [Validators.required]],
            password: ['', Validators.required],
        });
    }

    // Модальное окно раскрытой карточки
    showModalOpenOut(id: any): void {
        this.modalCreate
            .create({
                nzClosable: true,
                nzFooter: null,
                nzTitle: 'Информация о пользователе',
                nzNoAnimation: false,
                nzWidth: '365px',
                nzContent: ModalInfoComponent,
                nzViewContainerRef: this.viewContainerRef,
                nzData: {
                    data: id,
                },
            })
            .afterClose.subscribe();
    }

    // Модальное окно добавления победы
    showModaAddWin(): void {
        this.modalCreate
            .create({
                nzClosable: true,
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
    showModalComments(item: any, type: number): void {
        this.modalCreate
            .create({
                nzClosable: true,
                nzFooter: null,
                nzTitle: `Победа № ${item.user.id}`,
                nzNoAnimation: false,
                nzWidth: '560px',
                nzContent: CommentsModalComponent,
                nzViewContainerRef: this.viewContainerRef,
                nzData: {
                    data: item,
                    type,
                },
            })
            .afterClose.subscribe();
    }

    nzPageIndexChange($event: number) {
        console.log('this.page IndexpageIndex ', this.pageIndex);
        console.log('this.pageIndex $event', $event);

        // !!! Убрать item проверить данные
        this.winsList = this.apiService.getWins(this.pageSize, this.offset).pipe(
            tap(_ => {
                console.log('change page');
                this.offset = $event;
                this.pageIndex = $event; // Смена страницы но не отображаются данные
                this.chDRef.markForCheck();
            }),
        );

        console.log('this.pageIndex после нажатия', this.pageIndex);
    }

    // nzPageSizeChange($event: number) {
    //
    //     // this.pageSize = $event
    //     console.log('nzPageSizeChange')
    // }

    trackBy(_index: number, item: any) {
        return item.id;
    }
}
