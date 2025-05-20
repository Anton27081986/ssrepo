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
import { IProvisionDetailsTypes } from '@app/core/models/mp-reservation-orders/mp-reservation-order';
import { SearchInputComponent } from '@app/shared/components/inputs/search-input/search-input.component';
import { IFilterOption } from '@app/shared/components/filters/filters.component';
import { IReservationOrderChangeProvisionDetails } from '@app/core/models/mp-reservation-orders/mp-reservation-order-change-provision-details';
import { MpReservationOrdersCardPopupChangeProvisionDetailsTrComponent } from '@app/pages/mp-reservation-order-card/mp-reservation-orders-card-popup-change-provision-details/mp-reservation-orders-card-popup-change-provision-details-tr/mp-reservation-orders-card-popup-change-provision-details-tr.component';
import { NoticeDialogComponent } from '@app/shared/components/notice-dialog/notice-dialog.component';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ModalService } from '@app/core/modal/modal.service';
import { MpReservationOrderCardFacadeService } from '@app/core/facades/mp-reservation-order-card-facade.service';
import { forkJoin } from 'rxjs';

interface IProvisionDetailsData {
	items: IProvisionDetailsTypes[];
	tov: IDictionaryItemDto;
}

@UntilDestroy()
@Component({
	selector: 'app-mp-reservation-orders-card-popup-change-provision-details',
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
	],
	templateUrl: './mp-reservation-orders-card-popup-change-provision-details.component.html',
	styleUrl: './mp-reservation-orders-card-popup-change-provision-details.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MpReservationOrdersCardPopupChangeProvisionDetailsComponent {
	protected readonly TextType = TextType;
	protected readonly TextWeight = TextWeight;
	protected readonly Size = Size;
	protected readonly ButtonType = ButtonType;
	protected readonly IconType = IconType;
	protected readonly IconPosition = IconPosition;

	protected items: IReservationOrderChangeProvisionDetails[] = [];
	protected tov?: IFilterOption;

	public constructor(
		@Inject(DIALOG_DATA) private readonly data: IProvisionDetailsData,
		private readonly modalRef: ModalRef,
		private readonly modalService: ModalService,
		private readonly mpReservationOrderCardFacadeService: MpReservationOrderCardFacadeService,
	) {
		if (data) {
			this.items = this.data.items.map(item => {
				return {
					productionDate: item.productionDate,
					provisionDate: item.provisionDate,
					manufacturingAmount: item.manufacturingAmount,
					errors: {},
				};
			});

			this.tov = {
				id: this.data.tov.id,
				name: this.data.tov.name,
				checked: true,
			} as IFilterOption;
		}
	}

	public updateProvisionDetails(): void {
		const requests = this.items.map(item =>
			this.mpReservationOrderCardFacadeService.changeDetails(item),
		);

		forkJoin(requests)
			.pipe(untilDestroyed(this))
			.subscribe(() => {
				this.mpReservationOrderCardFacadeService.reloadOrder();
				this.modalRef.close();
			});
	}

	public close(): void {
		this.modalRef.close();
	}

	protected openPopupCancelAction(): void {
		this.modalService
			.open(NoticeDialogComponent, {
				data: {
					header: 'Изменения не будут сохранены',
					text: 'Вы уверены, что хотите совершить действие',
					type: 'Warning',
					buttonOk: 'Отмена',
					buttonCancel: 'Не сохранять',
				},
			})
			.afterClosed()
			.pipe(untilDestroyed(this))
			.subscribe(status => {
				if (!status) {
					this.modalRef.close();
				}
			});
	}
}
