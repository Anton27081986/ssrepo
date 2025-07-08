import {
	OperationPlanRequest,
	Pagination,
} from '@app/core/models/production-plan/operation-plan';

export interface UpdateRawMaterialsRequest {
	weekId?: number;
	calcVariantId: number;
	calcDate?: string;
	filterParams: OperationPlanRequest & Pagination;
	tovIds?: number[];
}

export interface LinkToModule {
	linkToModule: string;
}
