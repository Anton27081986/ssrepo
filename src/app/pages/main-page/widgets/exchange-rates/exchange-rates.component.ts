import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { IExchangeRates } from '@app/core/models/exchange-rates';
import { CurrencyApiService } from '@app/core/api/currency-api.service';
import { ExchangeRatesImports } from './exchange-rates.imports';
import { ExchangeRatesLinks } from './constants/exchange-rates-links';

@Component({
	selector: 'app-exchange-rates',
	templateUrl: './exchange-rates.component.html',
	styleUrls: ['./exchange-rates.component.scss'],
	imports: ExchangeRatesImports,
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExchangeRatesComponent {
	private readonly apiService: CurrencyApiService =
		inject(CurrencyApiService);

	protected requestTime: Date | undefined;
	protected exchangeRates$: Observable<IExchangeRates> = this.apiService
		.getExchangeRates()
		.pipe(
			tap(() => {
				this.requestTime = new Date();
			})
		);

	protected readonly exchangeRatesLinks = ExchangeRatesLinks;

	public onRedirect(url: string): void {
		window.open(url, '_blank');
	}
}
