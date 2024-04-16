export interface ISaleRequestsDto {
	linkToModule?: string | null;
	items?: Array<{
		id: number;
		detailLink: string;
		contractor: {
			id: number;
			name: string;
		};
		shipDate: string;
		paymentDate: string;
		isPaymentOverdue: boolean;
		status: {
			id: number;
			name: string;
		};
	}> | null;
	total?: number;
}
