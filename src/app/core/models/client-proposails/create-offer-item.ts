export interface ICreateOfferItem {
	tovProductId: number;
	tovGroupId: number,
	tovProductName: string;
	atWork: boolean;
	commentId: null | string;
	potencial: null | string;
	objective: null | string;
	technologistId: null | string;
	errors: {
		commentId?: boolean;
		potencial?: boolean;
		objective?: boolean;
		technologistId?: boolean;
	};
}
