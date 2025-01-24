import { UntilDestroy } from '@ngneat/until-destroy';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import {
	IPartnerPlaceEmblem,
	IPartnerThanksItemDto,
} from '@app/core/models/awards/partner-thanks-item-dto';
import {CardComponent} from "@app/shared/components/card/card.component";
import {NgIf, NgSwitch, NgSwitchCase} from "@angular/common";
import {UserCardComponent} from "@app/components/user-card/user-card.component";
import {IconComponent} from "@app/shared/components/icon/icon.component";

@UntilDestroy()
@Component({
	selector: 'app-thanks-partner-card',
	templateUrl: './thanks-partner-card.component.html',
	styleUrls: ['./thanks-partner-card.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		CardComponent,
		NgIf,
		UserCardComponent,
		NgSwitch,
		IconComponent,
		NgSwitchCase
	],
	standalone: true
})
export class ThanksPartnerCardComponent {
	@Input() thanksPartner: IPartnerThanksItemDto | null = null;
	protected IPartnerPlaceEmblem = IPartnerPlaceEmblem;
}
