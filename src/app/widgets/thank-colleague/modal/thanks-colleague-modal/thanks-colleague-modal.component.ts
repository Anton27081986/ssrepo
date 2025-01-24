import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ModalRef } from '@app/core/modal/modal.ref';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { DIALOG_DATA } from '@app/core/modal/modal-tokens';
import { TooltipPosition, TooltipTheme } from '@app/shared/components/tooltip/tooltip.enums';
import { IResponse } from '@app/core/utils/response';
import { ICommentsItemDto } from '@app/core/models/awards/comments-item-dto';
import { IObjectType } from '@app/core/models/awards/object-type';
import { FormControl, Validators } from '@angular/forms';
import { VictoryService } from '@app/components/victory/victory.service';
import { VictoryEventEnum, VictoryRootService } from '@app/components/victory/victory-root.service';
import { VictoryState } from '@app/components/victory/victory.state';
import { IThanksColleagueItem } from '@app/core/models/thanks-colleagues/thanks-colleague-item';
import { UserInfoPopupComponent } from '@app/components/user-info-popup/user-info-popup.component';
import { ModalService } from '@app/core/modal/modal.service';
import {LikeComponent, LikeStateEnum} from '@app/shared/components/like/like.component';
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {TextComponent} from "@app/shared/components/typography/text/text.component";
import {IconComponent} from "@app/shared/components/icon/icon.component";
import {SsDividerComponent} from "@app/shared/components/ss-divider/ss-divider.component";
import {AvatarComponent} from "@app/shared/components/avatar/avatar.component";
import {ChoiceLikeComponent} from "@app/shared/components/choice-like/choice-like.component";
import {VictoryCommentComponent} from "@app/components/victory/victory-comment/victory-comment.component";
import {EmptyPlaceholderComponent} from "@app/shared/components/empty-placeholder/empty-placeholder.component";
import {HeadlineComponent} from "@app/shared/components/typography/headline/headline.component";
import {
	FormControlInputWithFuncEditComponent
} from "@app/shared/components/inputs/form-control-input-with-func-edit/form-control-input-with-func-edit.component";
import {ButtonComponent} from "@app/shared/components/buttons/button/button.component";

export interface ThankColleagueModal {
	thank: IThanksColleagueItem;
	isExtendedMode: boolean;
}

@UntilDestroy()
@Component({
	selector: 'app-thanks-colleague-modal',
	templateUrl: './thanks-colleague-modal.component.html',
	styleUrls: ['./thanks-colleague-modal.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		NgIf,
		TextComponent,
		IconComponent,
		SsDividerComponent,
		AvatarComponent,
		LikeComponent,
		ChoiceLikeComponent,
		AsyncPipe,
		VictoryCommentComponent,
		NgForOf,
		EmptyPlaceholderComponent,
		HeadlineComponent,
		FormControlInputWithFuncEditComponent,
		ButtonComponent
	],
	standalone: true
})
export class ThanksColleagueModalComponent {
	protected readonly TooltipPosition = TooltipPosition;
	protected readonly TooltipTheme = TooltipTheme;

	protected thank: IThanksColleagueItem;

	protected readonly isExtendedMode: boolean = false;

	protected readonly comments$: Observable<IResponse<ICommentsItemDto>>;
	protected readonly subscription: Subscription = new Subscription();
	protected readonly funcEdit$: Observable<boolean> = this.victoryState.activeFuncCommentEdit$;
	protected readonly updateComment$: BehaviorSubject<ICommentsItemDto | null> =
		new BehaviorSubject<ICommentsItemDto | null>(null);

	protected isChoiceLike: boolean = false;

	protected notes: FormControl<string | null> = new FormControl(null, [Validators.required]);

	constructor(
		private readonly modalRef: ModalRef,
		private readonly modalService: ModalService,
		@Inject(DIALOG_DATA) private readonly data: ThankColleagueModal,
		private readonly victoryService: VictoryService,
		private readonly victoryRootService: VictoryRootService,
		private readonly victoryState: VictoryState,
		private readonly cdr: ChangeDetectorRef,
	) {
		this.isExtendedMode = this.data.isExtendedMode;

		this.comments$ = this.victoryService.getComments({
			objectId: this.data.thank.id!,
			type: IObjectType.WINS,
		});
		this.thank = this.data.thank;
	}

	protected openModalInfoUser(id: number | undefined) {
		if (id) {
			this.modalService.open(UserInfoPopupComponent, { data: id });
		}
	}

	protected close() {
		this.modalRef.close();
		this.victoryState.activeFuncCommentEdit$.next(false);
	}

	protected addOrUpdateComment(id: number) {
		if (!this.victoryState.activeFuncCommentEdit$.value && this.notes.valid) {
			this.subscription.add(
				this.victoryService
					.addComments({
						objectId: id,
						type: IObjectType.WINS,
						note: this.notes.value,
					})
					.pipe(untilDestroyed(this))
					.subscribe(() => {
						this.thank.commentsCount += 1;
						this.victoryRootService.event$.next({
							type: VictoryEventEnum.victoryUpdated,
						});
						this.notes.setValue('');
					}),
			);
		} else if (
			this.victoryState.activeFuncCommentEdit$.value &&
			this.updateComment$.value &&
			this.notes.valid
		) {
			this.subscription.add(
				this.victoryService
					.updateComments(this.updateComment$.value.id!, {
						objectId: id,
						type: IObjectType.WINS,
						note: this.notes.value,
					})
					.pipe(untilDestroyed(this))
					.subscribe(() => {
						this.victoryRootService.event$.next({
							type: VictoryEventEnum.victoryUpdated,
						});
						this.notes.setValue('');
						this.victoryState.activeFuncCommentEdit$.next(false);
					}),
			);
		}
	}

	protected updateComment(event: ICommentsItemDto) {
		if (event.note) {
			this.notes.setValue(event.note);
			this.updateComment$.next(event);
		}
	}

	protected cancelEditing() {
		this.notes.setValue(null);
		this.victoryState.activeFuncCommentEdit$.next(false);
		this.updateComment$.next(null);
	}

	protected changeLike(
		thank: IThanksColleagueItem,
		likeType: LikeStateEnum = this.LikeStateEnum.default,
	) {
		if (thank.id) {
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

	protected readonly LikeStateEnum = LikeStateEnum;
}
