export interface IResponse<T> {
	items: T[];
	total: number;
	linkToModule: string;
	addNewThanksLink?: string;
	totalCount?: number;
	weekCount?: number;
	clientOfferId?: string;
	totalSales?: number;
}

export interface Currency {
	currency: string;
	value: number;
}

export interface IResponseProposalsTrips<T> extends IResponse<T> {
	totalClientSales: Currency;
	totalExpensesList: Currency[];
}
