export interface ILostProductsItemDto {
	items?: Array<{
		id: number;
		detailLink: string;
		tov: {
			id: number;
			name: string;
		};
		fixationDate: string;
		shipDate: string;
		quantity: string;
		valueEff: string;
		requestName?: string;
		requestLink?: string;
	}> | null;
	total?: number;
	linkToModule?: string | null;
}
