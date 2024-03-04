import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	OnInit,
	ViewContainerRef,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime, filter, map, Observable, Subject, tap } from 'rxjs';
import { CommentsModalComponent } from '@app/components/modal/comments-modal/comments-modal.component';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ICreateThanksColleagueRequest } from '@app/components/thank-colleague/models/create-thanks-colleague-request';
import { ModalInfoComponent } from '@app/components/modal/modal-info/modal-info.component';
import { UserProfileStoreService } from '@app/core/states/user-profile-store.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { catchError, switchMap } from 'rxjs/operators';
import { UsersApiService } from '@app/core/api/users-api.service';
import { WinsApiService } from '@app/core/api/wins-api.service';
import { ThanksColleagueApiService } from '@app/core/api/thanks-colleague-api.service';

@UntilDestroy()
@Component({
	selector: 'app-thanks-colleague',
	templateUrl: './thanks-colleague.component.html',
	styleUrls: ['./thanks-colleague.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThanksColleagueComponent implements OnInit {
	public date: any;
	public isModalVisible = false;
	public thankColleagueForm!: FormGroup;
	public loading = false;
	public submitted = false;
	public isConfirmLoading = false;
	public thankColleagueList!: Observable<any>;
	public pageSize = 6;
	public pageIndex = 1;
	public offset = 0;
	public currentUserId: any;
	public getExtendedMode!: boolean;

	private readonly modelChanged: Subject<string> = new Subject<string>();

	public listOfOption: Array<{ name: string; id: string }> = [];

	public nzFilterOption = (): boolean => true;
	public total!: number;

	public constructor(
		private readonly apiService: UsersApiService,
		private readonly formBuilder: FormBuilder,
		public modalCreateService: NzModalService,
		private readonly viewContainerRef: ViewContainerRef,
		private readonly cdr: ChangeDetectorRef,
		private readonly userProfileStore: UserProfileStoreService,
		private readonly winsApiService: WinsApiService,
		private readonly thanksColleaguesApi: ThanksColleagueApiService,
	) {}

	public ngOnInit() {
		this.modelChanged
			.pipe(
				debounceTime(300),
				filter(value => value.length >= 3),
				switchMap(value =>
					this.apiService.getUsersByFIO(value).pipe(
						catchError((error: unknown) => {
							console.error('Ошибка при получении данных', error);

							return [];
						}),
					),
				),
				tap(({ items }) => {
					this.listOfOption = items;
				}),
				untilDestroyed(this),
			)
			.subscribe();

		this.userProfileStore.userProfile$
			.pipe(
				filter(profile => profile !== null),
				untilDestroyed(this),
			)
			.subscribe(profile => {
				if (profile) {
					this.currentUserId = profile.id;
				}
			});

		this.loadAllThanksForColleagues(this.pageSize, this.offset);

		this.winsApiService
			.getWins(this.pageSize, this.offset)
			.pipe(
				map(({ isExtendedMode }) => isExtendedMode),
				untilDestroyed(this),
			)
			.subscribe(value => {
				this.getExtendedMode = value;
			});

		this.thankColleagueForm = this.formBuilder.group({
			name: ['', [Validators.required]],
			comment: ['', [Validators.required]],
		});
	}

	public get name() {
		return this.thankColleagueForm.get('name');
	}

	public get comment() {
		return this.thankColleagueForm.get('comment');
	}

	public loadAllThanksForColleagues(pageSize: number, offset: number) {
		// eslint-disable-next-line no-return-assign
		this.thankColleagueList = this.thanksColleaguesApi
			.getThanksColleagueList(pageSize, offset)
			.pipe(
				tap(value => {
					this.total = value.total;
				}),
				map(({ items }) => items),
			);
	}

	public createThanksForColleague() {
		this.submitted = true;

		if (this.thankColleagueForm.invalid) {
			return;
		}

		this.loading = true;
	}

	public deleteThanksForColleague(thanks: any): void {
		this.thanksColleaguesApi
			.deleteThanksColleague(thanks.id)
			.pipe(untilDestroyed(this))
			.subscribe({
				next: () => {
					this.loadAllThanksForColleagues(this.pageSize, this.offset);
					this.cdr.detectChanges();
				},
				error: (error: unknown) => console.error('Ошибка при удалении спасибо', error),
			});
	}

	// Модальное окно комментариев
	public showModalComments(item: any, type: number): void {
		this.modalCreateService
			.create({
				nzClosable: true,
				nzFooter: null,
				nzTitle: `Благодарность № ${item.id}`,
				nzNoAnimation: false,
				nzWidth: '560px',
				nzContent: CommentsModalComponent,
				nzViewContainerRef: this.viewContainerRef,
				nzData: {
					data: item,
					type,
				},
			})
			.afterClose.pipe(untilDestroyed(this))
			.subscribe(() => {
				this.loadAllThanksForColleagues(this.pageSize, this.offset);
				this.cdr.detectChanges();
			});
	}

	// Модальное окно раскрытой карточки
	public showModalOpenOut(id: number): void {
		this.modalCreateService
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

	public showModal(): void {
		this.isModalVisible = true;
	}

	public handleOk(): void {
		if (this.thankColleagueForm.valid) {
			const toUserId = this.thankColleagueForm.value.name;
			const note = this.thankColleagueForm.value.comment;
			const createThanksRequest: ICreateThanksColleagueRequest = {
				userId: toUserId,
				note,
			};

			this.thanksColleaguesApi
				.addThanksColleague(createThanksRequest)
				.pipe(untilDestroyed(this))
				.subscribe({
					next: _ => {
						this.loadAllThanksForColleagues(this.pageSize, this.offset);
					},
					error: (error: unknown) =>
						console.error('Ошибка при добавлении спасибо', error),
				});
			this.thankColleagueForm.reset();
		}

		this.isModalVisible = false;
	}

	public handleCancel(): void {
		this.thankColleagueForm.reset();
		this.isModalVisible = false;
	}

	public search($event: any) {
		this.modelChanged.next($event);
	}

	public nzPageIndexChange($event: number) {
		if ($event === 1) {
			this.offset = 0;
		} else {
			this.offset = this.pageSize * $event - this.pageSize;
		}

		this.pageIndex = $event; // Установка текущего индекса

		this.loadAllThanksForColleagues(this.pageSize, this.offset);
	}
}
