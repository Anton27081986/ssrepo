export interface ExcessIncomeGroupRequest {
	limit: number;
	offset: number;
	clientId: number;
	contractorId: number | null;
	tovSubgroupsIds: number[];
	tovIds: number[];
}
