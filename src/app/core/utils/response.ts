export interface IResponse<T> {
	items: T[];
	total: number;
	linkToModule?: string;
	addNewThanksLink?: string;
	totalCount?: number;
	weekCount?: number;
	clientOfferId?: string;
}
