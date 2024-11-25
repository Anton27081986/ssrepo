import { ChangeDetectionStrategy, Component, Signal } from '@angular/core';
import { ColumnsStateService } from '@app/core/columns.state.service';
import { ITrTableBaseColumn } from '@app/core/store';
import { ExcessIncomeState } from '@app/pages/excess-income/excess-income-state/excess-income.state';
import { toSignal } from '@angular/core/rxjs-interop';
import { ExcessIncomeClientRowItemField } from '@app/pages/excess-income/excess-income-tr/excess-income-client-tr/excess-income-client-tr.component';
import { IDictionaryItemDto } from '@app/core/models/company/dictionary-item-dto';
import { ClientNodeState } from '@app/pages/excess-income/excess-income-state/client-node-state';
import { IFilter } from '@app/shared/components/filters/filters.component';
import { UntilDestroy } from '@ngneat/until-destroy';
import { ContractorNodeState } from '@app/pages/excess-income/excess-income-state/contractor-node-state';
import { GroupNodeState } from '@app/pages/excess-income/excess-income-state/group-node-state';
import { BehaviorSubject } from 'rxjs';
import { FormControl } from '@angular/forms';

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
		{ initialValue: [] },
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

	public limit = this.excessIncomeStateService.limit;

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
			name: 'contractors',
			type: 'search-select',
			searchType: 'contractor',
			label: 'Контрагент',
			placeholder: 'Выберите контрагента',
		},
		{
			name: 'tovGroups',
			type: 'search-select',
			searchType: 'tovGroups',
			label: 'Товарная подгруппа',
			placeholder: 'Выберите товарную подгруппу',
		},
		{
			name: 'tov',
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

	public isLoader$: BehaviorSubject<boolean> = this.excessIncomeStateService.isLoader$;

	protected readonly paginationControl: FormControl<number | null> =
		this.excessIncomeStateService.paginationControl;

	constructor(
		public readonly excessIncomeStateService: ExcessIncomeState,
		private readonly columnStateService: ColumnsStateService,
	) {
		this.columnStateService.colsTr$.next(this.defaultCols);

		this.currencyControl.setValue({ id: 2, name: 'RUR' });
	}

	public expended(node: ClientNodeState | ContractorNodeState | GroupNodeState) {
		node.expended$.next(!node.expended$.value);
	}

	protected defaultCols: ITrTableBaseColumn[] = [
		{
			cols: [
				{
					id: ExcessIncomeClientRowItemField.client,
					title: 'Клиент',
					order: 1,
					show: true,
					width: null,
					display: true,
					rowspan: 2,
					colspan: 1,
				},
				{
					id: ExcessIncomeClientRowItemField.contractors,
					title: 'Контрагент',
					order: 2,
					show: true,
					display: true,
					width: null,
					rowspan: 2,
					colspan: 1,
				},
				{
					id: ExcessIncomeClientRowItemField.otsr,
					title: 'Отср.',
					order: 3,
					show: true,
					display: true,
					width: null,
					rowspan: 2,
					colspan: 1,
				},
				{
					id: ExcessIncomeClientRowItemField.comments,
					title: 'Комментарий',
					order: 4,
					show: true,
					display: true,
					width: null,
					rowspan: 2,
					colspan: 1,
				},
				{
					id: ExcessIncomeClientRowItemField.nameGroups,
					title: 'Название ТПГ',
					order: 5,
					show: true,
					display: true,
					width: null,
					rowspan: 2,
					colspan: 1,
				},
				{
					id: ExcessIncomeClientRowItemField.nameTov,
					title: 'Название ТП',
					order: 6,
					show: true,
					display: true,
					width: null,
					rowspan: 2,
					colspan: 1,
				},
				{
					id: ExcessIncomeClientRowItemField.current,
					title: 'Текущая',
					order: 7,
					show: true,
					display: false,
					width: null,
					colspan: 4,
					rowspan: 1,
				},
				{
					id: ExcessIncomeClientRowItemField.next,
					title: 'Следующая',
					order: 7,
					show: true,
					display: false,
					width: null,
					colspan: 4,
					rowspan: 1,
				},
			],
		},
		{
			cols: [
				{
					id: ExcessIncomeClientRowItemField.priceCurrent,
					title: 'Прайс',
					order: 1,
					show: true,
					width: null,
					display: true,
					colspan: 1,
					rowspan: 1,
				},
				{
					id: ExcessIncomeClientRowItemField.sndCurrent,
					title: 'СНД',
					order: 2,
					show: true,
					width: null,
					display: true,
					colspan: 1,
					rowspan: 1,
				},
				{
					id: ExcessIncomeClientRowItemField.priceFixCurrent,
					title: 'Цена фикс',
					order: 3,
					show: true,
					width: null,
					display: true,
					colspan: 1,
					rowspan: 1,
				},
				{
					id: ExcessIncomeClientRowItemField.priceCalculateCurrent,
					title: 'Цена*',
					order: 4,
					show: true,
					width: null,
					display: true,
					colspan: 1,
					rowspan: 1,
				},
				{
					id: ExcessIncomeClientRowItemField.priceNext,
					title: 'Прайс',
					order: 5,
					show: true,
					width: null,
					display: true,
					colspan: 1,
					rowspan: 1,
				},
				{
					id: ExcessIncomeClientRowItemField.sndNext,
					title: 'СНД',
					order: 6,
					show: true,
					width: null,
					display: true,
					colspan: 1,
					rowspan: 1,
				},
				{
					id: ExcessIncomeClientRowItemField.priceFixNext,
					title: 'Цена фикс',
					order: 7,
					show: true,
					width: null,
					display: true,
					colspan: 1,
					rowspan: 1,
				},
				{
					id: ExcessIncomeClientRowItemField.priceCalculateNext,
					title: 'Цена*',
					order: 8,
					show: true,
					display: true,
					width: null,
					colspan: 1,
					rowspan: 1,
				},
			],
		},
	];
}
