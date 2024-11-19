export interface IUpdateAct {
	externalActNumber?: string | null;
	externalActDate?: string | null;
	internalActNumber?: string | null;
	internalActDate?: string | null;
	applicantUserId?: number | null;
	buUnitId?: number | null;
	payerContractorId?: number | null;
	payerBuUnitId?: number | null;
	providerContractorId?: number | null;
	inn?: string | null;
	contractId?: number | null;
	finDocOrderIds?: number[] | null;
	currency?: string | null;
}
