import { Component, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { CompletedWorkActsFacadeService } from '@app/core/facades/completed-work-acts-facade.service';
import { ICompletedWorkAct } from '@app/core/models/completed-work-acts/completed-work-act';
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
	public pageSize = 12;
	public pageIndex = 1;
	public offset = 0;

	public filters: IFilter[] = [
		{
			name: 'DateFrom-DateTo',
			type: 'date-range',
			label: 'Период (внтр)',
			placeholder: '',
		},
		{
			name: 'Id',
			type: 'number',
			label: 'Код',
			placeholder: 'Введите код',
		},
		{
			name: 'BuUnitId',
			type: 'search',
			searchType: 'bu-units',
			label: 'БЕ Плательщика',
			placeholder: 'Введите ББ',
		},
		{
			name: 'State',
			type: 'select',
			label: 'Состояние',
			options: [
				{
					id: 0,
					name: 'Архив',
				},
				{
					id: 1,
					name: 'Черновик',
				},
				{
					id: 2,
					name: 'Проведен',
				},
			],
			placeholder: 'Выберите состояние',
		},
		{
			name: 'ProviderContractorId',
			type: 'search',
			searchType: 'contractor',
			label: 'Поставщик услуг',
			placeholder: 'Выберите поставщика услуг',
		},
		{
			name: 'ApplicantUserId',
			type: 'search',
			searchType: 'user',
			label: 'Заявитель',
			placeholder: 'Введите ФИО',
		},
		{
			name: 'TotalAmount',
			type: 'number',
			label: 'Сумма (Итого)',
			placeholder: 'Введите сумму',
		},
		{
			name: 'Additional',
			type: 'boolean',
			label: 'Требуется моя виза',
			options: [
				{
					id: 0,
					name: 'Все',
				},
				{
					id: 1,
					name: 'Требуется моя виза',
				},
			],
			placeholder: '',
		},
		{
			name: 'WithArchive',
			type: 'boolean',
			label: 'Показать архивные акты',
			options: [
				{ id: 1, name: 'Да' },
				{ id: 0, name: 'Нет' },
			],
			placeholder: '',
		},
	];

	public constructor(private readonly completedWorkActsFacade: CompletedWorkActsFacadeService) {
		this.getFilteredActs();
	}

	public acts: Signal<IResponse<ICompletedWorkAct> | null> = toSignal(
		this.completedWorkActsFacade.acts$,
		{
			initialValue: null,
		},
	);

	public isLoader: Signal<boolean> = toSignal(this.completedWorkActsFacade.isLoader$, {
		initialValue: true,
	});

	protected getTableItems(acts: IResponse<ICompletedWorkAct>): ITableItem[] {
		const actTableItems = acts.items.map(x => {
			const tableItem: ICompletedWorkActTableItem = {} as ICompletedWorkActTableItem;

			tableItem.code = {
				text: x.id.toString() ?? '-',
				url: x.id !== undefined ? `./competed-work-acts/${x.id}` : '-',
			};

			tableItem.state = x.state.name ?? '-';

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

			tableItem.payerBuUnit = x.payerBuUnit?.name ?? '-';

			tableItem.providerContractor = {
				text: x.providerContractor?.name ?? '-',
				url: x.providerContractor?.linkToDetail ?? '-',
			};

			tableItem.applicantUser = x.applicantUser?.name ?? '-';

			tableItem.contract = x.contract?.name ?? '-';

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
			limit: isNewFilter ? 12 : this.pageSize,
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
				case 'search':
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

	public pageIndexChange($event: number) {
		if ($event === 1) {
			this.offset = 0;
		} else {
			this.offset = this.pageSize * $event - this.pageSize;
		}

		this.offset = this.pageSize * $event - this.pageSize;
		this.pageIndex = $event;

		this.getFilteredActs();
	}
}
