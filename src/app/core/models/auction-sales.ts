export interface IAuctionSales {
	allListLink: string;
	items: Array<{
		detailUrl: string;
		id: number;
		tovName: string;
		tovUnitName: string;
		price: number;
		currency: string;
		source: string;
		quantity: number;
	}>;
	total: number;
}
