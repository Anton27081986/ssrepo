export interface IResponse<T> {
	items: T[];
	total: number;
	linkToModule?: string;
}
