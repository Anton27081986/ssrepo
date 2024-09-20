import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { IClientOffersDto } from '@app/core/models/client-proposails/client-offers';
import { IResponse } from '@app/core/utils/response';
import { ColumnsStateService } from '@app/core/columns.state.service';
import { IStoreTableBaseColumn } from '@app/core/store';
import { ClientProposalsRowItemField } from '@app/pages/client-proposals-page/client-proposals-row-item-tr/client-proposals-row-item-tr.component';
import { filterTruthy } from '@app/core/facades/client-proposals-facade.service';
import { BehaviorSubject, map } from 'rxjs';

export enum StateTableProposals {
	default = 0,
	notData = 1,
	loader = 2,
	data = 3,
}

@UntilDestroy()
@Component({
	selector: 'app-client-proposals-table-vgp',
	templateUrl: './client-proposals-table-vgp.component.html',
	styleUrls: ['./client-proposals-table-vgp.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientProposalsTableVgpComponent implements OnChanges {
	@Input() public clientId: number | null = null;
	@Input() public clientOffers: IResponse<IClientOffersDto> | null = null;
	@Input() public isLoading: boolean = false;

	public readonly tableStateProposals$: BehaviorSubject<StateTableProposals> =
		new BehaviorSubject<StateTableProposals>(StateTableProposals.default);

	public readonly clientOffers$: BehaviorSubject<IResponse<IClientOffersDto> | null> =
		new BehaviorSubject<IResponse<IClientOffersDto> | null>(null);

	public readonly isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

	public constructor(protected readonly _columnState: ColumnsStateService) {
		this._columnState.cols$.next(this.defaultCols);

		this.clientOffers$
			.pipe(
				untilDestroyed(this),
				filterTruthy(),
				map(value => {
					if (value.total > 0) {
						return StateTableProposals.data;
					}

					if (value.total === 0) {
						return StateTableProposals.notData;
					}

					return StateTableProposals.default;
				}),
			)
			.subscribe(this.tableStateProposals$);

		this.isLoading$.pipe(untilDestroyed(this)).subscribe(val => {
			if (val) {
				this.tableStateProposals$.next(StateTableProposals.loader);
			}
		});
	}

	public ngOnChanges(changes: SimpleChanges) {
		if (changes.clientOffers) {
			this.clientOffers$.next(changes.clientOffers.currentValue);
		}

		if (changes.isLoading) {
			this.isLoading$.next(changes.isLoading.currentValue);
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
	protected readonly StateTableProposals = StateTableProposals;
}
