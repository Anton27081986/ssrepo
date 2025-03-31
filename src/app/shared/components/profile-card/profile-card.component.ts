import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { IUserProfile } from '@app/core/models/user-profile';
import { UserProfileStoreService } from '@app/core/states/user-profile-store.service';
import { Observable } from 'rxjs';
import { ProfileCardImports } from '@app/shared/components/profile-card/profile-card.imports';

@UntilDestroy()
@Component({
	selector: 'app-profile-card',
	templateUrl: './profile-card.component.html',
	styleUrls: ['./profile-card.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: ProfileCardImports,
	standalone: true,
})
export class ProfileCardComponent {
	protected readonly profile$: Observable<IUserProfile | null>;

	constructor(private readonly userStateService: UserProfileStoreService) {
		this.profile$ = userStateService.userProfile$;
	}
}
