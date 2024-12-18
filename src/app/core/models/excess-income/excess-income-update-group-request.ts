export interface ExcessIncomeUpdateGroupRequest {
	contractorId: number | null;
	tovGroupId: number;
	currentExcessIncomePercent: number | null;
	nextExcessIncomePercent: number | null;
}
