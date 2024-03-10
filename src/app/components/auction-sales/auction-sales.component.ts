import { Component, OnInit } from '@angular/core';
import { SalesApiService } from '@app/core/api/sales-api.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { IAuctionSalesDto } from '@app/core/models/sales/auction-sales-dto';

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
	public listAuction: IAuctionSalesDto | undefined;
	public offset = 0;

	public constructor(private readonly apiService: SalesApiService) {}

	public ngOnInit(): any {
		this.loadDataFromServer(this.pageSize, this.offset);
	}

	public loadDataFromServer(pageSize: number, offset: number): void {
		this.apiService
			.getAuctions(pageSize, offset)
			.pipe(untilDestroyed(this))
			.subscribe(value => {
				this.listAuction = value;

				if (value.total) {
					this.total = value.total + this.pageSize;
				}
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
