import { Component, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import {
	ITableItem,
	TableComponent,
} from '@app/shared/components/table/table.component';
import { IAuctionSalesDto } from '@app/core/models/sales/auction-sales-dto';
import { TableState } from '@app/shared/components/table/table-state';
import { BehaviorSubject } from 'rxjs';
import { AuctionSaleFacadeService } from '@app/core/facades/auction-sale-facade.service';
import { NumWithSpacesPipe } from '@app/core/pipes/num-with-spaces.pipe';
import { CardComponent } from '@app/shared/components/card/card.component';
import { LoaderComponent } from '@app/shared/components/loader/loader.component';
import { HeadlineComponent } from '@app/shared/components/typography/headline/headline.component';
import { CaptionComponent } from '@app/shared/components/typography/caption/caption.component';
import { AsyncPipe, CommonModule, NgIf } from '@angular/common';
import { EmptyPlaceholderComponent } from '@app/shared/components/empty-placeholder/empty-placeholder.component';
import { IconComponent } from '@app/shared/components/icon/icon.component';
import { PaginationComponent } from '@app/shared/components/pagination/pagination.component';

@UntilDestroy()
@Component({
	selector: 'app-auction-sales',
	templateUrl: './auction-sales.component.html',
	styleUrls: ['./auction-sales.component.scss'],
	imports: [
		CommonModule,
		CardComponent,
		LoaderComponent,
		HeadlineComponent,
		CaptionComponent,
		NgIf,
		TableComponent,
		AsyncPipe,
		EmptyPlaceholderComponent,
		IconComponent,
		PaginationComponent,
	],
	standalone: true,
})
export class AuctionSalesComponent implements OnInit {
	public pageIndex = 1;
	public pageSize = 10;
	public total: number | undefined;
	public listAuction: IAuctionSalesDto | undefined;
	public offset = 0;
	public tableItems$: BehaviorSubject<ITableItem[]> = new BehaviorSubject<
		ITableItem[]
	>([]);

	public tableState: TableState = TableState.Loading;

	protected readonly window = window;
	protected readonly TableState = TableState;
	constructor(
		private readonly auctionSaleFacadeService: AuctionSaleFacadeService,
	) {}

	public ngOnInit(): any {
		this.loadDataFromServer(this.pageSize, this.offset);
	}

	public loadDataFromServer(pageSize: number, offset: number): void {
		this.tableState = TableState.Loading;

		this.auctionSaleFacadeService
			.getAuctionSale(pageSize, offset)
			.pipe(untilDestroyed(this))
			.subscribe((value) => {
				this.listAuction = value;

				if (value.items) {
					const dataTable = <ITableItem[]>(<unknown>value.items.map(
						(item) => {
							const pipeNumWithSpaces = new NumWithSpacesPipe();

							return {
								...item,
								price: `${pipeNumWithSpaces.numberWithSpaces(item.price!, 2)} ${item.currency!}`,
								quantity: `${pipeNumWithSpaces.numberWithSpaces(item.quantity!, 2)} ${item.tovUnitName!}`,
								tovName: {
									text: `${item.tovName}`,
									url: item.detailUrl,
								},
							};
						},
					));

					this.tableItems$.next(dataTable);
					this.tableState = TableState.Full;
				}

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
}
