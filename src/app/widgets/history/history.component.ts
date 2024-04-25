import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { HistoryFacadeService } from '@app/core/facades/history-facade.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { IChangeTrackerItemDto } from '@app/core/models/change-tracker/change-tracker-item-dto';
import { SignalService } from '@app/core/signalR/signal.service';
import { AuthenticationService } from '@app/core/services/authentication.service';
import { IChangeItemDto } from '@app/core/models/change-tracker/change-item-dto';

@UntilDestroy()
@Component({
	selector: 'ss-history',
	templateUrl: './history.component.html',
	styleUrls: ['./history.component.scss'],
})
export class HistoryComponent implements OnInit, OnDestroy {
	@Input() public objectId: number | undefined;

	public historyItems: IChangeTrackerItemDto[] = [];

	public pageIndex = 1;
	public pageSize = 8;
	public total: number | undefined;
	public offset = 0;

	public constructor(
		private readonly historyFacadeService: HistoryFacadeService,
		private readonly signalHistoryService: SignalService,
		private readonly authService: AuthenticationService,
	) {}

	public ngOnInit() {
		if (this.objectId === undefined) {
			console.error('Требуется ObjectId');

			return;
		}

		this.loadDataFromServer(this.pageSize, this.offset);

		this.signalHistoryService.startConnection(
			this.authService.userValue.token!,
			this.objectId,
			0,
		);

		this.signalHistoryService.historyChange$.pipe(untilDestroyed(this)).subscribe(change => {
			console.info('signalR change', change);

			if (this.objectId === change.objectId) {
				this.historyItems.push(change.item);
			}
		});
	}

	public ngOnDestroy(): void {
		this.signalHistoryService.disconnect();
	}

	public loadDataFromServer(pageSize: number, offset: number) {
		this.historyFacadeService
			.getHistory(this.objectId!, 0, pageSize, offset)
			.pipe(untilDestroyed(this))
			.subscribe(items => {
				if (items.items) {
					this.historyItems = items.items;
				}

				if (items.total) {
					this.total = items.total + this.pageSize;
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

	public trackByHistoryItems(index: number, item: IChangeTrackerItemDto) {
		return item.id;
	}

	public trackByChanges(index: number, item: IChangeItemDto) {
		return index;
	}
}
