import { ChangeDetectionStrategy, Component, Signal } from '@angular/core';
import { ColumnsStateService } from '@app/core/columns.state.service';
import { ITrTableBaseColumn } from '@app/core/store';
import { ExcessIncomeState } from '@app/pages/excess-income/excess-income-state/excess-income.state';
import { toSignal } from '@angular/core/rxjs-interop';
import {
	ExcessIncomeClientRowItemField,
	ExcessIncomeClientTrComponent,
} from '@app/pages/excess-income/excess-income-tr/excess-income-client-tr/excess-income-client-tr.component';
import { IDictionaryItemDto } from '@app/core/models/company/dictionary-item-dto';
import { ClientNodeState } from '@app/pages/excess-income/excess-income-state/client-node-state';
import {
	FiltersComponent,
	IFilter,
} from '@app/shared/components/filters/filters.component';
import { UntilDestroy } from '@ngneat/until-destroy';
import { ContractorNodeState } from '@app/pages/excess-income/excess-income-state/contractor-node-state';
import { GroupNodeState } from '@app/pages/excess-income/excess-income-state/group-node-state';
import { BehaviorSubject } from 'rxjs';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
	ButtonComponent,
	ButtonType,
	collapseHeight,
	IconPosition,
	IconType,
	LabelComponent,
	LabelType,
	Size,
	TextComponent,
	TextType,
	TextWeight,
} from '@front-components/components';
import { SelectV2Component } from '@app/shared/components/inputs/select-v2/select-v2.component';
import { DropdownButtonComponent } from '@app/shared/components/buttons/dropdown-button/dropdown-button.component';
import { TableV2Component } from '@app/shared/components/ss-table-v2/ss-table-v2.component';
import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { LoaderComponent } from '@app/shared/components/loader/loader.component';
import { ExcessIncomeContractorTrComponent } from '@app/pages/excess-income/excess-income-tr/excess-income-contractor-tr/excess-income-contractor-tr.component';
import { ExcessIncomeGroupTrComponent } from '@app/pages/excess-income/excess-income-tr/excess-income-group-tr/excess-income-group-tr.component';
import { ExcessIncomeTovTrComponent } from '@app/pages/excess-income/excess-income-tr/excess-income-tov-tr/excess-income-tov-tr.component';
import { LoaderTrComponent } from '@app/shared/components/loader-tr/loader-tr.component';
import { PaginationTrComponent } from '@app/shared/components/pagination-tr/pagination-tr.component';
import { EmptyPlaceholderComponent } from '@app/shared/components/empty-placeholder/empty-placeholder.component';

@UntilDestroy()
@Component({
	selector: 'app-excess-income-page',
	templateUrl: './excess-income-page.component.html',
	styleUrls: ['./excess-income-page.component.scss'],
	providers: [ExcessIncomeState],
	animations: [collapseHeight],
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		TextComponent,
		ButtonComponent,
		SelectV2Component,
		DropdownButtonComponent,
		ReactiveFormsModule,
		FiltersComponent,
		TableV2Component,
		NgIf,
		AsyncPipe,
		LoaderComponent,
		NgForOf,
		ExcessIncomeClientTrComponent,
		ExcessIncomeContractorTrComponent,
		ExcessIncomeGroupTrComponent,
		ExcessIncomeTovTrComponent,
		LoaderTrComponent,
		PaginationTrComponent,
		EmptyPlaceholderComponent,
		LabelComponent,
	],
	standalone: true,
})
export class ExcessIncomePageComponent {
	protected clientsNode: Signal<ClientNodeState[]> = toSignal(
		this.excessIncomeStateService.clientNode$,
		{ initialValue: [] }
	);

	protected total: Signal<number> = toSignal(
		this.excessIncomeStateService.total$,
		{
			requireSync: true,
		}
	);

	protected currency: Signal<IDictionaryItemDto[]> = toSignal(
		this.excessIncomeStateService.currency$,
		{
			initialValue: [],
		}
	);

	public limit = this.excessIncomeStateService.limit;

	protected currencyControl = this.excessIncomeStateService.currencyControl;

	public filters: IFilter[] = [
		{
			name: 'client',
			type: 'search-select',
			searchType: 'client-company',
			label: 'Клиент',
			placeholder: 'Выберите клиента',
		},
		{
			name: 'contractors',
			type: 'search-select',
			searchType: 'contractor-company',
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
			searchType: 'tov-company',
			label: 'Товарная позиция',
			placeholder: 'Выберите товарную позицию',
		},
	];

	public isLoader$: BehaviorSubject<boolean> =
		this.excessIncomeStateService.isLoader$;

	public isLoaderTr$: BehaviorSubject<boolean> =
		this.excessIncomeStateService.isLoaderTr$;

	protected readonly paginationControl: FormControl<number | null> =
		this.excessIncomeStateService.paginationControl;

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
					id: ExcessIncomeClientRowItemField.nameGroups,
					title: 'Название ТПГ',
					order: 3,
					show: true,
					display: true,
					width: null,
					rowspan: 2,
					colspan: 1,
				},
				{
					id: ExcessIncomeClientRowItemField.nameTov,
					title: 'Название ТП',
					order: 4,
					show: true,
					display: true,
					width: null,
					rowspan: 2,
					colspan: 1,
				},
				{
					id: ExcessIncomeClientRowItemField.current,
					title: 'Текущая',
					order: 5,
					show: true,
					display: false,
					width: null,
					colspan: 3,
					rowspan: 1,
				},
				{
					id: ExcessIncomeClientRowItemField.next,
					title: 'Следующая',
					order: 6,
					show: true,
					display: false,
					width: null,
					colspan: 3,
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
					width: '120px',
					display: true,
					colspan: 1,
					rowspan: 1,
				},
				{
					id: ExcessIncomeClientRowItemField.sndCurrent,
					title: 'СНД, %',
					order: 2,
					show: true,
					width: '135px',
					display: true,
					colspan: 1,
					rowspan: 1,
				},
				// {
				// 	id: ExcessIncomeClientRowItemField.priceFixCurrent,
				// 	title: 'Цена фикс',
				// 	order: 3,
				// 	show: true,
				// 	width: '135px',
				// 	display: true,
				// 	colspan: 1,
				// 	rowspan: 1,
				// },
				{
					id: ExcessIncomeClientRowItemField.priceCalculateCurrent,
					title: 'Цена*',
					order: 3,
					show: true,
					width: '120px',
					display: true,
					colspan: 1,
					rowspan: 1,
				},
				{
					id: ExcessIncomeClientRowItemField.priceNext,
					title: 'Прайс',
					order: 4,
					show: true,
					width: '120px',
					display: true,
					colspan: 1,
					rowspan: 1,
				},
				{
					id: ExcessIncomeClientRowItemField.sndNext,
					title: 'СНД, %',
					order: 5,
					show: true,
					width: '135px',
					display: true,
					colspan: 1,
					rowspan: 1,
				},
				// {
				// 	id: ExcessIncomeClientRowItemField.priceFixNext,
				// 	title: 'Цена фикс',
				// 	order: 7,
				// 	show: true,
				// 	width: '135px',
				// 	display: true,
				// 	colspan: 1,
				// 	rowspan: 1,
				// },
				{
					id: ExcessIncomeClientRowItemField.priceCalculateNext,
					title: 'Цена*',
					order: 6,
					show: true,
					display: true,
					width: '120px',
					colspan: 1,
					rowspan: 1,
				},
			],
		},
	];

	protected readonly Size = Size;
	protected getFilteredExcessIncome(isNewFilter: boolean = false) {
		const preparedFilter: any = {};

		for (const filter of this.filters) {
			preparedFilter[filter.name] =
				filter.value && filter.type ? filter.value : null;

			switch (filter.type) {
				case 'search-select':
					preparedFilter[filter.name] = Array.isArray(filter.value)
						? filter.value.map((item) => item.id)
						: null;
					break;
				case 'boolean':
					preparedFilter[filter.name] =
						filter.value === 'Да' ? true : null;
					break;
				default:
					preparedFilter[filter.name] =
						filter.value?.toString().replace(',', '.') || null;
			}
		}

		this.excessIncomeStateService.applyFilters(preparedFilter);
	}

	protected readonly ButtonType = ButtonType;
	protected readonly TextType = TextType;
	protected readonly TextWeight = TextWeight;
	constructor(
		public readonly excessIncomeStateService: ExcessIncomeState,
		public readonly columnStateService: ColumnsStateService
	) {
		this.columnStateService.colsTr$.next(this.defaultCols);

		this.currencyControl.setValue({ id: 2, name: 'RUR' });
	}

	protected readonly IconPosition = IconPosition;
public expended(
		node: ClientNodeState | ContractorNodeState | GroupNodeState
	) {
		node.expended$.next(!node.expended$.value);
	}

	
	
	protected downloadInstr() {
		const instructionFileLink =
			'https://erp.ssnab.ru/api/static/general/2025/02/14/Инструкция_Управление_СНД_59605308-9107-4c29-8a42-89143dfde87c.docx';
		const link = document.createElement('a');

		link.href = instructionFileLink;
		link.click();
	}

	protected readonly IconType = IconType;
	protected readonly LabelType = LabelType;
}
