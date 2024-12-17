export interface ExcessIncomeUpdateTovRequest {
	clientId: number;
	contractorId: number;
	tovGroupId: number;
	tovId: number;
	currencyId: number;
	fixPrice: number | null;
	excessIncomePercent: number | null;
	isCurrent: boolean;
}
