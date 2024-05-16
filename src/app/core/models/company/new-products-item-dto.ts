export interface INewProductsItemDto {
	items?: Array<{
		id: number;
		detailLink: string;
		productName: string;
		status: {
			id: number;
			name: string;
		};
		customer: {
			id: number;
			name: string;
		};
		developer: {
			id: number;
			name: string;
		};
	}> | null;
	total?: number;
	linkToModule?: string | null;
}
