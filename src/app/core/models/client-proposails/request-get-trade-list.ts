export interface IRequestGetTradeList {
	clientId: number;
	limit: number;
	offset: number;
	TovIds?: number[];
	DateFrom?: string;
	DateTo?: string;
}
