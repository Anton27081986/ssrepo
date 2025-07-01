import { IDictionaryItemDto } from '@app/core/models/company/dictionary-item-dto';

export interface IWarehouseStockDto {
	warehouse: IDictionaryItemDto;
	amount: number;
}

export interface IWarehouseBalanceResponse {
	tov: IDictionaryItemDto;
	manufacturingAmount: number;
	totalRequested: number;
	stocks: IWarehouseStockDto[];
}
