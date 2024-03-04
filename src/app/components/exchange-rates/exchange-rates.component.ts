import {Component, OnInit} from '@angular/core';
import {map} from "rxjs";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {ApiService} from "@app/core/services/api.service";
import {IExchangeRates} from "@app/core/models/exchange-rates";

@UntilDestroy()
@Component({
	selector: 'app-exchange-rates',
	templateUrl: './exchange-rates.component.html',
	styleUrls: ['./exchange-rates.component.scss'],
})
export class ExchangeRatesComponent implements OnInit {
	protected exchangeRates: IExchangeRates | undefined;
	protected requestTime: Date | undefined;

	public constructor(private readonly apiService: ApiService) {}

	ngOnInit() {
		this.apiService
			.getExchangeRates()
			.pipe(
				untilDestroyed(this),
			)
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
		window.open(url, "_blank");
	}
}
