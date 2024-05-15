import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ITableItem } from '@app/shared/components/table/table.component';
import { ISamplesTableItem } from '@app/pages/client-card/client-request-samples/samples-table-item';
import { TableState } from '@app/shared/components/table/table-state';
import { FormBuilder, FormGroup } from '@angular/forms';
import { IRequestSamplesFilter } from '@app/core/models/request-samples-filter';
import { IFilter } from '@app/shared/components/filters/filters.component';
import { RequestSamplesFacadeService } from '@app/core/facades/request-samples-facade.service';
import { ISampleItemDto } from '@app/core/models/company/sample-item-dto';

@UntilDestroy()
@Component({
	selector: 'ss-client-request-samples',
	templateUrl: './client-request-samples.component.html',
	styleUrls: ['./client-request-samples.component.scss'],
})
export class ClientRequestSamplesComponent implements OnInit {
	// table
	public total: number | undefined;
	public pageSize = 6;
	public pageIndex = 1;
	public tableItems: ITableItem[] = [];
	public items: ISamplesTableItem[] = [];

	// state
	public isFiltersVisible: boolean = true;
	public tableState: TableState = TableState.Loading;
	public filtersForm!: FormGroup;
	public filter: IRequestSamplesFilter = {
		offset: 0,
		limit: this.pageSize,
	};

	public filters: IFilter[] = [
		{
			name: 'managerId',
			type: 'search',
			searchType: 'user',
			label: 'Менеджер',
			placeholder: 'Введите ФИО',
		},
		{
			name: 'TovId',
			type: 'input',
			label: 'Товарная позиция (ТП)',
			placeholder: 'Введите ТП',
		},
	];

	public constructor(
		public readonly requestSamplesFacade: RequestSamplesFacadeService,
		private readonly formBuilder: FormBuilder,
		private readonly cdr: ChangeDetectorRef,
	) {}

	public ngOnInit(): void {
		this.tableState = TableState.Loading;
		this.filtersForm = this.formBuilder.group({
			contractorId: [],
			fromShipDate: [],
			toShipDate: [],
		});

		this.requestSamplesFacade.applyFilters(this.filter);

		this.requestSamplesFacade.samples$.pipe(untilDestroyed(this)).subscribe(response => {
			if (!response.items || response.items.length === 0) {
				this.tableState = TableState.Empty;
			} else {
				this.items = this.mapClientsToTableItems(response);
				this.total = (response.total ?? 0) + this.pageSize;
				this.tableItems = <ITableItem[]>(<unknown>this.items);
				this.tableState = TableState.Full;
			}

			this.cdr.detectChanges();
		});
	}

	private mapClientsToTableItems(sales: ISampleItemDto) {
		return (
			sales.items?.map(x => {
				const tableItem: ISamplesTableItem = {} as ISamplesTableItem;

				tableItem.code = x.id.toString() ?? '-';
				tableItem.detailLink = x.detailLink ?? '';
				tableItem.status = x.status.name ?? '-';
				tableItem.orderDate = x.orderDate
					? new Date(Date.parse(x.orderDate)).toLocaleString('ru-RU', {
							year: 'numeric',
							month: 'numeric',
							day: 'numeric',
						})
					: '-';
				tableItem.managerName = x.manager.name ?? '-';
				tableItem.tovName = x.tov.name ?? '-';
				tableItem.planQuantity = x.planQuantity.toString() ?? '-';
				tableItem.factQuantity = x.factQuantity.toString() ?? '-';
				tableItem.planWeight = x.planWeight.toString() ?? '-';
				tableItem.factWeight = x.factWeight.toString() ?? '-';
				tableItem.comment = x.comment ?? '-';

				return tableItem;
			}) || []
		);
	}

	public toggleFilters() {
		this.isFiltersVisible = !this.isFiltersVisible;
	}

	public getFilteredSales(filter: { [key: string]: string }) {
		this.filter = filter as unknown as IRequestSamplesFilter;
		this.tableState = TableState.Loading;

		if (this.filtersForm.valid) {
			this.requestSamplesFacade.applyFilters({ ...this.filter, limit: this.pageSize });
		}
	}

	public nzPageIndexChange($event: number) {
		if ($event === 1) {
			this.filter.offset = 0;
		} else {
			this.filter.offset = this.pageSize * $event - this.pageSize;
		}

		this.filter.offset = this.pageSize * $event - this.pageSize;
		this.pageIndex = $event;

		this.requestSamplesFacade.applyFilters(this.filter);
	}

	protected readonly TableState = TableState;
}
