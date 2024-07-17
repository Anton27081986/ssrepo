export interface IClientsFilter {
	code?: number;
	clientIds?: string[];
	categoryIds?: number[];
	contractorIds?: number[];
	managerIds?: number[];
	statuses?: number[];
	withoutBaseManager?: boolean;
	limit: number;
	offset: number;
}
