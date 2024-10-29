import { Component, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { CompletedWorkActsFacadeService } from '@app/core/facades/completed-work-acts-facade.service';
import { CompletedWorkAct } from '@app/core/models/completed-work-acts/completed-work-act';
import { IResponse } from '@app/core/utils/response';
import { ITableItem } from '@app/shared/components/table/table.component';
import { ICompletedWorkActTableItem } from '@app/pages/completed-work-acts/completed-work-act-table-item';
import { IFilter } from '@app/shared/components/filters/filters.component';

@Component({
	selector: 'ss-completed-work-acts',
	templateUrl: './completed-work-acts.component.html',
	styleUrls: ['./completed-work-acts.component.scss'],
})
export class CompletedWorkActsComponent {
	public total: number | undefined;
	public pageSize = 20;
	public pageIndex = 1;
	public offset = 0;

	public filters: IFilter[] = [
		{
			name: 'DateFrom-DateTo',
			type: 'date-range',
			label: 'Выберите дату',
			placeholder: '',
		},
		{
			name: 'Id',
			type: 'number',
			label: '',
			placeholder: 'Введите код',
		},
		{
			name: 'BuUnitId',
			type: 'string',
			label: 'БЕ Плательщика',
			placeholder: 'Введите ББ',
		},
		{
			name: 'statuses',
			type: 'select',
			label: '',
			placeholder: 'Выберите состояние',
		},
		{
			name: 'statuses',
			type: 'select',
			label: '',
			placeholder: 'Выберите поставщика услуг',
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
			label: 'Заявитель',
			placeholder: 'Введите ФИО',
		},
		{
			name: 'amount',
			type: 'string',
			label: '',
			placeholder: 'Введите сумму акта',
		},
		{
			name: 'additional',
			type: 'select',
			label: 'Дополнительно',
			placeholder: 'Требуется моя виза',
		},
		{
			name: 'withArchived',
			type: 'boolean',
			label: 'Показать архивные акты',
			options: [
				{ id: 1, name: 'Да' },
				{ id: 0, name: 'Нет' },
			],
			placeholder: '',
		},
	];

	constructor(private readonly completedWorkActsFacade: CompletedWorkActsFacadeService) {
		this.getFilteredActs();
	}

	public acts: Signal<IResponse<CompletedWorkAct> | null> = toSignal(
		this.completedWorkActsFacade.acts$,
		{
			initialValue: null,
		},
	);

	public isLoader: Signal<boolean> = toSignal(this.completedWorkActsFacade.isLoader$, {
		initialValue: true,
	});

	protected getTableItems(acts: IResponse<CompletedWorkAct>): ITableItem[] {
		const actTableItems = acts.items.map(x => {
			const tableItem: ICompletedWorkActTableItem = {} as ICompletedWorkActTableItem;

			tableItem.code = {
				text: x.id.toString() ?? '-',
				url: x.id !== undefined ? `./competed-work-acts/${x.id}` : '-',
			};

			tableItem.state = x.state.name;

			tableItem.externalActDate = `${new Date(Date.parse(x.externalActDate)).toLocaleString(
				'ru-RU',
				{
					year: 'numeric',
					month: 'numeric',
					day: 'numeric',
				},
			)}`;

			tableItem.internalActDate = `${new Date(Date.parse(x.internalActDate)).toLocaleString(
				'ru-RU',
				{
					year: 'numeric',
					month: 'numeric',
					day: 'numeric',
				},
			)}`;

			tableItem.externalActNumber = x.externalActNumber;

			tableItem.internalActNumber = x.internalActNumber;

			tableItem.payerBuUnit = x.payerBuUnit.name;

			tableItem.providerContractor = {
				text: x.providerContractor.name ?? '-',
				url: x.providerContractorLinkUrl ?? '-',
			};

			tableItem.applicantUser = x.applicantUser.name;

			tableItem.totalAmount = x.totalAmount;

			return tableItem;
		});

		return <ITableItem[]>(<unknown>actTableItems);
	}

	public getFilteredActs(isNewFilter: boolean = false) {
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
					preparedFilter[filter.name] = filter.value === 'Да' ? true : null;
					break;
				default:
					preparedFilter[filter.name] =
						filter.value?.toString().replace(',', '.') || null;
			}
		}

		this.completedWorkActsFacade.applyFilters(preparedFilter);
	}
}
