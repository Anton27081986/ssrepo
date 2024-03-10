import { Component, Input } from '@angular/core';

@Component({
	selector: 'ss-table',
	templateUrl: './table.component.html',
	styleUrls: ['./table.component.scss'],
})
export class TableComponent {
	@Input() public head: Array<{ title: string; fields: string[]; link?: string }> | undefined;
	@Input() public items: Array<{ [key: string]: string | number }> | undefined;
	protected readonly Array = Array;

	protected getFieldValue(fields: string[], item: { [key: string]: string | number }): string {
		return fields.map(field => item[field]).join(' ');
	}
}
