export interface MpReservationFilter{
	code: number;
	applicationCode: number;
	customerId: number;
	tov: number;
	mutmz: number;
	status: number;
	dateFrom?: string;
	dateTo?: string;
}
