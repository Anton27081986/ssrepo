export interface ICompletedActsFilter {
	code?: number;
	managerIds?: number[];
	status?: number[];
	limit: number;
	offset: number;
}
