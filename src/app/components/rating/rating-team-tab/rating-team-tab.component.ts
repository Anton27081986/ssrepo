import { UntilDestroy } from '@ngneat/until-destroy';
import { IRankTypeItemDto } from '@app/core/models/awards/rank-type-item-dto';
import { ChangeDetectionStrategy, Component, input, InputSignal } from '@angular/core';
import { TooltipPosition, TooltipTheme } from '@app/shared/components/tooltip/tooltip.enums';

export enum TypeCup {
	gold = 1,
	silver = 2,
	cooper = 3,
}

@UntilDestroy()
@Component({
	selector: 'app-rating-team-tab',
	templateUrl: './rating-team-tab.component.html',
	styleUrls: ['./rating-team-tab.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RatingTeamTabComponent {
	public team: InputSignal<IRankTypeItemDto> = input.required<IRankTypeItemDto>();
	public active: InputSignal<boolean> = input.required<boolean>();
	public isTeam: InputSignal<boolean> = input.required<boolean>();
	protected readonly TooltipTheme = TooltipTheme;
	protected readonly TooltipPosition = TooltipPosition;
}
