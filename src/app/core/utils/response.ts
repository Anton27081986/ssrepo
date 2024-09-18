export interface IResponse<T> {
	items: T[];
	total: number;
	linkToModule?: string;
	addNewThanksLink?: string;
	totalCount?: number;
	weekCount?: number;
	clientOfferId?: string;
	totalClientSales?: string;
	totalExpensesList?: Array<{
		currency: string;
		expenses: number;
	}>;
	totalSales?: number;
	isAlterFilter?: boolean;
	alterFilterDefenitionNote?: string;
}
