import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ITableItem } from '@app/shared/components/table/table.component';
import { SaleRequestsFacadeService } from '@app/core/facades/sale-requests-facade.service';
import { ISaleRequestsFilter } from '@app/core/models/sale-requests-filter';
import { ISaleRequestsDto } from '@app/core/models/company/sale-requests';

export interface ISaleTableItem {
	code: string;
	saleLink: string;
	contractorId: string;
	shipDate: string;
	paymentDate: string;
	status: string;
}

export enum TableState {
	Loading,
	Empty,
	Full,
}

@UntilDestroy()
@Component({
	selector: 'app-sale-requests',
	templateUrl: './sale-requests.component.html',
	styleUrls: ['./sale-requests.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SaleRequestsComponent implements OnInit {
	// table
	public total: number | undefined;
	public pageSize = 6;
	public pageIndex = 1;
	public offset = 0;
	public tableItems: ITableItem[] = [];
	public items: ISaleTableItem[] = [];

	// state
	public isFiltersVisible: boolean = false;
	public tableState: TableState = TableState.Loading;
	public filtersForm!: FormGroup;

	public constructor(
		public readonly saleRequestsFacade: SaleRequestsFacadeService,
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

		this.saleRequestsFacade.applyFilters(this.getFilter());

		this.saleRequestsFacade.sales$.pipe(untilDestroyed(this)).subscribe(response => {
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

	private mapClientsToTableItems(sales: ISaleRequestsDto) {
		return (
			sales.items?.map(x => {
				const tableItem: ISaleTableItem = {} as ISaleTableItem;

				tableItem.code = x.id !== undefined ? x.id.toString() : '-';
				tableItem.saleLink = x.detailLink !== undefined ? x.detailLink : '';
				tableItem.contractorId = x.contractor?.id.toString(10) ?? '-';
				tableItem.shipDate = x.shipDate
					? new Date(Date.parse(x.shipDate)).toLocaleString('ru-RU', {
							year: 'numeric',
							month: 'numeric',
							day: 'numeric',
						})
					: '-';
				tableItem.paymentDate = x.paymentDate
					? new Date(Date.parse(x.paymentDate)).toLocaleString('ru-RU', {
							year: 'numeric',
							month: 'numeric',
							day: 'numeric',
						})
					: '-';

				tableItem.status = x.status !== undefined ? x.status.name : '-';

				return tableItem;
			}) || []
		);
	}

	public toggleFilters() {
		this.isFiltersVisible = !this.isFiltersVisible;
	}

	public getFilteredSales() {
		this.tableState = TableState.Loading;

		if (this.filtersForm.valid) {
			const filter = this.getFilter();

			this.saleRequestsFacade.applyFilters(filter);
		}
	}

	private getFilter(): ISaleRequestsFilter {
		return {
			ContractorId: this.filtersForm.get('contractorId')?.value,
			FromShipDate: this.filtersForm.get('fromShipDate')?.value,
			ToShipDate: this.filtersForm.get('toShipDate')?.value,
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

		this.saleRequestsFacade.applyFilters(this.getFilter());
	}

	public clearFilter() {
		this.filtersForm.reset({
			contractorId: [],
			fromShipDate: [],
			toShipDate: [],
		});
	}

	protected readonly TableState = TableState;
}
