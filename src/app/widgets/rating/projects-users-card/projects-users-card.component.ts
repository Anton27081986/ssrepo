import { UntilDestroy } from '@ngneat/until-destroy';
import { Component, input, Input, InputSignal } from '@angular/core';
import { IProjectDto } from '@app/core/models/awards/project-dto';
import { AvatarComponent } from '@app/shared/components/avatar/avatar.component';
import { TextComponent } from '@app/shared/components/typography/text/text.component';

@UntilDestroy()
@Component({
	selector: 'app-projects-users-card',
	templateUrl: './projects-users-card.component.html',
	styleUrls: ['./projects-users-card.component.scss'],
	imports: [AvatarComponent, TextComponent],
	standalone: true,
})
export class ProjectsUsersCardComponent {
	public team: InputSignal<IProjectDto> = input.required<IProjectDto>();
	@Input()
	viewPopupInfo = false;

	@Input()
	public size: 'small' | 'medium' | 'large' | 'big' = 'medium';
}
