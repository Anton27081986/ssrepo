import { IDictionaryItemDto } from '@front-components/components';

export interface IMpReservationOrder {
	id: number;
	note: string;
	code: number;
	status: IDictionaryItemDto;
	author: IDictionaryItemDto;
	totalAmount: number;
	tovUnit: string;
	dateFrom: string;
	dateTo: string;
	dateCreated: string;
	tov: IDictionaryItemDto;
	client: IDictionaryItemDto;
	provision: IProvisionType;
	manager: IDictionaryItemDto;
	stockBalance: number;
	orderRequests: IOrderRequests[];
}

export interface IProvisionType {
	provided: number;
	manufacturing: number;
	provisionAvailable: number;
	provisionUnavailable: number;
	provisionDetails?: IProvisionDetailsTypes[];
}

export interface IProvisionDetailsTypes {
	productionDate?: string;
	provisionDate?: string;
	manufacturingAmount?: number;
}

export interface IOrderRequests {
	requestedProvisionDate: string;
	amount: number;
}
