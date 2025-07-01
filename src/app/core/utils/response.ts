export interface IResponse<T> {
	isExtendedMode?: boolean;
	items: T[];
	total: number;
	linkToModule: string;
	addNewThanksLink?: string;
	totalCount?: number;
	weekCount?: number;
	clientOfferId?: string;
	totalQuantity?: number;
	daysTotal?: DaysTotal[];
}

export interface Currency {
	currency: string;
	value: number;
}

export interface IResponseProposalsTrips<T> extends IResponse<T> {
	totalClientSales: Currency;
	totalExpensesList: Currency[];
	totalSales: number;
}

export interface IRatingTeamsResponse<T> extends IResponse<T> {
	teamName: string;
}

export interface DaysTotal {
	date: string;
	planDayTotalQuantity: number;
	factDayTotalQuantity: number;
}
