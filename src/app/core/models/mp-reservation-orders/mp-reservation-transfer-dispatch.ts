export interface IDispatchDto {
	warehouseId: number;
	amount: number;
}

export interface IDispatchesRequest {
	dispatches: IDispatchDto[];
}
