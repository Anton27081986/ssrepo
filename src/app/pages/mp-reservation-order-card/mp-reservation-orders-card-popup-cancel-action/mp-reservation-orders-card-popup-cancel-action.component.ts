import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import { ModalRef } from '@app/core/modal/modal.ref';
import { HeadlineComponent } from '@app/shared/components/typography/headline/headline.component';
import { DateTimePickerComponent } from '@app/shared/components/inputs/date-time-picker/date-time-picker.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
	ButtonComponent,
	ButtonType,
	IconComponent,
	IconType,
	Size,
	TextComponent,
	TextType,
	TextWeight,
	CardComponent,
} from '@front-components/components';
import { TextareaComponent } from '@app/shared/components/textarea/textarea.component';
import { MpReservationOrderCardFacadeService } from '@app/core/facades/mp-reservation-order-card-facade.service';
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {Router} from "@angular/router";
import {DIALOG_DATA} from "@app/core/modal/modal-tokens";

@UntilDestroy()
@Component({
	selector: 'app-mp-reservation-orders-card-popup-cancel-action',
	standalone: true,
	imports: [
		CardComponent,
		HeadlineComponent,
		IconComponent,
		DateTimePickerComponent,
		FormsModule,
		ReactiveFormsModule,
		TextComponent,
		ButtonComponent,
		TextareaComponent,
	],
	templateUrl: './mp-reservation-orders-card-popup-cancel-action.component.html',
	styleUrl: './mp-reservation-orders-card-popup-cancel-action.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MpReservationOrdersCardPopupCancelActionComponent {
	protected readonly TextType = TextType;
	protected readonly TextWeight = TextWeight;
	protected readonly Size = Size;
	protected readonly IconType = IconType;
	protected readonly ButtonType = ButtonType;

	public readonly isConfirmed = this.data;

	public constructor(
		@Inject(DIALOG_DATA) private readonly data: boolean,
		private readonly modalRef: ModalRef,
		private readonly mpReservationOrderCardFacadeService: MpReservationOrderCardFacadeService,
		protected readonly router: Router,
	) {}

	protected close(result: boolean = false) {
		this.modalRef.close(result);
	}

	public removeOrder(): void {
		this.mpReservationOrderCardFacadeService.removeOrder().pipe(untilDestroyed(this))
			.subscribe(() => {
				this.modalRef.close();
				this.router.navigate(['mp-reservation-orders']);
			});
	}

	public rejectRemoveOrder(): void {
		this.mpReservationOrderCardFacadeService.rejectRemove().pipe(untilDestroyed(this))
			.subscribe(() => {
				this.modalRef.close();
				this.router.navigate(['mp-reservation-orders']);
			});
	}
}
