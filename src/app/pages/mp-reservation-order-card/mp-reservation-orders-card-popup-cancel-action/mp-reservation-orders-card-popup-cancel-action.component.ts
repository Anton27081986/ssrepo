import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { ModalRef } from '@app/core/modal/modal.ref';
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
import { MpReservationOrderCardFacadeService } from '@app/core/facades/mp-reservation-order-card-facade.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Router } from '@angular/router';
import { DIALOG_DATA } from '@app/core/modal/modal-tokens';

@UntilDestroy()
@Component({
	selector: 'app-mp-reservation-orders-card-popup-cancel-action',
	standalone: true,
	imports: [
		CardComponent,
		IconComponent,
		FormsModule,
		ReactiveFormsModule,
		TextComponent,
		ButtonComponent,
	],
	templateUrl:
		'./mp-reservation-orders-card-popup-cancel-action.component.html',
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

	constructor(
		@Inject(DIALOG_DATA) private readonly data: boolean,
		private readonly modalRef: ModalRef,
		private readonly mpReservationOrderCardFacadeService: MpReservationOrderCardFacadeService,
		protected readonly router: Router,
	) {}

	protected close(result: boolean = false): void {
		this.modalRef.close(result);
	}

	public removeOrder(): void {
		this.mpReservationOrderCardFacadeService
			.removeOrder()
			.pipe(untilDestroyed(this))
			.subscribe(() => {
				this.modalRef.close();
				void this.router.navigate(['mp-reservation-orders']);
			});
	}

	public rejectRemoveOrder(): void {
		this.mpReservationOrderCardFacadeService
			.rejectRemove()
			.pipe(untilDestroyed(this))
			.subscribe(() => {
				this.modalRef.close();
				void this.router.navigate(['mp-reservation-orders']);
			});
	}
}
