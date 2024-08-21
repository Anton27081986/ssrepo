import { UntilDestroy } from '@ngneat/until-destroy';
import { Component, Inject, OnInit } from '@angular/core';
import { UsersApiService } from '@app/core/api/users-api.service';
import { ModalRef } from '@app/core/modal/modal.ref';
import { Observable } from 'rxjs';
import { IUserProfile } from '@app/core/models/user-profile';
import { DIALOG_DATA } from '@app/core/modal/modal-tokens';

@UntilDestroy()
@Component({
	selector: 'app-user-info-popup',
	templateUrl: './user-info-popup.component.html',
	styleUrls: ['./user-info-popup.component.scss'],
})
export class UserInfoPopupComponent {
	protected $user: Observable<IUserProfile>;
	constructor(
		private readonly usersApiService: UsersApiService,
		private readonly modalRef: ModalRef,
		@Inject(DIALOG_DATA) private readonly data: string,
	) {
		this.$user = this.usersApiService.getUserById(this.data);
	}

	protected close() {
		this.modalRef.close();
	}
}
