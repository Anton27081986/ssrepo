import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	Inject,
	inject,
} from '@angular/core';
import { CardModule } from '@app/shared/components/card/card.module';
import { HeadlineModule } from '@app/shared/components/typography/headline/headline.module';
import { IconModule } from '@app/shared/components/icon/icon.module';
import { ModalRef } from '@app/core/modal/modal.ref';
import { DIALOG_DATA } from '@app/core/modal/modal-tokens';
import { HistoryComponent } from '@app/widgets/history/history.component';
import { TableModule } from '@app/shared/components/table/table.module';
import { TextModule } from '@app/shared/components/typography/text/text.module';
import { LinkModule } from '@app/shared/components/link/link.module';
import { ExcessIncomeApiService } from '@app/pages/excess-income/excess-income-service/excess-income.api-service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ITableItem } from '@app/shared/components/table/table.component';
import { TableState } from '@app/shared/components/table/table-state';
import { ExcessIncomeTovGroupHistoryItem } from '@app/core/models/excess-income/excess-income-tov-group-history';
import { IGroupPriceHistoryTableItem } from '@app/pages/excess-income/excess-income-history/group-price-history/group-price-history-table-item';
import { IDictionaryItemDto } from '@app/core/models/company/dictionary-item-dto';
import { LoaderModule } from '@app/shared/components/loader/loader.module';
import { NgIf } from '@angular/common';
import { ComponentsModule } from '@app/components/components.module';
import { UserInfoPopupComponent } from '@app/components/user-info-popup/user-info-popup.component';
import { ModalService } from '@app/core/modal/modal.service';
import {EmptyDataPageModule} from "@app/shared/components/empty-data-page/empty-data-page.module";

interface IDialogData {
	clientId?: number;
	contractorId?: number;
	tovGroupId?: number;
	tovId?: number;
}

@UntilDestroy()
@Component({
	selector: 'app-excess-income-group-price-history',
	standalone: true,
	imports: [
		CardModule,
		HeadlineModule,
		IconModule,
		HistoryComponent,
		TableModule,
		TextModule,
		LinkModule,
		LoaderModule,
		NgIf,
		ComponentsModule,
		EmptyDataPageModule,
	],
	templateUrl: './group-price-history.component.html',
	styleUrl: './group-price-history.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroupPriceHistoryComponent {
	private readonly modalRef = inject(ModalRef);
	public total: number = 0;
	public pageSize = 10;
	public pageIndex = 1;
	public offset = 0;
	public tableItems: ITableItem[] = [];
	public items: IGroupPriceHistoryTableItem[] = [];
	public tableState: TableState = TableState.Empty;
	public client: IDictionaryItemDto | undefined;
	public tovGroup: IDictionaryItemDto | undefined;
	public contractor: IDictionaryItemDto | undefined;

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
		if (this.data.clientId && this.data.tovGroupId) {
			this.tableState = TableState.Loading;

			this.excessIncomeApiService
				.getTovGroupHistory(
					this.data.clientId,
					this.data.tovGroupId,
					this.pageSize,
					this.offset,
				)
				.pipe(untilDestroyed(this))
				.subscribe(response => {
					this.client = response.client;
					this.tovGroup = response.tovSubgroup;
					this.contractor = response.contractor;

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

	private mapHistoryToTableItems(history: ExcessIncomeTovGroupHistoryItem[]) {
		return history.map(x => {
			const tableItem: IGroupPriceHistoryTableItem = {} as IGroupPriceHistoryTableItem;

			tableItem.author =
				{ text: x.author.name ?? '-', pseudoLink: x.author.id.toString() } ?? '-';
			tableItem.newExcessIncomePercent = x.newExcessIncomePercent?.toString() ?? '-';
			tableItem.oldExcessIncomePercent = x.oldExcessIncomePercent?.toString() ?? '-';
			tableItem.periodType = x.periodType ?? '-';
			tableItem.date = x.date
				? `${new Date(Date.parse(x.date)).toLocaleString('ru-RU', {
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
