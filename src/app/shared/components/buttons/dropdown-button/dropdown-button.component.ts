import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import {ButtonComponent} from "@app/shared/components/buttons/button/button.component";
import {IconComponent} from "@app/shared/components/icon/icon.component";
import {CardComponent} from "@app/shared/components/card/card.component";

@Component({
	selector: 'ss-dropdown-button',
	templateUrl: './dropdown-button.component.html',
	styleUrls: ['./dropdown-button.component.scss'],
	imports: [
		ButtonComponent,
		IconComponent,
		CardComponent
	],
	standalone: true
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
