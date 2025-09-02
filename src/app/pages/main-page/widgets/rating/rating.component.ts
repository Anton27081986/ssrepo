import {
	ChangeDetectionStrategy,
	Component,
	computed,
	OnInit,
	Signal,
} from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import {
	FormControl,
	FormGroup,
	ReactiveFormsModule,
	Validators,
} from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { IWeekItemDto } from '@app/core/models/awards/week-item-dto';
import { IRankTypeListDto } from '@app/core/models/awards/rank-type-list-dto';
import { IDictionaryItemDto } from '@app/core/models/company/dictionary-item-dto';
import { filterTruthy } from '@app/core/facades/client-proposals-facade.service';
import {
	TooltipPosition,
	TooltipTheme,
} from '@app/shared/components/tooltip/tooltip.enums';
import { TypeReport } from '@app/core/api/rating-api.service';
import { CardComponent } from '@app/shared/components/card/card.component';
import { TextComponent } from '@app/shared/components/typography/text/text.component';
import { CommonModule, NgIf } from '@angular/common';
import { TooltipDirective } from '@app/shared/components/tooltip/tooltip.directive';
import { IconComponent } from '@app/shared/components/icon/icon.component';
import { SelectV2Component } from '@app/shared/components/inputs/select-v2/select-v2.component';
import { SsDividerComponent } from '@app/shared/components/ss-divider/ss-divider.component';
import { SearchUserInputComponent } from '@app/shared/components/inputs/search-user-input/search-user-input.component';
import { RatingTeamsComponent } from './rating-teams/rating-teams.component';
import { RatingTeamUsersComponent } from './rating-team-users/rating-team-users.component';
import { RatingService } from './rating.service';
import { RatingTeamsStateService } from './rating-teams/rating-teams.state';

export interface RatingCriteriaForm {
	week: FormControl<IDictionaryItemDto | null>;
	userId: FormControl<number | null>;
}

@UntilDestroy()
@Component({
	selector: 'app-rating',
	templateUrl: './rating.component.html',
	styleUrls: ['./rating.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		CommonModule,
		CardComponent,
		TextComponent,
		NgIf,
		TooltipDirective,
		IconComponent,
		SelectV2Component,
		ReactiveFormsModule,
		SsDividerComponent,
		RatingTeamsComponent,
		RatingTeamUsersComponent,
		SearchUserInputComponent,
	],
	standalone: true,
})
export class RatingComponent implements OnInit {
	public weeks: Signal<IWeekItemDto[]> = toSignal(this.ratingState.weeks$, {
		initialValue: [],
	});

	public weeksOptions: Signal<IDictionaryItemDto[]> = computed(() => {
		return this.weeks().map((week) => {
			return {
				id: week.id,
				name: week.name!,
			};
		});
	});

	public rating: Signal<IRankTypeListDto | null> = toSignal(
		this.ratingState.rating$,
		{
			initialValue: null,
		}
	);

	public averageAll: Signal<number | undefined> = computed(() => {
		return this.rating()?.averageAll;
	});

	public membersTotal: Signal<number | undefined> = computed(() => {
		return this.rating()?.membersTotal;
	});

	public canDownloadReport: Signal<boolean> = toSignal(
		this.ratingState.reportAvailable$,
		{
			initialValue: false,
		}
	);

	protected readonly form: FormGroup<RatingCriteriaForm> = this.buildForm();

	protected readonly TooltipPosition = TooltipPosition;
	protected readonly TooltipTheme = TooltipTheme;
	protected readonly TypeReport = TypeReport;
	constructor(
		private readonly ratingState: RatingTeamsStateService,
		private readonly ratingService: RatingService
	) {}

	ngOnInit() {
		this.ratingState.weeks$
			.pipe(filterTruthy(), untilDestroyed(this))
			.subscribe((item) => {
				this.form.controls.week.setValue({
					id: item[0].id,
					name: item[0].name!,
				});
			});

		this.ratingState.currentUser$
			.pipe(filterTruthy(), untilDestroyed(this))
			.subscribe((user) => {
				this.form.controls.userId.setValue(user.id);
			});

		this.form.controls.userId.valueChanges
			.pipe(filterTruthy(), untilDestroyed(this))
			.subscribe(this.ratingState.userId$);
		this.form.controls.week.valueChanges
			.pipe(filterTruthy(), untilDestroyed(this))
			.subscribe(this.ratingState.week$);
	}

	private buildForm(): FormGroup<RatingCriteriaForm> {
		return new FormGroup<RatingCriteriaForm>({
			week: new FormControl<IDictionaryItemDto | null>(
				{ value: null, disabled: false },
				Validators.required
			),
			userId: new FormControl<number | null>(
				{ value: null, disabled: false },
				Validators.required
			),
		});
	}

	protected redirectUrl(type: TypeReport) {
		const value = this.ratingState.walkerControl.value;

		if (value && value.reportAvailable) {
			this.ratingService
				.getRatingReport(type, value)
				.pipe(untilDestroyed(this))
				.subscribe((url) => {
					window.open(url, '_blank');
				});
		}
	}
}
