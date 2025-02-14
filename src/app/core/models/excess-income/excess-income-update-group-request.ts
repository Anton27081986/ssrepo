export interface ExcessIncomeUpdateGroupRequest {
	contractorId: number | null;
	tovGroupId: number;
	isCurrent: boolean;
	excessIncomePercent: number | null;
}
