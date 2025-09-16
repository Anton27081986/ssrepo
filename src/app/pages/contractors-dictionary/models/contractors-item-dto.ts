export interface ContractorsItemDto {
	code: string;
	shortName: string;
	client: {
		id: number;
		name: string;
		linkToDetail: string;
	};
	category: string;
	inn: string;
	status: {
		id: number;
		name: string;
	};
	country: string;
	businessManager: {
		id: number;
		name: string;
		department: string;
		photoUrl: string;
	};
	edo: string;
	group: string;
	hasSpecialConditions: boolean;
}
