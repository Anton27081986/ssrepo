import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ClientsListFacadeService } from '@app/core/facades/clients-list-facade.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { IClientsFilter } from '@app/core/models/clients-filter';
import { ITableItem } from '@app/shared/components/table/table.component';
import { IClientItemDto } from '@app/core/models/company/client-item-dto';

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
	public offset = 0;
	public tableItems: ITableItem[] = [];
	public items: IClientTableItem[] = [];

	// state
	public isFiltersVisible: boolean = false;
	public tableState: TableState = TableState.Loading;
	public filtersForm!: FormGroup;

	public constructor(
		public readonly clientsListFacade: ClientsListFacadeService,
		private readonly formBuilder: FormBuilder,
		private readonly cdr: ChangeDetectorRef,
	) {}

	public ngOnInit(): void {
		this.filtersForm = this.formBuilder.group({
			code: [],
			category: [],
			client: [],
			manager: [],
			contractor: [],
			status: [6],
			withoutBaseManager: [false],
		});

		this.clientsListFacade.applyFilters(this.getFilter());

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

	public getFilteredClients() {
		if (this.filtersForm.valid) {
			const filter = this.getFilter();

			this.clientsListFacade.applyFilters(filter);
		}
	}

	private getFilter(): IClientsFilter {
		return {
			code: this.filtersForm.get('code')?.value,
			name: this.filtersForm.get('client')?.value,
			categoryId: this.filtersForm.get('category')?.value,
			contractorId: this.filtersForm.get('contractor')?.value,
			managerId: this.filtersForm.get('manager')?.value,
			status: this.filtersForm.get('status')?.value,
			withoutBaseManager: this.filtersForm.get('withoutBaseManager')?.value,
			offset: this.offset,
			limit: this.pageSize,
		};
	}

	public nzPageIndexChange($event: number) {
		if ($event === 1) {
			this.offset = 0;
		} else {
			this.offset = this.pageSize * $event - this.pageSize;
		}

		this.offset = this.pageSize * $event - this.pageSize;
		this.pageIndex = $event;

		this.clientsListFacade.applyFilters(this.getFilter());
	}

	public clearFilter() {
		this.filtersForm.reset({
			code: [],
			category: [],
			client: [],
			manager: [],
			contractor: [],
			status: [6],
			withoutBaseManager: [false],
		});
	}

	protected readonly TableState = TableState;
}
