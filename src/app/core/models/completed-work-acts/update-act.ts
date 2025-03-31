export interface IUpdateAct {
	dateUpload?: string | null;
	applicantUserId?: number | null;
	buUnitId?: number | null;
	payerBuUnitId?: number | null;
	providerContractorId?: number | null;
	inn?: string | null;
	contractId?: number | null;
	finDocOrderIds?: number[] | null;
	currencyId?: number | null;
	documentIds: string[];
	comment?: string | null;
}
