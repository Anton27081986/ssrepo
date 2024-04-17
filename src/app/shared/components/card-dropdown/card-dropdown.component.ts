import { Component, Input } from '@angular/core';

@Component({
	selector: 'ss-card-dropdown',
	templateUrl: './card-dropdown.component.html',
	styleUrls: ['./card-dropdown.component.scss'],
})
export class CardDropdownComponent {
	@Input() public title!: string;
	@Input() public titleSize: '1' | '2' | '3' = '1';

	protected isHidden = false;
	public onHideButton() {
		this.isHidden = !this.isHidden;
	}
}
