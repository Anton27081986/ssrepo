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
		prolongationDate: string;
		isSoonExpire: boolean;
	}> | null;
	total?: number;
}
