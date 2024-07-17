import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { ITab } from '@app/shared/components/tabs/tab';
import { SearchInputItem } from '@app/shared/components/inputs/search-client-input/search-client-input.component';
import { Observable, Subscription } from 'rxjs';
import { ClientProposalsFacadeService } from '@app/core/facades/client-proposals-facade.service';

@UntilDestroy()
@Component({
	selector: 'app-client-proposals-info',
	templateUrl: './client-proposals-info.component.html',
	styleUrls: ['./client-proposals-info.component.scss'],
	providers: [ClientProposalsFacadeService],
	encapsulation: ViewEncapsulation.None,
})
export class ClientProposalsInfoComponent implements OnInit {
	protected clientId: number | null = null;

	private readonly subscription = new Subscription();

	protected readonly searchControl = new FormControl<number>(0);

	public clientId$: Observable<number>;

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
		protected readonly clientProposalsFacadeService: ClientProposalsFacadeService,
	) {
		this.clientId$ = this.clientProposalsFacadeService.clientId$;
		this.subscription.add(
			this.clientId$.subscribe(id => {
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
}
// width: '140px' и align: 'center' Покачто как заглушка, в будующем сделаю возможность центрования и настройку размера ячейки.
