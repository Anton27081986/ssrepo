import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	Inject,
	inject,
} from '@angular/core';
import { ModalRef } from '@app/core/modal/modal.ref';
import { DIALOG_DATA } from '@app/core/modal/modal-tokens';
import { ExcessIncomeApiService } from '@app/pages/excess-income/excess-income-service/excess-income.api-service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import {
	ITableItem,
	TableComponent,
} from '@app/shared/components/table/table.component';
import { TableState } from '@app/shared/components/table/table-state';
import { IGroupPriceHistoryTableItem } from '@app/pages/excess-income/excess-income-history/group-price-history/group-price-history-table-item';
import { IDictionaryItemDto } from '@app/core/models/company/dictionary-item-dto';
import { CommonModule, NgIf } from '@angular/common';
import { ModalService } from '@app/core/modal/modal.service';
import { IChangeTrackerItemDto } from '@app/core/models/change-tracker/change-tracker-item-dto';
import { ExcessIncomeTov } from '@app/core/models/excess-income/excess-income-tov-from-backend';
import { CardComponent } from '@app/shared/components/card/card.component';
import { HeadlineComponent } from '@app/shared/components/typography/headline/headline.component';
import { IconComponent } from '@app/shared/components/icon/icon.component';
import { TextComponent } from '@app/shared/components/typography/text/text.component';
import { LoaderComponent } from '@app/shared/components/loader/loader.component';
import { EmptyDataPageComponent } from '@app/shared/components/empty-data-page/empty-data-page.component';
import { UserInfoPopupComponent } from '@app/shared/components/user-info-popup/user-info-popup.component';

interface IDialogData {
	tov: ExcessIncomeTov;
}

@UntilDestroy()
@Component({
	selector: 'app-excess-income-group-price-history',
	standalone: true,
	imports: [
		CommonModule,
		NgIf,
		CardComponent,
		HeadlineComponent,
		IconComponent,
		TextComponent,
		TableComponent,
		LoaderComponent,
		EmptyDataPageComponent,
	],
	templateUrl: './product-price-history.component.html',
	styleUrl: './product-price-history.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductPriceHistoryComponent {
	private readonly modalRef = inject(ModalRef);
	public total = 0;
	public pageSize = 10;
	public pageIndex = 1;
	public offset = 0;
	public tableItems: ITableItem[] = [];
	public items: IGroupPriceHistoryTableItem[] = [];
	public tableState: TableState = TableState.Empty;
	public client: IDictionaryItemDto | undefined;
	public tovGroup: IDictionaryItemDto | undefined;
	public tov: IDictionaryItemDto | undefined;
	public contractor: IDictionaryItemDto | undefined;

	protected readonly TableState = TableState;
	constructor(
		@Inject(DIALOG_DATA)
		protected readonly data: IDialogData,
		private readonly excessIncomeApiService: ExcessIncomeApiService,
		private readonly modalService: ModalService,
		private readonly cdr: ChangeDetectorRef
	) {
		this.getHistory();
	}

	private getHistory() {
		if (this.data.tov) {
			this.client = this.data.tov.client;
			this.tovGroup = this.data.tov.tovSubgroup;
			this.tov = this.data.tov.tov;
			this.contractor = this.data.tov.contractor;
			this.tableState = TableState.Loading;

			this.excessIncomeApiService
				.getTovHistory(
					`${this.client.id}:${this.contractor ? `${this.contractor.id}:` : ''}${this.tovGroup.id}:${this.tov.id}`,
					this.pageSize,
					this.offset
				)
				.pipe(untilDestroyed(this))
				.subscribe((response) => {
					if (!response.items || response.items.length === 0) {
						this.tableState = TableState.Empty;
					} else {
						this.items = this.mapHistoryToTableItems(
							response.items
						);
						this.total = response.total ?? 0;

						this.tableItems = <ITableItem[]>(<unknown>this.items);
						this.tableState = TableState.Full;
					}

					this.cdr.detectChanges();
				});
		}
	}

	private mapHistoryToTableItems(history: IChangeTrackerItemDto[]) {
		const items: IGroupPriceHistoryTableItem[] = [];

		history.forEach((x) => {
			x.changes.forEach((change) => {
				const tableItem: IGroupPriceHistoryTableItem =
					{} as IGroupPriceHistoryTableItem;

				tableItem.author = {
					text: x.user.name ?? '-',
					pseudoLink: x.user.id!.toString(),
				};
				tableItem.newExcessIncomePercent =
					change?.toValue?.toString() ?? '-';
				tableItem.oldExcessIncomePercent =
					change?.fromValue?.toString() ?? '-';
				tableItem.periodType = x.action ?? '-';
				tableItem.property = change?.propertyName ?? '-';
				tableItem.date = x.createdTime
					? `${new Date(Date.parse(x.createdTime)).toLocaleString(
							'ru-RU',
							{
								year: 'numeric',
								month: 'numeric',
								day: 'numeric',
							}
						)}`
					: '-';

				items.push(tableItem);
			});
		});

		return items.slice(0, 10);
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
}
