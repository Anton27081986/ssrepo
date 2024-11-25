export interface ExcessIncomeGroup {
	client: IdName;
	contractor: IdName;
	category: IdName;
	tovSubgroup: IdName;
	currentExcessIncomePercent: number;
	nextExcessIncomePercent: number;
}

export interface IdName {
	id: number;
	name: string;
}
