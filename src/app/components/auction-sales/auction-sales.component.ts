import { Component, OnInit } from '@angular/core';
import { SalesApiService } from '@app/core/api/sales-api.service';
import { IAuctionSales } from '@app/core/models/auction-sales';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
	selector: 'app-auction-sales',
	templateUrl: './auction-sales.component.html',
	styleUrls: ['./auction-sales.component.scss'],
})
export class AuctionSalesComponent implements OnInit {
	public pageIndex = 1;
	public pageSize = 8;
	public total: number | undefined;
	public listAuction: IAuctionSales | undefined;
	public offset = 0;

	public constructor(private readonly apiService: SalesApiService) {}

	public ngOnInit(): any {
		this.loadDataFromServer(this.pageSize, this.offset);
	}

	// Не верные параметры
	public loadDataFromServer(pageSize: number, offset: number): void {
		this.apiService
			.getAuctions(pageSize, offset)
			.pipe(untilDestroyed(this))
			.subscribe(value => {
				this.listAuction = value;
				this.total = value.total + this.pageSize; // TODO Поправить, в пагинации нужен еще один сдвиг в конце
			});
	}

	public nzPageIndexChange($event: number) {
		if ($event === 1) {
			this.offset = 0;
		} else {
			this.offset = this.pageSize * $event - this.pageSize;
		}

		this.offset = this.pageSize * $event - this.pageSize;

		this.pageIndex = $event; // Установка текущего индекса

		this.loadDataFromServer(this.pageSize, this.offset);
	}

	protected readonly window = window;
}
