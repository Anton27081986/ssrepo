import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IAddressBookSearchUser } from '@app/core/models/address-book-search-user';
import { UserInfoPopupComponent } from '@app/components/user-info-popup/user-info-popup.component';
import { ModalService } from '@app/core/modal/modal.service';
import {CardComponent} from "@app/shared/components/card/card.component";
import {AvatarComponent} from "@app/shared/components/avatar/avatar.component";
import {TextComponent} from "@app/shared/components/typography/text/text.component";
import {IconComponent} from "@app/shared/components/icon/icon.component";
import {CommonModule, NgIf} from "@angular/common";
import {TooltipDirective} from "@app/shared/components/tooltip/tooltip.directive";

@Component({
	selector: 'ss-address-book-card',
	templateUrl: './address-book-card.component.html',
	styleUrls: ['./address-book-card.component.scss'],
	imports: [
		CommonModule,
		CardComponent,
		AvatarComponent,
		TextComponent,
		IconComponent,
		NgIf,
		TooltipDirective
	],
	standalone: true
})
export class AddressBookCardComponent {
	@Input()
	public user!: IAddressBookSearchUser;

	@Output() toggleFavorite: EventEmitter<IAddressBookSearchUser> =
		new EventEmitter<IAddressBookSearchUser>();

	constructor(private readonly modalService: ModalService) {}

	protected openModalInfoUser(id: number | undefined) {
		if (id) {
			this.modalService.open(UserInfoPopupComponent, { data: id });
		}
	}

	protected onToggleFavorite() {
		this.toggleFavorite.emit(this.user);
	}
}
