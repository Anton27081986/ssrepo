import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	OnInit,
} from '@angular/core';
import { Observable } from 'rxjs';
import { IResponse } from '@app/core/utils/response';
import { IBusinessTripsDto } from '@app/core/models/client-proposails/business-trips';
import {
	ITableItem,
	TableComponent,
} from '@app/shared/components/table/table.component';
import { TableState } from '@app/shared/components/table/table-state';
import { ClientsCardFacadeService } from '@app/core/facades/client-card-facade.service';
import { BusinessTripsFacadeService } from '@app/core/facades/business-trips-facade.service';
import { IClientBusinessTripsTableItem } from '@app/pages/client-card/client-card-bisiness-trips/client-card-business-trips-table-item';
import { CardComponent } from '@app/shared/components/card/card.component';
import { LoaderComponent } from '@app/shared/components/loader/loader.component';
import { AsyncPipe, CommonModule, NgIf } from '@angular/common';
import { HeadlineComponent } from '@app/shared/components/typography/headline/headline.component';
import { EmptyPlaceholderComponent } from '@app/shared/components/empty-placeholder/empty-placeholder.component';
import { TextComponent } from '@app/shared/components/typography/text/text.component';
import { PaginationComponent } from '@app/shared/components/pagination/pagination.component';

@UntilDestroy()
@Component({
	selector: 'ss-client-card-business-trips',
	templateUrl: './client-card-business-trips.component.html',
	styleUrls: ['./client-card-business-trips.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		CommonModule,
		CardComponent,
		LoaderComponent,
		NgIf,
		HeadlineComponent,
		AsyncPipe,
		TableComponent,
		EmptyPlaceholderComponent,
		TextComponent,
		PaginationComponent,
	],
	standalone: true,
})
export class ClientCardBusinessTripsComponent implements OnInit {
	public businessTrips$: Observable<IResponse<IBusinessTripsDto>>;

	// table
	public total = 0;
	public pageSize = 6;
	public pageIndex = 1;
	public offset = 0;
	public tableItems: ITableItem[] = [];
	public items: IClientBusinessTripsTableItem[] = [];
	private clientId: number | undefined;

	// state
	public isFiltersVisible = false;
	public tableState: TableState = TableState.Empty;

	protected readonly TableState = TableState;
	constructor(
		public readonly businessTripsFacadeService: BusinessTripsFacadeService,
		private readonly cdr: ChangeDetectorRef,
		public readonly clientCardListFacade: ClientsCardFacadeService
	) {
		this.businessTrips$ = this.businessTripsFacadeService.businessTrips$;
	}

	public ngOnInit(): void {
		this.tableState = TableState.Loading;

		this.businessTripsFacadeService.businessTrips$
			.pipe(untilDestroyed(this))
			.subscribe((response) => {
				if (!response.items || response.items.length === 0) {
					this.tableState = TableState.Empty;
				} else {
					this.items = this.mapClientsToTableItems(response.items);

					if (response.total! > 6) {
						this.total = (response.total ?? 0) + this.pageSize;
					} else {
						this.total = response.total ?? 0;
					}

					this.tableItems = <ITableItem[]>(<unknown>this.items);
					this.tableState = TableState.Full;
				}

				this.cdr.detectChanges();
			});
		this.clientCardListFacade.client$
			.pipe(untilDestroyed(this))
			.subscribe((client) => {
				if (client.id) {
					this.clientId = client.id;

					this.getFilteredSales();
				}
			});
	}

	private mapClientsToTableItems(trips: IBusinessTripsDto[]) {
		return (
			trips?.map((x) => {
				const tableItem: IClientBusinessTripsTableItem =
					{} as IClientBusinessTripsTableItem;

				tableItem.code = {
					text: x.id.toString() ?? '-',
					url: x.linkToDetail ?? '',
				};
				tableItem.date = x.beginDate
					? `${new Date(Date.parse(x.beginDate)).toLocaleString(
							'ru-RU',
							{
								year: 'numeric',
								month: 'numeric',
								day: 'numeric',
							}
						)} - ${new Date(Date.parse(x.endDate)).toLocaleString(
							'ru-RU',
							{
								year: 'numeric',
								month: 'numeric',
								day: 'numeric',
							}
						)}`
					: '-';
				tableItem.task = x.goal.name;
				tableItem.members =
					x.members?.map((c) => c.name).join(', ') ?? '-';

				return tableItem;
			}) || []
		);
	}

	public getFilteredSales() {
		const preparedFilter: any = {
			limit: this.pageSize,
			offset: this.offset,
			clientId: this.clientId,
		};

		this.tableState = TableState.Loading;

		this.businessTripsFacadeService.applyFilters(preparedFilter);
	}

	public nzPageIndexChange($event: number) {
		if ($event === 1) {
			this.offset = 0;
		} else {
			this.offset = this.pageSize * $event - this.pageSize;
		}

		this.offset = this.pageSize * $event - this.pageSize;
		this.pageIndex = $event;

		this.getFilteredSales();
	}
}
