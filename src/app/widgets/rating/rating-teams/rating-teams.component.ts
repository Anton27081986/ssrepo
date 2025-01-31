import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ChangeDetectionStrategy, Component, computed, effect, Signal } from '@angular/core';
import { IRankTypeItemDto } from '@app/core/models/awards/rank-type-item-dto';
import { toSignal } from '@angular/core/rxjs-interop';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import { IRankTypeListDto } from '@app/core/models/awards/rank-type-list-dto';
import {CommonModule, NgIf} from "@angular/common";
import {LoaderComponent} from "@app/shared/components/loader/loader.component";
import {TabsControlComponent} from "@app/widgets/rating/tabs-control/tabs-control.component";
import {RatingTeamsStateService} from "@app/widgets/rating/rating-teams/rating-teams.state";
import {RatingTeamUsersState} from "@app/widgets/rating/rating-team-users/rating-team-users.state";

@UntilDestroy()
@Component({
	selector: 'app-rating-teams',
	templateUrl: './rating-teams.component.html',
	styleUrls: ['./rating-teams.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		CommonModule,
		NgIf,
		TabsControlComponent,
		LoaderComponent,
		ReactiveFormsModule
	],
	standalone: true
})
export class RatingTeamsComponent {
	protected readonly rating: Signal<IRankTypeListDto | null> = toSignal(
		this.ratingState.rating$,
		{
			initialValue: null,
		},
	);

	protected readonly teams: Signal<IRankTypeItemDto[]> = computed(() => {
		const rating = this.rating();

		if (rating) {
			return rating.items;
		}

		return [];
	});

	public walkerControl: FormControl<IRankTypeItemDto> = this.ratingState.walkerControl;

	protected isLoading: Signal<boolean> = toSignal(this.ratingState.isLoading$, {
		requireSync: true,
	});

	constructor(
		private readonly ratingState: RatingTeamsStateService,
		private readonly ratingUsersState: RatingTeamUsersState,
	) {
		effect(() => {
			const rating = this.rating();

			if (rating) {
				const findWalkerInItems = rating.items.find(item => item.id === rating.rankTypeId);

				if (findWalkerInItems) {
					this.walkerControl.setValue(findWalkerInItems);
				} else {
					this.walkerControl.setValue(rating.items[0]);
				}
			}
		});

		this.walkerControl.valueChanges.pipe(untilDestroyed(this)).subscribe(val => {
			this.ratingUsersState.offset$.next(0);
		});
	}
}
