export interface IRequestGetBusinessTrips {
	clientId: number;
	limit: number;
	offset: number;
	onlyCurrentYear?: boolean;
}
