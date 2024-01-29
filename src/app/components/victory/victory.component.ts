import {ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild,} from '@angular/core';
import {NzIconService} from 'ng-zorro-antd/icon';
import {AppIcons} from '@app/common/icons';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ApiService} from '@app/shared/services/api/api.service';
import {map, Observable, Subject, tap, zip} from 'rxjs';
import {NzModalService} from 'ng-zorro-antd/modal';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {VictoryService} from '@app/components/victory/victory.service';

@UntilDestroy()
@Component({
    selector: 'app-victory',
    templateUrl: './victory.component.html',
    styleUrls: ['./victory.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VictoryComponent implements OnInit {
    @ViewChild('liked') likedPeople!: ElementRef;

    public total!: number;
    public pageSize = 6;
    public pageIndex = 1;
    public offset = 0;
    public getExtendedMode!: Observable<any>;
    public winsList!: Observable<any>;
    public winsUrl!: Observable<any>;
    public winsGroupsList!: Observable<any>;

    // Форма
    private readonly modelChangedColleague: Subject<string> = new Subject<string>();
    private readonly modelChangedTpr: Subject<string> = new Subject<string>();

    public isConfirmLoading = false;
    public textPlaceHolder = 'Выберите ваших коллег из списка или введите фамилию';
    public isSended = true;
    public addVictoryForm!: FormGroup;
    public submitted = false;

    protected isModalVisible = false;
    public errorComment = false;

    public partyWinSelectedTags: Array<{name: string; id: number}> = [];
    public tprSelectedTags: Array<{name: string; id: number}> = [];
    public userWinArray: string[] = [];
    public tprWinArray: string[] = [];
    public selectedUser!: string;
    public selectedTpr!: string;

    public listColleague: Array<{name: string; id: string}> = [];
    public listTPR: Array<{name: string; id: string}> = [];

    constructor(
        private readonly apiService: ApiService,
        private readonly _victoryService: VictoryService,
        private readonly formBuilder: FormBuilder,
        private readonly iconService: NzIconService,
        public modal: NzModalService,
        private readonly cd: ChangeDetectorRef,
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
        this.iconService.addIconLiteral('ss:delete', AppIcons.delete);
    }

    get comment() {
        return this.addVictoryForm.get('comment');
    }

    getWinList() {
        this.winsList = this.apiService.getWins(this.pageSize, this.offset);
    }

    ngOnInit() {
        this.getWinList();

        this.addVictoryForm = this.formBuilder.group({
            comment: ['', [Validators.required, Validators.maxLength(3000)]],
        });

        // Подписка на изменения input поиска коллег
        zip(this.modelChangedColleague)
            .pipe(
                // debounceTime(300),
                tap(value => {
                    if (value[0].length > 1) {
                        this.apiService
                            .getUsersByFIO(value[0])
                            .pipe(
                                map(({items}) => items),
                                tap(data => {
                                    this.listColleague = data;
                                }),
                            )
                            .subscribe();
                    }
                }),
            )
            .subscribe();

        // Подписка на изменения input поиска tpr
        zip(this.modelChangedTpr)
            .pipe(
                // debounceTime(300),
                tap(value => {
                    if (value[0].length > 1) {
                        this.apiService
                            .searchProductByName(value[0])
                            .pipe(
                                map(({items}) => items),
                                tap(data => {
                                    this.listTPR = data;
                                }),
                            )
                            .subscribe();
                    }
                }),
            )
            .subscribe();

        // Опитимизировать два запросы
        this.apiService
            .getWins(this.pageSize, this.offset)
            .pipe(map(({isExtendedMode}) => isExtendedMode))
            .subscribe(value => {
                this.getExtendedMode = value;
            });

        this.apiService
            .getWins(this.pageSize, this.offset)
            .pipe(
                untilDestroyed(this),
                map(({total}) => total),
                tap(value => {
                    this.total = value;
                }),
            )
            .subscribe();

        this.winsUrl = this.apiService.getWins(this.pageSize, this.offset);
        this.winsGroupsList = this.apiService.getWinsGroups().pipe(map(({items}) => items));

        // Подписка на комментарий
        this._victoryService.count$
            .pipe(
                untilDestroyed(this),
                tap(_ => {
                    this.updateWinList();
                }),
            )
            .subscribe();
    }

    // TODO Вынести форму в отдельный компонент - add-victory-modal
    // Модальное окно добавления победы
    showModaAddWin($event: any): void {
        $event.stopPropagation();

        /*        this.modalCreate
            .create({
                nzClosable: true,
                nzTitle: 'Делитесь вашими победами, ведь успех заразителен!',
                nzFooter: [
                    {
                        label: 'Close',
                        shape: 'round',
                        onClick: () => console.log('onClick')
                    },
                ],

                nzNoAnimation: false,
                nzWidth: '560px',
                nzContent: AddVictoryModalComponent,
                nzViewContainerRef: this.viewContainerRef,
            })
            .afterClose.subscribe(_ => {
                console.log('Победы закрыты');
                this.updateWinList();
                this.cd.markForCheck();
            });*/
    }

    public showModal(): void {
        this.isModalVisible = true;
    }

    public handleOk(): void {
        if (this.addVictoryForm.valid) {
            const comment = this.comment?.value;
            const userList = this.partyWinSelectedTags.map(item => item.id);
            const tprList = this.tprSelectedTags.map(item => item.id);

            this.apiService
                .addWins(comment, userList, tprList)
                .pipe(
                    tap(_ => {
                        this.partyWinSelectedTags = [];
                        this.tprSelectedTags = [];

                        this.updateWinList();

                        this.cd.detectChanges();

                        this.isSended = false;
                    }),
                )
                .subscribe(
                    () => {
                        this.updateWinList();
                    },
                    () => {
                        this.errorComment = true;
                    },
                );
        } else {
            console.log('Форма не валидна');
        }

        this.isModalVisible = false;
    }

    public handleCancel(): void {
        this.isModalVisible = false;
    }

    // При выборе клика по пользователю
    onUserChange() {
        this.userWinArray.push(this.selectedUser); // Выбранные пользователи
        this.apiService
            .getUserById(this.selectedUser)
            .pipe(
                tap(user => {
                    this.partyWinSelectedTags.push({
                        id: user.id,
                        name: user.name,
                    }); // добавление тега
                    this.cd.markForCheck();
                }),
            )
            .subscribe();
    }

    // При выборе клика по продукту
    onTprChange() {
        this.tprWinArray.push(this.selectedTpr);
        this.apiService
            .getProductById(Number(this.selectedTpr))
            .pipe(
                tap(user => {
                    this.tprSelectedTags.push({
                        id: user.id,
                        name: user.name,
                    }); // добавление тега

                    this.cd.markForCheck();
                }),
            )
            .subscribe();
    }

    searchUsers($event: any) {
        this.modelChangedColleague.next($event);
    }

    searchTpr($event: any) {
        this.modelChangedTpr.next($event);
    }

    nzPageIndexChange($event: number) {
        if ($event === 1) {
            this.offset = 0;
        } else {
            this.offset = this.pageSize * $event - this.pageSize;
        }

        this.pageIndex = $event; // Установка текущего индекса

        this.updateWinList();
    }

    updateWinList() {
        this.winsList = this.apiService.getWins(this.pageSize, this.offset).pipe(
            tap(_ => {
                this.cd.markForCheck();
            }),
        );
    }

    deleteTagUser(i: number) {
        this.partyWinSelectedTags.splice(i, 1);
        this.cd.markForCheck();
    }

    deleteTagTpr(i: number) {
        this.tprSelectedTags.splice(i, 1);
    }

    addNewWin() {
        console.log('addNewWin');
    }
}
