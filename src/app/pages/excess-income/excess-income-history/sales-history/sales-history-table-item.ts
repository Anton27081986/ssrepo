export interface ISalesHistoryTableItem {
	code: { text: number; url: string };
	contractor: { text: string | null; url: string } | string;
	date: string;
	price: number;
	quantity: number;
	sum: number;
	currency: string;
}
