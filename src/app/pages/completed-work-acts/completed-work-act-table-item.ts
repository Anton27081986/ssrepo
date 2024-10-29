export interface ICompletedWorkActTableItem {
	code: { text: string; url: string };
	state: string;
	externalActNumber: string;
	externalActDate: string;
	internalActNumber: string;
	internalActDate: string;
	payerBuUnit: string;
	providerContractor: { text: string; url: string };
	applicantUser: string;
	totalAmount: number;
}
