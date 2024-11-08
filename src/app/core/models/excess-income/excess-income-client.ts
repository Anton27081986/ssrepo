import { ExcessIncomeContractor } from '@app/core/models/excess-income/excess-income-contractors-Item';

export interface ExcessIncomeClient {
	id: number;
	code: number;
	name: string;
	contractors: ExcessIncomeContractor[];
}
