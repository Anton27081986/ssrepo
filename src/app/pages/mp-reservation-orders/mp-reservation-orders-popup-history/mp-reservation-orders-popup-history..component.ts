import { ChangeDetectionStrategy, Component, Inject, inject } from '@angular/core';
import { ModalRef } from '@app/core/modal/modal.ref';
import { DIALOG_DATA } from '@app/core/modal/modal-tokens';
import { QueryType } from '@app/widgets/history/models/query-type';
import { ViewMode } from '@app/widgets/history/models/view-mode';
import { HistoryComponent } from '@app/widgets/history/history.component';
import { CardComponent } from '@app/shared/components/card/card.component';
import { HeadlineComponent } from '@app/shared/components/typography/headline/headline.component';
import { IconComponent } from '@app/shared/components/icon/icon.component';

@Component({
	selector: 'app-mp-reservation-orders-popup-history',
	standalone: true,
	imports: [HistoryComponent, CardComponent, HeadlineComponent, IconComponent],
	templateUrl: './mp-reservation-orders-popup-history.component.html',
	styleUrl: './mp-reservation-orders-popup-history.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MpReservationOrdersPopupHistoryComponent {

	protected readonly queryType = QueryType;
	protected readonly viewMode = ViewMode;

	public constructor(
		@Inject(DIALOG_DATA) protected readonly orderId: number,
		private readonly modalRef: ModalRef,
	) {}

	protected close(): void {
		this.modalRef.close();
	}
}
