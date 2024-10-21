import { UntilDestroy } from '@ngneat/until-destroy';
import { Component, input, Input, InputSignal } from '@angular/core';
import { ITeamDto } from '@app/core/models/awards/team-dto';

@UntilDestroy()
@Component({
	selector: 'app-team-users-card',
	templateUrl: './team-users-card.component.html',
	styleUrls: ['./team-users-card.component.scss'],
})
export class TeamUsersCardComponent {
	public team: InputSignal<ITeamDto> = input.required<ITeamDto>();
	@Input() viewPopupInfo: boolean = false;
	@Input() public size: 'small' | 'medium' | 'large' | 'big' = 'medium';
}
