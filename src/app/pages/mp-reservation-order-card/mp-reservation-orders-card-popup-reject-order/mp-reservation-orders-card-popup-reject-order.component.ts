import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ModalRef } from '@app/core/modal/modal.ref';
import { HeadlineComponent } from '@app/shared/components/typography/headline/headline.component';
import { IconComponent } from '@app/shared/components/icon/icon.component';
import { DateTimePickerComponent } from '@app/shared/components/inputs/date-time-picker/date-time-picker.component';
import {
	FormControl,
	FormGroup,
	FormsModule,
	ReactiveFormsModule, Validators,
} from '@angular/forms';
import {
	ButtonComponent,
	ButtonType,
	CardComponent, FieldCtrlDirective,
	FormFieldComponent, IconPosition,
	IconType,
	Size,
	TextareaComponent,
	TextComponent,
	TextType,
	TextWeight,
} from '@front-components/components';
import {ModalService} from "@app/core/modal/modal.service";
import {
	MpReservationOrdersCardPopupCancelActionComponent
} from "@app/pages/mp-reservation-order-card/mp-reservation-orders-card-popup-cancel-action/mp-reservation-orders-card-popup-cancel-action.component";
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import {MpReservationOrderCardFacadeService} from "@app/core/facades/mp-reservation-order-card-facade.service";
import {Router} from "@angular/router";

@UntilDestroy()
@Component({
	selector: 'app-mp-reservation-orders-card-popup-reject-order',
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
		TextareaComponent,
		FormFieldComponent,
		FieldCtrlDirective,
	],
	templateUrl: './mp-reservation-orders-card-popup-reject-order.component.html',
	styleUrl: './mp-reservation-orders-card-popup-reject-order.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MpReservationOrdersCardPopupRejectOrderComponent {
	protected readonly TextType = TextType;
	protected readonly TextWeight = TextWeight;
	protected readonly Size = Size;
	protected readonly ButtonType = ButtonType;
	protected readonly IconType = IconType;

	public declineForm: FormGroup<{
		reason: FormControl<string | null>;
	}>;

	public constructor(private readonly modalRef: ModalRef, private readonly modalService: ModalService, private readonly facade: MpReservationOrderCardFacadeService,
					   protected readonly router: Router) {
		this.declineForm = new FormGroup({
			reason: new FormControl<string | null>(null, [Validators.required]),
		});
	}

	public rejectOrder() {
		this.declineForm.markAllAsTouched();

		if (this.declineForm.controls.reason.value) {
			this.facade
				.rejectOrder(this.declineForm.controls.reason.value!)
				.pipe(untilDestroyed(this))
				.subscribe(() => {
					this.modalRef.close();
					this.router.navigate(['mp-reservation-orders']);
				})
		}
	}

	protected close() {
		this.modalService
			.open(MpReservationOrdersCardPopupCancelActionComponent)
			.afterClosed()
			.pipe(untilDestroyed(this))
			.subscribe((result) => {
				if (result) {
					this.modalRef.close();
				}
			})
	}

	protected readonly IconPosition = IconPosition;
}
