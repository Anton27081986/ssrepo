import { UntilDestroy } from '@ngneat/until-destroy';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { ICommentsItemDto } from '@app/core/models/awards/comments-item-dto';
import { VictoryService } from '@app/components/victory/victory.service';
import { VictoryEventEnum, VictoryRootService } from '@app/components/victory/victory-root.service';
import { Subscription } from 'rxjs';
import { IUserProfile } from '@app/core/models/auth/user-profile';
import { VictoryState } from '@app/components/victory/victory.state';
import { TooltipPosition, TooltipTheme } from '@app/shared/components/tooltip/tooltip.enums';

@UntilDestroy()
@Component({
	selector: 'app-victory-comment',
	templateUrl: './victory-comment.component.html',
	styleUrls: ['./victory-comment.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VictoryCommentComponent {
	@Input() comment: ICommentsItemDto | null = null;
	private readonly subscription: Subscription = new Subscription();
	protected readonly authUserId: number | null = null;
	@Output() updateComment: EventEmitter<ICommentsItemDto> = new EventEmitter<ICommentsItemDto>();

	constructor(
		private readonly victoryService: VictoryService,
		private readonly victoryRootService: VictoryRootService,
		private readonly victoryState: VictoryState,
	) {
		const profile = JSON.parse(localStorage.getItem('userProfile')!) as IUserProfile;
		this.authUserId = profile.id!;
	}

	protected editComment() {
		this.victoryState.activeFuncCommentEdit$.next(true);
		this.updateComment.emit(this.comment!);
	}

	protected deleteComment() {
		if (this.comment) {
			this.subscription.add(
				this.victoryService.removeVictoryCommentById(this.comment.id!).subscribe(() => {
					this.victoryRootService.event$.next({ type: VictoryEventEnum.victoryUpdated });
				}),
			);
		}
	}

	protected getFormatDate(date: string) {
		return new Date(Date.parse(date)).toLocaleString('ru-RU', {
			year: 'numeric',
			month: 'numeric',
			day: 'numeric',
			hour: 'numeric',
			minute: 'numeric',
		});
	}

	protected readonly TooltipPosition = TooltipPosition;
	protected readonly TooltipTheme = TooltipTheme;
}
