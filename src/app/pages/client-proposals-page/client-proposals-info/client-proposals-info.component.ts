import {
	ChangeDetectionStrategy,
	Component,
	computed,
	Signal,
} from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Router, RouterOutlet } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ITab } from '@app/shared/components/tabs/tab';
import {
	SearchClientInputComponent,
	SearchInputItem,
} from '@app/shared/components/inputs/search-client-input/search-client-input.component';
import { Observable, Subscription, take } from 'rxjs';
import { ClientProposalsFacadeService } from '@app/core/facades/client-proposals-facade.service';
import { Permissions } from '@app/core/constants/permissions.constants';
import { toSignal } from '@angular/core/rxjs-interop';
import { ClientProposalsBusinessTripsTabState } from '@app/pages/client-proposals-page/client-proposals-tabs/client-proposals-bisiness-trips-tab/client-proposals-business-trips-tab.state';
import { ClientProposalsTradeListTabState } from '@app/pages/client-proposals-page/client-proposals-tabs/client-proposals-trade-list-tab/client-proposals-trade-list-tab.state';
import { ClientProposalsSamplesTabState } from '@app/pages/client-proposals-page/client-proposals-tabs/client-proposals-samples-tab/client-proposals-samples-tab.state';
import { ClientProposalsContractorsTabState } from '@app/pages/client-proposals-page/client-proposals-tabs/client-proposals-contractors-tab/client-proposals-contractors-tab.state';
import { ClientProposalsDevelopmentTabState } from '@app/pages/client-proposals-page/client-proposals-tabs/client-proposals-development-tab/client-proposals-development-tab.state';
import { ClientProposalsNewsLineTabState } from '@app/pages/client-proposals-page/client-proposals-tabs/client-proposals-news-line-tab/client-proposals-news-line-tab.state';
import { HeadlineComponent } from '@app/shared/components/typography/headline/headline.component';
import {
	AsyncPipe,
	CommonModule,
	NgIf,
	NgTemplateOutlet,
} from '@angular/common';
import { AccordionComponent } from '@app/shared/components/accordion/accordion.component';
import { CardComponent } from '@app/shared/components/card/card.component';
import { ClientProposalsCardComponent } from '@app/pages/client-proposals-page/client-proposals/client-proposals-card/client-proposals-card.component';
import { ClientProposalsDoneProductionComponent } from '@app/pages/client-proposals-page/client-proposals-done-production/client-proposals-done-production.component';
import { TabsComponent } from '@app/shared/components/tabs/tabs.component';

@UntilDestroy()
@Component({
	selector: 'app-client-proposals-info',
	templateUrl: './client-proposals-info.component.html',
	styleUrls: ['./client-proposals-info.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		CommonModule,
		HeadlineComponent,
		SearchClientInputComponent,
		AsyncPipe,
		AccordionComponent,
		NgTemplateOutlet,
		CardComponent,
		ClientProposalsCardComponent,
		NgIf,
		ReactiveFormsModule,
		ClientProposalsDoneProductionComponent,
		TabsComponent,
		RouterOutlet,
	],
	standalone: true,
})
export class ClientProposalsInfoComponent {
	protected clientId: number | null = null;

	private readonly subscription = new Subscription();

	protected readonly searchControl = new FormControl<number>(0);

	public blockForProposals$ =
		this.clientProposalsFacadeService.blockForProposalSubject$;

	public clientId$: Observable<number>;

	public outlet: RouterOutlet = new RouterOutlet();

	public permissions: Signal<string[]> = toSignal(
		this.clientProposalsFacadeService.proposalsPermissions$,
		{
			initialValue: [],
		},
	);

	protected tabs: Signal<ITab[]> = computed(() => {
		const tabs: ITab[] = [
			{
				label: 'Состав контрагентов',
				name: 'contractors',
				isVisible: true,
			},
			{
				label: 'Товарная ведомость по клиенту',
				name: 'trade-list',
				isVisible: false,
			},
			{
				label: 'Командировки',
				name: 'business-trips',
				isVisible: false,
			},
			{
				label: 'Разработки АК',
				name: 'development',
				isVisible: false,
			},
			{
				label: 'Образцы',
				name: 'samples',
				isVisible: false,
			},
			{
				label: 'Лента новостей',
				name: 'news-line',
				isVisible: false,
			},
		];

		if (
			this.permissions().includes(
				Permissions.CLIENT_PROPOSALS_ADDITIONAL_INFO_READ,
			)
		) {
			tabs.forEach((tab) => {
				tab.isVisible = true;
			});
		} else {
			tabs.forEach((tab) => {
				if (tab.name !== 'contractors') {
					tab.isVisible = false;
				}
			});
		}

		return tabs;
	});

	protected mainInfoTab: ITab | undefined = this.tabs().find(
		(tab) => tab.name === 'contractors',
	);

	protected selectedTab: ITab = this.mainInfoTab!;

	protected readonly Permissions = Permissions;
	constructor(
		private readonly _router: Router,
		protected readonly clientProposalsFacadeService: ClientProposalsFacadeService,
	) {
		this.clientId$ = this.clientProposalsFacadeService.clientId$;
		this.subscription.add(
			this.clientId$.subscribe((id) => {
				this.clientId = id;
				this.searchControl.setValue(id);
			}),
		);
		this.clientProposalsFacadeService.proposalsPermissions$
			.pipe(untilDestroyed(this))
			.subscribe((item) => {
				if (item.length) {
					if (
						item.includes(
							Permissions.CLIENT_PROPOSALS_ADDITIONAL_INFO_READ,
						)
					) {
						const url = this._router.url.split('/');

						this.selectTab(url[url.length - 1]);
					} else {
						this.selectTab('contractors');
					}
				} else {
					const url = this._router.url.split('/');

					this.selectTab(url[url.length - 1]);
				}
			});
	}

	protected getSearchClient(client: SearchInputItem | null) {
		if (client && client.id) {
			const arrUrl = this._router.url.split('/');

			this._router
				.navigate([
					`/client-proposals-page/${client.id}/${arrUrl[arrUrl.length - 1]}`,
				])
				.then();
		}
	}

	public selectTab(page: string) {
		if (this.clientId) {
			this.selectedTab =
				this.tabs().find((tab) => tab.name === page && tab.isVisible) ||
				this.mainInfoTab!;
			this._router.navigate([
				`/client-proposals-page/${this.clientId}/${this.selectedTab.name}`,
			]);
		}
	}
}
