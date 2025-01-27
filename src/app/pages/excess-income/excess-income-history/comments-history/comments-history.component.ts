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
import {CommonModule, NgIf} from '@angular/common';
import { UserInfoPopupComponent } from '@app/components/user-info-popup/user-info-popup.component';
import { ModalService } from '@app/core/modal/modal.service';
import { ExccessIncomeCommentsHistory } from '@app/core/models/excess-income/exccess-income-comments-history';
import { ICommentHistoryTableItem } from '@app/pages/excess-income/excess-income-history/comments-history/comments-history-table-item';
import {CardComponent} from "@app/shared/components/card/card.component";
import {HeadlineComponent} from "@app/shared/components/typography/headline/headline.component";
import {IconComponent} from "@app/shared/components/icon/icon.component";
import {PaginationComponent} from "@app/shared/components/pagination/pagination.component";
import {LoaderComponent} from "@app/shared/components/loader/loader.component";
import {EmptyDataPageComponent} from "@app/shared/components/empty-data-page/empty-data-page.component";

interface IDialogData {
	clientId: number;
	contractorId?: number;
	tovGroupId?: number;
	tovId?: number;
}

@UntilDestroy()
@Component({
	selector: 'app-excess-income-comments-history',
	standalone: true,
	imports: [
		CommonModule,
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
	templateUrl: './comments-history.component.html',
	styleUrl: './comments-history.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentsHistoryComponent {
	private readonly modalRef = inject(ModalRef);
	public total: number = 0;
	public pageSize = 10;
	public pageIndex = 1;
	public offset = 0;
	public tableItems: ITableItem[] = [];
	public items: ICommentHistoryTableItem[] = [];
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
		if (this.data.tovId) {
			this.tableState = TableState.Loading;

			this.excessIncomeApiService
				.getCommentsHistory(
					this.data.clientId,
					this.data.tovId,
					this.data.contractorId || null,
					this.pageSize,
					this.offset,
				)
				.pipe(untilDestroyed(this))
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

	private mapHistoryToTableItems(history: ExccessIncomeCommentsHistory[]) {
		return history.map(x => {
			const tableItem: ICommentHistoryTableItem = {} as ICommentHistoryTableItem;

			tableItem.author =
				{ text: x.author.name ?? '-', pseudoLink: x.author.id.toString() } ;
			tableItem.comment = x.comment ?? '-';
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
