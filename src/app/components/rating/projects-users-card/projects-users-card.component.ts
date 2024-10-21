import { UntilDestroy } from '@ngneat/until-destroy';
import { Component, input, Input, InputSignal } from '@angular/core';
import { IProjectDto } from '@app/core/models/awards/project-dto';

@UntilDestroy()
@Component({
	selector: 'app-projects-users-card',
	templateUrl: './projects-users-card.component.html',
	styleUrls: ['./projects-users-card.component.scss'],
})
export class ProjectsUsersCardComponent {
	public team: InputSignal<IProjectDto> = input.required<IProjectDto>();
	@Input() viewPopupInfo: boolean = false;
	@Input() public size: 'small' | 'medium' | 'large' | 'big' = 'medium';
}
