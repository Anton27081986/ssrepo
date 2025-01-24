import { Component, Input } from '@angular/core';
import {CardComponent} from "@app/shared/components/card/card.component";
import {ButtonComponent} from "@app/shared/components/buttons/button/button.component";
import {NgClass} from "@angular/common";
import {TextComponent} from "@app/shared/components/typography/text/text.component";
import {IconComponent} from "@app/shared/components/icon/icon.component";

@Component({
	selector: 'ss-card-dropdown',
	templateUrl: './card-dropdown.component.html',
	styleUrls: ['./card-dropdown.component.scss'],
	imports: [
		CardComponent,
		ButtonComponent,
		NgClass,
		TextComponent,
		IconComponent
	],
	standalone: true
})
export class CardDropdownComponent {
	@Input() public title!: string;
	@Input() public titleSize: '1' | '2' | '3' = '1';

	protected isHidden = false;
	public onHideButton() {
		this.isHidden = !this.isHidden;
	}
}
