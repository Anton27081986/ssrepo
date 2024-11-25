import { IdName } from '@app/core/models/excess-income/excess-income-group';

export interface ExcessIncomeTov {
	tov: IdName;
	client: IdName;
	contractor: IdName;
	category: IdName;
	tovSubgroup: IdName;
	status: IdName;
	currentParams: {
		price: number;
		excessIncomePercent: number | null;
		fixPrice: number | null;
		finalPrice: number | null;
	};
	nextParams: {
		price: number;
		excessIncomePercent: number | null;
		fixPrice: number | null;
		finalPrice: number | null;
	};
	comment: string;
}
