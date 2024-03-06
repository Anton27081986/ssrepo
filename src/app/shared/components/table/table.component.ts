import {Component, Input} from '@angular/core';

@Component({
	selector: 'ss-table',
	templateUrl: './table.component.html',
	styleUrls: ['./table.component.scss'],
})
export class TableComponent {
	@Input() head: { title: string, field: string | string[], link?: string }[] | undefined;
	@Input() items: { [key: string]: string; }[] | undefined;
	protected readonly Array = Array;

	getValueFrom() {}
}
