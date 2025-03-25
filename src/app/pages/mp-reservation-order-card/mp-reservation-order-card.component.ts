import {Component, effect, OnInit, signal, Signal, WritableSignal} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import {
	ButtonComponent,
	ButtonType,
	Colors, LabelComponent, LabelType, LinkComponent,
	Size,
	TextComponent,
	TextType,
	TextWeight
} from "@front-components/components";
import { CorrespondenceComponent } from "@app/widgets/correspondence/correspondence.component";
import { CardComponent } from "@app/shared/components/card/card.component";
import { TableComponent } from "@app/shared/components/table/table.component";
import { MpReservationOrdersFacadeService } from "@app/core/facades/mp-reservation-orders-facade.service";
import { toSignal } from "@angular/core/rxjs-interop";
import { IMpReservationOrder } from "@app/core/models/mp-reservation-orders/mp-reservation-order";
import { ChartLineComponent, ChartLineItem } from "@app/shared/components/chart-line/chart-line.component";

@Component({
	selector: "app-mp-reservation-order-card",
	templateUrl: "./mp-reservation-order-card.component.html",
	styleUrls: ["./mp-reservation-order-card.component.scss"],
	imports: [
		TextComponent,
		CorrespondenceComponent,
		ButtonComponent,
		LabelComponent,
		CardComponent,
		CardComponent,
		LinkComponent,
		TableComponent,
		ChartLineComponent
	],
	standalone: true
})
export class MpReservationOrderCardComponent implements OnInit {

	public order: Signal<IMpReservationOrder | null> = toSignal(this.mpReservationOrdersFacadeService.activeOrder$, {
		initialValue: null,
	});

	public chartData: WritableSignal<ChartLineItem[]> = signal([])

	constructor(
		private readonly mpReservationOrdersFacadeService: MpReservationOrdersFacadeService,
		private readonly activatedRoute: ActivatedRoute,
		protected readonly router: Router) {

		effect(() => {
			if (this.order()?.provision) {
				this.chartData.set([
					{ label: 'В производстве', value: this.order()!.provision.manufacturing, color: '#AF60FF' },
					{ label: 'Не может быть обеспечено', value: this.order()!.provision.provisionUnavailable, color: '#E51414' },
					{ label: 'Моя бронь', value: this.order()!.provision.provided, color: '#BD9E67' },
					{ label: 'Свободно', value: this.order()!.provision.provisionAvailable, color: '#20B878' },
				]);
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

	protected readonly TextType = TextType;
	protected readonly Colors = Colors;
	protected readonly TextWeight = TextWeight;
	protected readonly ButtonType = ButtonType;
	protected readonly Size = Size;
	protected readonly LabelType = LabelType;
}
