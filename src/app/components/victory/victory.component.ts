import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	ElementRef,
	OnInit,
	ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { map, Observable, Subject, tap, zip } from 'rxjs';
import { NzModalService } from 'ng-zorro-antd/modal';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { VictoryService } from '@app/components/victory/victory.service';
import { WinsApiService } from '@app/core/api/wins-api.service';
import { UsersApiService } from '@app/core/api/users-api.service';

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

	public partyWinSelectedTags: Array<{ name: string; id: number }> = [];
	public tprSelectedTags: Array<{ name: string; id: number }> = [];
	public userWinArray: string[] = [];
	public tprWinArray: string[] = [];
	public selectedUser!: string;
	public selectedTpr!: string;

	public listColleague: Array<{ name: string; id: string }> = [];
	public listTPR: Array<{ name: string; id: string }> = [];

	public constructor(
		private readonly apiService: WinsApiService,
		private readonly usersApiService: UsersApiService,
		private readonly _victoryService: VictoryService,
		private readonly formBuilder: FormBuilder,
		public modal: NzModalService,
		private readonly cd: ChangeDetectorRef,
	) {}

	public get comment() {
		return this.addVictoryForm.get('comment');
	}

	public getWinList() {
		this.winsList = this.apiService.getWins(this.pageSize, this.offset);
	}

	public ngOnInit() {
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
						this.usersApiService
							.getUsersByFIO(value[0])
							.pipe(
								map(({ items }) => items),
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
								map(({ items }) => items),
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
			.pipe(map(({ isExtendedMode }) => isExtendedMode))
			.subscribe(value => {
				this.getExtendedMode = value;
			});

		this.apiService
			.getWins(this.pageSize, this.offset)
			.pipe(
				untilDestroyed(this),
				map(({ total }) => total),
				tap(value => {
					this.total = value;
				}),
			)
			.subscribe();

		this.winsUrl = this.apiService.getWins(this.pageSize, this.offset);
		this.winsGroupsList = this.apiService.getWinsGroups().pipe(map(({ items }) => items));

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
	public onUserChange() {
		this.userWinArray.push(this.selectedUser); // Выбранные пользователи
		this.usersApiService
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
	public onTprChange() {
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

	public searchUsers($event: any) {
		this.modelChangedColleague.next($event);
	}

	public searchTpr($event: any) {
		this.modelChangedTpr.next($event);
	}

	public nzPageIndexChange($event: number) {
		if ($event === 1) {
			this.offset = 0;
		} else {
			this.offset = this.pageSize * $event - this.pageSize;
		}

		this.pageIndex = $event; // Установка текущего индекса

		this.updateWinList();
	}

	public updateWinList() {
		this.winsList = this.apiService.getWins(this.pageSize, this.offset).pipe(
			tap(_ => {
				this.cd.markForCheck();
			}),
		);
	}

	public deleteTagUser(i: number) {
		this.partyWinSelectedTags.splice(i, 1);
		this.cd.markForCheck();
	}

	public deleteTagTpr(i: number) {
		this.tprSelectedTags.splice(i, 1);
	}
}
