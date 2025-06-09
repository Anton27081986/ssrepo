import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { ModalRef } from '@app/core/modal/modal.ref';
import { HeadlineComponent } from '@app/shared/components/typography/headline/headline.component';
import { IconComponent } from '@app/shared/components/icon/icon.component';
import { DateTimePickerComponent } from '@app/shared/components/inputs/date-time-picker/date-time-picker.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
	ButtonComponent,
	ButtonType,
	CardComponent,
	IconPosition,
	IconType,
	IDictionaryItemDto,
	SelectComponent,
	Size,
	TextComponent,
	TextType,
	TextWeight,
} from '@front-components/components';
import { TextareaComponent } from '@app/shared/components/textarea/textarea.component';
import { SelectV2Component } from '@app/shared/components/inputs/select-v2/select-v2.component';
import { TableComponent } from '@app/shared/components/table/table.component';
import { TableV2Component } from '@app/shared/components/ss-table-v2/ss-table-v2.component';
import { AtWorkRowItemTrComponent } from '@app/pages/client-proposals-page/at-work-modal/at-work-row-item-tr/at-work-row-item-tr.component';
import { NgForOf } from '@angular/common';
import { MpReservationOrdersCardPopupQualificationTrComponent } from '@app/pages/mp-reservation-order-card/mp-reservation-orders-card-popup-qualification/mp-reservation-orders-card-popup-qualification-tr/mp-reservation-orders-card-popup-qualification-tr.component';
import { DIALOG_DATA } from '@app/core/modal/modal-tokens';
import { SearchInputComponent } from '@app/shared/components/inputs/search-input/search-input.component';
import { IFilterOption } from '@app/shared/components/filters/filters.component';
import { IApproveChangeRow } from '@app/core/models/mp-reservation-orders/mp-reservation-order-change-provision-details';
import { MpReservationOrdersCardPopupChangeProvisionDetailsTrComponent } from '@app/pages/mp-reservation-order-card/mp-reservation-orders-card-popup-change-provision-details/mp-reservation-orders-card-popup-change-provision-details-tr/mp-reservation-orders-card-popup-change-provision-details-tr.component';
import { MpReservationOrdersCardPopupChangeManagerTrComponent } from '@app/pages/mp-reservation-order-card/mp-reservation-orders-card-popup-change-manager/mp-reservation-orders-card-popup-change-manager-tr/mp-reservation-orders-card-popup-change-manager-tr.component';
import { MpReservationOrdersCardPopupApproveDetailsChangeTrComponent } from '@app/pages/mp-reservation-order-card/mp-reservation-orders-card-popup-change-approve-details-change/mp-reservation-orders-card-popup-approve-details-change-tr/mp-reservation-orders-card-popup-approve-details-change-tr.component';
import { MpReservationOrderCardFacadeService } from '@app/core/facades/mp-reservation-order-card-facade.service';
import { IApproveChangeData } from '@app/core/models/mp-reservation-orders/mp-reservation-order-approve-details-change';
import {NoticeDialogComponent} from "@app/shared/components/notice-dialog/notice-dialog.component";
import {untilDestroyed} from "@ngneat/until-destroy";
import {ModalService} from "@app/core/modal/modal.service";

@Component({
	selector: 'app-mp-reservation-orders-card-popup-change-approve-details-change',
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
		CardComponent,
		SelectComponent,
		SelectV2Component,
		TableComponent,
		TableV2Component,
		AtWorkRowItemTrComponent,
		NgForOf,
		MpReservationOrdersCardPopupQualificationTrComponent,
		SearchInputComponent,
		MpReservationOrdersCardPopupChangeProvisionDetailsTrComponent,
		MpReservationOrdersCardPopupChangeManagerTrComponent,
		MpReservationOrdersCardPopupApproveDetailsChangeTrComponent,
	],
	templateUrl: './mp-reservation-orders-card-popup-change-approve-details-change.component.html',
	styleUrl: './mp-reservation-orders-card-popup-change-approve-details-change.component.scss',
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
	protected manager?: IDictionaryItemDto;

	public constructor(
		@Inject(DIALOG_DATA) private readonly data: IApproveChangeData,
		private readonly modalRef: ModalRef,
		private readonly mpReservationOrderCardFacadeService: MpReservationOrderCardFacadeService,
		private readonly modalService: ModalService,
	) {
		this.items = this.data.oldItems.map((oldItem, idx) => {
			const newItem = this.data.newItems[idx] ?? { requestedProvisionDate: '', amount: 0 };
			return {
				oldDate: oldItem.requestedProvisionDate,
				newDate: newItem.requestedProvisionDate,
				oldAmount: oldItem.amount,
				newAmount: newItem.amount,
			};
		});
		this.tov = { id: Number(data.tov.id), name: data.tov.name, checked: true };
	}

	protected close() {
		this.modalRef.close();
	}

	public openPopupCancelAction(): void {
		this.modalService
			.open(NoticeDialogComponent, {
				data: {
					header: 'Изменения не будут сохранены',
					text: 'Вы уверены, что хотите совершить действие',
					type: 'Warning',
					buttonOk: 'Отмена',
					buttonCancel: 'Не сохранять',
				},
			}).afterClosed().pipe(untilDestroyed(this)).subscribe(status => {
			if (!status) {
				this.modalRef.close()
			}
		})
	}

	public approveClarification(): void {
		this.mpReservationOrderCardFacadeService.approveClarification().subscribe();
		this.modalRef.close();
		this.mpReservationOrderCardFacadeService.reloadOrder();
	}
}
