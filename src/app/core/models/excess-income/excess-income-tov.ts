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
		excessIncomePercent: number;
		fixPrice: number;
		finalPrice: number;
	};
	nextParams: {
		price: number;
		excessIncomePercent: number;
		fixPrice: number;
		finalPrice: number;
	};
}
