import { IDictionaryItemDto } from '@front-components/components';

export interface IMpReservationOrder {
	id: number;
	note: string;
	code: number;
	status: IDictionaryItemDto;
	author: IDictionaryItemDto;
	totalAmount: number;
	tovUnit: string;
	contractor: IDictionaryItemDto;
	manager: IDictionaryItemDto | null;
	dateFrom: string;
	dateTo: string;
	dateCreated: string;
	tov: IDictionaryItemDto;
	provision: IProvisionType;
	stockBalance: number;
	orderRequests: IOrderRequests[];
	optimalBatch: number;
	muptiplicityPack: number;
}

export interface IProvisionType {
	toProvide: number;
	manufacturing: number;
	provisionAvailable: number;
	provisionUnavailable: number;
	provisionDetails?: IProvisionDetailsTypes[];
}

export interface IProvisionDetailsTypes {
	id?: number;
	productionDate?: string;
	provisionDate?: string;
	manufacturingAmount?: number;
}

export interface IOrderRequests {
	requestedProvisionDate: string;
	amount: number;
}
