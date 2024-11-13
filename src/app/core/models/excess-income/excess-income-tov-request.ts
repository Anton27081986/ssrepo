export interface ExcessIncomeTovRequest {
	limit: number;
	offset: number;
	clientId: number;
	contractorId: number;
	tovSubGroupId: number;
	currency: string;
	tovsIds: number[];
}
