import { UntilDestroy } from '@ngneat/until-destroy';
import { Component, input, Input, InputSignal } from '@angular/core';
import { ITeamDto } from '@app/core/models/awards/team-dto';
import {AvatarComponent} from "@app/shared/components/avatar/avatar.component";
import {TextComponent} from "@app/shared/components/typography/text/text.component";

@UntilDestroy()
@Component({
	selector: 'app-team-users-card',
	templateUrl: './team-users-card.component.html',
	styleUrls: ['./team-users-card.component.scss'],
	imports: [
		AvatarComponent,
		TextComponent
	],
	standalone: true
})
export class TeamUsersCardComponent {
	public team: InputSignal<ITeamDto> = input.required<ITeamDto>();
	@Input() viewPopupInfo: boolean = false;
	@Input() public size: 'small' | 'medium' | 'large' | 'big' = 'medium';
}
