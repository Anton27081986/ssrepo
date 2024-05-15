export interface IReturnRequestsItemDto {
	items?: Array<{
		id: number;
		detailLink: string;
		status: {
			id: number;
			name: string;
		};
		createDate: string;
		author: {
			id: number;
			name: string;
		};
		type: {
			id: number;
			name: string;
		};
		contractor: {
			id: number;
			name: string;
		};
		tov: {
			id: number;
			name: string;
		};
	}> | null;
	total?: number;
	linkToModule?: string | null;
}
