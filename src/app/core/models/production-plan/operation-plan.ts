export interface OperationPlanItems {
	id: number;
	weekId: number;
	tov: IName;
	category: IName;
	section: IName;
	optimalBatch: number;
	productionType: IName;
	productionCity: IName;
	productManagerUser: IName;
	planEcomonicUser: IName;
	isPersonification: boolean;
	isComment: boolean;
	planDays: PlanDays[];
	monthPlanQuantity: number;
	monthFactQuantity: number;
	weekPlanQuantity: number;
	weekFactQuantity: number;
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
	planEconomicUserId: number;
	productManagerUserId: number;
	warehouseId: number;
	productionSectionId: number;
	tovId: number;
	cityId: number;
	tovCategoryId: number;
	productionFactoryId: number;
	additional: number;
}

export interface Pagination {
	limit: number;
	offset: number;
}
