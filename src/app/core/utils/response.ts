export interface IResponse<T> {
	items: T[];
	total: number;
	linkToModule?: string;
	addNewThanksLink?: string;
	totalCount?: number;
	weekCount?: number;
	clientOfferId?: string;
	totalClientSales?: {
		currency: string;
		value: number;
	};
	totalExpensesList?: Array<{
		currency: string;
		value: number;
	}>;
	totalSales?: number;
}
