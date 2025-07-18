import { Component } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ModalRef } from '@app/core/modal/modal.ref';
import {
	FormBuilder,
	FormControl,
	FormGroup,
	ReactiveFormsModule,
	Validators,
} from '@angular/forms';
import { IUserDto } from '@app/core/models/awards/user-dto';
import { BehaviorSubject, Subscription } from 'rxjs';
import { IAttachmentDto } from '@app/core/models/notifications/attachment-dto';
import { ThankColleagueFacadeService } from '@app/core/facades/thanks-colleague-facade.service';
import { NotificationToastService } from '@app/core/services/notification-toast.service';
import { HeadlineComponent } from '@app/shared/components/typography/headline/headline.component';
import { IconComponent } from '@app/shared/components/icon/icon.component';
import { SsDividerComponent } from '@app/shared/components/ss-divider/ss-divider.component';
import { ChipsUserSearchComponent } from '@app/shared/components/inputs/chips-user-search/chips-user-search.component';
import { TextareaComponent } from '@app/shared/components/textarea/textarea.component';
import { ButtonComponent } from '@app/shared/components/buttons/button/button.component';

@UntilDestroy()
@Component({
	selector: 'app-add-thanks-colleague-modal',
	templateUrl: './add-thanks-colleague-modal.component.html',
	styleUrls: ['./add-thanks-colleague-modal.component.scss'],
	imports: [
		HeadlineComponent,
		IconComponent,
		SsDividerComponent,
		ReactiveFormsModule,
		ChipsUserSearchComponent,
		TextareaComponent,
		ButtonComponent,
	],
	standalone: true,
})
export class AddThanksColleagueModalComponent {
	protected formGroup: FormGroup<AddVictoryForm>;

	public toUsers: IUserDto[] = [];
	protected subscription: Subscription = new Subscription();

	protected readonly victoryFiles = new BehaviorSubject<
		IAttachmentDto[] | null
	>(null);

	constructor(
		private readonly modalRef: ModalRef,
		private readonly _formBuilder: FormBuilder,
		protected readonly facade: ThankColleagueFacadeService,
		private readonly notificationService: NotificationToastService
	) {
		this.formGroup = this._formBuilder.group<AddVictoryForm>({
			note: this._formBuilder.nonNullable.control(
				'',
				Validators.required
			),
			userIds: this._formBuilder.nonNullable.control([]),
		});
	}

	protected close() {
		this.modalRef.close();
	}

	submit() {
		const userIds = this.toUsers.map((user) => user.id!);

		if (userIds.length) {
			this.formGroup.controls.userIds.setValue(userIds);
		}

		if (this.formGroup.valid) {
			this.facade
				.addThanksForColleague(this.formGroup.value)
				.pipe(untilDestroyed(this))
				.subscribe(() => {
					this.notificationService.addToast(
						'Благодарность уже добавлена на главный экран',
						'ok'
					);
					this.facade.resetThanks();
					this.close();
				});
		}
	}
}

export interface AddVictoryForm {
	note: FormControl<string>;
	userIds: FormControl<number[]>;
}
