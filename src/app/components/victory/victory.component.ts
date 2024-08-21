import { UntilDestroy } from '@ngneat/until-destroy';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BehaviorSubject, Observable, switchMap } from 'rxjs';
import { IWinsListDto } from '@app/core/models/awards/wins-list-dto';
import { ModalService } from '@app/core/modal/modal.service';
import { AddVictoryModalComponent } from '@app/components/victory/modal/add-victory-modal/add-victory-modal.component';
import { VictoryService } from '@app/components/victory/victory.service';
import { VictoryState } from '@app/components/victory/victory.state';

@UntilDestroy()
@Component({
	selector: 'app-victory',
	templateUrl: './victory.component.html',
	styleUrls: ['./victory.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [VictoryState],
})
export class VictoryComponent {
	public total!: number;
	public pageSize = 12;
	public pageIndex = 1;
	public readonly victoryList$: Observable<IWinsListDto>;
	public offset$: BehaviorSubject<number> = new BehaviorSubject<number>(0);

	public nzPageIndexChange($event: number) {
		if ($event === 1) {
			this.offset$.next(0);
		} else {
			this.offset$.next(this.pageSize * $event - this.pageSize);
		}

		this.pageIndex = $event;
	}

	public constructor(
		private readonly modalService: ModalService,
		private readonly victoryService: VictoryService,
	) {
		this.victoryList$ = this.offset$.pipe(
			switchMap(offset => {
				return this.victoryService.getWins(this.pageSize, offset);
			}),
		);
	}

	protected openAddVictoryPopover() {
		this.modalService.open(AddVictoryModalComponent, { data: {} });
	}
}
