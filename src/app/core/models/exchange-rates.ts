export interface IExchangeRates {
	lintToAll: 'string';
	items: Array<{
		currencyName: 'string';
		todayRate: number;
		yesterdayRate: number;
		tomorrowRate: number;
	}>;
}
