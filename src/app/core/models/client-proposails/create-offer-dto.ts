
export interface ICreateOfferDto {
	clientId: number;
	items: Array<{
		tovProductId: number;
		atWork: boolean;
		commentId?: null | number;
		potencial?: null | number;
		objective?: null | number;
		technologistId?: null | number;
	}>;
}
