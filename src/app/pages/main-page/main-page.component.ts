import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { first } from 'rxjs';
import { UserProfileStoreService } from '@app/core/states/user-profile-store.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { environment } from '@environments/environment';
import { BannerComponent } from '@app/widgets/banner/banner.component';
import { AuctionSalesComponent } from '@app/widgets/auction-sales/auction-sales.component';
import { ThanksColleagueComponent } from '@app/widgets/thank-colleague/thanks-colleague.component';
import { AddressBookComponent } from '@app/widgets/address-book/address-book.component';
import { BirthdayComponent } from '@app/widgets/birthday/birthday.component';
import { CommonModule, NgIf } from '@angular/common';
import { ExchangeRatesComponent } from '@app/widgets/exchange-rates/exchange-rates.component';
import { RatingComponent } from '@app/widgets/rating/rating.component';
import { VictoryComponent } from '@app/widgets/victory/victory.component';
import { ThanksPartnerComponent } from '@app/widgets/thank-partner/thanks-partner.component';
import { TransportComponent } from '@app/widgets/transport/transport.component';

@UntilDestroy()
@Component({
	selector: 'app-main-page',
	templateUrl: './main-page.component.html',
	styleUrls: ['./main-page.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		CommonModule,
		BannerComponent,
		AuctionSalesComponent,
		VictoryComponent,
		ThanksColleagueComponent,
		ThanksPartnerComponent,
		ExchangeRatesComponent,
		AddressBookComponent,
		BirthdayComponent,
		TransportComponent,
		RatingComponent,
		NgIf,
		RatingComponent,
	],
	standalone: true,
})
export class MainPageComponent implements OnInit {
	public loading = false;
	public backUrl: boolean = environment.production;

	constructor(private readonly userStateService: UserProfileStoreService) {}

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
