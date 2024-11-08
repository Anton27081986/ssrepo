import { ChangeDetectionStrategy, Component, computed, Signal } from '@angular/core';
import { ColumnsStateService } from '@app/core/columns.state.service';
import { IStoreTableBaseColumn } from '@app/core/store';
import {
	ExcessIncomeCriteria,
	ExcessIncomeState,
} from '@app/pages/excess-income/excess-income-state/excess-income.state';
import { toSignal } from '@angular/core/rxjs-interop';
import { ExcessIncomeClientRowItemField } from '@app/pages/excess-income/excess-income-tr/excess-income-client-tr/excess-income-client-tr.component';
import { IDictionaryItemDto } from '@app/core/models/company/dictionary-item-dto';
import { ClientNodeState } from '@app/pages/excess-income/excess-income-state/client-node-state';
import { IFilter } from '@app/shared/components/filters/filters.component';
import { UntilDestroy } from '@ngneat/until-destroy';
@UntilDestroy()
@Component({
	selector: 'app-excess-income-page',
	templateUrl: './excess-income-page.component.html',
	styleUrls: ['./excess-income-page.component.scss'],
	providers: [ExcessIncomeState],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExcessIncomePageComponent {
	protected clientsNode: Signal<ClientNodeState[]> = toSignal(
		this.excessIncomeStateService.clientNode$,
		{ requireSync: true },
	);

	protected total: Signal<number> = toSignal(this.excessIncomeStateService.total$, {
		requireSync: true,
	});

	protected currency: Signal<IDictionaryItemDto[]> = toSignal(
		this.excessIncomeStateService.currency$,
		{
			initialValue: [],
		},
	);

	public pageSize = this.excessIncomeStateService.limit;

	protected currencyControl = this.excessIncomeStateService.currencyControl;
	public filters: IFilter[] = [
		{
			name: 'client',
			type: 'search-select',
			searchType: 'client',
			label: 'Клиент',
			placeholder: 'Выберите клиента',
		},
		{
			name: 'contractor',
			type: 'search-select',
			searchType: 'contractor',
			label: 'Контрагент',
			placeholder: 'Выберите контрагента',
		},
		{
			name: 'tovGroup',
			type: 'search-select',
			searchType: 'tovGroups',
			label: 'Товарная подгруппа',
			placeholder: 'Выберите товарную подгруппу',
		},
		{
			name: 'tovs',
			type: 'search-select',
			searchType: 'tovs',
			label: 'Товарная подгруппа',
			placeholder: 'Выберите товарную позицию',
		},
	];

	protected getFilteredExcessIncome(isNewFilter: boolean = false) {
		const preparedFilter: any = {};

		for (const filter of this.filters) {
			preparedFilter[filter.name] = filter.value && filter.type ? filter.value : null;

			switch (filter.type) {
				case 'search-select':
					preparedFilter[filter.name] = Array.isArray(filter.value)
						? filter.value.map(item => item.id)
						: null;
					break;
				case 'boolean':
					preparedFilter[filter.name] = filter.value === 'Да' ? true : null;
					break;
				default:
					preparedFilter[filter.name] =
						filter.value?.toString().replace(',', '.') || null;
			}
		}

		this.excessIncomeStateService.applyFilters(preparedFilter);
	}

	constructor(
		public readonly excessIncomeStateService: ExcessIncomeState,
		private readonly columnStateService: ColumnsStateService,
	) {
		this.columnStateService.cols$.next(this.defaultCols);
		this.currencyControl.setValue({ id: 2, name: 'RUR' });
	}

	public pageOffsetChange($event: number) {
		this.excessIncomeStateService.offset$.next($event);
	}

	public readonly defaultCols: IStoreTableBaseColumn[] = [
		{
			id: ExcessIncomeClientRowItemField.client,
			title: 'Клиент',
			order: 1,
			show: true,
			width: null,
		},
		{
			id: ExcessIncomeClientRowItemField.contractors,
			title: 'Контрагент',
			order: 2,
			show: true,
			width: null,
		},
		{
			id: ExcessIncomeClientRowItemField.otsr,
			title: 'Отср.',
			order: 3,
			show: true,
			width: null,
		},
		{
			id: ExcessIncomeClientRowItemField.comments,
			title: 'Комментарий',
			order: 4,
			show: true,
			width: null,
		},
		{
			id: ExcessIncomeClientRowItemField.nameGroups,
			title: 'Название ТПГ',
			order: 5,
			show: true,
			width: null,
		},
		{
			id: ExcessIncomeClientRowItemField.nameTov,
			title: 'Название ТПР',
			order: 6,
			show: true,
			width: null,
		},
		{
			id: ExcessIncomeClientRowItemField.priceCurrent,
			title: 'Прайс',
			order: 7,
			show: true,
			width: null,
		},
		{
			id: ExcessIncomeClientRowItemField.sndCurrent,
			title: 'СНД',
			order: 8,
			show: true,
			width: null,
		},
		{
			id: ExcessIncomeClientRowItemField.priceFixCurrent,
			title: 'Цена фикс',
			order: 9,
			show: true,
			width: null,
		},
		{
			id: ExcessIncomeClientRowItemField.priceCalculateCurrent,
			title: 'Цена*',
			order: 10,
			show: true,
			width: null,
		},
		{
			id: ExcessIncomeClientRowItemField.priceNext,
			title: 'Прайс',
			order: 11,
			show: true,
			width: null,
		},
		{
			id: ExcessIncomeClientRowItemField.sndNext,
			title: 'СНД',
			order: 12,
			show: true,
			width: null,
		},
		{
			id: ExcessIncomeClientRowItemField.priceFixNext,
			title: 'Цена фикс',
			order: 13,
			show: true,
			width: null,
		},
		{
			id: ExcessIncomeClientRowItemField.priceCalculateNext,
			title: 'Цена*',
			order: 14,
			show: true,
			width: null,
		},
		{
			id: ExcessIncomeClientRowItemField.actions,
			title: 'Действие',
			order: 15,
			show: true,
			width: null,
		},
	];
}
