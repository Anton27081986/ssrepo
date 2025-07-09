export interface OrderAnOutfitRequest {
	date?: string;
	ids?: number[];
}

export interface OrderAnOutfit {
	linkToModule: string;
	D_DOC: string;
	gps: string;
	QUANTITY: number;
	TOV: string;
	FACTORY_ID: string;
	SECTION_ID: number;
	MPO_ID: number;
	PRE_BUNK_ID: number;
}
