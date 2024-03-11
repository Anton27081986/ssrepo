import { Component, Input } from '@angular/core';

export interface ITableItem {
	[key: string]: string | number | null;
}

export interface ITableHead {
	title: string;
	fields: string[];
	link?: string;
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

	protected getFieldValue(fields: string[], item: ITableItem): string {
		return fields.map(field => item[field]).join(' ');
	}
}
