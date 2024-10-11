import { UntilDestroy } from '@ngneat/until-destroy';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { IUserDto } from '@app/core/models/awards/user-dto';
import { TooltipPosition, TooltipTheme } from '@app/shared/components/tooltip/tooltip.enums';

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
})
export class LikeComponent {
	@Input() count: number = 0;
	@Input() likedUsers: IUserDto[] | null = null;
	@Input() type: LikeStateEnum = LikeStateEnum.default;
	protected readonly TooltipPosition = TooltipPosition;
	protected readonly TooltipTheme = TooltipTheme;
	protected LikeStateEnum = LikeStateEnum;
}
