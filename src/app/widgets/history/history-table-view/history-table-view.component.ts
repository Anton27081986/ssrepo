import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';
import { IChangeTrackerItemDto } from '@app/core/models/change-tracker/change-tracker-item-dto';
import { ITableItem } from '@app/shared/components/table/table.component';
import { LoaderModule } from '@app/shared/components/loader/loader.module';
import { TableModule } from '@app/shared/components/table/table.module';
import { ComponentsModule } from '@app/components/components.module';

@Component({
	selector: 'app-history-table-view',
	standalone: true,
	imports: [LoaderModule, TableModule, ComponentsModule],
	templateUrl: './history-table-view.component.html',
	styleUrl: './history-table-view.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HistoryTableViewComponent {
	public historyItems = input<ITableItem[], IChangeTrackerItemDto[]>([], {
		transform: this.convertToTableItems,
	});

	public pageIndex = model.required<number>();
	public pageSize = input<number>(8);
	public pageTotal = input.required<number>();
	public loading = input.required<boolean>();

	public indexChanged(index: number) {
		this.pageIndex.set(index);
	}

	private convertToTableItems(historyItems: IChangeTrackerItemDto[]): ITableItem[] {
		return <ITableItem[]>(<unknown>historyItems.map(item => {
			return {
				createdTime: item.createdTime,
				userName: item.user?.name,
				comments: item.comments ?? '-',
				action: item.action,
			};
		}));
	}
}
