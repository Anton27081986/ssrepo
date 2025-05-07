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
import {DatePipe, NgForOf} from '@angular/common';
import { DIALOG_DATA } from '@app/core/modal/modal-tokens';
import { MpReservationOrdersFacadeService } from '@app/core/facades/mp-reservation-orders-facade.service';
import { IResponse } from '@app/core/utils/response';
import { IChangeTrackerItemDto } from '@app/core/models/change-tracker/change-tracker-item-dto';
import {
	IHistoryRow
} from "@app/pages/mp-reservation-orders/mp-reservation-orders-popup-history/mp-reservation-orders-popup-history.model";

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
		const rows: IHistoryRow[] = [];
		for (const item of itemsHistory) {
			const baseDate = item.createdTime;
			const author = item.user?.name ?? '-';
			const action = item.action;
			const comment = item.comments ?? '';

			if (item.changes?.length) {
				for (const change of item.changes) {
					rows.push({
						author,
						action,
						comment,
						toWhom: change.propertyName ?? '',
						date: baseDate,
					});
				}
			} else {
				rows.push({ author, action, comment, toWhom: '', date: baseDate });
			}
		}
		return rows;
	}

	public close(): void {
		this.modalRef.close();
	}
}
