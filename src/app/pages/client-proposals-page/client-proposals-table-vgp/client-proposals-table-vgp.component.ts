import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { IFilterOption } from '@app/shared/components/filters/filters.component';
import { ClientProposalsSendCloudPopoverComponent } from '@app/pages/client-proposals-page/client-proposals-send-cloud-popover/client-proposals-send-cloud-popover.component';
import { ModalService } from '@app/core/modal/modal.service';
import {
	ClientProposalsFacadeService,
	filterTruthy,
} from '@app/core/facades/client-proposals-facade.service';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { IClientOffersDto } from '@app/core/models/client-proposails/client-offers';
import { IResponse } from '@app/core/utils/response';
import { ColumnsStateService } from '@app/core/columns.state.service';
import { IStoreTableBaseColumn } from '@app/core/store';
import { ClientProposalsRowItemField } from '@app/pages/client-proposals-page/client-proposals-row-item-tr/client-proposals-row-item-tr.component';
import { CheckFileListStateService } from '@app/pages/client-proposals-page/client-proposals-table-vgp/check-file-list-state.service';
import { HttpClient } from '@angular/common/http';
import { switchMap } from 'rxjs/operators';

@UntilDestroy()
@Component({
	selector: 'app-client-proposals-table-vgp',
	templateUrl: './client-proposals-table-vgp.component.html',
	styleUrls: ['./client-proposals-table-vgp.component.scss'],
	providers: [ColumnsStateService, CheckFileListStateService],
})
export class ClientProposalsTableVgpComponent implements OnInit, OnChanges {
	protected productionIds$: BehaviorSubject<number[]> = new BehaviorSubject<number[]>([]);
	protected waitingForLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
	private productionIds: number[] = [];
	private readonly urlInCloud$: BehaviorSubject<null | string> = new BehaviorSubject<
		null | string
	>(null);

	@Input() public clientId: number | null = null;

	protected clientOffers$: Observable<IResponse<IClientOffersDto>> | undefined;

	public constructor(
		private readonly modalService: ModalService,
		private readonly clientProposalsFacadeService: ClientProposalsFacadeService,
		protected readonly _columnState: ColumnsStateService,
		protected readonly checkListStateService: CheckFileListStateService,
		protected readonly http: HttpClient,
	) {
		this._columnState.cols$.next(this.defaultCols);
	}

	public ngOnInit() {
		this.productionIds$.pipe(untilDestroyed(this)).subscribe(ids => {
			if (ids.length && this.clientId) {
				this.clientOffers$ = this.clientProposalsFacadeService.getClientOffers({
					clientId: this.clientId,
					productionIds: ids,
				});
			}
		});
	}

	protected getSelected(event: IFilterOption[]) {
		if (event.length) {
			this.productionIds = event.map(item => {
				return item.id;
			});
		} else {
			this.productionIds = [];
		}
	}

	protected openPopoverSendToTheCloud(url: string) {
		this.modalService.open(ClientProposalsSendCloudPopoverComponent, { data: { url } });
	}

	protected saveInCloud() {
		const files = this.checkListStateService.checkFiles$.value;

		if (files.length) {
			this.clientProposalsFacadeService
				.saveInCloud(files)
				.pipe(untilDestroyed(this))
				.subscribe(url => {
					this.openPopoverSendToTheCloud(url.shareLink);
				});
		}
	}

	protected submit() {
		this.checkListStateService.checkFiles$.next([]);
		this.productionIds$.next(this.productionIds);
	}

	public ngOnChanges(changes: SimpleChanges) {
		if (changes.clientId) {
			this.ngOnInit();
		}
	}

	protected getUrlFile() {
		this.clientProposalsFacadeService
			.saveInCloud(this.checkListStateService.checkFiles$.value)
			.pipe(untilDestroyed(this))
			.subscribe(val => {
				this.urlInCloud$.next(val.shareLink);
			});
	}

	protected saveFiles() {
		if (this.checkListStateService.checkFiles$.value.length) {
			if (!this.urlInCloud$.value) {
				this.getUrlFile();
			}

			this.urlInCloud$
				.pipe(
					filterTruthy(),
					map(url => {
						this.waitingForLoading$.next(true);

						return this.clientProposalsFacadeService.getFiles(url);
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
			width: null,
			toolTip: 'Цена прайса, руб - Склад Союзснаб, прайс Союзснаб, предоплата',
		},
		{
			id: ClientProposalsRowItemField.advantagesTpr,
			title: 'Преимущества ТПР',
			order: 9,
			show: true,
			width: '500px',
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
}
