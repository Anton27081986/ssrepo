import {
	ChangeDetectionStrategy,
	Component,
	effect,
	inject,
	input,
	OnChanges,
	OnDestroy,
	signal,
	SimpleChanges,
	WritableSignal,
} from '@angular/core';
import { combineLatest, filter, map, of, switchMap, tap } from 'rxjs';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { HistoryFacadeService } from '@app/core/facades/history-facade.service';
import { SignalService } from '@app/core/signalR/signal.service';
import { AuthenticationService } from '@app/core/services/authentication.service';
import { QueryType } from '@app/widgets/history/models/query-type';
import { ViewMode } from '@app/widgets/history/models/view-mode';
import { IChangeTrackerItemDto } from '@app/core/models/change-tracker/change-tracker-item-dto';
import { catchError } from 'rxjs/operators';
import { HistoryListViewComponent } from '@app/widgets/history/history-list-view/history-list-view.component';
import { HistoryTableViewComponent } from '@app/widgets/history/history-table-view/history-table-view.component';
import { formatDate } from '@angular/common';

@Component({
	selector: 'ss-history',
	templateUrl: './history.component.html',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [HistoryListViewComponent, HistoryTableViewComponent],
})
export class HistoryComponent implements OnChanges, OnDestroy {
	private readonly historyFacadeService = inject(HistoryFacadeService);
	private readonly signalHistoryService = inject(SignalService);
	private readonly authService = inject(AuthenticationService);

	public objectId = input.required<number>();
	public queryType = input.required<QueryType>();
	public view = input<ViewMode>(ViewMode.List);

	public pageIndex = signal(1);
	public pageSize = input<number>(8);
	public pageTotal = signal(0);
	public loading = signal<boolean>(false);
	public readonly viewMode = ViewMode;

	public historyItems = toSignal(
		combineLatest([
			toObservable(this.objectId),
			toObservable(this.queryType),
			toObservable(this.pageIndex),
			toObservable(this.pageSize),
		]).pipe(
			tap(() => this.loading.set(true)),
			filter(([objectId]) => !!objectId),
			switchMap(([objectId, queryType, pageIndex, pageSize]) =>
				this.historyFacadeService
					.getHistory(objectId, queryType, pageSize, (pageIndex - 1) * pageSize)
					.pipe(
						tap(response => this.pageTotal.set(response.total || 0)),

						map(response =>
							response.items.map(historyItem => {
								historyItem.createdTime = formatDate(
									new Date(historyItem.createdTime),
									'dd.MM.yyyy HH:mm',
									'ru-RU',
								);

								return historyItem;
							}),
						),

						catchError(() => {
							this.loading.set(false);

							return of([] as IChangeTrackerItemDto[]);
						}),
					),
			),
			tap(() => this.loading.set(false)),
		),
		{
			initialValue: [] as IChangeTrackerItemDto[],
		},
	);

	public mutableHistoryItems: WritableSignal<IChangeTrackerItemDto[]> = signal(
		this.historyItems(),
	);

	public constructor() {
		this.historyChanges();

		effect(
			() => {
				this.mutableHistoryItems.set(this.historyItems());
			},
			{ allowSignalWrites: true },
		);
	}

	public ngOnChanges(changes: SimpleChanges) {
		if (changes.objectId && this.objectId()) {
			this.signalHistoryService.startConnection(
				this.authService.userValue.token!,
				this.objectId(),
				this.queryType(),
			);
		}
	}

	public ngOnDestroy(): void {
		this.signalHistoryService.disconnect();
	}

	private historyChanges(): void {
		toSignal(
			this.signalHistoryService.historyChange$.pipe(
				tap(change => {
					if (this.objectId() === change.objectId) {
						this.mutableHistoryItems.set([change.item, ...this.mutableHistoryItems()]);
					}
				}),
			),
		);
	}
}
