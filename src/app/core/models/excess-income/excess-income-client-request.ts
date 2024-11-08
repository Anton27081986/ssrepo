export interface ExcessIncomeClientRequest {
	limit: number;
	offset: number;
	clientIds: number[];
	contractorIds: number[];
	tovSubgroupsIds: number[];
	tovsIds: number[];
}
