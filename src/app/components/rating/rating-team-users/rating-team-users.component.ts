import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ChangeDetectionStrategy, Component, computed, Signal } from '@angular/core';
import { RatingTeamUsersState } from '@app/components/rating/rating-team-users/rating-team-users.state';
import { toSignal } from '@angular/core/rxjs-interop';
import { IRankItemDto } from '@app/core/models/awards/rank-item-dto';
import { IRatingTeamsResponse } from '@app/core/utils/response';
import { RatingTeamsStateService } from '@app/components/rating/rating-teams/rating-teams.state';
import {TextComponent} from "@app/shared/components/typography/text/text.component";
import {LoaderComponent} from "@app/shared/components/loader/loader.component";
import {NgForOf, NgIf} from "@angular/common";
import {
	RatingTeamUsersCardComponent
} from "@app/components/rating/rating-team-users-card/rating-team-users-card.component";
import {EmptyPlaceholderComponent} from "@app/shared/components/empty-placeholder/empty-placeholder.component";
import {IconComponent} from "@app/shared/components/icon/icon.component";
import {HeadlineComponent} from "@app/shared/components/typography/headline/headline.component";
import {PaginationComponent} from "@app/shared/components/pagination/pagination.component";

@UntilDestroy()
@Component({
	selector: 'app-rating-team-users',
	templateUrl: './rating-team-users.component.html',
	styleUrls: ['./rating-team-users.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		TextComponent,
		LoaderComponent,
		NgIf,
		RatingTeamUsersCardComponent,
		NgForOf,
		EmptyPlaceholderComponent,
		IconComponent,
		HeadlineComponent,
		PaginationComponent
	],
	standalone: true
})
export class RatingTeamUsersComponent {
	protected usersTeamResponse: Signal<IRatingTeamsResponse<IRankItemDto> | null> = toSignal(
		this.usersTeamState.teamUsers$,
		{
			initialValue: null,
		},
	);

	protected users: Signal<IRankItemDto[]> = computed(() => {
		const usersTeamsResponse = this.usersTeamResponse();

		if (usersTeamsResponse) {
			return usersTeamsResponse.items;
		}

		return [];
	});

	protected total: Signal<number> = computed(() => {
		const usersTeamsResponse = this.usersTeamResponse();

		if (usersTeamsResponse) {
			return usersTeamsResponse.total;
		}

		return 0;
	});

	protected teamName: Signal<string | null> = computed(() => {
		const usersTeamsResponse = this.usersTeamResponse();

		if (usersTeamsResponse) {
			return usersTeamsResponse.teamName;
		}

		return null;
	});

	protected isLoading: Signal<boolean> = toSignal(this.usersTeamState.isLoading$, {
		requireSync: true,
	});

	public limit: number = this.usersTeamState.limit;
	public pageSize = this.usersTeamState.pageSize;
	public pageIndex = this.usersTeamState.pageIndex;
	public offset$ = this.usersTeamState.offset$;

	constructor(
		private readonly usersTeamState: RatingTeamUsersState,
		private readonly teamState: RatingTeamsStateService,
	) {
		this.teamState.walkerControl.valueChanges.pipe(untilDestroyed(this)).subscribe(val => {
			this.pageIndex = 1;
		});
	}

	public nzPageIndexChange($event: number) {
		if ($event === 1) {
			this.offset$.next(0);
		} else {
			this.offset$.next(this.pageSize * $event - this.pageSize);
		}

		this.pageIndex = $event;
	}
}
