import { Component, Inject } from '@angular/core';
import { ModalRef } from '@app/core/modal/modal.ref';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import {
	ButtonComponent,
	ButtonType,
	CardComponent,
	IconType,
	IconPosition,
	Size,
	TextComponent,
	TextType,
	TextWeight,
} from '@front-components/components';
import { DatePipe, NgForOf } from '@angular/common';
import { DIALOG_DATA } from '@app/core/modal/modal-tokens';
import { MpReservationOrdersFacadeService } from '@app/core/facades/mp-reservation-orders-facade.service';
import { IResponse } from '@app/core/utils/response';
import { IChangeTrackerItemDto } from '@app/core/models/change-tracker/change-tracker-item-dto';
import { IHistoryRow } from '@app/pages/mp-reservation-orders/mp-reservation-orders-popup-history/mp-reservation-orders-popup-history.model';
import { PaginationComponent } from '@app/shared/components/pagination/pagination.component';

@UntilDestroy()
@Component({
	selector: 'mp-reservation-orders-popup-history',
	templateUrl: './mp-reservation-orders-popup-history.component.html',
	styleUrls: ['./mp-reservation-orders-popup-history.component.scss'],
	standalone: true,
	imports: [
		NgForOf,
		CardComponent,
		CardComponent,
		ButtonComponent,
		ButtonComponent,
		TextComponent,
		TextComponent,
		DatePipe,
		PaginationComponent,
	],
})
export class MpReservationOrdersPopupHistoryComponent {
	protected readonly ButtonType = ButtonType;
	protected readonly Size = Size;
	protected readonly TextType = TextType;
	protected readonly TextWeight = TextWeight;
	protected readonly IconPosition = IconPosition;
	protected readonly IconType = IconType;

	public historyEntries: IHistoryRow[] = [];
	public total = 0;
	public pageSize = 10;
	public pageIndex = 1;
	public offset = 0;

	constructor(
		@Inject(DIALOG_DATA) protected readonly orderId: string,
		private readonly modalRef: ModalRef,
		private readonly mpReservationOrdersFacadeService: MpReservationOrdersFacadeService,
	) {
		this.loadHistory();
	}

	private loadHistory(): void {
		this.mpReservationOrdersFacadeService
			.getHistoryOrder(this.orderId, this.pageSize, this.offset)
			.pipe(untilDestroyed(this))
			.subscribe((resp: IResponse<IChangeTrackerItemDto>) => {
				this.total = resp.total ?? resp.items.length;
				this.historyEntries = this.mapToRows(resp.items);
			});
	}

	private mapToRows(itemsHistory: IChangeTrackerItemDto[]): IHistoryRow[] {
		return itemsHistory.map((item) => {
			const nameChange = item.changes?.find(
				(changeItem) => changeItem.propertyName === 'Name',
			);
			const toWhom = nameChange
				? `${nameChange.fromValue ?? ''}, ${nameChange.toValue ?? ''}`
				: '';

			return {
				author: item.user.name ?? '-',
				action: item.action ?? '-',
				comment: item.comments ?? '-',
				toWhom,
				date: item.createdTime ?? '-',
			};
		});
	}

	public pageIndexChange(newPage: number) {
		this.pageIndex = newPage;
		this.offset = this.pageSize * (newPage - 1);
		this.loadHistory();
	}

	public close(): void {
		this.modalRef.close();
	}
}
