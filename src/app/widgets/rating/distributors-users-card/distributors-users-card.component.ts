import { UntilDestroy } from '@ngneat/until-destroy';
import { Component, input, Input, InputSignal } from '@angular/core';
import { IDistributorDto } from '@app/core/models/awards/distributor-dto';
import { AvatarComponent } from '@app/shared/components/avatar/avatar.component';
import { TextComponent } from '@app/shared/components/typography/text/text.component';

@UntilDestroy()
@Component({
	selector: 'app-distributors-users-card',
	templateUrl: './distributors-users-card.component.html',
	styleUrls: ['./distributors-users-card.component.scss'],
	imports: [AvatarComponent, TextComponent],
	standalone: true,
})
export class DistributorsUsersCardComponent {
	public team: InputSignal<IDistributorDto> =
		input.required<IDistributorDto>();

	@Input()
	viewPopupInfo = false;

	@Input()
	public size: 'small' | 'medium' | 'large' | 'big' = 'medium';
}
