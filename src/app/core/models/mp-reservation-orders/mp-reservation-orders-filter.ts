export interface MpReservationFilter {
	personificationId?: number;
	authorIds?: number[];
	tovIds?: number[];
	managerIds?: number[];
	statusIds?: number[];
	dateFrom?: string;
	dateTo?: string;
	provisionDateFrom?: string;
	provisionDateTo?: string;
	contractorIds?: number[];
	limit: number;
	offset: number;
}
