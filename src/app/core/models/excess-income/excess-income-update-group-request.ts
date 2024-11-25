export interface ExcessIncomeUpdateGroupRequest {
	contractorId: number;
	tovGroupId: number;
	currentExcessIncomePercent: number | null;
	nextExcessIncomePercent: number | null;
}
