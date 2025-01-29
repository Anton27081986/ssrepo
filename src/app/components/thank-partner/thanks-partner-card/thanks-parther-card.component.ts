import { UntilDestroy } from '@ngneat/until-destroy';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import {
	IPartnerPlaceEmblem,
	IPartnerThanksItemDto,
} from '@app/core/models/awards/partner-thanks-item-dto';

@UntilDestroy()
@Component({
	selector: 'app-thanks-partner-card',
	templateUrl: './thanks-partner-card.component.html',
	styleUrls: ['./thanks-partner-card.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThanksPartnerCardComponent {
	@Input() thanksPartner: IPartnerThanksItemDto | null = null;
	protected IPartnerPlaceEmblem = IPartnerPlaceEmblem;
}
