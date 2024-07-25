import { Injectable } from '@angular/core';
import { AuctionSalesApiService } from '@app/core/api/auction-sales-api.service';

@Injectable({
	providedIn: 'root',
})
export class AuctionSaleFacadeService {
	public constructor(private readonly auctionSalesApiService: AuctionSalesApiService) {}

	public getAuctionSale(limit: number, offset: number) {
		return this.auctionSalesApiService.getAuctions(limit, offset);
	}
}
