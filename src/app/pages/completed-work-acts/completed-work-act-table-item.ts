export interface ICompletedWorkActTableItem {
	code: { text: string; pseudoLink: string };
	state: string;
	externalActNumber: string;
	externalActDate: string;
	internalActNumber: string;
	internalActDate: string;
	uploadActDate: string;
	payerBuUnit: string;
	providerContractor: { text: string; url: string };
	applicantUser: string;
	totalAmount: number;
	contract: string;
}
