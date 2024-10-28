import { ChangeDetectionStrategy, Component, computed, OnInit, Signal } from '@angular/core';
import { IUserProfile } from '@app/core/models/user-profile';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { RatingTeamsStateService } from '@app/components/rating/rating-teams/rating-teams.state';
import { IWeekItemDto } from '@app/core/models/awards/week-item-dto';
import { IRankTypeListDto } from '@app/core/models/awards/rank-type-list-dto';
import { RatingTeamUsersState } from '@app/components/rating/rating-team-users/rating-team-users.state';
import { IDictionaryItemDto } from '@app/core/models/company/dictionary-item-dto';
import { filterTruthy } from '@app/core/facades/client-proposals-facade.service';
import { TooltipPosition, TooltipTheme } from '@app/shared/components/tooltip/tooltip.enums';
import { RatingService } from '@app/components/rating/rating.service';
import { TypeReport } from '@app/core/api/rating-api.service';
import { switchMap } from 'rxjs';
import { IRankTypeItemDto } from '@app/core/models/awards/rank-type-item-dto';

export interface RatingCriteriaForm {
	weekId: FormControl<number | null>;
	userId: FormControl<number | null>;
}

@UntilDestroy()
@Component({
	selector: 'app-rating',
	templateUrl: './rating.component.html',
	styleUrls: ['./rating.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [RatingTeamsStateService, RatingTeamUsersState],
})
export class RatingComponent implements OnInit {
	public weeks: Signal<IWeekItemDto[]> = toSignal(this.ratingState.weeks$, {
		initialValue: [],
	});

	public weeksOptions: Signal<IDictionaryItemDto[]> = computed(() => {
		return this.weeks().map(week => {
			return {
				id: week.id,
				name: week.name!,
			};
		});
	});

	public rating: Signal<IRankTypeListDto | null> = toSignal(this.ratingState.rating$, {
		initialValue: null,
	});

	public averageAll: Signal<number | undefined> = computed(() => {
		return this.rating()?.averageAll;
	});

	public membersTotal: Signal<number | undefined> = computed(() => {
		return this.rating()?.membersTotal;
	});

	public canDownloadReport: Signal<boolean> = toSignal(this.ratingState.reportAvailable$, {
		initialValue: false,
	});

	protected readonly form: FormGroup<RatingCriteriaForm> = this.buildForm();

	constructor(
		private readonly ratingState: RatingTeamsStateService,
		private readonly ratingService: RatingService,
	) {}

	ngOnInit() {
		this.ratingState.weeks$.pipe(filterTruthy(), untilDestroyed(this)).subscribe(item => {
			this.form.controls.weekId.setValue(item[0].id);
		});

		this.ratingState.currentUser$.pipe(filterTruthy(), untilDestroyed(this)).subscribe(user => {
			this.form.controls.userId.setValue(user.id);
		});

		this.form.controls.userId.valueChanges
			.pipe(filterTruthy(), untilDestroyed(this))
			.subscribe(this.ratingState.userId$);
		this.form.controls.weekId.valueChanges
			.pipe(filterTruthy(), untilDestroyed(this))
			.subscribe(this.ratingState.weekId$);
	}

	private buildForm(): FormGroup<RatingCriteriaForm> {
		return new FormGroup<RatingCriteriaForm>({
			weekId: new FormControl<number | null>(
				{ value: null, disabled: false },
				Validators.required,
			),
			userId: new FormControl<number | null>(
				{ value: null, disabled: false },
				Validators.required,
			),
		});
	}

	protected redirectUrl(type: TypeReport) {
		const value = this.ratingState.walkerControl.value;
		if (value && value.reportAvailable) {
			this.ratingService
				.getRatingReport(type, value)
				.pipe(untilDestroyed(this))
				.subscribe(url => {
					window.open(url, '_blank');
				});
		}
	}

	protected readonly TooltipPosition = TooltipPosition;
	protected readonly TooltipTheme = TooltipTheme;
	protected readonly TypeReport = TypeReport;
}
