import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	OnDestroy,
	OnInit,
	ViewContainerRef,
} from '@angular/core';
import { distinctUntilChanged, filter, map, Observable, Subject, switchMap, tap, zip } from 'rxjs';
import isEqual from 'lodash/isEqual';
import { ModalInfoComponent } from '@app/components/modal/modal-info/modal-info.component';
import { NzModalService } from 'ng-zorro-antd/modal';
import { UserProfileStoreService } from '@app/core/states/user-profile-store.service';
import { IUserProfile } from '@app/core/models/user-profile';
import { RatingStoreService } from '@app/core/states/rating-store.service';
import { RatingApiService } from '@app/core/api/rating-api.service';
import { UsersApiService } from '@app/core/api/users-api.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
	selector: 'app-rating',
	templateUrl: './rating.component.html',
	styleUrls: ['./rating.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RatingComponent implements OnInit, OnDestroy {
	public userProfile$: Observable<IUserProfile | null>;
	public ratingWeeks$: Observable<any>;
	public ratingTypes$: Observable<any>;
	public ratings$!: Observable<any>;

	private readonly userNameChanged: Subject<string> = new Subject<string>();

	private currentUserId!: number;
	public selectedUserId?: number;
	public selectedWeekId!: number;
	public selectedRatingTypeId!: number;
	public usersListOfOption: Array<{ name: string; id: string }> = [];

	private readonly destroy$: Subject<boolean> = new Subject<boolean>();

	public loading = false;
	public title: any;
	public submitted = false;

	public total!: number;
	public pageSize = 6;
	public pageIndex = 1;
	public offset = 0;

	public nzFilterOption = (): boolean => true;
	public rateValue = {
		great: 4.5,
		good1: 4.4,
		good2: 4.0,
		bad: 3.9,
	};

	public constructor(
		private readonly userProfileStoreService: UserProfileStoreService,
		private readonly ratingStoreService: RatingStoreService,
		private readonly modalCreate: NzModalService,
		private readonly viewContainerRef: ViewContainerRef,
		private readonly cd: ChangeDetectorRef,
		private readonly ratingApiService: RatingApiService,
		private readonly usersApiService: UsersApiService,
	) {
		this.userProfile$ = this.userProfileStoreService.userProfile$.pipe(
			filter(value => value !== null),
		);
		this.ratingWeeks$ = this.ratingStoreService.ratingWeeks$.pipe(
			filter(value => value !== null),
		);

		this.ratingTypes$ = new Observable<any>().pipe(
			distinctUntilChanged((prev, curr) => isEqual(prev, curr)),
		);
	}

	public ngOnInit() {
		this.userProfile$
			.pipe(
				tap(value => {
					if (value) {
						this.usersListOfOption.push({
							id: value.id.toString(),
							name: value.name!,
						});

						this.selectedUserId = value.id;
					}
				}),
				untilDestroyed(this),
			)
			.subscribe();

		this.getRatingTypesByWeekAndUserInit(); // Получаем текущий id пользователя обновляем типы рейтингов и подсвечиваем нужный тип
		this.getRatingsByWeekAndRatingTypeInit(); // Получам и устанавливаем участников

		// Получение последних 5 недель
		this.ratingWeeks$ = this.ratingStoreService.ratingWeeks$;

		zip(this.userNameChanged)
			.pipe(
				tap(value => {
					if (value[0].length >= 3) {
						this.usersApiService
							.getUsersByFIO(value[0])
							.pipe(
								map(({ items }) => items),
								tap(data => {
									this.usersListOfOption = data;
								}),
								untilDestroyed(this),
							)
							.subscribe();
					}
				}),
				untilDestroyed(this),
			)
			.subscribe();
	}

	// Получаем текущий id пользователя обновляем типы рейтингов и подсвечиваем нужный тип
	public getRatingTypesByWeekAndUserInit() {
		zip(this.userProfile$, this.ratingWeeks$)
			.pipe(
				map(([user, week]) => {
					return {
						...user,
						week: { ...week[0] },
					};
				}),
				untilDestroyed(this),
			)
			.subscribe(value => {
				this.currentUserId = value.id!; // id пользователя
				this.selectedWeekId = value.week.id; // id недели
				this.ratingTypes$ = this.ratingApiService.getRatingTypes(value.week.id, value.id!);
			});
	}

	public getRatingsByWeekAndRatingTypeInit() {
		zip(this.userProfile$, this.ratingWeeks$)
			.pipe(
				map(([user, week]) => {
					return {
						...user,
						week: { ...week[0] },
					};
				}),
				switchMap(() => {
					return this.ratingApiService.getRatingTypes(
						this.selectedWeekId,
						this.currentUserId,
					);
				}),
				untilDestroyed(this),
			)
			.subscribe(value => {
				this.selectedRatingTypeId = value.rankTypeId!; // устанавливаем rankTypeId глобально
				this.ratings$ = this.ratingApiService
					.getRatings(this.selectedWeekId, this.selectedRatingTypeId, this.pageSize, 0)
					.pipe(
						tap(value => {
							this.pageIndex = 1;
							this.total = value.total;
							this.cd.markForCheck();
						}),
					);
			});
	}

	public getRatingsByWeekAndRatingTypeSearch(
		userId: number | null,
		weekId: number,
		limit: number,
		Offset: number = 0,
	) {
		// Переделать
		zip(this.userProfile$)
			.pipe(
				map(() => {
					return {
						user: { userId },
					};
				}),
				switchMap(() => {
					return this.ratingApiService.getRatingTypes(weekId, userId!);
				}),
				untilDestroyed(this),
			)
			.subscribe(value => {
				this.selectedRatingTypeId = value.rankTypeId!;
				this.ratings$ = this.ratingApiService
					.getRatings(this.selectedWeekId, this.selectedRatingTypeId, limit, Offset)
					.pipe(
						tap(value => {
							this.pageIndex = 1;
							this.total = value.total;
							this.cd.markForCheck();
						}),
					);
			});
	}

	public getRatingsByWeekAndRatingTypeChangeWeek(weekId: number) {
		this.ratings$ = this.ratingApiService
			.getRatings(weekId, this.selectedRatingTypeId, this.pageSize, 0)
			.pipe(
				tap(value => {
					this.pageIndex = 1;
					this.total = value.total;
					this.cd.markForCheck();
				}),
			);
	}

	public onSelectWeek(weekId: number): void {
		this.getRatingsByWeekAndRatingTypeChangeWeek(weekId);
		this.ratingTypes$ = this.ratingApiService.getRatingTypes(weekId, this.currentUserId);
	}

	public onClickByRatingType(id: number, limit: number, $event: MouseEvent) {
		$event.stopPropagation();
		this.selectedRatingTypeId = id; // Получаем id кликнутого типа рейтига, чтобы его подсветить

		// Выводим участников по кликнутому id рейтинга и id выбранной недели при смене недели в селекте
		this.ratings$ = this.ratingApiService
			.getRatings(this.selectedWeekId, this.selectedRatingTypeId, this.pageSize, 0)
			.pipe(
				tap(value => {
					this.pageIndex = 1;
					this.total = value.total;
					this.cd.markForCheck();
				}),
			);
	}

	public onUserSearch($event: any) {
		this.userNameChanged.next($event);
	}

	// При выборе пользователя
	public onUserChange() {
		this.ratingTypes$ = this.ratingApiService.getRatingTypes(
			this.selectedWeekId,
			this.selectedUserId!,
		);
		this.getRatingsByWeekAndRatingTypeSearch(
			this.selectedUserId!,
			this.selectedWeekId,
			this.pageSize,
			this.offset,
		);
	}

	// Модальное окно раскрытой карточки
	public showModalOpenOut(id: number): void {
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
			.afterClose.pipe(untilDestroyed(this))
			.subscribe();
	}

	public nzPageIndexChange($event: number) {
		if ($event === 1) {
			this.offset = 0;
		} else {
			this.offset = this.pageSize * $event - this.pageSize;
		}

		this.pageIndex = $event;

		this.ratings$ = this.ratingApiService
			.getRatings(this.selectedWeekId, this.selectedRatingTypeId, this.pageSize, this.offset)
			.pipe(
				tap(value => {
					this.total = value.total;
					this.cd.markForCheck();
				}),
			);
	}

	public ngOnDestroy() {
		this.destroy$.next(true);
		this.userNameChanged.complete();
	}
}
