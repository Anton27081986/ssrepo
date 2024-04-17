import { Component, OnInit } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientsCardFacadeService } from '@app/core/facades/client-card-facade.service';
import { IClientDto } from '@app/core/models/company/client-dto';
import { Observable } from 'rxjs';

enum TabsEnum {
	'Общая информация' = 'basic',
	'Заявки на продажу' = 'sales',
	'Образцы' = 'samples',
	'ЖНТПР' = 'gntpr',
	'Возвраты/претензии' = 'refund',
	'ПКП' = 'pkp',
	'Договоры' = 'contracts',
	'Дни рождения' = 'birthdays',
}

@UntilDestroy()
@Component({
	selector: 'app-client-card',
	templateUrl: './client-card.component.html',
	styleUrls: ['./client-card.component.scss'],
})
export class ClientCardComponent implements OnInit {
	public client$: Observable<IClientDto | null>;
	public clientId$: Observable<number | null>;

	private clientId: number | undefined;

	protected tabs = Object.keys(TabsEnum);
	protected selectedTab = '';

	public constructor(
		private readonly activatedRoute: ActivatedRoute,
		public readonly clientCardListFacade: ClientsCardFacadeService,
		private readonly router: Router,
	) {
		this.client$ = this.clientCardListFacade.client$;
		this.clientId$ = this.clientCardListFacade.clientId$;
	}

	public ngOnInit() {
		const id = this.activatedRoute.snapshot.paramMap.get('id');

		if (id) {
			this.clientId = Number.parseInt(id, 10);
		}

		if (this.clientId) {
			this.clientCardListFacade.setClientId(this.clientId);
			this.clientCardListFacade.getClientCardById(this.clientId);
		}

		for (const tabsEnumKey in TabsEnum) {
			if (this.router.url.includes(TabsEnum[tabsEnumKey as keyof typeof TabsEnum])) {
				this.selectedTab = tabsEnumKey;
			}
		}
	}

	selectTab(page: string) {
		this.router.navigate([
			`/client-card/${this.clientId}/${TabsEnum[page as keyof typeof TabsEnum]}`,
		]);
	}
}
