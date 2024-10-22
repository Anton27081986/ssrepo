import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { IThanksColleagueItem } from '@app/core/models/thanks-colleagues/thanks-colleague-item';
import { UserInfoPopupComponent } from '@app/components/user-info-popup/user-info-popup.component';
import { ModalService } from '@app/core/modal/modal.service';
import { IObjectType } from '@app/core/models/awards/object-type';
import { VictoryService } from '@app/components/victory/victory.service';
import { LikeStateEnum } from '@app/shared/components/like/like.component';
import { TooltipPosition, TooltipTheme } from '@app/shared/components/tooltip/tooltip.enums';
import { ThanksColleagueModalComponent } from '@app/widgets/thank-colleague/modal/thanks-colleague-modal/thanks-colleague-modal.component';

@UntilDestroy()
@Component({
	selector: 'app-thanks-colleague-card',
	templateUrl: './thanks-colleague-card.component.html',
	styleUrls: ['./thanks-colleague-card.component.scss'],
})
export class ThanksColleagueCardComponent {
	@Input() thankColleague: IThanksColleagueItem | null = null;
	@Input() isExtendedMode: boolean = false;

	protected isChoiceLike = false;

	protected readonly LikeStateEnum = LikeStateEnum;
	protected readonly TooltipTheme = TooltipTheme;
	protected readonly TooltipPosition = TooltipPosition;

	constructor(
		private readonly modalService: ModalService,
		private readonly victoryService: VictoryService,
		private readonly cdr: ChangeDetectorRef,
	) {}

	protected openModalInfoUser(id: number | undefined) {
		if (id) {
			this.modalService.open(UserInfoPopupComponent, { data: id });
		}
	}

	protected changeLike(
		thank: IThanksColleagueItem | null,
		likeType: LikeStateEnum = this.LikeStateEnum.default,
	) {
		if (thank) {
			if (thank.isUserLiked) {
				this.victoryService
					.removeLikeVictory({
						awardId: likeType,
						type: IObjectType.THANKS,
						objectId: thank.id,
					})
					.pipe(untilDestroyed(this))
					.subscribe(() => {
						thank.isUserLiked = false;
						thank.likesCount! -= 1;
						thank.award =
							thank.award === this.LikeStateEnum.default || this.isExtendedMode
								? this.LikeStateEnum.usual
								: thank.award;
						this.cdr.detectChanges();
					});
			} else {
				this.victoryService
					.addLikeVictory({
						awardId:
							likeType === this.LikeStateEnum.default
								? this.LikeStateEnum.usual
								: likeType,
						type: IObjectType.THANKS,
						objectId: thank.id,
					})
					.pipe(untilDestroyed(this))
					.subscribe(() => {
						thank.isUserLiked = true;
						thank.likesCount! += 1;
						thank.award =
							thank.award === this.LikeStateEnum.default
								? this.LikeStateEnum.usual
								: thank.award || likeType;
						this.isChoiceLike = false;
						this.cdr.detectChanges();
					});
			}
		}
	}

	protected openPopoverInfo(thank: IThanksColleagueItem) {
		if (thank) {
			this.modalService.open(ThanksColleagueModalComponent, {
				data: { thank, isExtendedMode: this.isExtendedMode },
			});
		}
	}
}
