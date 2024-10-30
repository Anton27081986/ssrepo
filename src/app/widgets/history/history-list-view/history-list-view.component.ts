import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';
import { IChangeTrackerItemDto } from '@app/core/models/change-tracker/change-tracker-item-dto';
import { CardModule } from '@app/shared/components/card/card.module';
import { LoaderModule } from '@app/shared/components/loader/loader.module';
import { HeadlineModule } from '@app/shared/components/typography/headline/headline.module';
import { NgForOf, NgIf } from '@angular/common';
import { TextModule } from '@app/shared/components/typography/text/text.module';
import { ComponentsModule } from '@app/components/components.module';
import { AccordionModule } from '@app/shared/components/accordion/accordion.module';

@Component({
	selector: 'app-history-list-view',
	standalone: true,
	imports: [
		NgIf,
		CardModule,
		LoaderModule,
		HeadlineModule,
		NgForOf,
		TextModule,
		ComponentsModule,
		AccordionModule,
	],
	templateUrl: './history-list-view.component.html',
	styleUrl: './history-list-view.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HistoryListViewComponent {
	public historyItems = input.required<IChangeTrackerItemDto[]>();

	public pageIndex = model.required<number>();
	public pageSize = input<number>(8);
	public pageTotal = input.required<number>();
	public loading = input.required<boolean>();

	public trackByHistoryItems(index: number, item: IChangeTrackerItemDto) {
		return item.id;
	}

	public indexChanged(index: number) {
		this.pageIndex.set(index);
	}
}
