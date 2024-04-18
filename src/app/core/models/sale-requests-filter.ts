export interface ISaleRequestsFilter {
	ContractorId?: number;
	FromShipDate?: string;
	ToShipDate?: string;
	limit: number;
	offset: number;
}
