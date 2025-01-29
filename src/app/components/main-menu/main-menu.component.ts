import { Component, Input } from '@angular/core';
import { IMenuItemDto } from '@app/core/models/company/menu-item-dto';

@Component({
	selector: 'app-main-menu',
	templateUrl: './main-menu.component.html',
	styleUrls: ['./main-menu.component.scss'],
})
export class MainMenuComponent {
	@Input() public menu: IMenuItemDto[] | null = null;

	public toggleMenu(item: IMenuItemDto) {
		item.toggle$?.next(!item.toggle$?.value);
	}
}
