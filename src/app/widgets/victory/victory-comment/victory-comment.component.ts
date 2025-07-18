import { UntilDestroy } from '@ngneat/until-destroy';
import {
	ChangeDetectionStrategy,
	Component,
	EventEmitter,
	Input,
	Output,
} from '@angular/core';
import { ICommentsItemDto } from '@app/core/models/awards/comments-item-dto';
import { Subscription } from 'rxjs';
import { IUserProfile } from '@app/core/models/auth/user-profile';
import {
	TooltipPosition,
	TooltipTheme,
} from '@app/shared/components/tooltip/tooltip.enums';
import { IconComponent } from '@app/shared/components/icon/icon.component';
import { TooltipDirective } from '@app/shared/components/tooltip/tooltip.directive';
import { TextComponent } from '@app/shared/components/typography/text/text.component';
import { SsDividerComponent } from '@app/shared/components/ss-divider/ss-divider.component';
import { DatePipe } from '@angular/common';
import { VictoryService } from '@app/widgets/victory/victory.service';
import {
	VictoryEventEnum,
	VictoryRootService,
} from '@app/widgets/victory/victory-root.service';
import { VictoryState } from '@app/widgets/victory/victory.state';
import { UserCardComponent } from '@app/shared/components/user-card/user-card.component';

@UntilDestroy()
@Component({
	selector: 'app-victory-comment',
	templateUrl: './victory-comment.component.html',
	styleUrls: ['./victory-comment.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		UserCardComponent,
		IconComponent,
		TooltipDirective,
		TextComponent,
		SsDividerComponent,
		DatePipe,
	],
	standalone: true,
})
export class VictoryCommentComponent {
	@Input()
	comment: ICommentsItemDto | null = null;

	private readonly subscription: Subscription = new Subscription();
	protected readonly authUserId: number | null = null;
	@Output()
	updateComment: EventEmitter<ICommentsItemDto> =
		new EventEmitter<ICommentsItemDto>();

	protected readonly TooltipPosition = TooltipPosition;
	protected readonly TooltipTheme = TooltipTheme;
	constructor(
		private readonly victoryService: VictoryService,
		private readonly victoryRootService: VictoryRootService,
		private readonly victoryState: VictoryState
	) {
		const profile = JSON.parse(
			localStorage.getItem('userProfile')!
		) as IUserProfile;

		this.authUserId = profile.id!;
	}

	protected editComment() {
		this.victoryState.activeFuncCommentEdit$.next(true);
		this.updateComment.emit(this.comment!);
	}

	protected deleteComment() {
		if (this.comment) {
			this.subscription.add(
				this.victoryService
					.removeVictoryCommentById(this.comment.id!)
					.subscribe(() => {
						this.victoryRootService.event$.next({
							type: VictoryEventEnum.victoryUpdated,
						});
					})
			);
		}
	}
}
