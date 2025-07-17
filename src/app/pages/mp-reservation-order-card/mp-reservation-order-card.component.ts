import {
	Component,
	effect,
	OnInit,
	Signal,
	signal,
	WritableSignal,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
	ButtonComponent,
	ButtonType,
	Colors,
	DropdownButtonComponent,
	DropdownItemComponent,
	IconComponent,
	IconType,
	LabelComponent,
	LabelType,
	LinkComponent,
	Size,
	TextComponent,
	TextType,
	TextWeight,
} from '@front-components/components';
import { CorrespondenceComponent } from '@app/widgets/correspondence/correspondence.component';
import { CardComponent } from '@app/shared/components/card/card.component';
import {
	ITableItem,
	TableComponent,
} from '@app/shared/components/table/table.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { IMpReservationOrder } from '@app/core/models/mp-reservation-orders/mp-reservation-order';
import { Permissions } from '@app/core/constants/permissions.constants';
import { MpReservationOrdersCardPopupRejectOrderComponent } from '@app/pages/mp-reservation-order-card/mp-reservation-orders-card-popup-reject-order/mp-reservation-orders-card-popup-reject-order.component';
import { ModalService } from '@app/core/modal/modal.service';
import { MpReservationOrdersCardPopupChangeProvisionDateComponent } from '@app/pages/mp-reservation-order-card/mp-reservation-orders-card-popup-change-provision-date/mp-reservation-orders-card-popup-change-provision-date.component';
import { DatePipe } from '@angular/common';
import { MpReservationOrdersCardPopupQualificationComponent } from '@app/pages/mp-reservation-order-card/mp-reservation-orders-card-popup-qualification/mp-reservation-orders-card-popup-qualification.component';
import { MpReservationOrdersCardPopupChangeProvisionDetailsComponent } from '@app/pages/mp-reservation-order-card/mp-reservation-orders-card-popup-change-provision-details/mp-reservation-orders-card-popup-change-provision-details.component';
import { MpReservationOrdersCardPopupChangeManagerComponent } from '@app/pages/mp-reservation-order-card/mp-reservation-orders-card-popup-change-manager/mp-reservation-orders-card-popup-change-manager.component';
import { MpReservationOrdersCardPopupChangeApproveDetailsChangeComponent } from '@app/pages/mp-reservation-order-card/mp-reservation-orders-card-popup-change-approve-details-change/mp-reservation-orders-card-popup-change-approve-details-change.component';
import { MpReservationOrdersCardPopupOrderInProductionComponent } from '@app/pages/mp-reservation-order-card/mp-reservation-orders-card-popup-order-in-production/mp-reservation-orders-card-popup-order-in-production.component';
import { MpReservationOrdersCardPopupOrderApprovalComponent } from '@app/pages/mp-reservation-order-card/mp-reservation-orders-card-popup-order-approval/mp-reservation-orders-card-popup-order-approval.component';
import { TagV2Component } from '@app/shared/components/tag-v2/tag-v2.component';
import { MpReservationOrderCardFacadeService } from '@app/core/facades/mp-reservation-order-card-facade.service';
import { CorrespondenceTypeEnum } from '@app/widgets/correspondence/correspondence-type-enum';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { MpReservationOrdersCardPopupCancelActionComponent } from '@app/pages/mp-reservation-order-card/mp-reservation-orders-card-popup-cancel-action/mp-reservation-orders-card-popup-cancel-action.component';
import { NumWithSpacesPipe } from '@app/core/pipes/num-with-spaces.pipe';
import { MpReservationOrdersPopupHistoryComponent } from '@app/pages/mp-reservation-orders/mp-reservation-orders-popup-history/mp-reservation-orders-popup-history..component';

@UntilDestroy()
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
		LinkComponent,
		TableComponent,
		DropdownButtonComponent,
		DropdownItemComponent,
		DatePipe,
		TagV2Component,
		IconComponent,
		NumWithSpacesPipe,
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

	protected readonly CorrespondenceTypeEnum = CorrespondenceTypeEnum;

	public pipeNumWithSpaces = new NumWithSpacesPipe();

	public order: Signal<IMpReservationOrder | null> = toSignal(
		this.mpReservationOrderCardFacadeService.activeOrder$,
		{
			initialValue: null,
		},
	);

	public volumes: WritableSignal<ITableItem[]> = signal([]);

	public procuring: WritableSignal<ITableItem[]> = signal([]);

	constructor(
		private readonly mpReservationOrderCardFacadeService: MpReservationOrderCardFacadeService,
		private readonly modalService: ModalService,
		private readonly activatedRoute: ActivatedRoute,
		protected readonly router: Router,
	) {
		effect(() => {
			if (this.order()?.provision) {
				this.volumes.set(
					this.order()!.orderRequests.map((item) => {
						return {
							amount: this.pipeNumWithSpaces.numberWithSpaces(
								item.amount,
								2,
							),
							requestedProvisionDate: item.requestedProvisionDate
								.split('T')[0]
								.split('-')
								.reverse()
								.join('.'),
						} as unknown as ITableItem;
					}),
				);

				this.procuring.set(
					this.order()!.provision?.provisionDetails?.map((item) => {
						return {
							manufacturingAmount: item.manufacturingAmount
								? this.pipeNumWithSpaces.numberWithSpaces(
										item.manufacturingAmount,
										2,
									)
								: '-',
							productionDate: item.productionDate
								? item.productionDate
										.split('T')[0]
										.split('-')
										.reverse()
										.join('.')
								: '-',
							provisionDate: item.provisionDate
								? item.provisionDate
										.split('T')[0]
										.split('-')
										.reverse()
										.join('.')
								: '-',
						} as unknown as ITableItem;
					}) || [],
				);
			}
		});
	}

	public ngOnInit(): void {
		const id = this.activatedRoute.snapshot.paramMap.get('id');

		if (id) {
			this.mpReservationOrderCardFacadeService.getPersonificationById(id);
		} else {
			void this.router.navigate(['mp-reservation-orders']);
		}
	}

	public get isDisabledActionButton(): boolean {
		return this.order()?.status.name === 'Отклонено';
	}

	public openPopupRejectOrder(): void {
		this.modalService.open(
			MpReservationOrdersCardPopupRejectOrderComponent,
			{
				data: this.order()?.id,
			},
		);
	}

	public openPopupHistoryOrder(orderId: number): void {
		this.modalService.open(MpReservationOrdersPopupHistoryComponent, {
			data: orderId,
		});
	}

	public openPopupOrderApproval(): void {
		this.modalService.open(
			MpReservationOrdersCardPopupOrderApprovalComponent,
		);
	}

	public openPopupOrderInProduction(): void {
		this.modalService.open(
			MpReservationOrdersCardPopupOrderInProductionComponent,
		);
	}

	public openPopupProvisionDate(): void {
		this.modalService.open(
			MpReservationOrdersCardPopupChangeProvisionDateComponent,
			{
				data: {
					id: this.order()?.id,
					provisionDetails: this.order()?.provision.provisionDetails,
				},
			},
		);
	}

	public removeOrder(): void {
		this.mpReservationOrderCardFacadeService
			.removeOrder()
			.pipe(untilDestroyed(this))
			.subscribe(() => {
				void this.router.navigate(['mp-reservation-orders']);
			});
	}

	public openPopupCancelActionRemove(isConfirm: boolean): void {
		this.modalService.open(
			MpReservationOrdersCardPopupCancelActionComponent,
			{
				data: isConfirm,
			},
		);
	}

	public openPopupQualification(): void {
		this.modalService.open(
			MpReservationOrdersCardPopupQualificationComponent,
			{
				data: {
					items: this.order()?.orderRequests,
					tov: this.order()?.tov,
					id: this.order()?.id,
				},
			},
		);
	}

	public openPopupChangeProvisionDetails(): void {
		this.modalService.open(
			MpReservationOrdersCardPopupChangeProvisionDetailsComponent,
			{
				data: {
					items: this.order()?.provision.provisionDetails,
					tov: this.order()?.tov,
					id: this.order()?.id,
				},
			},
		);
	}

	public openPopupApproveDetailsChange(): void {
		const oldItems = this.order()!.orderRequests;
		const tov = this.order()!.tov;
		const id = this.order()!.id;

		this.mpReservationOrderCardFacadeService
			.getApproveClarification()
			.pipe(untilDestroyed(this))
			.subscribe((response) => {
				const newItems = response.provisionRequests;

				this.modalService.open(
					MpReservationOrdersCardPopupChangeApproveDetailsChangeComponent,
					{
						data: { oldItems, newItems, tov, id },
					},
				);
			});
	}

	public openPopupChangeManager(): void {
		this.modalService.open(
			MpReservationOrdersCardPopupChangeManagerComponent,
			{
				data: {
					items: this.order()?.provision.provisionDetails,
					tov: this.order()?.tov,
					id: this.order()?.id,
					manager: this.order()?.manager,
				},
			},
		);
	}
}
