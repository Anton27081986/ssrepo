export interface ExcessIncomeUpdateTovCommentRequest {
	clientId: number;
	contractorId: number | null;
	tovId: number;
	comment: string;
}
