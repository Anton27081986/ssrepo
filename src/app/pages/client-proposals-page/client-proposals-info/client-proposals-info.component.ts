import { Component } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { ITab } from '@app/shared/components/tabs/tab';
import { SearchInputItem } from '@app/shared/components/inputs/search-client-input/search-client-input.component';

@UntilDestroy()
@Component({
	selector: 'app-client-proposals-info',
	templateUrl: './client-proposals-info.component.html',
	styleUrls: ['./client-proposals-info.component.scss'],
})
export class ClientProposalsInfoComponent {
	protected clientId: number | null = null;

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
	) {
		const id = _activatedRoute.snapshot.paramMap.get('clientId');

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
}
