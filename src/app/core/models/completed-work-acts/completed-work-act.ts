import { IDictionaryItemDto } from '@app/core/models/company/dictionary-item-dto';
import { IFile } from '@app/core/models/files/file';

export interface ICompletedWorkAct {
	id: number;
	externalActNumber: string;
	externalActDate: string;
	internalActNumber: string;
	internalActDate: string;
	state: IDictionaryItemDto;
	applicantUser?: IDictionaryItemDto;
	payerContractor: IDictionaryItemDto;
	payerBuUnit: IDictionaryItemDto;
	providerContractor: IDictionaryItemDto;
	contract?: IDictionaryItemDto;
	finDocOrders: IDictionaryItemDto[];
	documents: IFile[];
	currency: IDictionaryItemDto;
	oneSComment: string;
	oneSNumber: string;
	oneSTotalAmount: number;
	providerContractorLinkUrl: string;
	totalAmount: number;
	contractId: number;
	dateUpload: string;
	comment: string;
}
