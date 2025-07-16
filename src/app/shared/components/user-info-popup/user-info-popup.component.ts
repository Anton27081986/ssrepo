import { UntilDestroy } from '@ngneat/until-destroy';
import { Component, forwardRef, Inject } from '@angular/core';
import { UsersApiService } from '@app/core/api/users-api.service';
import { ModalRef } from '@app/core/modal/modal.ref';
import { Observable } from 'rxjs';
import { IUserProfile } from '@app/core/models/user-profile';
import { DIALOG_DATA } from '@app/core/modal/modal-tokens';
import { AsyncPipe, CommonModule, NgIf } from '@angular/common';
import { HeadlineComponent } from '@app/shared/components/typography/headline/headline.component';
import { SsDividerComponent } from '@app/shared/components/ss-divider/ss-divider.component';
import { IconComponent } from '@app/shared/components/icon/icon.component';
import { TextComponent } from '@app/shared/components/typography/text/text.component';
import { UserCardComponent } from '@app/shared/components/user-card/user-card.component';

@UntilDestroy()
@Component({
	selector: 'app-user-info-popup',
	templateUrl: './user-info-popup.component.html',
	styleUrls: ['./user-info-popup.component.scss'],
	imports: [
		CommonModule,
		AsyncPipe,
		NgIf,
		HeadlineComponent,
		SsDividerComponent,
		forwardRef(() => UserCardComponent),
		IconComponent,
		TextComponent,
	],
	standalone: true,
})
export class UserInfoPopupComponent {
	protected $user: Observable<IUserProfile>;
	constructor(
		private readonly usersApiService: UsersApiService,
		private readonly modalRef: ModalRef,
		@Inject(DIALOG_DATA) private readonly id: number,
	) {
		this.$user = this.usersApiService.getUserById(this.id);
	}

	protected close() {
		this.modalRef.close();
	}
}
