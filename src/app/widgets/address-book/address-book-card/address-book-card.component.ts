import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IAddressBookSearchUser } from '@app/core/models/address-book-search-user';
import { UserInfoPopupComponent } from '@app/components/user-info-popup/user-info-popup.component';
import { ModalService } from '@app/core/modal/modal.service';

@Component({
	selector: 'ss-address-book-card',
	templateUrl: './address-book-card.component.html',
	styleUrls: ['./address-book-card.component.scss'],
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
