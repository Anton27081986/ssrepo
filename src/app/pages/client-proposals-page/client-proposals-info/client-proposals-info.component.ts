import { ChangeDetectionStrategy, Component, computed, OnInit, Signal } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { Router, RouterOutlet } from '@angular/router';
import { FormControl } from '@angular/forms';
import { ITab } from '@app/shared/components/tabs/tab';
import { SearchInputItem } from '@app/shared/components/inputs/search-client-input/search-client-input.component';
import { Observable, Subscription } from 'rxjs';
import { ClientProposalsFacadeService } from '@app/core/facades/client-proposals-facade.service';
import { Permissions } from '@app/core/constants/permissions.constants';
import { toSignal } from '@angular/core/rxjs-interop';

@UntilDestroy()
@Component({
	selector: 'app-client-proposals-info',
	templateUrl: './client-proposals-info.component.html',
	styleUrls: ['./client-proposals-info.component.scss'],
	providers: [ClientProposalsFacadeService],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientProposalsInfoComponent implements OnInit {
	protected clientId: number | null = null;

	private readonly subscription = new Subscription();

	protected readonly searchControl = new FormControl<number>(0);

	public blockForProposals$ = this.clientProposalsFacadeService.blockForProposalSubject$;

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

		if (this.permissions().includes(Permissions.CLIENT_PROPOSALS_ADDITIONAL_INFO_READ)) {
			tabs.forEach(tab => {
				tab.isVisible = true;
			});
		} else {
			tabs.forEach(tab => {
				if (tab.name !== 'contractors') {
					tab.isVisible = false;
				}
			});
		}
		return tabs;
	});

	protected mainInfoTab: ITab | undefined = this.tabs().find(tab => tab.name === 'contractors');

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

		this.selectTab('contractors');
	}

	ngOnInit() {
		for (const tab of this.tabs()) {
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
			this.selectedTab = this.tabs().find(tab => tab.name === page) || this.mainInfoTab!;
			this._router.navigate([`/client-proposals-page/${this.clientId}/${page}`]);
		}
	}

	protected readonly Permissions = Permissions;
}
