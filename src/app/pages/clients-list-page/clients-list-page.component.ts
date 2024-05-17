import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ClientsListFacadeService } from '@app/core/facades/clients-list-facade.service';
import { IClientsFilter } from '@app/core/models/clients-filter';
import { ITableItem } from '@app/shared/components/table/table.component';
import { IClientItemDto } from '@app/core/models/company/client-item-dto';
import { IFilter } from '@app/shared/components/filters/filters.component';
import { LocalStorageService } from '@app/core/services/local-storage.service';

export interface IClientTableItem {
	code: string;
	clientCardLink: string;
	category: string;
	clientName: string;
	contractors: string;
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
})
export class ClientsListPageComponent implements OnInit {
	// table
	public total: number | undefined;
	public pageSize = 20;
	public pageIndex = 1;
	public tableItems: ITableItem[] = [];
	public items: IClientTableItem[] = [];

	// state
	public isFiltersVisible: boolean = true;
	public tableState: TableState = TableState.Loading;
	public filter: IClientsFilter = {
		offset: 0,
		limit: this.pageSize,
	};

	public filters: IFilter[] = [
		{
			name: 'code',
			type: 'input',
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
			options: [],
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
	];

	public constructor(
		public readonly clientsListFacade: ClientsListFacadeService,
		private readonly localStorageService: LocalStorageService,
		private readonly cdr: ChangeDetectorRef,
	) {}

	public ngOnInit(): void {
		this.tableState = TableState.Loading;

		const savedFilters = this.localStorageService.getItem<IClientsFilter>('clientsListFilter');

		if (savedFilters) {
			this.filter = savedFilters;
		}

		this.clientsListFacade.applyFilters(this.filter);

		this.clientsListFacade.clients$.pipe(untilDestroyed(this)).subscribe(response => {
			if (!response.items || response.items.length === 0) {
				this.tableState = TableState.Empty;
			} else {
				this.items = this.mapClientsToTableItems(response.items);
				this.total = (response.total ?? 0) + this.pageSize;
				this.tableItems = <ITableItem[]>(<unknown>this.items);
				this.tableState = TableState.Full;
			}

			this.cdr.detectChanges();
		});

		this.clientsListFacade.categories$.pipe(untilDestroyed(this)).subscribe(response => {
			const categoriesFilter = this.filters.find(filter => filter.name === 'categoryIds');

			if (categoriesFilter) {
				categoriesFilter.options = response.items;
			}
		});

		this.clientsListFacade.contractors$.pipe(untilDestroyed(this)).subscribe(response => {
			const contractorsFilter = this.filters.find(filter => filter.name === 'contractorIds');

			if (contractorsFilter) {
				contractorsFilter.options = response.items;
			}
		});

		this.clientsListFacade.statuses$.pipe(untilDestroyed(this)).subscribe(statuses => {
			const contractorsFilter = this.filters.find(filter => filter.name === 'statuses');

			if (contractorsFilter) {
				contractorsFilter.options = statuses.items;
			}
		});
	}

	private mapClientsToTableItems(clients: IClientItemDto[]) {
		return clients.map(x => {
			const tableItem: IClientTableItem = {} as IClientTableItem;

			tableItem.code = x.id !== undefined ? x.id.toString() : '-';
			tableItem.clientCardLink = x.id !== undefined ? `./client-card/${x.id}` : '-';
			tableItem.category = x.category?.name ?? '-';
			tableItem.clientName = x.name ?? '-';
			tableItem.contractors = x.contractors ? x.contractors.map(c => c.name).join(', ') : '-';

			tableItem.managers = x.managers ? x.managers.map(c => c.name).join(', ') : '-';
			tableItem.status =
				this.clientsListFacade.statusOptions.find(option => option.id === x.status)?.name ??
				'-';

			tableItem.withoutManager = x.isBaseManagerFired ? 'Да' : 'Нет';

			return tableItem;
		});
	}

	public toggleFilters() {
		this.isFiltersVisible = !this.isFiltersVisible;
	}

	public getFilteredClients(filter: { [key: string]: any }) {
		const preparedFilter: any = {};

		for (const field in filter) {
			if (Array.isArray(filter[field]) && filter[field].length) {
				preparedFilter[field] = filter[field].map(
					(item: { id: number; name: string }) => item.id,
				) ?? null;
			} else {
				preparedFilter[field] = filter[field] ?? null;
			}

		}

		this.filter = { ...this.filter, ...(preparedFilter as unknown as IClientsFilter) };
		this.filter.withoutBaseManager = !!this.filter.withoutBaseManager;
		this.localStorageService.setItem('clientsListFilter', this.filter);
		this.tableState = TableState.Loading;
		this.clientsListFacade.applyFilters(preparedFilter);
	}

	public nzPageIndexChange($event: number) {
		if ($event === 1) {
			this.filter.offset = 0;
		} else {
			this.filter.offset = this.pageSize * $event - this.pageSize;
		}

		this.filter.offset = this.pageSize * $event - this.pageSize;
		this.pageIndex = $event;

		this.clientsListFacade.applyFilters(this.filter);
	}

	protected readonly TableState = TableState;
}
