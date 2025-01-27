import { UntilDestroy } from '@ngneat/until-destroy';
import {
	ChangeDetectionStrategy,
	Component,
	computed,
	input,
	InputSignal,
	Signal,
} from '@angular/core';
import { IRankItemDto } from '@app/core/models/awards/rank-item-dto';
import { TypeCup } from '@app/components/rating/rating-team-tab/rating-team-tab.component';
import { TooltipPosition, TooltipTheme } from '@app/shared/components/tooltip/tooltip.enums';
import { ModalService } from '@app/core/modal/modal.service';
import { RateTypeEnum } from '@app/core/models/awards/rate-type';
import {CardComponent} from "@app/shared/components/card/card.component";
import {CommonModule, NgIf, NgSwitch, NgSwitchCase} from "@angular/common";
import {UserCardComponent} from "@app/components/user-card/user-card.component";
import {ProjectsUsersCardComponent} from "@app/components/rating/projects-users-card/projects-users-card.component";
import {
	DistributorsUsersCardComponent
} from "@app/components/rating/distributors-users-card/distributors-users-card.component";
import {TeamUsersCardComponent} from "@app/components/rating/team-users-card/team-users-card.component";
import {TooltipDirective} from "@app/shared/components/tooltip/tooltip.directive";
import {TextComponent} from "@app/shared/components/typography/text/text.component";
import {IconComponent} from "@app/shared/components/icon/icon.component";

@UntilDestroy()
@Component({
	selector: 'app-rating-team-users-card',
	templateUrl: './rating-team-users-card.component.html',
	styleUrls: ['./rating-team-users-card.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		CommonModule,
		CardComponent,
		NgSwitch,
		NgSwitchCase,
		UserCardComponent,
		ProjectsUsersCardComponent,
		DistributorsUsersCardComponent,
		TeamUsersCardComponent,
		NgIf,
		TooltipDirective,
		TextComponent,
		IconComponent
	],
	standalone: true
})
export class RatingTeamUsersCardComponent {
	public teamUsers: InputSignal<IRankItemDto> = input.required<IRankItemDto>();

	public typeCup: Signal<'gold' | 'silver' | 'cooper' | null> = computed(() => {
		switch (this.teamUsers().place) {
			case TypeCup.gold:
				return 'gold';
			case TypeCup.silver:
				return 'silver';
			case TypeCup.cooper:
				return 'cooper';
			default:
				return null;
		}
	});

	redirectOnComment(link: string | null) {
		if (link) {
			window.open(link);
		}
	}

	constructor(private readonly modalService: ModalService) {}

	protected readonly TooltipPosition = TooltipPosition;
	protected readonly TooltipTheme = TooltipTheme;
	protected readonly RateTypeEnum = RateTypeEnum;
}
