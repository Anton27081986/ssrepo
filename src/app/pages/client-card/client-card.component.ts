import { Component, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import {ActivatedRoute, Router, RouterOutlet} from '@angular/router';
import { ClientsCardFacadeService } from '@app/core/facades/client-card-facade.service';
import { IClientDto } from '@app/core/models/company/client-dto';
import { Observable } from 'rxjs';
import { ITab } from '@app/shared/components/tabs/tab';
import { Permissions } from '@app/core/constants/permissions.constants';
import { QueryType } from '@app/widgets/history/models/query-type';
import {IconComponent} from "@app/shared/components/icon/icon.component";
import {HeadlineComponent} from "@app/shared/components/typography/headline/headline.component";
import {TagComponent} from "@app/shared/components/tag/tag.component";
import {AsyncPipe, CommonModule, NgIf} from "@angular/common";
import {TabsComponent} from "@app/shared/components/tabs/tabs.component";
import {
	ClientCardContractorsComponent
} from "@app/pages/client-card/client-card-basic/client-card-contractors/client-card-contractors.component";
import {HistoryComponent} from "@app/widgets/history/history.component";
import {CorrespondenceComponent} from "@app/widgets/correspondence/correspondence.component";

@UntilDestroy()
@Component({
	selector: 'app-client-card',
	templateUrl: './client-card.component.html',
	styleUrls: ['./client-card.component.scss'],
	imports: [
		CommonModule,
		IconComponent,
		HeadlineComponent,
		TagComponent,
		AsyncPipe,
		TabsComponent,
		RouterOutlet,
		ClientCardContractorsComponent,
		HistoryComponent,
		CorrespondenceComponent,
		NgIf
	],
	standalone: true
})
export class ClientCardComponent implements OnInit {
	public client$: Observable<IClientDto | null>;
	public clientId$: Observable<number | null>;

	private clientId: number | undefined;

	public tabs: ITab[] = [
		{
			label: 'Общая информация',
			name: 'basic',
			isVisible: true,
		},
		{
			label: 'Заявки на продажу',
			name: 'sales',
			isVisible: false,
		},
		{
			label: 'Образцы',
			name: 'samples',
			isVisible: false,
		},
		{
			label: 'ЖНТПР',
			name: 'gntpr',
			isVisible: false,
		},
		{
			label: 'Возвраты/претензии',
			name: 'refund',
			isVisible: false,
		},
		{
			label: 'ПКП',
			name: 'pkp',
			isVisible: false,
		},
		{
			label: 'Договоры',
			name: 'contracts',
			isVisible: false,
		},
		{
			label: 'Командировки',
			name: 'business-trips',
			isVisible: false,
		},
		{
			label: 'Дни рождения',
			name: 'birthdays',
			isVisible: false,
		},
	];

	protected mainInfoTab: ITab | undefined = this.tabs.find(tab => tab.name === 'basic');

	protected selectedTab: ITab = this.mainInfoTab!;
	protected readonly queryType = QueryType;

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

		this.clientCardListFacade.permissions$.pipe(untilDestroyed(this)).subscribe(permissions => {
			const allTabsAvailable = permissions.includes(Permissions.CLIENT_ADDITIONAL_INFO_READ);

			if (allTabsAvailable) {
				this.tabs.forEach(tab => {
					tab.isVisible = true;
				});
			} else if (!permissions.includes(this.clientCardListFacade.notInitPermission)) {
				this.selectTab('basic');
			}
		});

		this.client$.pipe(untilDestroyed(this)).subscribe(client => {
			if (client?.isAnyPaymentOverdue) {
				this.tabs = this.tabs.map(tab =>
					tab.name === 'sales' ? { ...tab, icon: 'error' } : tab,
				);
			}
		});

		for (const tab of this.tabs) {
			if (this.router.url.includes(tab!.name!)) {
				this.selectedTab = tab;
			}
		}
	}

	public selectTab(page: string) {
		this.router.navigate([`/client-card/${this.clientId}/${page}`]);
	}

	public toClientsList() {
		this.clientCardListFacade.setClientId(null);
		this.router.navigate([`/clients-list`]);
	}
}
