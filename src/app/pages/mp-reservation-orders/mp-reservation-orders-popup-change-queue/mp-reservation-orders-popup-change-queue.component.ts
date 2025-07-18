import { Component, Signal } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
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
import { SearchInputComponent } from '@app/shared/components/inputs/search-input/search-input.component';
import { TooltipTheme } from '@app/shared/components/tooltip/tooltip.enums';
import { MpReservationOrdersFacadeService } from '@app/core/facades/mp-reservation-orders-facade.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { DraggableOrderRowDirective } from '@app/pages/mp-reservation-orders/mp-reservation-orders-popup-change-queue/draggable-order-row.directive/draggable-order-row.directive';
import { IOrderReorderRequest } from '@app/pages/mp-reservation-orders/mp-reservation-orders-popup-change-queue/draggable-order-row.directive/draggable-order-row.model';
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
		SearchInputComponent,
		SelectComponent,
		DraggableOrderRowDirective,
		IconComponent,
		NgIf,
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

	public filterTov: IDictionaryItemDto | null = null;
	public filterStatus: IDictionaryItemDto | null = null;
	public status = new FormControl<IDictionaryItemDto | null>(null);

	constructor(
		private readonly modalRef: ModalRef,
		private readonly modalService: ModalService,
		private readonly mpReservationOrdersFacadeService: MpReservationOrdersFacadeService
	) {
		this.status.valueChanges
			.pipe(untilDestroyed(this))
			.subscribe((value) => {
				this.filterStatus = value;
			});

		this.mpReservationOrdersFacadeService.loadQueueOrders();
	}

	public get filteredOrdersQueue(): IQueueOrderDto[] {
		return this.queueOrders().filter((order) => {
			if (this.filterStatus) {
				const statusName = this.filterStatus.name;

				return (
					(order.status ? 'Обработан' : 'В очереди') === statusName
				);
			}

			return true;
		});
	}

	public onTovFilter(item: IDictionaryItemDto): void {
		this.filterTov = item;
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

	public findQueueOrders(): void {}

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
