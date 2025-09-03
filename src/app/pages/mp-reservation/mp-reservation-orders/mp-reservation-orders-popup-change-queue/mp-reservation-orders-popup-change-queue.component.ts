import { Component, Signal } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { ModalRef } from '@app/core/modal/modal.ref';
import { ModalService } from '@app/core/modal/modal.service';
import {
	ButtonComponent,
	ButtonType,
	CardComponent,
	FieldCtrlDirective,
	FormFieldComponent,
	IconPosition,
	IconType,
	InputComponent,
	SelectComponent,
	Size,
	TextComponent,
	TextType,
	TextWeight,
} from '@front-components/components';
import { DatePipe, NgForOf, NgIf } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IDictionaryItemDto } from '@app/core/models/company/dictionary-item-dto';
import { DialogComponent } from '@app/shared/components/dialog/dialog.component';
import { TooltipTheme } from '@app/shared/components/tooltip/tooltip.enums';
import { MpReservationOrdersFacadeService } from '@app/core/facades/mp-reservation-orders-facade.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { DraggableOrderRowDirective } from './draggable-order-row.directive/draggable-order-row.directive';
import { IOrderReorderRequest } from './draggable-order-row.directive/draggable-order-row.model';
import { IQueueOrderDto } from '@app/core/models/mp-reservation-orders/mp-reservation-queue-order';
import {
	IconComponent,
	IconType as IconTypeNew,
} from '@front-library/components';

@UntilDestroy()
@Component({
	selector: 'mp-reservation-orders-popup-change-queue',
	templateUrl: './mp-reservation-orders-popup-change-queue.component.html',
	styleUrls: ['./mp-reservation-orders-popup-change-queue.component.scss'],
	standalone: true,
	imports: [
		NgForOf,
		CardComponent,
		ButtonComponent,
		TextComponent,
		FormsModule,
		FieldCtrlDirective,
		FormFieldComponent,
		ReactiveFormsModule,
		DatePipe,
		SelectComponent,
		DraggableOrderRowDirective,
		IconComponent,
		NgIf,
		InputComponent,
	],
})
export class MpReservationOrdersPopupChangeQueueComponent {
	protected readonly ButtonType = ButtonType;
	protected readonly Size = Size;
	protected readonly TextType = TextType;
	protected readonly TextWeight = TextWeight;
	protected readonly IconType = IconType;
	protected readonly IconTypeNew = IconTypeNew;
	protected readonly TooltipTheme = TooltipTheme;
	protected readonly IconPosition = IconPosition;

	protected statusOptions: Signal<IDictionaryItemDto[]> = toSignal(
		this.mpReservationOrdersFacadeService.personificationStatuses$,
		{
			initialValue: [],
		}
	);

	protected queueOrders: Signal<IQueueOrderDto[]> = toSignal(
		this.mpReservationOrdersFacadeService.queueOrders$,
		{ initialValue: [] }
	);

	public filterTovName = new FormControl<string>('');
	public filterStatusName = new FormControl<IDictionaryItemDto | null>(null);

	constructor(
		private readonly modalRef: ModalRef,
		private readonly modalService: ModalService,
		private readonly mpReservationOrdersFacadeService: MpReservationOrdersFacadeService
	) {
		this.mpReservationOrdersFacadeService.loadQueueOrders();
	}

	public get filteredOrdersQueue(): IQueueOrderDto[] {
		const list = this.queueOrders() ?? [];
		const tovSearch = this.filterTovName.value?.trim().toLowerCase() || '';
		const statusControl = this.filterStatusName.value;

		return list.filter((order) => {
			if (tovSearch) {
				const name = order.personificationOrder.tov.name.toLowerCase();

				if (!name.includes(tovSearch)) {
					return false;
				}
			}

			if (statusControl) {
				if (
					order.personificationOrder.status?.name !==
					statusControl.name
				) {
					return false;
				}
			}

			return true;
		});
	}

	public clearStatusFilter(): void {
		this.filterStatusName.reset();
	}

	public close(): void {
		this.modalService
			.open(DialogComponent, {
				data: {
					header: 'Данные не будут сохранены',
					text: 'Вы уверены, что хотите уйти?',
				},
			})
			.afterClosed()
			.subscribe((status) => {
				if (status) {
					this.modalRef.close();
				}
			});
	}

	public onOrderReorder(event: IOrderReorderRequest): void {
		const { orderId, toIndex } = event;
		const current = [...this.queueOrders()];
		const fromIndex = current.findIndex((q) => q.id === orderId);

		if (fromIndex < 0 || fromIndex === toIndex) {
			return;
		}

		const [moved] = current.splice(fromIndex, 1);

		current.splice(toIndex, 0, moved);

		current.forEach((queueOrder, idx) => {
			queueOrder.position = idx + 1;
		});

		this.mpReservationOrdersFacadeService.updateQueueOrders(current);

		const oldPos = fromIndex + 1;
		const newPos = toIndex + 1;

		this.mpReservationOrdersFacadeService.updateOrderPositionInQueue(
			oldPos,
			newPos
		);
	}
}
