import { IDictionaryItemDto } from "@front-components/components";

export interface IMpReservationOrder {
	id: number;
	note: string;
	code: number;
	status: IDictionaryItemDto;
	author: IDictionaryItemDto;
	amount: number;
	tovUnits: string;
	dateFrom: string;
	dateTo: string;
	createdDate: string;
	provision: {
		provided: number
		provisionAvailable: number
		manufacturing: number
		provisionUnavailable: number
	};
}
