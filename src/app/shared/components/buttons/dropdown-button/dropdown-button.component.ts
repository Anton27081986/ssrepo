import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
	selector: 'ss-dropdown-button',
	templateUrl: './dropdown-button.component.html',
	styleUrls: ['./dropdown-button.component.scss'],
})
export class DropdownButtonComponent implements OnChanges {
	@Input()
	public title: string | undefined;

	@Input()
	public closeOnClick: boolean = false;

	@Input()
	public isDropdownVisible: boolean = true;

	protected isOpened = false;

	protected close() {
		if (this.closeOnClick) {
			this.isOpened = false;
		}
	}

	ngOnChanges(changes: SimpleChanges) {
		if (changes.isDropdownVisible) {
			if (!this.isDropdownVisible) {
				this.isOpened = false;
			}
		}
	}
}
