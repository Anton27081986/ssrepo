export interface ISalesHistoryTableItem {
	code: { text: number; link: string };
	contractor: { text: string | null; link: string } | string;
	date: string;
	price: number;
	quantity: number;
	sum: number;
	currency: string;
}
