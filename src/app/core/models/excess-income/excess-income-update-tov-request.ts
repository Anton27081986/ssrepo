export interface ExcessIncomeUpdateTovRequest {
	clientId: number;
	contractorId: number;
	tovGroupId: number;
	tovId: number;
	currencyId: number;
	currentFixPrice: number | null;
	nextFixPrice: number | null;
	currentExcessIncomePercent: number | null;
	nextExcessIncomePercent: number | null;
	comment: string;
}
