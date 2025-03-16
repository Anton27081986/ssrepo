import {Component, OnInit, signal} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {
	ButtonComponent,
	ButtonType,
	Colors, LabelComponent, LabelType, LinkComponent,
	Size,
	TextComponent,
	TextType,
	TextWeight
} from "@front-components/components";
import {CorrespondenceComponent} from "@app/widgets/correspondence/correspondence.component";
import {CardComponent} from "@app/shared/components/card/card.component";
import {TableComponent} from "@app/shared/components/table/table.component";

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
		TableComponent
	],
	standalone: true
})
export class MpReservationOrderCardComponent implements OnInit {

	protected id = signal<number | undefined>(undefined)

	constructor(
		private readonly activatedRoute: ActivatedRoute,
		protected readonly router: Router) {
	}

	public ngOnInit() {
		const id = this.activatedRoute.snapshot.paramMap.get('id');

		if (id) {
			this.id.set(Number(id));
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
