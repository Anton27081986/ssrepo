import { Component, Input } from '@angular/core';

export interface ITableItem {
	[key: string]: { text: string; url?: string } & Array<{ text: string; url?: string }> & string;
}

export interface ITableHead {
	title: string;
	field: string;
}

@Component({
	selector: 'ss-table',
	templateUrl: './table.component.html',
	styleUrls: ['./table.component.scss'],
})
export class TableComponent {
	@Input() public head: ITableHead[] | undefined;
	@Input() public items: ITableItem[] | undefined;
	protected readonly Array = Array;
}
