import { UntilDestroy } from '@ngneat/until-destroy';
import {
	ChangeDetectionStrategy,
	Component,
	computed,
	input,
	InputSignal,
	Signal,
} from '@angular/core';
import { IClientOffersDto } from '@app/core/models/client-proposails/client-offers';
import { ColumnsStateService } from '@app/core/columns.state.service';
import { ITrTableBaseColumn } from '@app/core/store';
import {
	ClientProposalsRowItemField,
	ClientProposalsRowItemTrComponent,
} from '@app/pages/client-proposals-page/client-proposals-row-item-tr/client-proposals-row-item-tr.component';
import { ResponseProposals } from '@app/core/utils/response-proposals';
import { TableV2Component } from '@app/shared/components/ss-table-v2/ss-table-v2.component';
import { IconComponent } from '@app/shared/components/icon/icon.component';
import { HeadlineComponent } from '@app/shared/components/typography/headline/headline.component';
import { LoaderComponent } from '@app/shared/components/loader/loader.component';
import {
	CommonModule,
	NgForOf,
	NgIf,
	NgSwitch,
	NgSwitchCase,
	NgTemplateOutlet,
} from '@angular/common';

export enum StateTableProposals {
	default = 0,
	alterSearch = 1,
	notData = 2,
	loader = 3,
	data = 4,
}

@UntilDestroy()
@Component({
	selector: 'app-client-proposals-table-vgp',
	templateUrl: './client-proposals-table-vgp.component.html',
	styleUrls: ['./client-proposals-table-vgp.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		CommonModule,
		TableV2Component,
		IconComponent,
		HeadlineComponent,
		LoaderComponent,
		NgForOf,
		NgIf,
		NgSwitch,
		NgSwitchCase,
		NgTemplateOutlet,
		ClientProposalsRowItemTrComponent,
	],
	standalone: true,
})
export class ClientProposalsTableVgpComponent {
	public readonly clientOffers: InputSignal<ResponseProposals<IClientOffersDto> | null> =
		input.required<ResponseProposals<IClientOffersDto> | null>();

	public readonly isLoading: InputSignal<boolean> = input.required<boolean>();

	public readonly defaultStateTable: InputSignal<boolean> =
		input.required<boolean>();

	public readonly tableState: Signal<StateTableProposals> = computed(() => {
		if (this.isLoading()) {
			return this.StateTableProposals.loader;
		}

		if (this.defaultStateTable()) {
			return StateTableProposals.default;
		}

		const clientOffers = this.clientOffers();

		if (clientOffers) {
			if (clientOffers.isAlterFilter) {
				return StateTableProposals.alterSearch;
			}

			if (clientOffers.total > 0) {
				return StateTableProposals.data;
			}

			if (clientOffers.total === 0 && !clientOffers.isAlterFilter) {
				return StateTableProposals.notData;
			}
		}

		return StateTableProposals.default;
	});

	protected defaultCols: ITrTableBaseColumn[] = [
		{
			cols: [
				{
					id: ClientProposalsRowItemField.vgp,
					title: 'ВГП',
					order: 1,
					show: true,
					width: null,
					colspan: 1,
					rowspan: 1,
					display: true,
				},
				{
					id: ClientProposalsRowItemField.tg,
					title: 'ТГ',
					order: 2,
					show: true,
					width: null,
					colspan: 1,
					rowspan: 1,
					display: true,
				},
				{
					id: ClientProposalsRowItemField.tpg,
					title: 'ТПГ',
					order: 3,
					show: true,
					width: null,
					colspan: 1,
					rowspan: 1,
					display: true,
				},
				{
					id: ClientProposalsRowItemField.tpr,
					title: 'ТПР',
					order: 4,
					show: true,
					width: null,
					colspan: 1,
					rowspan: 1,
					display: true,
				},
				{
					id: ClientProposalsRowItemField.countKA,
					title: 'Кол-во клиентов с продажами ТПР',
					order: 5,
					show: true,
					width: null,
					colspan: 1,
					rowspan: 1,
					display: true,
				},
				{
					id: ClientProposalsRowItemField.volumeOfSales,
					title: 'Объём продаж ТПР, тн/год',
					order: 6,
					show: true,
					width: null,
					colspan: 1,
					rowspan: 1,
					display: true,
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
					colspan: 1,
					rowspan: 1,
					display: true,
				},
				{
					id: ClientProposalsRowItemField.price,
					title: 'Цена прайса, руб',
					order: 8,
					show: true,
					width: '100px',
					toolTip:
						'Цена прайса, руб - Склад Союзснаб, прайс Союзснаб, предоплата',
					colspan: 1,
					rowspan: 1,
					display: true,
				},
				{
					id: ClientProposalsRowItemField.advantagesTpr,
					title: 'Преимущества ТПР',
					order: 9,
					show: true,
					width: '400px',
					colspan: 1,
					rowspan: 1,
					display: true,
				},
				{
					id: ClientProposalsRowItemField.rim,
					title: 'РИМ',
					order: 10,
					show: true,
					width: null,
					colspan: 1,
					rowspan: 1,
					display: true,
				},
				{
					id: ClientProposalsRowItemField.documents,
					title: 'Документы',
					order: 11,
					show: true,
					width: null,
					colspan: 1,
					rowspan: 1,
					display: true,
				},
			],
		},
	];

	protected readonly StateTableProposals = StateTableProposals;
	constructor(protected readonly _columnState: ColumnsStateService) {
		this._columnState.colsTr$.next(this.defaultCols);
	}

	public goToUrlProposals(linkToDetail: string) {
		window.open(linkToDetail, '_blank');
	}
}
