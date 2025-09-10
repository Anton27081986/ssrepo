import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { ModalRef } from '@app/core/modal/modal.ref';
import { HeadlineComponent } from '@app/shared/components/typography/headline/headline.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
	ButtonComponent,
	ButtonType,
	CardComponent,
	IconPosition,
	IconType,
	IDictionaryItemDto,
	Size,
	TextComponent,
	TextType,
	TextWeight,
} from '@front-components/components';
import { TableV2Component } from '@app/shared/components/ss-table-v2/ss-table-v2.component';
import { NgForOf } from '@angular/common';
import { DIALOG_DATA } from '@app/core/modal/modal-tokens';
import { IFilterOption } from '@app/shared/components/filters/filters.component';
import { IApproveChangeRow } from '@app/core/models/mp-reservation-orders/mp-reservation-order-change-provision-details';
import { MpReservationOrdersCardPopupApproveDetailsChangeTrComponent } from './mp-reservation-orders-card-popup-approve-details-change-tr/mp-reservation-orders-card-popup-approve-details-change-tr.component';
import { MpReservationOrderCardFacadeService } from '@app/core/facades/mp-reservation-order-card-facade.service';
import { IApproveChangeData } from '@app/core/models/mp-reservation-orders/mp-reservation-order-approve-details-change';

@Component({
	selector:
		'app-mp-reservation-orders-card-popup-change-approve-details-change',
	standalone: true,
	imports: [
		CardComponent,
		HeadlineComponent,
		FormsModule,
		ReactiveFormsModule,
		TextComponent,
		ButtonComponent,
		CardComponent,
		TableV2Component,
		NgForOf,
		MpReservationOrdersCardPopupApproveDetailsChangeTrComponent,
	],
	templateUrl:
		'./mp-reservation-orders-card-popup-change-approve-details-change.component.html',
	styleUrl:
		'./mp-reservation-orders-card-popup-change-approve-details-change.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MpReservationOrdersCardPopupChangeApproveDetailsChangeComponent {
	protected readonly TextType = TextType;
	protected readonly TextWeight = TextWeight;
	protected readonly Size = Size;
	protected readonly ButtonType = ButtonType;
	protected readonly IconType = IconType;
	protected readonly IconPosition = IconPosition;

	protected items: IApproveChangeRow[] = [];
	protected tov?: IFilterOption;
	protected newTov?: IFilterOption;
	protected manager?: IDictionaryItemDto;

	constructor(
		@Inject(DIALOG_DATA) private readonly data: IApproveChangeData,
		private readonly modalRef: ModalRef,
		private readonly mpReservationOrderCardFacadeService: MpReservationOrderCardFacadeService,
	) {
		this.items = this.data.oldItems.map((oldItem, idx) => {
			const newItem = this.data.newItems[idx] ?? {
				requestedProvisionDate: '',
				amount: 0,
			};

			return {
				oldDate: oldItem.requestedProvisionDate,
				newDate: newItem.requestedProvisionDate,
				oldAmount: oldItem.amount,
				newAmount: newItem.amount,
			};
		});
		this.newTov = {
			id: Number(data.newTov.id),
			name: data.newTov.name,
			checked: true,
		};
		this.tov = {
			id: Number(data.tov.id),
			name: data.tov.name,
			checked: true,
		};
	}

	protected close(): void {
		this.modalRef.close();
	}

	public approveClarification(): void {
		this.mpReservationOrderCardFacadeService
			.approveClarification()
			.subscribe(() => {
				this.modalRef.close();
				this.mpReservationOrderCardFacadeService.reloadOrder();
			});
	}
}
