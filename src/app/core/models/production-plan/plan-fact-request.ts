export interface CreatePlanFactRequest {
	planDate: string;
	planQuantity?: string | null;
	factQuantity?: string | null;
}

export interface UpdatePlanFactRequest {
	id: number;
	planQuantity?: string | null;
	factQuantity?: string | null;
}
