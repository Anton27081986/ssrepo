export interface AddToVRequest {
	weekId: number;
	items: toVRequest[];
}

export interface toVRequest {
	tovId: number;
	sectionId: number;
}
