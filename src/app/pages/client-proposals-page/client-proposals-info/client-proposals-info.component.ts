import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { ITab } from '@app/shared/components/tabs/tab';
import { SearchInputItem } from '@app/shared/components/inputs/search-client-input/search-client-input.component';
import { IStoreTableBaseColumn } from '@app/core/store';
import { ClientProposalsRowItemField } from '@app/pages/client-proposals-page/client-proposals-row-item-tr/client-proposals-row-item-tr.component';
import { ColumnsStateService } from '@app/core/columns.state.service';
import { Subscription } from 'rxjs';
import { ClientProposalsFacadeService } from '@app/core/facades/client-proposals-facade.service';

@UntilDestroy()
@Component({
	selector: 'app-client-proposals-info',
	templateUrl: './client-proposals-info.component.html',
	styleUrls: ['./client-proposals-info.component.scss'],
	providers: [ColumnsStateService, ClientProposalsFacadeService],
	encapsulation: ViewEncapsulation.None,
})
export class ClientProposalsInfoComponent implements OnInit {
	protected clientId: number | null = null;

	private readonly subscription = new Subscription();

	protected readonly searchControl = new FormControl<number>(0);

	public tabs: ITab[] = [
		{
			label: 'Состав контрагентов',
			name: 'contractors',
			isVisible: true,
		},
		{
			label: 'Товарная ведомость по клиенту',
			name: 'trade-list',
			isVisible: true,
		},
		{
			label: 'Командировки',
			name: 'business-trips',
			isVisible: true,
		},
		{
			label: 'Разработки АК',
			name: 'development',
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
	];

	protected mainInfoTab: ITab | undefined = this.tabs.find(tab => tab.name === 'contractors');

	protected selectedTab: ITab = this.mainInfoTab!;

	constructor(
		private readonly _router: Router,
		protected readonly _columnState: ColumnsStateService,
		protected readonly clientProposalsFacadeService: ClientProposalsFacadeService,
	) {
		this._columnState.cols$.next(this.defaultCols);

		this.subscription.add(
			this.clientProposalsFacadeService.clientId$.subscribe(id => {
				if (id) {
					this.clientId = id;
					this.searchControl.setValue(id);
				} else {
					this._router.navigate(['/client-proposals-page']).then();
				}
			}),
		);
	}

	ngOnInit() {
		for (const tab of this.tabs) {
			if (this._router.url.includes(tab!.name!)) {
				this.selectedTab = tab;
			}
		}
	}

	protected getSearchClient(client: SearchInputItem | null) {
		if (client && client.id) {
			const arrUrl = this._router.url.split('/');

			this._router
				.navigate([`/client-proposals-page/${client.id}/${arrUrl[arrUrl.length - 1]}`])
				.then();
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
