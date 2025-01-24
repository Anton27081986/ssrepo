import { UntilDestroy } from '@ngneat/until-destroy';
import { Component, Input } from '@angular/core';
import { IUserDto } from '@app/core/models/awards/user-dto';
import { ModalService } from '@app/core/modal/modal.service';
import { UserInfoPopupComponent } from '@app/components/user-info-popup/user-info-popup.component';
import {AvatarComponent} from "@app/shared/components/avatar/avatar.component";
import {NgIf} from "@angular/common";
import {TextComponent} from "@app/shared/components/typography/text/text.component";

@UntilDestroy()
@Component({
	selector: 'app-user-card',
	templateUrl: './user-card.component.html',
	styleUrls: ['./user-card.component.scss'],
	imports: [
		AvatarComponent,
		NgIf,
		TextComponent
	],
	standalone: true
})
export class UserCardComponent {
	@Input() user: IUserDto | null = null;
	@Input() viewPopupInfo: boolean = false;
	@Input() public size: 'small' | 'medium' | 'large' | 'big' = 'medium';

	constructor(private readonly modalService: ModalService) {}

	protected openModalInfoUser() {
		if (this.user && this.viewPopupInfo) {
			this.modalService.open(UserInfoPopupComponent, { data: this.user.id });
		}
	}
}
