import { ExcessIncomeUpdateClientTovGroupItem } from '@app/core/models/excess-income/excess-income-update-client';

export interface ExcessIncomeUpdateClientRequest {
	isCurrent: boolean;
	items: ExcessIncomeUpdateClientTovGroupItem[];
}
