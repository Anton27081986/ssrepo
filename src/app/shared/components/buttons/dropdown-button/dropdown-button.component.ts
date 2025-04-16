import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ButtonComponent } from '@app/shared/components/buttons/button/button.component';
import { IconComponent } from '@app/shared/components/icon/icon.component';
import { CardComponent } from '@app/shared/components/card/card.component';
import { AvatarComponent } from '@app/shared/components/avatar/avatar.component';

@Component({
	selector: 'ss-dropdown-button',
	templateUrl: './dropdown-button.component.html',
	styleUrls: ['./dropdown-button.component.scss'],
	imports: [ButtonComponent, IconComponent, CardComponent, AvatarComponent],
	standalone: true,
})
export class DropdownButtonComponent implements OnChanges {
	@Input()
	public title: string | undefined;

	@Input()
	public isAvatar = false;

	@Input()
	public avatar: string | undefined;

	@Input()
	public closeOnClick = false;

	@Input()
	public isDropdownVisible = true;

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
