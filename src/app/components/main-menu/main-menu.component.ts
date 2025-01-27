import { Component, Input } from '@angular/core';
import { IMenuItemDto } from '@app/core/models/company/menu-item-dto';
import {AsyncPipe, CommonModule, NgForOf, NgIf} from "@angular/common";
import {TextComponent} from "@app/shared/components/typography/text/text.component";
import {SsMenuComponent} from "@app/shared/components/ss-menu/components/ss-menu.component";

@Component({
	selector: 'app-main-menu',
	templateUrl: './main-menu.component.html',
	styleUrls: ['./main-menu.component.scss'],
	imports: [
		CommonModule,
		NgForOf,
		NgIf,
		TextComponent,
		SsMenuComponent,
		AsyncPipe
	],
	standalone: true
})
export class MainMenuComponent {
	@Input() public menu: IMenuItemDto[] | null = null;

	public toggleMenu(item: IMenuItemDto) {
		item.toggle$?.next(!item.toggle$?.value);
	}
}
