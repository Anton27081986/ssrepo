export interface IContractsItemDto {
	items?: Array<{
		id: number;
		detailLink: string;
		contractor: {
			id: number;
			name: string;
		};
		beginDate: string;
		endDate: string;
		prolongationDays: number;
		isSoonExpire: boolean;
	}> | null;
	total?: number;
}
