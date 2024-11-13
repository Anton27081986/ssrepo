export interface ExcessIncomeTovRequest {
	limit: number;
	offset: number;
	clientId: number;
	contractorId: number | null;
	tovSubGroupId: number;
	currency: string;
	tovsIds: number[];
}
