import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { IUserProfile } from '@app/core/models/user-profile';
import { UserProfileStoreService } from '@app/core/states/user-profile-store.service';
import { Observable } from 'rxjs';
import {AsyncPipe, NgIf} from "@angular/common";
import {AvatarComponent} from "@app/shared/components/avatar/avatar.component";
import {TextComponent} from "@app/shared/components/typography/text/text.component";
import {CaptionComponent} from "@app/shared/components/typography/caption/caption.component";
import {SsDividerComponent} from "@app/shared/components/ss-divider/ss-divider.component";
import {IconComponent} from "@app/shared/components/icon/icon.component";

@UntilDestroy()
@Component({
	selector: 'app-profile-card',
	templateUrl: './profile-card.component.html',
	styleUrls: ['./profile-card.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		NgIf,
		AsyncPipe,
		AvatarComponent,
		TextComponent,
		CaptionComponent,
		SsDividerComponent,
		IconComponent
	],
	standalone: true
})
export class ProfileCardComponent {
	protected readonly profile$: Observable<IUserProfile | null>;

	constructor(private readonly userStateService: UserProfileStoreService) {
		this.profile$ = userStateService.userProfile$;
	}
}
