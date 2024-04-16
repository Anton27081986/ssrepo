export interface ISaleRequestsFilter {
	ContractorId?: number;
	FromShipDate: Date;
	ToShipDate: Date;
	limit: number;
	offset: number;
}
