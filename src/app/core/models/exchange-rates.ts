interface ICurrency {
	currencyName: string;
	todayRate: number;
	yesterdayRate: number;
	tomorrowRate: number;
}

export interface IExchangeRates {
	lintToAll: string;
	items: ICurrency[];
}
