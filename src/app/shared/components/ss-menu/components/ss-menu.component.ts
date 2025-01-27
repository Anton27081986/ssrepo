import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { IMenuItemDto } from '@app/core/models/company/menu-item-dto';
import {SsMenuItemComponent} from "@app/shared/components/ss-menu/ss-menu-item/ss-menu-item.component";
import {CommonModule, NgForOf, NgIf, NgStyle} from "@angular/common";

@Component({
	selector: 'ss-menu',
	templateUrl: 'ss-menu.component.html',
	styleUrls: ['ss-menu.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		CommonModule,
		SsMenuItemComponent,
		NgStyle,
		NgIf,
		NgForOf
	],
	standalone: true
})
export class SsMenuComponent {
	@Input() menuItems: IMenuItemDto[] | undefined | null = null;
	@Input() parent: IMenuItemDto | null = null;

	close() {
		this.parent?.toggle$?.next(false);
	}

	getColomnCount(): string {
		switch (this.parent?.name) {
			case 'ИЗБРАННОЕ': {
				return '2';
				break;
			}
			case 'КОНТРАГЕНТЫ': {
				return '3';
				break;
			}
			case 'ТОРГОВЛЯ': {
				return '4';
				break;
			}
			case 'ФИНАНСЫ': {
				return '5';
				break;
			}
			case 'СКЛАД': {
				return '4';
				break;
			}
			case 'КАЛЕНДАРЬ': {
				return '4';
				break;
			}
			case 'ОТЧЕТЫ': {
				return '6';
				break;
			}
			case 'ПЕРСОНАЛ': {
				return '4';
				break;
			}
			case 'СИСТЕМА': {
				return '2';
				break;
			}
			default: {
				return '2';
			}
		}
	}
}
