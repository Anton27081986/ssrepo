import {Component, effect, OnInit, Signal, signal, WritableSignal} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {
	ButtonComponent,
	ButtonType,
	Colors, DropdownButtonComponent, DropdownItemComponent,
	IconType,
	LabelComponent,
	LabelType,
	LinkComponent,
	Size,
	TextComponent,
	TextType,
	TextWeight
} from "@front-components/components";
import { CorrespondenceComponent } from "@app/widgets/correspondence/correspondence.component";
import { CardComponent } from "@app/shared/components/card/card.component";
import {ITableItem, TableComponent} from "@app/shared/components/table/table.component";
import { MpReservationOrdersFacadeService } from "@app/core/facades/mp-reservation-orders-facade.service";
import { toSignal } from "@angular/core/rxjs-interop";
import { IMpReservationOrder } from "@app/core/models/mp-reservation-orders/mp-reservation-order";
import {ChartLineComponent, ChartLineItem, ChartLineSize} from "@app/shared/components/chart-line/chart-line.component";
import { Permissions } from '@app/core/constants/permissions.constants';
import { MpReservationOrdersCardPopupRejectOrderComponent } from '@app/pages/mp-reservation-order-card/mp-reservation-orders-card-popup-reject order/mp-reservation-orders-card-popup-reject order.component';
import { ModalService } from '@app/core/modal/modal.service';
import { MpReservationOrdersCardPopupChangeProvisionDateComponent } from '@app/pages/mp-reservation-order-card/mp-reservation-orders-card-popup-change-provision-date/mp-reservation-orders-card-popup-change-provision-date.component';
import {
	MpReservationOrdersCardPopupCancelActionComponent
} from "@app/pages/mp-reservation-order-card/mp-reservation-orders-card-popup-cancel-action/mp-reservation-orders-card-popup-cancel-action.component";
import {DatePipe} from "@angular/common";

@Component({
	selector: 'app-mp-reservation-order-card',
	templateUrl: './mp-reservation-order-card.component.html',
	styleUrls: ['./mp-reservation-order-card.component.scss'],
	imports: [
		TextComponent,
		CorrespondenceComponent,
		ButtonComponent,
		LabelComponent,
		CardComponent,
		CardComponent,
		LinkComponent,
		TableComponent,
		ChartLineComponent,
		DropdownButtonComponent,
		DropdownItemComponent,
		DatePipe
	],
	standalone: true,
})
export class MpReservationOrderCardComponent implements OnInit {
	protected readonly TextType = TextType;
	protected readonly Colors = Colors;
	protected readonly TextWeight = TextWeight;
	protected readonly ButtonType = ButtonType;
	protected readonly Size = Size;
	protected readonly LabelType = LabelType;
	protected readonly Permissions = Permissions;
	protected readonly IconType = IconType;

	public order: Signal<IMpReservationOrder | null> = toSignal(this.mpReservationOrdersFacadeService.activeOrder$, {
		initialValue: null,
	});

	public chartData: WritableSignal<ChartLineItem[]> = signal([])

	public volumes: WritableSignal<ITableItem[]> = signal([])

	public procuring: WritableSignal<ITableItem[]> = signal([])

	constructor(
		private readonly mpReservationOrdersFacadeService: MpReservationOrdersFacadeService,
		private readonly modalService: ModalService,
		private readonly activatedRoute: ActivatedRoute,
		protected readonly router: Router) {

		effect(() => {
			if (this.order()?.provision) {
				this.chartData.set([
					{ label: 'В производстве', value: this.order()!.provision.manufacturing, color: Colors.InfoHeavy },
					{ label: 'Не может быть обеспечено', value: this.order()!.provision.provisionUnavailable, color: Colors.DangerHeavy },
					{ label: 'Моя бронь', value: this.order()!.provision.provided, color: Colors.WarningLight },
					{ label: 'Свободно', value: this.order()!.provision.provisionAvailable, color: Colors.PositiveHeavy },
				]);

				this.volumes.set(this.order()!.orderRequests.map((item)=>{
					return {
						amount: item.amount.toString(),
						requestedProvisionDate: item.requestedProvisionDate.split('T')[0].split('-').reverse().join('.')
					} as unknown as ITableItem;
				}))

				this.procuring.set(this.order()!.provision?.provisionDetails?.map((item)=>{
					return {
						manufacturingAmount: item.manufacturingAmount ? item.manufacturingAmount.toString() : '-',
						productionDate: item.productionDate ? item.productionDate.split('T')[0].split('-').reverse().join('.') : '-',
						provisionDate: item.provisionDate ? item.provisionDate.split('T')[0].split('-').reverse().join('.') : '-'
					} as unknown as ITableItem;
				}) || [])
			}
		});
	}

	public ngOnInit() {
		const id = this.activatedRoute.snapshot.paramMap.get('id');

		if (id) {
			this.mpReservationOrdersFacadeService.getPersonificationById(id);
		} else {
			this.router.navigate(['mp-reservation-orders']);
		}
	}

	public openPopupRejectOrder(): void {
		this.modalService.open(MpReservationOrdersCardPopupRejectOrderComponent, { data: this.order()?.id });
	}

	public openPopupProvisionDate(): void {
		this.modalService.open(MpReservationOrdersCardPopupChangeProvisionDateComponent);
	}

	public openPopupCancelAction(): void {
		this.modalService.open(MpReservationOrdersCardPopupCancelActionComponent);
	}

	protected readonly ChartLineSize = ChartLineSize;
}
