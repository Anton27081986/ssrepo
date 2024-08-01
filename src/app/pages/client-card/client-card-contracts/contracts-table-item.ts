export interface IContractsTableItem {
	code: {
		text: string;
		url: string;
	};
	detailLink: string;
	contractor: string;
	beginDate: string;
	endDate: string;
	prolongationDate: string;
	highlight: boolean;
}
