import {
    ChangeDetectionStrategy,
    Component,
    OnDestroy,
    OnInit,
    ViewContainerRef,
} from '@angular/core';
import {NzIconService} from 'ng-zorro-antd/icon';
import {AppIcons} from '@app/common/icons';
import {ApiService} from '@app/shared/services/api/api.service';
import {distinctUntilChanged, map, Observable, Subject, switchMap, tap, zip} from 'rxjs';
import {UserService} from '@auth/services/user.service';
import isEqual from 'lodash/isEqual';
import {ModalInfoComponent} from '@app/components/modal/modal-info/modal-info.component';
import {NzModalService} from 'ng-zorro-antd/modal';

@Component({
    selector: 'app-rating',
    templateUrl: './rating.component.html',
    styleUrls: ['./rating.component.scss'],
    changeDetection: ChangeDetectionStrategy.Default,
})
export class RatingComponent implements OnInit, OnDestroy {
    destroy$: Subject<boolean> = new Subject<boolean>();

    loading = false;
    title: any;
    submitted = false;
    weekId!: number;
    public rankTypeId!: number;
    private currentUserId!: number;
    currentUserName: any;
    placeholder = 'Сотрудник';

    private readonly modelChanged: Subject<string> = new Subject<string>();

    protected rankTypes = new Observable<any>().pipe(
        distinctUntilChanged((prev, curr) => isEqual(prev, curr)),
    );

    protected rankWeeks!: Observable<any>;
    protected ranks!: Observable<any>;

    protected getProfile$ = this._userService.getProfile();
    protected getRankWeeks$ = this._apiService.getRankWeeks();

    pageSize = 6;
    pageIndex = 1;

    // Переменные для поиска
    selectedValue = null;
    listOfOption: Array<{name: string; id: string}> = [];

    nzFilterOption = (): boolean => true;

    rateValue = {
        great: 4.5,
        good1: 4.4,
        good2: 4.0,
        bad: 3.9,
    };

    constructor(
        private readonly _apiService: ApiService,
        private readonly _userService: UserService,
        private readonly iconService: NzIconService,
        public modalCreate: NzModalService,
        private readonly viewContainerRef: ViewContainerRef,
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
        // Получение пользователя для поиска
        this._userService
            .getProfile()
            .pipe(
                tap(value => {
                    this.listOfOption.push({
                        id: value.id,
                        name: value.name,
                    });

                    this.selectedValue = value.id;
                }),
            )
            .subscribe();

        this.getRankTypesByWeekAndUserInit(); // Получаем текущий id пользователя обновляем типы рейтингов и подсвечиваем нужный тип
        this.getPartyByWeekAndRankTypeInit();

        // Получение последних 5 недель
        this.rankWeeks = this._apiService.getRankWeeks().pipe(map(({items}) => items));

        // Подписка на изменения input поиска
        zip(this.modelChanged)
            .pipe(
                // debounceTime(300),
                tap(value => {
                    if (value[0].length >= 3) {
                        this._apiService
                            .getUsersByFIO(value[0])
                            .pipe(
                                map(({items}) => items),
                                tap(data => {
                                    this.listOfOption = data;
                                }),
                            )
                            .subscribe();
                    }
                }),
            )
            .subscribe();
    }

    // api rank/type
    // Первоначальная загрузка
    // Получаем текущий id пользователя обновляем типы рейтингов и подсвечиваем нужный тип
    getRankTypesByWeekAndUserInit() {
        zip(this.getProfile$, this.getRankWeeks$)
            .pipe(
                map(([user, week]) => {
                    return {
                        ...user,
                        week: {...week.items[0]},
                    };
                }),
            )
            .subscribe(value => {
                this.currentUserId = value.id; // id пользователя используем глобально
                this.currentUserName = value.name; // id пользователя используем глобально
                this.weekId = value.week.id; // id недели используем глобально

                // Выводим типы за первую неделю
                this.rankTypes = this._apiService.getRankTypes(value.week.id, value.id);
            });
    }

    // api rank
    // Получение участников при инициализации
    // Получаем текущий id пользователя подсвечиваем нужный тип
    // Нужный тип получаем из rankTypeId api rank/types
    getPartyByWeekAndRankTypeInit() {
        zip(this.getProfile$, this.getRankWeeks$)
            .pipe(
                map(([user, week]) => {
                    return {
                        ...user,
                        week: {...week.items[0]},
                    };
                }),
                switchMap(() => {
                    return this._apiService.getRankTypes(this.weekId, this.currentUserId);
                }),
            )
            .subscribe(value => {
                this.rankTypeId = value.rankTypeId; // устанавливаем rankTypeId глобально
                this.ranks = this._apiService.getRank(this.weekId, this.rankTypeId, 100, 0);
            });
    }

    // api rank
    // Ипользуем при поиске
    getPartyByWeekAndRankTypeSearch(userId?: any, weekId?: any) {
        // Переделать
        zip(this.getProfile$)
            .pipe(
                map(() => {
                    return {
                        user: {userId},
                    };
                }),
                switchMap(() => {
                    return this._apiService.getRankTypes(weekId, userId);
                }),
            )
            .subscribe(value => {
                this.rankTypeId = value.rankTypeId; // устанавливаем rankTypeId глобально
                this.ranks = this._apiService.getRank(this.weekId, this.rankTypeId, 100, 0);
            });
    }

    selectWeek(weekId: number): void {
        this.rankTypes = this._apiService.getRankTypes(weekId, this.currentUserId);
    }

    clickByTypeRank(id: number, limit: number, $event: MouseEvent) {
        $event.stopPropagation();
        this.rankTypeId = id; // Получаем id кликнутого типа рейтига, чтобы его подсветить

        // Вывводим участников по кликнутому id рейтинга и id выбранной недели при смене недели в селекте
        this.ranks = this._apiService.getRank(this.weekId, this.rankTypeId, limit, 0);
    }

    search($event: any) {
        this.modelChanged.next($event);
    }

    // При выборе клика
    onUserChange() {
        this.rankTypes = this._apiService.getRankTypes(this.weekId, this.selectedValue);
        this.getPartyByWeekAndRankTypeSearch(this.selectedValue, this.weekId);
    }

    // Модальное окно раскрытой карточки
    showModalOpenOut(id: number): void {
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
                    data: id,
                },
            })
            .afterClose.subscribe();
    }

    ngOnDestroy() {
        this.destroy$.next(true);
        // this.destroy$.unsubscribe();
        this.modelChanged.complete();
    }
}
