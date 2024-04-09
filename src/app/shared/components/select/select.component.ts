import {Component, EventEmitter, Output} from '@angular/core';

@Component({
	selector: 'ss-select',
	templateUrl: './select.component.html',
	styleUrls: ['./select.component.scss'],
})
export class SelectComponent {
	@Output() onChange = new EventEmitter<any>;

	constructor() {
	}

	onClick(el: EventTarget | null) {
		if (el) {
			this.onChange.emit((el as HTMLSelectElement).value);
		}
	}
}
