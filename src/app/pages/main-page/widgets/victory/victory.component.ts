import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BehaviorSubject, Observable, switchMap, tap } from 'rxjs';
import { IWinsListDto } from '@app/core/models/awards/wins-list-dto';
import { ModalService } from '@app/core/modal/modal.service';
import { TableState } from '@app/shared/components/table/table-state';
import { CardComponent } from '@app/shared/components/card/card.component';
import { LoaderComponent } from '@app/shared/components/loader/loader.component';
import { AsyncPipe, CommonModule, NgIf } from '@angular/common';
import { TextComponent } from '@app/shared/components/typography/text/text.component';
import { ButtonComponent } from '@app/shared/components/buttons/button/button.component';
import { IconComponent } from '@app/shared/components/icon/icon.component';
import { SsDividerComponent } from '@app/shared/components/ss-divider/ss-divider.component';
import { EmptyPlaceholderComponent } from '@app/shared/components/empty-placeholder/empty-placeholder.component';
import { HeadlineComponent } from '@app/shared/components/typography/headline/headline.component';
import { PaginationComponent } from '@app/shared/components/pagination/pagination.component';
import { VictoryService } from './victory.service';
import { AddVictoryModalComponent } from './modal/add-victory-modal/add-victory-modal.component';
import { UserCardWidgetComponent } from '../user-card-widget/user-card-widget.component';

@UntilDestroy()
@Component({
	selector: 'app-victory',
	templateUrl: './victory.component.html',
	styleUrls: ['./victory.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		CommonModule,
		CardComponent,
		LoaderComponent,
		NgIf,
		TextComponent,
		ButtonComponent,
		IconComponent,
		SsDividerComponent,
		AsyncPipe,
		UserCardWidgetComponent,
		EmptyPlaceholderComponent,
		HeadlineComponent,
		PaginationComponent,
	],
	standalone: true,
})
export class VictoryComponent {
	public total!: number;
	public pageSize = 12;
	public pageIndex = 1;
	public readonly victoryList$: Observable<IWinsListDto>;
	public offset$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
	public isLoading = true;

	protected readonly TableState = TableState;
	constructor(
		private readonly modalService: ModalService,
		private readonly victoryService: VictoryService
	) {
		this.victoryList$ = this.offset$.pipe(
			switchMap((offset) => {
				this.isLoading = true;

				return this.victoryService.getWins(this.pageSize, offset);
			}),
			untilDestroyed(this)
		);

		this.victoryList$
			.pipe(
				tap(() => {
					this.isLoading = false;
				}),
				untilDestroyed(this)
			)
			.subscribe();
	}

	public nzPageIndexChange($event: number) {
		if ($event === 1) {
			this.offset$.next(0);
		} else {
			this.offset$.next(this.pageSize * $event - this.pageSize);
		}

		this.pageIndex = $event;
	}

	protected openAddVictoryPopover() {
		this.modalService.open(AddVictoryModalComponent, { data: {} });
	}
}
