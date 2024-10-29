export interface CompletedWorkAct {
	id: number;
	externalActNumber: string;
	externalActDate: string;
	internalActNumber: string;
	internalActDate: string;
	state: {
		id: number;
		name: string;
	};
	applicantUser: {
		id: number;
		name: string;
	};
	payerBuUnit: {
		id: number;
		name: string;
	};
	providerContractor: {
		id: number;
		name: string;
	};
	providerContractorLinkUrl: string;
	contractId: number;
	totalAmount: number;
}
