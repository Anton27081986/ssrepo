import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ColumnsStateService } from '@app/core/columns.state.service';
import { CheckFileListStateService } from '@app/pages/client-proposals-page/client-proposals/check-file-list-state.service';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { IResponse } from '@app/core/utils/response';
import { IClientOffersDto } from '@app/core/models/client-proposails/client-offers';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IDictionaryItemDto } from '@app/core/models/company/dictionary-item-dto';
import {
	ClientProposalsFacadeService,
	filterTruthy,
} from '@app/core/facades/client-proposals-facade.service';
import { switchMap } from 'rxjs/operators';
import { ClientProposalsSendCloudPopoverComponent } from '@app/pages/client-proposals-page/client-proposals-send-cloud-popover/client-proposals-send-cloud-popover.component';
import { ModalService } from '@app/core/modal/modal.service';
import { AtWorkModalComponent } from '@app/pages/client-proposals-page/at-work-modal/at-work-modal.component';
import { NoticeDialogComponent } from '@app/shared/components/notice-dialog/notice-dialog.component';
import { NotificationToastService } from '@app/core/services/notification-toast.service';
import { TooltipPosition, TooltipTheme } from '@app/shared/components/tooltip/tooltip.enums';

export interface IClientProposalsCriteriaForm {
	vgpIds: FormControl<number[] | null>;
	tgIds: FormControl<number[] | null>;
	tpgIds: FormControl<number[] | null>;
	TprFlags: FormControl<number[] | null>;
}

@UntilDestroy()
@Component({
	selector: 'app-client-proposals-card',
	templateUrl: './client-proposals-card.component.html',
	styleUrls: ['./client-proposals-card.component.scss'],
	providers: [ColumnsStateService, CheckFileListStateService],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientProposalsCardComponent {
	protected waitingForLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
	protected clientOffers$!: Observable<IResponse<IClientOffersDto>>;
	protected isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
	public blockForProposals$ = this.clientProposalsFacadeService.blockForProposalSubject$;

	public isAlterFilter$ = this.clientProposalsFacadeService.isAlterFilter$;
	public alterFilterDefenitionNote$ =
		this.clientProposalsFacadeService.alterFilterDefenitionNote$;

	public vgpQueryControl: FormControl<string | null> = new FormControl<string | null>(null);
	public tgQueryControl: FormControl<string | null> = new FormControl<string | null>(null);
	public tpgQueryControl: FormControl<string | null> = new FormControl<string | null>(null);

	protected offersItems$: BehaviorSubject<IClientOffersDto[]> = new BehaviorSubject<
		IClientOffersDto[]
	>([]);

	get vgpFormControl(): number[] {
		return this.form.controls.vgpIds.value ? this.form.controls.vgpIds.value : [];
	}

	get tgFormControl(): number[] {
		return this.form.controls.tgIds.value ? this.form.controls.tgIds.value : [];
	}

	get tpgFormControl(): number[] {
		return this.form.controls.tpgIds.value ? this.form.controls.tpgIds.value : [];
	}

	get TprFlagsFormControl(): number[] {
		return this.form.controls.TprFlags.value ? this.form.controls.TprFlags.value : [];
	}

	get isDisabledButton(): boolean {
		if (this.clientProposalsFacadeService.blockForProposalSubject$.value) {
			return true;
		}

		return !this.form.valid;
	}

	get canTakeWork(): boolean {
		return this.clientProposalsFacadeService.canTakeWork;
	}

	protected readonly form: FormGroup<IClientProposalsCriteriaForm> = this.buildForm();

	private clientId: number | null = null;

	protected productionOptionsTg$: Observable<IDictionaryItemDto[]>;
	protected productionOptionsVgp$: Observable<IDictionaryItemDto[]>;
	protected productionOptionsTpg$: Observable<IDictionaryItemDto[]>;
	protected productionOptionsSign$: Observable<IDictionaryItemDto[]>;

	constructor(
		protected readonly clientProposalsFacadeService: ClientProposalsFacadeService,
		protected readonly checkListStateService: CheckFileListStateService,
		private readonly modalService: ModalService,
		private readonly notificationToastService: NotificationToastService,
	) {
		this.clientProposalsFacadeService.clientId$
			.pipe(untilDestroyed(this))
			.subscribe(clientId => {
				this.clientId = clientId;
			});

		this.productionOptionsVgp$ = this.vgpQueryControl.valueChanges.pipe(
			filterTruthy(),
			switchMap(val => {
				return this.clientProposalsFacadeService.getProduction(val).pipe(
					untilDestroyed(this),
					filterTruthy(),
					map(val => {
						return val.items;
					}),
				);
			}),
		);

		this.productionOptionsTg$ = this.tgQueryControl.valueChanges.pipe(
			filterTruthy(),
			switchMap(val => {
				return this.clientProposalsFacadeService.getTgSearch(val).pipe(
					untilDestroyed(this),
					filterTruthy(),
					map(val => {
						return val.items;
					}),
				);
			}),
		);

		this.productionOptionsTpg$ = this.tpgQueryControl.valueChanges.pipe(
			filterTruthy(),
			switchMap(val => {
				return this.clientProposalsFacadeService.getTpgSearch(val).pipe(
					untilDestroyed(this),
					filterTruthy(),
					map(val => {
						return val.items;
					}),
				);
			}),
		);

		this.productionOptionsSign$ = this.clientProposalsFacadeService.getSignVgpSearch().pipe(
			map(values => {
				return values.items;
			}),
		);
	}

	private buildForm(): FormGroup<IClientProposalsCriteriaForm> {
		return new FormGroup<IClientProposalsCriteriaForm>({
			vgpIds: new FormControl<number[] | null>(
				{ value: null, disabled: false },
				Validators.required,
			),
			tpgIds: new FormControl<number[] | null>({ value: null, disabled: false }),
			tgIds: new FormControl<number[] | null>({ value: null, disabled: false }),
			TprFlags: new FormControl<number[] | null>({ value: null, disabled: false }),
		});
	}

	protected openPopoverSendToTheCloud(url: string) {
		this.modalService.open(ClientProposalsSendCloudPopoverComponent, { data: { url } });
	}

	protected saveInCloud() {
		const files = this.checkListStateService.checkFiles$.value;

		if (files.length) {
			this.clientProposalsFacadeService
				.saveInCloud(files, true)
				.pipe(untilDestroyed(this))
				.subscribe(url => {
					this.openPopoverSendToTheCloud(url.shareLink);
				});
		}
	}

	protected submit() {
		this.checkListStateService.checkFiles$.next([]);

		if (this.form.valid && !this.clientProposalsFacadeService.blockForProposalSubject$.value) {
			this.clientOffers$ = this.clientProposalsFacadeService.clientId$.pipe(
				filterTruthy(),
				tap(() => this.isLoading$.next(true)),
				switchMap(clientId => {
					return this.clientProposalsFacadeService.getClientOffers({
						clientId,
						productionIds: this.vgpFormControl,
						TovGroups: this.tgFormControl,
						TovSubGroups: this.tpgFormControl,
						TprFlags: this.TprFlagsFormControl,
					});
				}),
				tap(value => {
					this.offersItems$.next(value.items);
					if (value.total) {
						if (this.canTakeWork) {
							this.clientProposalsFacadeService.blockForProposalSubject$.next(true);
						}

						if (!localStorage.getItem('warningClientProposalsBool')) {
							this.modalService
								.open(NoticeDialogComponent, {
									data: {
										header: 'Предложение сформировано',
										text:
											'Каждый раз после получения рекомендаций \n' +
											'необходимо брать в работу хотя бы одну из ТПР  \n' +
											'для дальнейшего продвижения.',
										type: 'Warning',
									},
								})
								.afterClosed()
								.pipe(untilDestroyed(this))
								.subscribe(() => {
									localStorage.setItem('warningClientProposalsBool', 'true');
								});
						}
					}

					this.isLoading$.next(false);
				}),
			);
		}
	}

	protected saveFiles() {
		if (this.checkListStateService.checkFiles$.value.length && !this.waitingForLoading$.value) {
			this.clientProposalsFacadeService
				.saveInCloud(this.checkListStateService.checkFiles$.value, false)
				.pipe(
					untilDestroyed(this),
					filterTruthy(),
					map(url => {
						this.waitingForLoading$.next(true);

						return this.clientProposalsFacadeService.getFiles(url.shareLink);
					}),
					switchMap(data => {
						return data;
					}),
					untilDestroyed(this),
				)
				.subscribe(blob => {
					this.waitingForLoading$.next(false);
					const fileURL = window.URL.createObjectURL(blob);
					const link = document.createElement('a');

					link.href = fileURL;
					link.click();

					window.URL.revokeObjectURL(fileURL);
					this.waitingForLoading$.next(false);
				});
		}
	}

	getTooltipButton(): string | null {
		if (this.clientProposalsFacadeService.blockForProposalSubject$.value) {
			return 'Необходимо взять в работу предложение';
		}

		if (!this.form.valid) {
			return 'Заполните необходимое поле ВГП';
		}

		return null;
	}

	protected openAtWorkModal(items: IClientOffersDto[]) {
		this.modalService
			.open(AtWorkModalComponent, {
				data: {
					items,
					clientId: this.clientId,
				},
			})
			.afterClosed()
			.pipe(untilDestroyed(this))
			.subscribe(status => {
				if (status) {
					this.clientProposalsFacadeService.blockForProposalSubject$.next(false);
					this.notificationToastService.addToast('Задачи успешно созданы', 'ok');
				}
			});
	}

	protected readonly TooltipTheme = TooltipTheme;
	protected readonly TooltipPosition = TooltipPosition;
}
