import { Component, Input } from '@angular/core';

@Component({
	selector: 'ss-dropdown-button',
	templateUrl: './dropdown-button.component.html',
	styleUrls: ['./dropdown-button.component.scss'],
})
export class DropdownButtonComponent {
	@Input()
	public title: string | undefined;
	@Input()
	public closeOnClick: boolean = false;
	@Input()
	public isOpened = false;

	protected close() {
		if (this.closeOnClick) {
			this.isOpened = false;
		}
	}
}
