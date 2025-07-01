import {
	Directive,
	HostListener,
	Input,
	Output,
	EventEmitter,
} from '@angular/core';
import {
	IOrderReorderRequest
} from "@app/pages/mp-reservation-orders/mp-reservation-orders-popup-change-queue/draggable-order-row.directive/draggable-order-row.model";

@Directive({
	selector: '[ssDraggableOrderRow]',
	standalone: true,
	host: {
		'[attr.draggable]': 'true',
	},
})
export class DraggableOrderRowDirective {
	/** Временное хранилище id перетаскиваемого заказа */
	private static draggedOrderId: number | null = null;

	/** Входящий заказ (должен содержать поле queueOrderId) */
	@Input() queueOrder!: { id: number };

	/** Текущий индекс в списке */
	@Input() index!: number;

	/** Выходное событие с { orderId, toIndex } */
	@Output() reorder = new EventEmitter<IOrderReorderRequest>();

	@HostListener('dragstart', ['$event'])
	onDragStart(event: DragEvent): void {
		DraggableOrderRowDirective.draggedOrderId = this.queueOrder.id;
		event.dataTransfer?.setData('text/plain', this.queueOrder.id.toString());
		event.dataTransfer!.effectAllowed = 'move';
	}

	@HostListener('dragend')
	onDragEnd(): void {
		DraggableOrderRowDirective.draggedOrderId = null;
	}

	@HostListener('dragover', ['$event'])
	onDragOver(event: DragEvent): void {
		event.preventDefault();
		event.dataTransfer!.dropEffect = 'move';
	}

	@HostListener('drop', ['$event'])
	onDrop(event: DragEvent): void {
		event.preventDefault();
		const fromOrderId = DraggableOrderRowDirective.draggedOrderId;
		const toIndex = this.index;

		if (fromOrderId && fromOrderId !== this.queueOrder.id) {
			this.reorder.emit({ orderId: fromOrderId, toIndex });
		}
	}
}
