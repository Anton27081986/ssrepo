export interface ISaleRequestsFilter {
	ContractorId?: number;
	clientId?: number;
	FromShipDate?: string;
	ToShipDate?: string;
	limit: number;
	offset: number;
}
