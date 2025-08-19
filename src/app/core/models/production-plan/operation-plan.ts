import {IDictionaryItemDto} from "@front-library/components";

export interface OperationPlanItem {
	id: number;
	weekId: number;
	tov: IDictionaryItemDto;
	tovCategory: IName;
	productionSection: IName;
	optimalBatch: number;
	productionType: IName;
	productionCity: IName;
	productManagerUser: IName;
	planEconomicUser: IName;
	isPersonification: boolean;
	isComment: boolean;
	planDays: PlanDays[] | null;
	monthPlanQuantity: number;
	monthFactQuantity: number;
	weekPlanQuantity: number;
	weekFactQuantity: number;
	commentCount: string;
}

export interface IName {
	id: number;
	name: string;
}

export interface PlanDays {
	id: number;
	operationalPlanId: number;
	planQuantity: number;
	factQuantity: number;
	date: string;
	isManufactoryOrder: boolean;
}

export interface OperationPlanRequest {
	weekId: number;
	planEconomicUserIds: number[];
	productManagerUserIds: number[];
	warehouseIds: number[];
	productionSectionIds: number[];
	tovIds: number[];
	cityIds: number[];
	tovCategoryIds: number[];
	productionFactoryIds: number[];
}

export interface Pagination {
	limit: number;
	offset: number;
}

export interface IDay {
	day: string;
	isWmsUpload: boolean;
}
