import { Component } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ModalRef } from '@app/core/modal/modal.ref';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { IUserDto } from '@app/core/models/awards/user-dto';
import { VictoryEventEnum } from '@app/components/victory/victory-root.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { AddVictoryModalResultComponent } from '@app/components/victory/modal/add-victory-modal-result/add-victory-modal-result.component';
import { ModalService } from '@app/core/modal/modal.service';
import { IAttachmentDto } from '@app/core/models/notifications/attachment-dto';
import { ThankColleagueFacadeService } from '@app/core/facades/thanks-colleague-facade.service';
import {NotificationToastService} from "@app/core/services/notification-toast.service";

@UntilDestroy()
@Component({
	selector: 'app-add-thanks-colleague-modal',
	templateUrl: './add-thanks-colleague-modal.component.html',
	styleUrls: ['./add-thanks-colleague-modal.component.scss'],
})
export class AddThanksColleagueModalComponent {
	protected formGroup: FormGroup<AddVictoryForm>;

	public toUsers: IUserDto[] = [];
	protected subscription: Subscription = new Subscription();

	protected readonly victoryFiles = new BehaviorSubject<IAttachmentDto[] | null>(null);

	constructor(
		private readonly modalRef: ModalRef,
		private readonly _formBuilder: FormBuilder,
		protected readonly facade: ThankColleagueFacadeService,
		private readonly notificationService: NotificationToastService,
	) {
		this.formGroup = this._formBuilder.group<AddVictoryForm>({
			note: this._formBuilder.nonNullable.control('', Validators.required),
			userIds: this._formBuilder.nonNullable.control([]),
		});
	}

	protected close() {
		this.modalRef.close();
	}

	submit() {
		const userIds = this.toUsers.map(user => user.id!);

		if (userIds.length) {
			this.formGroup.controls.userIds.setValue(userIds);
		}

		if (this.formGroup.valid) {
			this.facade
				.addThanksForColleague(this.formGroup.value)
				.pipe(untilDestroyed(this))
				.subscribe(() => {
					this.notificationService.addToast('Благодарность уже добавлена на главный экран', 'ok')
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
