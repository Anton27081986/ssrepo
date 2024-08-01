import { Injectable } from '@angular/core';
import { ProductionsApiService } from '@app/core/api/productions-api.service';

Injectable();

export class ProductionsFacadeService {
	constructor(private readonly productionsApi: ProductionsApiService) {}

	searchProductions(query: string) {
		return this.productionsApi.searchProductions(query);
	}
}
