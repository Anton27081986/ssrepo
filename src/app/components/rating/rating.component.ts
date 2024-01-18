import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    HostListener,
    OnDestroy,
    OnInit,
} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {NzIconService} from 'ng-zorro-antd/icon';
import {AppIcons} from '@app/common/icons';
import {ApiService} from '@app/shared/services/api/api.service';
import {debounceTime, map, Observable, Subject, take, takeUntil, tap} from 'rxjs';
import {UserService} from '@auth/services/user.service';

@Component({
    selector: 'app-rating',
    templateUrl: './rating.component.html',
    styleUrls: ['./rating.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RatingComponent implements OnInit, OnDestroy {
    destroy$: Subject<boolean> = new Subject<boolean>();

    loginForm!: FormGroup;
    loading = false;
    checked = true;
    title: any;
    submitted = false;
    isConfirmLoading = false;
    weekId: any;
    rankTypeId: any;
    currentUserId: any;
    currentUserName: any;

    showWindowResult = false;
    public searchResult!: Observable<any>;
    private readonly modelChanged: Subject<string> = new Subject<string>();

    protected rankTypes!: Observable<any>;
    protected rankWeeks!: Observable<any>;
    protected ranks!: Observable<any>;

    constructor(
        private readonly apiService: ApiService,
        private readonly userService: UserService,
        private readonly formBuilder: FormBuilder,
        private readonly iconService: NzIconService,
        private readonly resultSearch: ElementRef,
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
        this.listUserSelectRank();

        // Получение последних 5 недель
        this.rankWeeks = this.apiService.getRankWeeks().pipe(map(({items}) => items));

        this.loginForm = this.formBuilder.group({
            login: [],
        });
    }

    listUserSelectRank(weekId?: any) {
        // переписать nest
        this.apiService
            .getRankWeeks()
            .pipe(
                map(({items}) => items),
                take(1),
            )
            .subscribe(value => {
                if (weekId) {
                    console.log('weekId указан');
                    this.weekId = weekId;
                    this.rankTypes = this.apiService.getRankTypes(weekId);
                } else {
                    console.log('weekId не указан');
                    this.weekId = value[0].id;
                    this.rankTypes = this.apiService.getRankTypes(this.weekId);
                }

                this.apiService
                    .getRankTypes(this.weekId)
                    .pipe(take(1))
                    .subscribe(value => {
                        this.rankTypeId = value.rankTypeId;

                        this.userService
                            .getProfile()
                            .pipe(takeUntil(this.destroy$))
                            .subscribe(value => {
                                this.currentUserId = value.id;
                                this.currentUserName = value.name;

                                console.log('weekId', this.weekId);
                                console.log('userId', this.currentUserName);
                                console.log('rankTypeId', this.rankTypeId);

                                // Получить участников пользователя
                                this.ranks = this.apiService
                                    .getRank(this.weekId, this.currentUserId, this.rankTypeId, 6, 0)
                                    .pipe(map(({items}) => items));
                            });
                    });
            });
    }

    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.loginForm.invalid) {
            return;
        }

        this.loading = true;
    }

    @HostListener('document:click', ['$event'])
    onClick(event: Event) {
        console.log('event HostListener', event);

        console.log('showWindowResult', this.showWindowResult);

        if (this.showWindowResult) {
            if (!this.resultSearch.nativeElement.contains(event.target)) {
                this.showWindowResult = false;
                console.log('showWindowResult false set');
            }
        }
    }

    search($event: any) {
        $event.stopPropagation();
        this.showWindowResult = true;
        this.modelChanged.next($event.target.value);

        this.modelChanged.pipe(debounceTime(300)).subscribe(nextValue => {
            console.log('метод search modelChanged', nextValue);

            if (nextValue.length > 3) {
                this.searchResult = this.apiService.getUsersByFIO(nextValue).pipe(
                    debounceTime(300),
                    map(({items}) => items),
                    tap(data => console.log('метод search searchResult', data)),
                );
            }
        });
    }

    selectWeek(value: {id: string; name: string}): void {
        console.log('selectWeek', value);
        this.rankTypes = this.apiService.getRankTypes(value);

        this.listUserSelectRank(value);
    }

    ngOnDestroy() {
        this.destroy$.next(true);
        // this.destroy$.unsubscribe();
        this.modelChanged.complete();
    }
}
