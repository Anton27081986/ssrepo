import { UntilDestroy } from '@ngneat/until-destroy';
import { Component, Input, OnInit } from '@angular/core';
import { IFilterOption } from '@app/shared/components/filters/filters.component';
import { ClientProposalsSendCloudPopoverComponent } from '@app/pages/client-proposals-page/client-proposals-send-cloud-popover/client-proposals-send-cloud-popover.component';
import { ModalService } from '@app/core/modal/modal.service';
import { ClientProposalsFacadeService } from '@app/core/facades/client-proposals-facade.service';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { IClientOffersDto } from '@app/core/models/client-proposails/client-offers';
import { IResponse } from '@app/core/utils/response';
import { ColumnsStateService } from '@app/core/columns.state.service';
import { IStoreTableBaseColumn } from '@app/core/store';
import { ClientProposalsRowItemField } from '@app/pages/client-proposals-page/client-proposals-row-item-tr/client-proposals-row-item-tr.component';

@UntilDestroy()
@Component({
	selector: 'app-client-proposals-table-vgp',
	templateUrl: './client-proposals-table-vgp.component.html',
	styleUrls: ['./client-proposals-table-vgp.component.scss'],
	providers: [ColumnsStateService],
})
export class ClientProposalsTableVgpComponent {
	protected productionIds$: BehaviorSubject<number[]> = new BehaviorSubject<number[]>([]);
	private productionIds: number[] = [];
	@Input() clientId: number | null = null;

	protected clientOffers$: Observable<IResponse<IClientOffersDto>> | undefined;

	private subscription: Subscription = new Subscription();

	constructor(
		private readonly modalService: ModalService,
		private readonly clientProposalsFacadeService: ClientProposalsFacadeService,
		protected readonly _columnState: ColumnsStateService,
	) {
		this._columnState.cols$.next(this.defaultCols);
		this.subscription.add(
			this.productionIds$.subscribe(ids => {
				if (ids.length && this.clientId) {
					this.clientOffers$ = this.clientProposalsFacadeService.getClientOffers({
						clientId: this.clientId,
						productionIds: ids,
					});
				}
			}),
		);
	}

	protected getSelected(event: IFilterOption[]) {
		if (event.length) {
			const ids: number[] = event.map(item => {
				return item.id;
			});

			this.productionIds = ids;
		} else {
			this.productionIds = [];
		}
	}

	protected openPopoverSendToTheCloud() {
		this.modalService.open(ClientProposalsSendCloudPopoverComponent, {});
	}

	protected submit() {
		this.productionIds$.next(this.productionIds);
	}

	public readonly defaultCols: IStoreTableBaseColumn[] = [
		{
			id: ClientProposalsRowItemField.vgp,
			title: 'ВГП',
			order: 1,
			show: true,
		},
		{
			id: ClientProposalsRowItemField.tg,
			title: 'ТГ',
			order: 2,
			show: true,
			width: '140px',
			align: 'center',
		},
		{
			id: ClientProposalsRowItemField.tpg,
			title: 'ТПГ',
			order: 3,
			show: true,
			width: '140px',
			align: 'center',
		},
		{
			id: ClientProposalsRowItemField.tpr,
			title: 'ТПР',
			order: 4,
			show: true,
			width: '140px',
			align: 'center',
		},
		{
			id: ClientProposalsRowItemField.countKA,
			title: 'Количество КА с продажами ТПР',
			order: 5,
			show: true,
			width: '100%',
			align: 'center',
		},
		{
			id: ClientProposalsRowItemField.volumeOfSales,
			title: 'Объём продаж, тн/год',
			order: 6,
			show: true,
		},
		{
			id: ClientProposalsRowItemField.ratingTpr,
			title: 'Рейтинг ТПР',
			order: 7,
			show: true,
		},
		{
			id: ClientProposalsRowItemField.price,
			title: 'Цена прайса, руб',
			order: 8,
			show: true,
		},
		{
			id: ClientProposalsRowItemField.advantagesTpr,
			title: 'Преимущества ТПР',
			order: 9,
			show: true,
		},
		{
			id: ClientProposalsRowItemField.rim,
			title: 'РИМ',
			order: 10,
			show: true,
		},
		{
			id: ClientProposalsRowItemField.documents,
			title: 'Документы',
			order: 11,
			show: true,
		},
	];
}
