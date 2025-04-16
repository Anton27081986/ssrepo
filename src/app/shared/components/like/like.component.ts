import { UntilDestroy } from '@ngneat/until-destroy';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { IUserDto } from '@app/core/models/awards/user-dto';
import {
	TooltipPosition,
	TooltipTheme,
} from '@app/shared/components/tooltip/tooltip.enums';
import { IconComponent } from '@app/shared/components/icon/icon.component';
import { TooltipDirective } from '@app/shared/components/tooltip/tooltip.directive';
import { TextComponent } from '@app/shared/components/typography/text/text.component';
import { UserListMoreComponent } from '@app/shared/components/like/user-list-more/user-list-more.component';

export enum LikeStateEnum {
	usual,
	gold,
	silver,
	copper,
	default,
}

@UntilDestroy()
@Component({
	selector: 'app-like',
	templateUrl: './like.component.html',
	styleUrls: ['./like.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		IconComponent,
		TooltipDirective,
		TextComponent,
		UserListMoreComponent,
	],
	standalone: true,
})
export class LikeComponent {
	@Input()
	count = 0;

	@Input()
	likedUsers: IUserDto[] = [];

	@Input()
	type: LikeStateEnum = LikeStateEnum.default;

	protected readonly TooltipPosition = TooltipPosition;
	protected readonly TooltipTheme = TooltipTheme;
	protected LikeStateEnum = LikeStateEnum;
}
