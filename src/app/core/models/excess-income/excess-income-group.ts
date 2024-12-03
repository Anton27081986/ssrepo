export interface ExcessIncomeGroup {
	client: IdName;
	contractor: IdName;
	category: IdName;
	tovSubgroup: IdName;
	currentExcessIncomePercent: number;
	nextExcessIncomePercent: number;
	comment: string;
}

export interface IdName {
	id: number;
	name: string;
}
