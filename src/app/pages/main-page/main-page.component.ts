import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { first } from 'rxjs';
import { UserProfileStoreService } from '@app/core/states/user-profile-store.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { environment } from '@environments/environment';
import {SliderComponent} from "@app/widgets/slider/slider.component";
import {AuctionSalesComponent} from "@app/widgets/auction-sales/auction-sales.component";
import {VictoryComponent} from "@app/components/victory/victory.component";
import {ThanksColleagueComponent} from "@app/widgets/thank-colleague/thanks-colleague.component";
import {ThanksPartnerComponent} from "@app/components/thank-partner/thanks-partner.component";
import {ExchangeRatesComponent} from "@app/components/exchange-rates/exchange-rates.component";
import {AddressBookComponent} from "@app/widgets/address-book/address-book.component";
import {BirthdayComponent} from "@app/components/birthday/birthday.component";
import {TransportComponent} from "@app/components/transport/transport.component";
import {RatingComponent} from "@app/components/rating/rating.component";
import {CommonModule, NgIf} from "@angular/common";
import {UserCardComponent} from "@app/components/user-card/user-card.component";

@UntilDestroy()
@Component({
	selector: 'app-main-page',
	templateUrl: './main-page.component.html',
	styleUrls: ['./main-page.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		CommonModule,
		UserCardComponent,
		SliderComponent,
		AuctionSalesComponent,
		VictoryComponent,
		ThanksColleagueComponent,
		ThanksPartnerComponent,
		ExchangeRatesComponent,
		AddressBookComponent,
		BirthdayComponent,
		TransportComponent,
		RatingComponent,
		NgIf
	],
	standalone: true
})
export class MainPageComponent implements OnInit {
	public loading = false;
	public backUrl: boolean = environment.production;

	public constructor(private readonly userStateService: UserProfileStoreService) {}

	public ngOnInit() {
		this.loading = true;

		this.userStateService.userProfile$
			.pipe(first())
			.pipe(untilDestroyed(this))
			.subscribe(() => {
				this.loading = false;
			});
	}
}
