export interface MpReservationFilter {
	personificationId?: number;
	authorIds?: number[];
	tovIds?: number[];
	managerIds?: number[];
	statusIds?: number[];
	dateFrom?: string;
	dateTo?: string;
	clientIds?: number[];
	limit: number;
	offset: number;
}
