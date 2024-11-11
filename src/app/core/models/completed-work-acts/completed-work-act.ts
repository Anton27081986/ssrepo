import { IDictionaryItemDto } from '@app/core/models/company/dictionary-item-dto';
import { IFile } from '@app/core/models/files/file';

export interface ICompletedWorkAct {
	id: number;
	externalActNumber: string;
	externalActDate: string;
	internalActNumber: string;
	internalActDate: string;
	state: IDictionaryItemDto;
	applicantUser: IDictionaryItemDto;
	buUnit: IDictionaryItemDto;
	payerContractor: IDictionaryItemDto;
	payerBuUnit: IDictionaryItemDto;
	providerContractor: IDictionaryItemDto;
	inn: string;
	contract: IDictionaryItemDto;
	finDocOrders: IDictionaryItemDto[];
	documents: IFile[];
	currency: string;
	oneSComment: string;
	oneSNumber: string;
	providerContractorLinkUrl: string;
	totalAmount: number;
	contractId: number;
}
