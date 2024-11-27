export interface IGroupPriceHistoryTableItem {
	author: { text: string | null; pseudoLink: string } | string;
	date: string;
	newExcessIncomePercent: string;
	oldExcessIncomePercent: string;
	periodType: string;
}
