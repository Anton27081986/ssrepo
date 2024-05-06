export interface ISampleItemDto {
	items?: Array<{
		id: number;
		detailLink: string;
		orderDate: string;
		status: {
			id: number;
			name: string;
		};
		manager: {
			id: number;
			name: string;
		};
		tov: {
			id: number;
			name: string;
		};
		planQuantity: number;
		factQuantity: number;
		planWeight: number;
		factWeight: number;
		comment: string;
	}> | null;
	total?: number;
	linkToModule?: string | null;
}
