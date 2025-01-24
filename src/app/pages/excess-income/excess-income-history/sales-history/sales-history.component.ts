import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	Inject,
	inject,
} from '@angular/core';
import { ModalRef } from '@app/core/modal/modal.ref';
import { DIALOG_DATA } from '@app/core/modal/modal-tokens';
import { HistoryComponent } from '@app/widgets/history/history.component';
import { ExcessIncomeApiService } from '@app/pages/excess-income/excess-income-service/excess-income.api-service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import {ITableItem, TableComponent} from '@app/shared/components/table/table.component';
import { TableState } from '@app/shared/components/table/table-state';
import { NgIf } from '@angular/common';
import { UserInfoPopupComponent } from '@app/components/user-info-popup/user-info-popup.component';
import { ModalService } from '@app/core/modal/modal.service';
import { ExcessIncomeSalesHistory } from '@app/core/models/excess-income/excess-income-sales-history';
import { ISalesHistoryTableItem } from '@app/pages/excess-income/excess-income-history/sales-history/sales-history-table-item';
import { catchError } from 'rxjs/operators';
import { ExcessIncomeTov } from '@app/core/models/excess-income/excess-income-tov-from-backend';
import {CardComponent} from "@app/shared/components/card/card.component";
import {HeadlineComponent} from "@app/shared/components/typography/headline/headline.component";
import {IconComponent} from "@app/shared/components/icon/icon.component";
import {PaginationComponent} from "@app/shared/components/pagination/pagination.component";
import {LoaderComponent} from "@app/shared/components/loader/loader.component";
import {EmptyDataPageComponent} from "@app/shared/components/empty-data-page/empty-data-page.component";

interface IDialogData {
	clientId?: number | null;
	tov: ExcessIncomeTov;
}

@UntilDestroy()
@Component({
	selector: 'app-excess-income-group-sales-history',
	standalone: true,
	imports: [
		HistoryComponent,
		NgIf,
		CardComponent,
		HeadlineComponent,
		IconComponent,
		TableComponent,
		PaginationComponent,
		LoaderComponent,
		EmptyDataPageComponent,
	],
	templateUrl: './sales-history.component.html',
	styleUrl: './sales-history.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SalesHistoryComponent {
	private readonly modalRef = inject(ModalRef);
	public total: number = 0;
	public pageSize = 10;
	public pageIndex = 1;
	public offset = 0;
	public tableItems: ITableItem[] = [];
	public items: ISalesHistoryTableItem[] = [];
	public tableState: TableState = TableState.Empty;

	public constructor(
		@Inject(DIALOG_DATA)
		protected readonly data: IDialogData,
		private readonly excessIncomeApiService: ExcessIncomeApiService,
		private readonly modalService: ModalService,
		private readonly cdr: ChangeDetectorRef,
	) {
		this.getHistory();
	}

	private getHistory() {
		if (this.data.tov.tov.id) {
			this.tableState = TableState.Loading;

			this.excessIncomeApiService
				.getSalesHistory(
					this.data.clientId,
					this.data.tov.tov.id,
					this.pageSize,
					this.offset,
				)
				.pipe(
					untilDestroyed(this),
					catchError((err: unknown) => {
						this.tableState = TableState.Empty;

						this.cdr.detectChanges();
						throw err;
					}),
				)
				.subscribe(response => {
					if (!response.items || response.items.length === 0) {
						this.tableState = TableState.Empty;
					} else {
						this.items = this.mapHistoryToTableItems(response.items);
						this.total = response.total ?? 0;

						this.tableItems = <ITableItem[]>(<unknown>this.items);
						this.tableState = TableState.Full;
					}

					this.cdr.detectChanges();
				});
		}
	}

	private mapHistoryToTableItems(history: ExcessIncomeSalesHistory[]) {
		return history.map(x => {
			const tableItem: ISalesHistoryTableItem = {} as ISalesHistoryTableItem;

			tableItem.code = { text: x.id ?? '-', url: x.detailLink } ;
			tableItem.contractor = x.contractor.linkToDetail
				? { text: x.contractor.name ?? '-', url: x.contractor.linkToDetail }
				: '-';
			tableItem.price = x.price ?? '-';
			tableItem.quantity = x.quantity ?? '-';
			tableItem.sum = x.sum ?? '-';
			tableItem.currency = x.currency ?? '-';
			tableItem.status = x.status.name ?? '-';
			tableItem.date = x.shipDate
				? `${new Date(Date.parse(x.shipDate)).toLocaleString('ru-RU', {
						year: 'numeric',
						month: 'numeric',
						day: 'numeric',
					})}`
				: '-';

			return tableItem;
		});
	}

	protected openModalInfoUser(user: { row: ITableItem; icon: string }) {
		if (user) {
			this.modalService.open(UserInfoPopupComponent, { data: user.icon });
		}
	}

	public pageIndexChange($event: number) {
		if ($event === 1) {
			this.offset = 0;
		} else {
			this.offset = this.pageSize * $event - this.pageSize;
		}

		this.offset = this.pageSize * $event - this.pageSize;
		this.pageIndex = $event;

		this.getHistory();
	}

	protected close() {
		this.modalRef.close();
	}

	protected readonly TableState = TableState;
}
