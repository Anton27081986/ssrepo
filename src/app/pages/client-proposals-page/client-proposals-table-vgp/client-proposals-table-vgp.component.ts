import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Component, Input } from '@angular/core';
import { ClientProposalsSendCloudPopoverComponent } from '@app/pages/client-proposals-page/client-proposals-send-cloud-popover/client-proposals-send-cloud-popover.component';
import { ModalService } from '@app/core/modal/modal.service';
import {
	ClientProposalsFacadeService,
	filterTruthy,
} from '@app/core/facades/client-proposals-facade.service';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { IClientOffersDto } from '@app/core/models/client-proposails/client-offers';
import { IResponse } from '@app/core/utils/response';
import { ColumnsStateService } from '@app/core/columns.state.service';
import { IStoreTableBaseColumn } from '@app/core/store';
import { ClientProposalsRowItemField } from '@app/pages/client-proposals-page/client-proposals-row-item-tr/client-proposals-row-item-tr.component';
import { CheckFileListStateService } from '@app/pages/client-proposals-page/client-proposals-table-vgp/check-file-list-state.service';
import { HttpClient } from '@angular/common/http';
import { switchMap } from 'rxjs/operators';
import { IDictionaryItemDto } from '@app/core/models/company/dictionary-item-dto';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AtWorkModalComponent } from '@app/pages/client-proposals-page/at-work-modal/at-work-modal.component';
import { DialogComponent } from '@app/shared/components/dialog/dialog.component';

export interface IClientProposalsCriteriaForm {
	vgpIds: FormControl<number[] | null>;
	tgIds: FormControl<number[] | null>;
	tpgIds: FormControl<number[] | null>;
	TprFlags: FormControl<number[] | null>;
}

@UntilDestroy()
@Component({
	selector: 'app-client-proposals-table-vgp',
	templateUrl: './client-proposals-table-vgp.component.html',
	styleUrls: ['./client-proposals-table-vgp.component.scss'],
	providers: [ColumnsStateService, CheckFileListStateService],
})
export class ClientProposalsTableVgpComponent {
	@Input() public clientId: number | null = null;

	protected waitingForLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
	protected clientOffers$!: Observable<IResponse<IClientOffersDto>>;
	protected isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
	public blockForProposals$ = this.clientProposalsFacadeService.blockForProposalSubject$;

	public vgpQueryControl: FormControl<string | null> = new FormControl<string | null>(null);
	public tgQueryControl: FormControl<string | null> = new FormControl<string | null>(null);
	public tpgQueryControl: FormControl<string | null> = new FormControl<string | null>(null);

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

	protected readonly form: FormGroup<IClientProposalsCriteriaForm> = this.buildForm();

	protected productionOptionsTg$: Observable<IDictionaryItemDto[]>;
	protected productionOptionsVgp$: Observable<IDictionaryItemDto[]>;
	protected productionOptionsTpg$: Observable<IDictionaryItemDto[]>;
	protected productionOptionsSign$: Observable<IDictionaryItemDto[]>;

	public constructor(
		private readonly modalService: ModalService,
		private readonly clientProposalsFacadeService: ClientProposalsFacadeService,
		protected readonly _columnState: ColumnsStateService,
		protected readonly checkListStateService: CheckFileListStateService,
		protected readonly http: HttpClient,
	) {
		this._columnState.cols$.next(this.defaultCols);

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
					this.isLoading$.next(false);
					if (value.total) {
						this.clientProposalsFacadeService.blockForProposalSubject$.next(true);
						if (!localStorage.getItem('warningClientProposalsBool')) {
							this.modalService
								.open(DialogComponent, {
									data: {
										text:
											'Каждый раз после получения рекомендаций \n' +
											'необходимо брать в работу хотя бы одну из ТПР  \n' +
											'для дальнейшего продвижения.',
										oneButton: true,
									},
								})
								.afterClosed()
								.pipe(untilDestroyed(this))
								.subscribe(() => {
									localStorage.setItem('warningClientProposalsBool', 'true');
								});
						}
					}
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

	public readonly defaultCols: IStoreTableBaseColumn[] = [
		{
			id: ClientProposalsRowItemField.vgp,
			title: 'ВГП',
			order: 1,
			show: true,
			width: null,
		},
		{
			id: ClientProposalsRowItemField.tg,
			title: 'ТГ',
			order: 2,
			show: true,
			width: null,
		},
		{
			id: ClientProposalsRowItemField.tpg,
			title: 'ТПГ',
			order: 3,
			show: true,
			width: null,
		},
		{
			id: ClientProposalsRowItemField.tpr,
			title: 'ТПР',
			order: 4,
			show: true,
			width: null,
		},
		{
			id: ClientProposalsRowItemField.countKA,
			title: 'Кол-во КА с продажами ТПР',
			order: 5,
			show: true,
			width: null,
		},
		{
			id: ClientProposalsRowItemField.volumeOfSales,
			title: 'Объём продаж ТПР, тн/год',
			order: 6,
			show: true,
			width: null,
		},

		{
			id: ClientProposalsRowItemField.ratingTpr,
			title: 'Рейтинг ТПР',
			order: 7,
			show: true,
			width: null,
			toolTip:
				'(ТПР имеет эффективное решение +1) * ' +
				'Сумма заказов за полгода * Количество клиентов с продажами ТПР ' +
				'за полгода * Фактический средний доход за полгода / 1000000',
		},
		{
			id: ClientProposalsRowItemField.price,
			title: 'Цена прайса, руб',
			order: 8,
			show: true,
			width: '100px',
			toolTip: 'Цена прайса, руб - Склад Союзснаб, прайс Союзснаб, предоплата',
		},
		{
			id: ClientProposalsRowItemField.advantagesTpr,
			title: 'Преимущества ТПР',
			order: 9,
			show: true,
			width: '400px',
		},
		{
			id: ClientProposalsRowItemField.rim,
			title: 'РИМ',
			order: 10,
			show: true,
			width: null,
		},
		{
			id: ClientProposalsRowItemField.documents,
			title: 'Документы',
			order: 11,
			show: true,
			width: null,
		},
	];

	protected openAtWorkModal(clientId: number, items: IClientOffersDto[]) {
		this.modalService.open(AtWorkModalComponent, {
			data: {
				clientId,
				items,
			},
		});
	}
}
