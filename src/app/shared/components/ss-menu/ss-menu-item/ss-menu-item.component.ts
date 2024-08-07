import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { IMenuItemDto } from '@app/core/models/company/menu-item-dto';

@Component({
	selector: 'ss-menu-item',
	templateUrl: 'ss-menu-item.component.html',
	styleUrls: ['ss-menu-item.component.scss'],
	// encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SsMenuItemComponent {
	@Input() menuItems: IMenuItemDto | undefined | null = null;
	constructor() {}
}
