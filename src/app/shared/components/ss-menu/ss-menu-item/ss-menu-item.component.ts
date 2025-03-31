import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { IMenuItemDto } from '@app/core/models/company/menu-item-dto';
import { TextComponent } from '@app/shared/components/typography/text/text.component';
import { CommonModule, NgForOf, NgIf } from '@angular/common';

@Component({
	selector: 'ss-menu-item',
	templateUrl: 'ss-menu-item.component.html',
	styleUrls: ['ss-menu-item.component.scss'],
	// encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [CommonModule, TextComponent, NgIf, NgForOf],
	standalone: true,
})
export class SsMenuItemComponent {
	@Input()
	menuItems: IMenuItemDto | undefined | null = null;

	constructor() {}
}
