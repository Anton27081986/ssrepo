export interface IClientsFilter {
	code?: number;
	name?: string;
	categoryId?: number;
	contractorId?: number;
	managerId?: number;
	status?: number;
	withoutBaseManager?: boolean;
	limit: number;
	offset: number;
}
