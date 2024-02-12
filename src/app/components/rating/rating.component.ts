// import {
// 	ChangeDetectionStrategy,
// 	ChangeDetectorRef,
// 	Component,
// 	OnDestroy,
// 	OnInit,
// 	ViewContainerRef,
// } from '@angular/core';
// import { NzIconService } from 'ng-zorro-antd/icon';
// import { AppIcons } from '@app/common/icons';
// import { ApiService } from '@app/shared/services/services/services.service';
// import { distinctUntilChanged, map, Observable, Subject, switchMap, tap, zip } from 'rxjs';
// import { UserService } from '@auth/services/user.service';
// import isEqual from 'lodash/isEqual';
// import { ModalInfoComponent } from '@app/components/modal/modal-info/modal-info.component';
// import { NzModalService } from 'ng-zorro-antd/modal';
//
// @Component({
// 	selector: 'app-rating',
// 	templateUrl: './rating.component.html',
// 	styleUrls: ['./rating.component.scss'],
// 	changeDetection: ChangeDetectionStrategy.Default,
// })
// export class RatingComponent implements OnInit, OnDestroy {
// 	private readonly modelChanged: Subject<string> = new Subject<string>();
// 	protected rankTypes = new Observable<any>().pipe(
// 		distinctUntilChanged((prev, curr) => isEqual(prev, curr)),
// 	);
//
// 	public loading = false;
// 	public title: any;
// 	public submitted = false;
// 	public weekId!: number;
// 	public rankTypeId!: number;
// 	public total!: number;
// 	public pageSize = 6;
// 	public pageIndex = 1;
// 	public offset = 0;
// 	public selectedValue?: number;
// 	public listOfOption: Array<{ name: string; id: string }> = [];
// 	public nzFilterOption = (): boolean => true;
// 	public rateValue = {
// 		great: 4.5,
// 		good1: 4.4,
// 		good2: 4.0,
// 		bad: 3.9,
// 	};
//
// 	public ranks: Observable<any>;
// 	private getProfile$: Observable<any>;
// 	private currentUserId: any;
//
// 	public constructor(
// 		private readonly _apiService: ApiService,
// 		private readonly _userService: UserService,
// 		private readonly iconService: NzIconService,
// 		private readonly modalCreate: NzModalService,
// 		private readonly viewContainerRef: ViewContainerRef,
// 		private readonly cd: ChangeDetectorRef,
// 	) {
// 		this.iconService.addIconLiteral('ss:arrowBottom', AppIcons.arrowBottom);
// 		this.iconService.addIconLiteral('ss:calendar', AppIcons.calendar);
// 		this.iconService.addIconLiteral('ss:medalGold', AppIcons.medalGold);
// 		this.iconService.addIconLiteral('ss:medalSilver', AppIcons.medalSilver);
// 		this.iconService.addIconLiteral('ss:medalBronze', AppIcons.medalBronze);
// 		this.iconService.addIconLiteral('ss:like', AppIcons.like);
// 		this.iconService.addIconLiteral('ss:comment', AppIcons.comment);
// 		this.iconService.addIconLiteral('ss:plus', AppIcons.plus);
// 		this.iconService.addIconLiteral('ss:medal', AppIcons.medal);
// 		this.iconService.addIconLiteral('ss:openOut', AppIcons.openOut);
// 		this.iconService.addIconLiteral('ss:onePeople', AppIcons.onePeople);
// 		this.iconService.addIconLiteral('ss:twoPeople', AppIcons.twoPeople);
// 		this.iconService.addIconLiteral('ss:iconClose', AppIcons.iconClose);
// 		this.iconService.addIconLiteral('ss:attach', AppIcons.attach);
// 	}
//
// 	public ngOnInit() {
// 		// Получение пользователя для поиска
// 		this._userService
// 			.getProfile()
// 			.pipe(
// 				tap(value => {
// 					this.listOfOption.push({
// 						id: value.id.toString(),
// 						name: value.name || '',
// 					});
//
// 					this.selectedValue = value.id;
// 				}),
// 			)
// 			.subscribe();
//
// 		this.getRankTypesByWeekAndUserInit(); // Получаем текущий id пользователя обновляем типы рейтингов и подсвечиваем нужный тип
// 		this.getPartyByWeekAndRankTypeInit(); // Получам и устанавливаем участников
//
// 		// Получение последних 5 недель
// 		this.rankWeeks = this._apiService.getRankWeeks().pipe(map(({ items }) => items));
//
// 		zip(this.modelChanged)
// 			.pipe(
// 				tap(value => {
// 					if (value[0].length >= 3) {
// 						this._apiService
// 							.getUsersByFIO(value[0])
// 							.pipe(
// 								map(({ items }) => items),
// 								tap(data => {
// 									this.listOfOption = data;
// 								}),
// 							)
// 							.subscribe();
// 					}
// 				}),
// 			)
// 			.subscribe();
// 	}
//
// 	// Получаем текущий id пользователя обновляем типы рейтингов и подсвечиваем нужный тип
// 	public getRankTypesByWeekAndUserInit() {
// 		zip(this.getProfile$, this.getRankWeeks$)
// 			.pipe(
// 				map(([user, week]) => {
// 					return {
// 						...user,
// 						week: { ...week.items[0] },
// 					};
// 				}),
// 			)
// 			.subscribe(value => {
// 				this.currentUserId = value.id; // id пользователя
// 				this.weekId = value.week.id; // id недели
//
// 				// Выводим типы за первую неделю
// 				this.rankTypes = this._apiService.getRankTypes(value.week.id, value.id);
// 			});
// 	}
//
// 	getPartyByWeekAndRankTypeInit() {
// 		zip(this.getProfile$, this.getRankWeeks$)
// 			.pipe(
// 				map(([user, week]) => {
// 					return {
// 						...user,
// 						week: { ...week.items[0] },
// 					};
// 				}),
// 				switchMap(() => {
// 					return this._apiService.getRankTypes(this.weekId, this.currentUserId);
// 				}),
// 			)
// 			.subscribe(value => {
// 				this.rankTypeId = value.rankTypeId; // устанавливаем rankTypeId глобально
// 				this.ranks = this._apiService
// 					.getRank(this.weekId, this.rankTypeId, this.pageSize, 0)
// 					.pipe(
// 						tap(value => {
// 							this.pageIndex = 1;
// 							this.total = value.total;
// 							this.cd.markForCheck();
// 						}),
// 					);
// 			});
// 	}
//
// 	getPartyByWeekAndRankTypeSearch(
// 		userId: number | null,
// 		weekId: number,
// 		limit: number,
// 		Offset: number = 0,
// 	) {
// 		// Переделать
// 		zip(this.getProfile$)
// 			.pipe(
// 				map(() => {
// 					return {
// 						user: { userId },
// 					};
// 				}),
// 				switchMap(() => {
// 					return this._apiService.getRankTypes(weekId, userId);
// 				}),
// 			)
// 			.subscribe(value => {
// 				this.rankTypeId = value.rankTypeId;
//
// 				// TODO Настроить нагинацию
// 				this.ranks = this._apiService
// 					.getRank(this.weekId, this.rankTypeId, limit, Offset)
// 					.pipe(
// 						tap(value => {
// 							this.pageIndex = 1;
// 							this.total = value.total;
// 							this.cd.markForCheck();
// 						}),
// 					);
// 			});
// 	}
//
// 	getPartyByWeekAndRankTypeChangeWeek(weekId: number) {
// 		this.ranks = this._apiService.getRank(weekId, this.rankTypeId, this.pageSize, 0).pipe(
// 			tap(value => {
// 				this.pageIndex = 1;
// 				this.total = value.total;
// 				this.cd.markForCheck();
// 			}),
// 		);
// 	}
//
// 	public selectWeek(weekId: number): void {
// 		this.getPartyByWeekAndRankTypeChangeWeek(weekId);
// 		this.rankTypes = this._apiService.getRankTypes(weekId, this.currentUserId);
// 	}
//
// 	public clickByTypeRank(id: number, limit: number, $event: MouseEvent) {
// 		$event.stopPropagation();
// 		this.rankTypeId = id; // Получаем id кликнутого типа рейтига, чтобы его подсветить
//
// 		// Выводим участников по кликнутому id рейтинга и id выбранной недели при смене недели в селекте
// 		this.ranks = this._apiService.getRank(this.weekId, this.rankTypeId, this.pageSize, 0).pipe(
// 			tap(value => {
// 				this.pageIndex = 1;
// 				this.total = value.total;
// 				this.cd.markForCheck();
// 			}),
// 		);
// 	}
//
// 	public search($event: any) {
// 		this.modelChanged.next($event);
// 	}
//
// 	// При выборе пользователя
// 	onUserChange() {
// 		this.rankTypes = this._apiService.getRankTypes(this.weekId, this.selectedValue);
// 		this.getPartyByWeekAndRankTypeSearch(
// 			this.selectedValue,
// 			this.weekId,
// 			this.pageSize,
// 			this.offset,
// 		);
// 	}
//
// 	// Модальное окно раскрытой карточки
// 	public showModalOpenOut(id: number): void {
// 		this.modalCreate
// 			.create({
// 				nzClosable: false,
// 				nzFooter: null,
// 				nzTitle: 'Информация о пользователе',
// 				nzNoAnimation: false,
// 				nzWidth: '365px',
// 				nzContent: ModalInfoComponent,
// 				nzViewContainerRef: this.viewContainerRef,
// 				nzData: {
// 					data: id,
// 				},
// 			})
// 			.afterClose.subscribe();
// 	}
//
// 	nzPageIndexChange($event: number) {
// 		if ($event === 1) {
// 			this.offset = 0;
// 		} else {
// 			this.offset = this.pageSize * $event - this.pageSize;
// 		}
//
// 		this.pageIndex = $event; // Установка текущего индекса
// 		// this.getPartyByWeekAndRankTypeSearch(this.selectedValue, this.weekId, this.pageSize, this.offset);
//
// 		this.ranks = this._apiService
// 			.getRank(this.weekId, this.rankTypeId, this.pageSize, this.offset)
// 			.pipe(
// 				tap(value => {
// 					this.total = value.total;
// 					this.cd.markForCheck();
// 				}),
// 			);
// 	}
//
// 	ngOnDestroy() {
// 		// this.destroy$.next(true);
// 		this.modelChanged.complete();
// 	}
// }
