import { Component } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { ITab } from '@app/shared/components/tabs/tab';
import { SearchInputItem } from '@app/shared/components/inputs/search-client-input/search-client-input.component';
import { IStoreTableBaseColumn } from '@app/core/store';
import { ClientProposalsRowItemField } from '@app/pages/client-proposals-page/client-proposals-row-item-tr/client-proposals-row-item-tr.component';
import { ColumnsStateService } from '@app/core/columns.state.service';
import { ClientProposalsService } from '@app/pages/client-proposals-page/client-proposals.service';

@UntilDestroy()
@Component({
	selector: 'app-client-proposals-info',
	templateUrl: './client-proposals-info.component.html',
	styleUrls: ['./client-proposals-info.component.scss'],
	providers: [ColumnsStateService, ClientProposalsService],
})
export class ClientProposalsInfoComponent {
	protected clientId: number | null = null;

	// protected readonly modelClientItems$: Observable<ITableItem[]>;

	protected readonly searchControl = new FormControl<number>(0);

	public tabs: ITab[] = [
		{
			label: 'Командировки',
			name: 'business-trips',
			isVisible: true,
		},
		{
			label: 'Разработка АК',
			name: 'development',
			isVisible: true,
		},
		{
			label: 'Товарная ведомость',
			name: 'trade-list',
			isVisible: true,
		},
		{
			label: 'Образцы',
			name: 'samples',
			isVisible: true,
		},
		{
			label: 'Лента новостей',
			name: 'news-line',
			isVisible: true,
		},
		{
			label: 'Повышение лояльности',
			name: 'loyalty',
			isVisible: true,
		},
	];

	protected mainInfoTab: ITab | undefined = this.tabs.find(tab => tab.name === 'business-trips');

	protected selectedTab: ITab = this.mainInfoTab!;

	constructor(
		_activatedRoute: ActivatedRoute,
		private readonly _router: Router,
		protected readonly _columnState: ColumnsStateService,
		protected readonly clientProposalsService: ClientProposalsService,
	) {
		this._columnState.cols$.next(this.defaultCols);

		const id = _activatedRoute.snapshot.paramMap.get('clientId');

		// Закоменчено в ожидании бэка.
		// this.modelClientItems$ = _activatedRoute.paramMap.pipe(
		// 	switchMap(params => {
		// 		this.clientId = Number.parseInt(params.get('clientId'), 10);
		//
		// 		return clientProposalsService.getModelClientData(this.clientId);
		// 	}),
		// 	shareReplay({
		// 		bufferSize: 1,
		// 		refCount: true,
		// 	}),
		// );

		if (id) {
			this.clientId = Number.parseInt(id, 10);
			this.searchControl.setValue(this.clientId);
		} else {
			this._router.navigate(['/client-proposals-page']).then();
		}
	}

	protected getSearchClient(client: SearchInputItem | null) {
		if (client) {
			this.clientId = client.id;
			this._router.navigate(['/client-proposals-page', this.clientId]).then();
		} else {
			this._router.navigate(['/client-proposals-page']).then();
		}
	}

	public selectTab(page: string) {
		if (this.clientId) {
			this._router.navigate([`/client-proposals-page/${this.clientId}/${page}`]);
		}
	}

	// width: '140px' и align: 'center' Покачто как заглушка, в будующем сделаю возможность центрования и настройку размера ячейки.

	private readonly defaultCols: IStoreTableBaseColumn[] = [
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
			id: ClientProposalsRowItemField.tpr,
			title: 'ТПР',
			order: 4,
			show: true,
			width: '140px',
			align: 'center',
		},
		{
			id: ClientProposalsRowItemField.countKA,
			title: 'Количество КА с продажами этих ТПР',
			order: 5,
			show: true,
			width: '100%',
			align: 'center',
		},
		{
			id: ClientProposalsRowItemField.volumeOfSales,
			title: 'Обьем продаж',
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
			title: 'Цена прайса',
			order: 8,
			show: true,
		},
		{
			id: ClientProposalsRowItemField.ytpTpr,
			title: 'УТП ТПР',
			order: 9,
			show: true,
		},
		{
			id: ClientProposalsRowItemField.analoguesOfCompetitors,
			title: 'Аналоги конкурентов',
			order: 10,
			show: true,
		},
		{
			id: ClientProposalsRowItemField.rim,
			title: 'РИМ',
			order: 11,
			show: true,
		},
		{
			id: ClientProposalsRowItemField.documents,
			title: 'Документы',
			order: 12,
			show: true,
		},
	];
}
