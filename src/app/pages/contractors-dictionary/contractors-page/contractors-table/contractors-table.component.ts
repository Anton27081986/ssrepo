import {
	ChangeDetectionStrategy,
	Component,
	effect,
	inject,
	input,
	InputSignal,
} from '@angular/core';
import {
	Align,
	Colors,
	DropdownItemComponent,
	DropdownListComponent,
	IconType,
	PopoverTriggerForDirective,
	SsTableState,
	TableCellDirective,
	TableDirective,
	TableThGroupComponent,
	TdComponent,
	TextComponent,
	TextType,
	TextWeight,
	ThComponent,
	TrComponent,
	UtilityButtonComponent,
} from '@front-library/components';
import { ContractorsItemDto } from '@app/pages/contractors-dictionary/models/contractors-item-dto';
import { TableColumnConfig } from '@front-library/components/lib/components/table/models';

@Component({
	selector: 'app-contractors-table',
	templateUrl: './contractors-table.component.html',
	styleUrls: ['./contractors-table.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [
		TableDirective,
		TableThGroupComponent,
		TextComponent,
		TableCellDirective,
		TrComponent,
		TdComponent,
		ThComponent,
		UtilityButtonComponent,
		DropdownListComponent,
		DropdownItemComponent,
		PopoverTriggerForDirective,
	],
})
export class ContractorsTableComponent {
	public items: InputSignal<ContractorsItemDto[]> = input.required();
	protected tableState: SsTableState<ContractorsItemDto> = inject(
		SsTableState<ContractorsItemDto>
	);
	public readonly visibleColumnsIds = this.tableState.visibleColumnsIds;
	public readonly visibleColumns = this.tableState.visibleColumns;
	public readonly data = this.tableState.data;
	protected readonly Colors = Colors;
	protected readonly TextWeight = TextWeight;
	protected readonly TextType = TextType;
	protected readonly Align = Align;

	constructor() {
		effect(() => {
			this.tableState.initialize(this.items(), baseColumns);
		});
	}

	protected readonly ColumnIdEnum = ColumnIdEnum;
	protected readonly IconType = IconType;
}

export enum ColumnIdEnum {
	Code = 'code',
	ShortName = 'shortName',
	Client = 'client',
	Category = 'category',
	Inn = 'inn',
	Status = 'status',
	Group = 'group',
	Country = 'country',
	BusinessManager = 'businessManager',
	Edo = 'edo',
	Actions = 'actions',
}

export const baseColumns: TableColumnConfig[] = [
	{
		id: ColumnIdEnum.Code,
		name: 'Код карточки',
		showInDropdown: true,
		showInHeader: true,
		visible: true,
		stickyColumn: true,
	},
	{
		id: ColumnIdEnum.ShortName,
		name: 'Краткое название',
		showInDropdown: true,
		showInHeader: true,
		visible: true,
		stickyColumn: true,
	},
	{
		id: ColumnIdEnum.Client,
		name: 'Клиент',
		showInDropdown: true,
		showInHeader: true,
		visible: true,
		stickyColumn: true,
	},
	{
		id: ColumnIdEnum.Category,
		name: 'Категория',
		showInDropdown: true,
		showInHeader: true,
		visible: true,
		stickyColumn: true,
	},
	{
		id: ColumnIdEnum.Inn,
		name: 'ИНН',
		showInDropdown: true,
		showInHeader: true,
		visible: true,
		stickyColumn: true,
	},
	{
		id: ColumnIdEnum.Status,
		name: 'Статус',
		showInDropdown: true,
		showInHeader: true,
		visible: true,
		stickyColumn: true,
	},
	{
		id: ColumnIdEnum.Group,
		name: 'Группа',
		showInDropdown: true,
		showInHeader: true,
		visible: true,
		stickyColumn: true,
	},
	{
		id: ColumnIdEnum.Country,
		name: 'Страна, регион',
		showInDropdown: true,
		showInHeader: true,
		visible: true,
		stickyColumn: true,
	},
	{
		id: ColumnIdEnum.BusinessManager,
		name: 'БМ',
		showInDropdown: true,
		showInHeader: true,
		visible: true,
		stickyColumn: true,
	},
	{
		id: ColumnIdEnum.Edo,
		name: 'ЭДО',
		showInDropdown: true,
		showInHeader: true,
		visible: true,
		stickyColumn: true,
	},
	{
		id: ColumnIdEnum.Actions,
		name: '',
		showInDropdown: true,
		showInHeader: true,
		visible: true,
		stickyColumn: true,
		width: '40px',
		align: Align.Center,
	},
];
