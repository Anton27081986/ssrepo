import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RawMaterialAccountingFacadeService } from '@app/core/facades/raw-material-accounting-facade';
import { Observable } from 'rxjs';
import { ITableItem } from '@app/shared/components/table/table.component';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { IFilter } from '@app/shared/components/filters/filters.component';
import { ModalService } from '@app/core/modal/modal.service';
import { ContractInfoComponent } from '@app/pages/raw-material-accounting/modals/contract-info/contract-info.component';
import { ContractNewComponent } from '@app/pages/raw-material-accounting/modals/contract-new/contract-new.component';
import { Permissions } from '@app/core/constants/permissions.constants';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '@environments/environment';

@UntilDestroy()
@Component({
	selector: 'ss-raw-material-accounting',
	templateUrl: './raw-material-accounting.component.html',
	styleUrls: ['./raw-material-accounting.component.scss'],
})
export class RawMaterialAccountingComponent implements OnInit {
	public isLoading$: Observable<boolean>;
	public isFiltersVisible: boolean = false;
	public canAdd: boolean = false;

	public tableItems: ITableItem[] | null = null;
	public pageIndex = 1;
	public pageSize = 10;
	public total: number = 0;
	public offset = 0;

	public filters: IFilter[] = [
		{
			name: 'ContractNumber',
			type: 'string',
			label: 'Контракт, №',
			placeholder: 'Введите номер контракта',
		},
		{
			name: 'ContractDetailId',
			type: 'search',
			searchType: 'contract',
			label: 'Договор',
			placeholder: 'Введите номер договора',
		},
		{
			name: 'ContractorId',
			type: 'search',
			searchType: 'contractor',
			label: 'Контрагент',
			placeholder: 'Введите наименование контрагента',
		},
		{
			name: 'UserIds',
			type: 'search-select',
			searchType: 'user',
			label: 'Автор',
			placeholder: 'Введите имя автора',
		},
		{
			name: 'statuses',
			type: 'select',
			label: 'Статус',
			placeholder: 'Выберите один или несколько',
		},
	];

	constructor(
		private readonly facadeService: RawMaterialAccountingFacadeService,
		private readonly modalService: ModalService,
		private readonly cdr: ChangeDetectorRef,
		private readonly route: ActivatedRoute,
		private readonly router: Router,
	) {
		this.isLoading$ = this.facadeService.isContractsLoading$;

		this.facadeService.contracts$.pipe(untilDestroyed(this)).subscribe(contracts => {
			if (contracts?.items) {
				this.tableItems = contracts.items.map(x => {
					const tableItem: any = {};

					tableItem.id = x.id ? x.id : null;
					tableItem.contract = x.contractDetail.name ? x.contractDetail.name : '-';
					tableItem.contractId = x.contractDetail.id ? x.contractDetail.id : '-';
					tableItem.contractor = x.contractor.linkToDetail
						? { text: x.contractor.name, url: x.contractor.linkToDetail }
						: '-';
					tableItem.contractNumber = x.contractNumber
						? {
								text: x.contractNumber,
								url: `${environment.apiUrl}/raw-material-accounting/${x.id}`,
							}
						: null;
					tableItem.quantityTotal = x.quantityTotal ? x.quantityTotal : '-';
					tableItem.quantityReceived = x.quantityReceived ? x.quantityReceived : '-';
					tableItem.quantityRemaining = x.quantityRemaining ? x.quantityRemaining : '-';
					tableItem.period = `${new Date(Date.parse(x.periodStartDate)).toLocaleString(
						'ru-RU',
						{
							year: 'numeric',
							month: 'numeric',
							day: 'numeric',
						},
					)} - ${new Date(Date.parse(x.periodEndDate)).toLocaleString('ru-RU', {
						year: 'numeric',
						month: 'numeric',
						day: 'numeric',
					})}`;
					tableItem.user = x.user.name ? x.user.name : '-';
					tableItem.status = x.status ? x.status.name : '-';

					return tableItem;
				});

				this.total = contracts?.total | 0;
				this.cdr.detectChanges();
			}
		});

		this.facadeService.statuses$.pipe(untilDestroyed(this)).subscribe(statuses => {
			const statusesFilter = this.filters.find(filter => filter.name === 'statuses');

			if (statusesFilter && statuses.items) {
				statusesFilter.options = statuses.items;
			}
		});

		this.route.params.pipe(untilDestroyed(this)).subscribe(params => {
			if (params.id) {
				this.modalService
					.open(ContractInfoComponent, {
						data: {
							id: params.id,
						},
					})
					.afterClosed()
					.pipe(untilDestroyed(this))
					.subscribe(contract => {
						this.router.navigate(['/raw-material-accounting']);
					});
			}
		});
	}

	ngOnInit() {
		this.facadeService.getContracts({
			limit: this.pageSize,
			offset: this.offset,
		});
		this.facadeService.permissions$.pipe(untilDestroyed(this)).subscribe(permissions => {
			this.canAdd = permissions.includes(Permissions.CLIENT_PROCUREMENTS_ADD);
			this.cdr.detectChanges();
		});
	}

	public toggleFilters() {
		this.isFiltersVisible = !this.isFiltersVisible;
	}

	public getFilteredContracts(isNewFilter: boolean = false) {
		if (isNewFilter) {
			this.pageIndex = 1;
		}

		const preparedFilter: any = {
			limit: isNewFilter ? 10 : this.pageSize,
			offset: isNewFilter ? 0 : this.offset,
		};

		for (const filter of this.filters) {
			preparedFilter[filter.name] = filter.value && filter.type ? filter.value : null;

			switch (filter.type) {
				case 'date-range':
					const from =
						filter.value && typeof filter.value === 'string'
							? filter.value.split('-')[0].split('.')
							: null;

					preparedFilter[filter.name.split('-')[0]] = from
						? `${[from[2], from[1], parseInt(from[0], 10)].join('-')}T00:00:00.000Z`
						: null;
					const to =
						filter.value && typeof filter.value === 'string'
							? filter.value.split('-')[1].split('.')
							: null;

					preparedFilter[filter.name.split('-')[1]] = to
						? `${[to[2], to[1], parseInt(to[0], 10)].join('-')}T23:59:59.999Z`
						: null;
					break;
				case 'select':
				case 'search-select':
					preparedFilter[filter.name] = Array.isArray(filter.value)
						? filter.value.map(item => item.id)
						: null;
					break;
				case 'boolean':
					preparedFilter[filter.name] = filter.value === 'Да' ? true : null;
					break;
				case 'search':
					preparedFilter[filter.name] = Array.isArray(filter.value)
						? filter.value[0]?.id
						: null;
					break;
				default:
					preparedFilter[filter.name] = filter.value || null;
			}
		}

		this.facadeService.getContracts(preparedFilter);
	}

	public pageIndexChange($event: number) {
		if ($event === 1) {
			this.offset = 0;
		} else {
			this.offset = this.pageSize * $event - this.pageSize;
		}

		this.pageIndex = $event;

		this.facadeService.getContracts({
			limit: this.pageSize,
			offset: this.offset,
		});
	}

	public addContract() {
		this.modalService
			.open(ContractNewComponent)
			.afterClosed()
			.pipe(untilDestroyed(this))
			.subscribe(contract => {
				if (contract) {
					this.getFilteredContracts(true);
				}
			});
	}
}
