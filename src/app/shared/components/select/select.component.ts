import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
	selector: 'ss-select',
	templateUrl: './select.component.html',
	styleUrls: ['./select.component.scss'],
})
export class SelectComponent {
	@Input() public label: string | undefined;
	@Output() public onChange = new EventEmitter<any>();

	public onClick(el: EventTarget | null) {
		if (el) {
			this.onChange.emit((el as HTMLSelectElement).value);
		}
	}
}
