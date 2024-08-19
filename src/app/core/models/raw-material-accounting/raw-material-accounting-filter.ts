export interface IRawMaterialAccountingFilter {
	ContractorId?: number;
	ContractDetailId?: number;
	ContractNumber?: string;
	UserIds?: number[];
	statuses?: number[];
	limit: number;
	offset: number;
}
