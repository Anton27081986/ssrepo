export interface ExcessIncomeGroupRequest {
	limit: number;
	offset: number;
	clientId: number;
	contractorId: number;
	tovSubgroupsIds: number[];
	tovIds: number[];
}
