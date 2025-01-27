import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ClientsListFacadeService } from '@app/core/facades/clients-list-facade.service';
import {ITableItem, TableComponent} from '@app/shared/components/table/table.component';
import { IClientItemDto } from '@app/core/models/company/client-item-dto';
import {FiltersComponent, IFilter} from '@app/shared/components/filters/filters.component';
import { UserProfileStoreService } from '@app/core/states/user-profile-store.service';
import {HeadlineComponent} from "@app/shared/components/typography/headline/headline.component";
import {ButtonComponent} from "@app/shared/components/buttons/button/button.component";
import {IconComponent} from "@app/shared/components/icon/icon.component";
import {CommonModule, NgForOf, NgIf} from "@angular/common";
import {NzPaginationComponent} from "ng-zorro-antd/pagination";
import {EmptyPlaceholderComponent} from "@app/shared/components/empty-placeholder/empty-placeholder.component";
import {TextComponent} from "@app/shared/components/typography/text/text.component";
import {CardComponent} from "@app/shared/components/card/card.component";
import {LoaderComponent} from "@app/shared/components/loader/loader.component";
import {CaptionComponent} from "@app/shared/components/typography/caption/caption.component";

export interface IClientTableItem {
	code: { text: string; url: string };
	category: string;
	clientName: string;
	contractors: Array<{ text?: string | null; url?: string | null }>;
	managers: string;
	status: string;
	withoutManager: string;
}

export enum TableState {
	Loading,
	Empty,
	Full,
}

@UntilDestroy()
@Component({
	selector: 'app-clients-list-page-page',
	templateUrl: './clients-list-page.component.html',
	styleUrls: ['./clients-list-page.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		CommonModule,
		HeadlineComponent,
		ButtonComponent,
		IconComponent,
		TableComponent,
		NgIf,
		NzPaginationComponent,
		EmptyPlaceholderComponent,
		TextComponent,
		CardComponent,
		FiltersComponent,
		LoaderComponent,
		NgForOf,
		CaptionComponent
	],
	standalone: true
})
export class ClientsListPageComponent implements OnInit {
	// table
	public total: number | undefined;
	public pageSize = 20;
	public pageIndex = 1;
	public offset = 0;
	public tableItems: ITableItem[] = [];
	public items: IClientTableItem[] = [];

	// state
	public isFiltersVisible: boolean = true;
	public tableState: TableState = TableState.Loading;

	public filters: IFilter[] = [
		{
			name: 'code',
			type: 'number',
			label: 'Код',
			placeholder: 'Введите код',
		},
		{
			name: 'categoryIds',
			type: 'select',
			label: 'Категория',
			options: [],
			placeholder: 'Выберите категории',
		},
		{
			name: 'clientIds',
			type: 'search-select',
			searchType: 'client',
			label: 'Клиент',
			placeholder: 'Введите название клиента',
		},
		{
			name: 'contractorIds',
			type: 'search-select',
			searchType: 'contractor',
			label: 'Контрагенты',
			placeholder: 'Введите наименование контрагента',
		},
		{
			name: 'managerIds',
			type: 'search-select',
			searchType: 'user',
			label: 'Менеджеры',
			placeholder: 'Введите ФИО',
		},
		{
			name: 'statuses',
			type: 'select',
			label: 'Статус',
			placeholder: 'Выберите статус',
		},
		{
			name: 'withoutBaseManager',
			type: 'boolean',
			label: 'Клиент без БМ',
			options: [
				{ id: 1, name: 'Да' },
				{ id: 0, name: 'Нет' },
			],
			placeholder: '',
		},
		{
			name: 'hideArchived',
			type: 'boolean',
			label: 'Не показывать архивных клиентов',
			options: [
				{ id: 1, name: 'Да' },
				{ id: 0, name: 'Нет' },
			],
			placeholder: '',
		},
	];

	public constructor(
		public readonly clientsListFacade: ClientsListFacadeService,
		private readonly cdr: ChangeDetectorRef,
		private readonly userService: UserProfileStoreService,
	) {}

	public ngOnInit(): void {
		this.tableState = TableState.Loading;

		this.userService.userProfile$.pipe(untilDestroyed(this)).subscribe(user => {
			const managersFilter = this.filters.find(
				coreFilter => coreFilter.name === 'managerIds',
			);

			if (managersFilter && user) {
				managersFilter.options = [{ id: user.id, name: user.name, checked: true }];
				managersFilter.value = managersFilter.options;
			}

			const statusesFilter = this.filters.find(coreFilter => coreFilter.name === 'statuses');

			if (statusesFilter) {
				statusesFilter.options = [
					{ id: 1, name: 'Новый', checked: true },
					{ id: 6, name: 'Действующий', checked: true },
				];
				statusesFilter.value = statusesFilter.options;
			}

			this.getFilteredClients();
		});

		this.clientsListFacade.clients$.pipe(untilDestroyed(this)).subscribe(response => {
			if (!response.items || response.items.length === 0) {
				this.tableState = TableState.Empty;
			} else {
				this.items = this.mapClientsToTableItems(response.items);

				if (response.total! > 6) {
					this.total = (response.total ?? 0) + this.pageSize;
				} else {
					this.total = response.total ?? 0;
				}

				this.tableItems = <ITableItem[]>(<unknown>this.items);
				this.tableState = TableState.Full;
			}

			this.cdr.detectChanges();
		});

		this.clientsListFacade.categories$.pipe(untilDestroyed(this)).subscribe(categories => {
			const categoriesFilter = this.filters.find(filter => filter.name === 'categoryIds');

			if (categoriesFilter && categories.items) {
				categoriesFilter.options = categoriesFilter.options
					? [
							...categoriesFilter.options,
							...categories.items.filter(
								filter =>
									!categoriesFilter.options?.find(
										savedFilter => savedFilter.id === filter.id,
									),
							),
						]
					: categories.items;
			}
		});

		this.clientsListFacade.statuses$.pipe(untilDestroyed(this)).subscribe(statuses => {
			const statusesFilter = this.filters.find(filter => filter.name === 'statuses');

			if (statusesFilter && statuses.items) {
				statusesFilter.options = statusesFilter.options
					? [
							...statusesFilter.options,
							...statuses.items.filter(
								filter =>
									!statusesFilter.options?.find(
										savedFilter => savedFilter.id === filter.id,
									),
							),
						]
					: statuses.items;
			}
		});
	}

	private mapClientsToTableItems(clients: IClientItemDto[]) {
		return clients.map(x => {
			const tableItem: IClientTableItem = {} as IClientTableItem;

			tableItem.code = {
				text: x.code !== undefined ? x.code.toString().replace('.', ',') : '-',
				url: x.id !== undefined ? `./client-card/${x.id}` : '-',
			};
			tableItem.category = x.category?.name ?? '-';
			tableItem.clientName = x.name ?? '-';
			tableItem.contractors = x.contractors
				? x.contractors.map(c => {
						return { text: c.name, url: c.linkToDetail };
					})
				: [];

			tableItem.managers = x.managers ? x.managers.map(c => c.name).join(', ') : '-';
			tableItem.status = x.status?.name ?? '-';

			tableItem.withoutManager = x.isBaseManagerFired ? 'Да' : 'Нет';

			return tableItem;
		});
	}

	public toggleFilters() {
		this.isFiltersVisible = !this.isFiltersVisible;
	}

	public getFilteredClients(isNewFilter: boolean = false) {
		if (isNewFilter) {
			this.pageIndex = 1;
		}

		const preparedFilter: any = {
			limit: isNewFilter ? 20 : this.pageSize,
			offset: isNewFilter ? 0 : this.offset,
		};

		for (const filter of this.filters) {
			preparedFilter[filter.name] = filter.value && filter.type ? filter.value : null;

			switch (filter.type) {
				case 'select':
				case 'search-select':
					preparedFilter[filter.name] = Array.isArray(filter.value)
						? filter.value.map(item => item.id)
						: null;
					break;
				case 'boolean':
					preparedFilter[filter.name] = filter.value === 'Да';
					break;
				default:
					preparedFilter[filter.name] =
						filter.value?.toString().replace(',', '.') || null;
			}
		}

		this.tableState = TableState.Loading;
		this.clientsListFacade.applyFilters(preparedFilter);
	}

	public nzPageIndexChange($event: number) {
		if ($event === 1) {
			this.offset = 0;
		} else {
			this.offset = this.pageSize * $event - this.pageSize;
		}

		this.offset = this.pageSize * $event - this.pageSize;
		this.pageIndex = $event;

		this.getFilteredClients();
	}

	protected readonly TableState = TableState;
}
