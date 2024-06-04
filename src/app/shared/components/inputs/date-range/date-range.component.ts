import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
	selector: 'ss-date-range',
	templateUrl: './date-range.component.html',
	styleUrls: ['./date-range.component.scss'],
})
export class DateRangeComponent {
	startDate: string | undefined;
	endDate: string | undefined;
	@Input() public label: string | undefined;
	@Output() public select = new EventEmitter<any>();

	@Input() public value: any = '';

	dateChanged(start: string, end: string) {
		this.startDate = start;
		this.endDate = end;
		this.select.emit(start+'-'+end);
	}
}
