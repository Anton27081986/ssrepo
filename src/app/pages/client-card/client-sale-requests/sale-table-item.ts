export interface ISaleTableItem {
	code: { text: string; url: string };
	saleLink: string;
	contractor: string;
	shipDate: string;
	paymentDate: string;
	status: string;
	highlight: boolean;
}
