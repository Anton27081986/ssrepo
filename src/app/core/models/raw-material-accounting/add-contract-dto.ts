export interface AddContractDto {
	contractNumber: string;
	contractorId: number;
	contractDetailId: string;
	quantityTotal: number;
	quantityReceived: number;
	quantityRemaining: number;
	price: number;
	periodStartDate: string;
	periodEndDate: string;
	paymentConditions: string;
	deliveryConditions: string;
	notificationDate: string;
	tovId: number;
}
