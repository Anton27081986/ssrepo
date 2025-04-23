import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import { ModalRef } from '@app/core/modal/modal.ref';
import { HeadlineComponent } from '@app/shared/components/typography/headline/headline.component';
import { IconComponent } from '@app/shared/components/icon/icon.component';
import { DateTimePickerComponent } from '@app/shared/components/inputs/date-time-picker/date-time-picker.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
    ButtonComponent,
    ButtonType, CardComponent, IconPosition, IconType, IDictionaryItemDto, SelectComponent,
    Size,
    TextComponent,
    TextType,
    TextWeight,
} from '@front-components/components';
import {TextareaComponent} from "@app/shared/components/textarea/textarea.component";
import {SelectV2Component} from "@app/shared/components/inputs/select-v2/select-v2.component";
import {TableComponent} from "@app/shared/components/table/table.component";
import {TableV2Component} from "@app/shared/components/ss-table-v2/ss-table-v2.component";
import {
    AtWorkRowItemTrComponent
} from "@app/pages/client-proposals-page/at-work-modal/at-work-row-item-tr/at-work-row-item-tr.component";
import {NgForOf} from "@angular/common";
import {
    MpReservationOrdersCardPopupQualificationTrComponent
} from "@app/pages/mp-reservation-order-card/mp-reservation-orders-card-popup-qualification/mp-reservation-orders-card-popup-qualification-tr/mp-reservation-orders-card-popup-qualification-tr.component";
import {DIALOG_DATA} from "@app/core/modal/modal-tokens";
import {IOrderRequests} from "@app/core/models/mp-reservation-orders/mp-reservation-order";
import {
    IOrderChangeQualification
} from "@app/core/models/mp-reservation-orders/mp-reservation-order-change-qualification";
import {SearchInputComponent} from "@app/shared/components/inputs/search-input/search-input.component";
import {IFilterOption} from "@app/shared/components/filters/filters.component";

interface IQualificationData {
    id: number,
    items: IOrderRequests[],
    tov: IDictionaryItemDto
}

@Component({
	selector: 'app-mp-reservation-orders-popup-qualification',
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
    ],
	templateUrl: './mp-reservation-orders-card-popup-qualification.component.html',
	styleUrl: './mp-reservation-orders-card-popup-qualification.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MpReservationOrdersCardPopupQualificationComponent {
	protected readonly TextType = TextType;
	protected readonly TextWeight = TextWeight;
	protected readonly Size = Size;
	protected readonly ButtonType = ButtonType;
    protected items: IOrderChangeQualification[] = [];
    protected tov?: IFilterOption;
    protected id?: number;

	public constructor(private readonly modalRef: ModalRef,
    @Inject(DIALOG_DATA) private readonly data: IQualificationData) {
        if (data) {
            this.items = this.data.items.map(item => {
                return {
                    amount: item.amount,
                    requestedProvisionDate: item.requestedProvisionDate,
                    errors: {},
                };
            });

            this.tov = { id: this.data.tov.id, name: this.data.tov.name, checked: true } as IFilterOption;
            this.id = this.data.id;
        }
    }

	protected close() {
		this.modalRef.close();
	}

	protected readonly IconType = IconType;
	protected readonly IconPosition = IconPosition;
}
