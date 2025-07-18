import {
	ChangeDetectionStrategy,
	Component,
	input,
	model,
} from '@angular/core';
import { IChangeTrackerItemDto } from '@app/core/models/change-tracker/change-tracker-item-dto';
import {
	ITableHead,
	ITableItem,
	TableComponent,
} from '@app/shared/components/table/table.component';
import { LoaderComponent } from '@app/shared/components/loader/loader.component';
import { PaginationComponent } from '@app/shared/components/pagination/pagination.component';

@Component({
	selector: 'app-history-table-view',
	standalone: true,
	imports: [LoaderComponent, TableComponent, PaginationComponent],
	templateUrl: './history-table-view.component.html',
	styleUrl: './history-table-view.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HistoryTableViewComponent {
	public historyItems = input<ITableItem[], IChangeTrackerItemDto[]>([], {
		transform: this.convertToTableItems,
	});

	public tableHead = input<ITableHead[]>([]);

	public pageIndex = model.required<number>();
	public pageSize = input<number>(8);
	public pageTotal = input.required<number>();
	public loading = input.required<boolean>();

	public indexChanged(index: number) {
		this.pageIndex.set(index);
	}

	private convertToTableItems(
		historyItems: IChangeTrackerItemDto[]
	): ITableItem[] {
		return <ITableItem[]>(<unknown>historyItems.map((item) => {
			return {
				createdTime: item.createdTime,
				userName: item.user?.name,
				comments: item.comments ?? '-',
				action: item.action,
				fromValue: item.changes[0]?.fromValue ?? '-',
				toValue: item.changes[0]?.toValue ?? '-',
			};
		}));
	}
}
