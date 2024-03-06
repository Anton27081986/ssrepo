import { Component, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { IExchangeRates } from '@app/core/models/exchange-rates';
import { CurrencyApiService } from '@app/core/api/currency-api.service';

@UntilDestroy()
@Component({
	selector: 'app-exchange-rates',
	templateUrl: './exchange-rates.component.html',
	styleUrls: ['./exchange-rates.component.scss'],
})
export class ExchangeRatesComponent implements OnInit {
	protected exchangeRates: IExchangeRates | undefined;
	protected requestTime: Date | undefined;

	public constructor(private readonly apiService: CurrencyApiService) {}

	public ngOnInit() {
		this.apiService
			.getExchangeRates()
			.pipe(untilDestroyed(this))
			.subscribe(
				exchangeRates => {
					this.exchangeRates = exchangeRates;
					this.requestTime = new Date();
				},
				(error: unknown) => {
					console.error('Курсы валют не загружены', error);
				},
			);
	}

	onRedirect(url: string) {
		window.open(url, '_blank');
	}
}
