export interface ExcessIncomeGroup {
	client: IdName;
	contractor: IdName;
	category: IdName;
	tovSubgroup: IdName;
}

export interface IdName {
	id: number;
	name: string;
}
