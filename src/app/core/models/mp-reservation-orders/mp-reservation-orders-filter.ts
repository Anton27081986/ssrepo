export interface MpReservationFilter {
	id: number;
	authorId: number;
	tovId: number;
	managerId: number;
	statusId: number;
	dateCreatedFrom: string;
	dateCreatedTo: string;
	clientId: number;
	limit: number;
	offset: number;
}
