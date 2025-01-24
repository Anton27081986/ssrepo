import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';
import { IChangeTrackerItemDto } from '@app/core/models/change-tracker/change-tracker-item-dto';
import {TextComponent} from "@app/shared/components/typography/text/text.component";
import {LoaderComponent} from "@app/shared/components/loader/loader.component";
import {CardComponent} from "@app/shared/components/card/card.component";
import {PaginationComponent} from "@app/shared/components/pagination/pagination.component";
import {HeadlineComponent} from "@app/shared/components/typography/headline/headline.component";
import {AccordionComponent} from "@app/shared/components/accordion/accordion.component";

@Component({
	selector: 'app-history-list-view',
	standalone: true,
	imports: [
		TextComponent,
		LoaderComponent,
		CardComponent,
		PaginationComponent,
		HeadlineComponent,
		AccordionComponent,
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
