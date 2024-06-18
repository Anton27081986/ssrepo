import { Component } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { ITab } from '@app/shared/components/tabs/tab';
import { IClientDataDto } from '@app/core/models/company/client-dto';
import { ClientsCardFacadeService } from '@app/core/facades/client-card-facade.service';

@UntilDestroy()
@Component({
	selector: 'app-client-tpr-info',
	templateUrl: './client-tpr-info.component.html',
	styleUrls: ['./client-tpr-info.component.scss'],
})
export class ClientTprInfoComponent {
	protected clientId: number | undefined;
	protected readonly client$: Observable<IClientDataDto> | undefined;

	protected readonly searchControl = new FormControl<string>('', { nonNullable: true });

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
		private readonly _activatedRoute: ActivatedRoute,
		private readonly _router: Router,
		private readonly _clientsCardFacadeService: ClientsCardFacadeService,
	) {
		this.clientId = Number(this._activatedRoute.snapshot.paramMap.get('clientId'));

		if (this.clientId) {
			this._clientsCardFacadeService.getClientCardById(this.clientId);
		}
	}

	protected getSearchClient(client: { id: number; title: string }) {
		if (client) {
			this.clientId = client.id;
			this._router.navigate(['/client-tpr-page', client.id]).then();
		}
	}

	public selectTab(page: string) {
		if (this.clientId) {
			this._router.navigate([`/client-tpr-page/${this.clientId}/${page}`]);
		}
	}
}
