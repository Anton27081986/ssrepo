export interface MpReservationFilter {
	limit: number;
	offset: number;
	personificationId?: number;
	authorIds?: number[];
	tovIds?: number[];
	managerIds?: number[];
	statusIds?: number[];
	dateFrom?: string;
	dateTo?: string;
	clientIds?: number[];
}
