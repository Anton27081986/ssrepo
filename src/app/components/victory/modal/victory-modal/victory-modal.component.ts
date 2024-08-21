import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { ModalRef } from '@app/core/modal/modal.ref';
import { BehaviorSubject, Observable, Subscription, tap } from 'rxjs';
import { DIALOG_DATA } from '@app/core/modal/modal-tokens';
import { IWinsItemDto } from '@app/core/models/awards/wins-item-dto';
import { TooltipPosition, TooltipTheme } from '@app/shared/components/tooltip/tooltip.enums';
import { IResponse } from '@app/core/utils/response';
import { ICommentsItemDto } from '@app/core/models/awards/comments-item-dto';
import { IObjectType } from '@app/core/models/awards/object-type';
import { FormControl, Validators } from '@angular/forms';
import { VictoryService } from '@app/components/victory/victory.service';
import { VictoryEventEnum, VictoryRootService } from '@app/components/victory/victory-root.service';
import { VictoryState } from '@app/components/victory/victory.state';
import { Awards } from '@app/core/api/awards';
import { LikeStateEnum } from '@app/components/like/like.component';

export interface VictoryModal {
	victory: IWinsItemDto;
	isExtendedMode: boolean;
}

@UntilDestroy()
@Component({
	selector: 'app-add-victory-modal',
	templateUrl: './victory-modal.component.html',
	styleUrls: ['./victory-modal.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VictoryModalComponent {
	protected victory$: Observable<IWinsItemDto>;

	protected readonly isExtendedMode$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
		false,
	);

	protected readonly comments$: Observable<IResponse<ICommentsItemDto>>;
	protected readonly subscription: Subscription = new Subscription();
	protected readonly funcEdit$: Observable<boolean> = this.victoryState.activeFuncCommentEdit$;
	protected readonly updateComment$: BehaviorSubject<ICommentsItemDto | null> =
		new BehaviorSubject<ICommentsItemDto | null>(null);

	protected readonly typeLike$: BehaviorSubject<LikeStateEnum> =
		new BehaviorSubject<LikeStateEnum>(LikeStateEnum.default);

	protected readonly authUserId: number | null = null;
	protected isChoiceLike: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

	protected notes: FormControl<string | null> = new FormControl(null, Validators.required);

	constructor(
		private readonly modalRef: ModalRef,
		@Inject(DIALOG_DATA) private readonly data: VictoryModal,
		private readonly victoryService: VictoryService,
		private readonly victoryRootService: VictoryRootService,
		private readonly victoryState: VictoryState,
	) {
		this.isExtendedMode$.next(this.data.isExtendedMode);

		this.comments$ = this.victoryService.getComments({
			objectId: this.data.victory.id,
			type: IObjectType.WINS,
		});
		this.victory$ = this.victoryService.getWinModal(this.data.victory.id).pipe(
			tap(victory => {
				this.getStateLike(victory);
			}),
		);
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
					.subscribe(() => {
						this.victoryRootService.event$.next({
							type: VictoryEventEnum.victoryUpdated,
						});
						this.notes.setValue(null);
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
					.subscribe(() => {
						this.victoryRootService.event$.next({
							type: VictoryEventEnum.victoryUpdated,
						});
						this.notes.setValue(null);
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

	protected changeLike(isUserLiked: boolean, award: number | null = null) {
		if (this.data.victory.id !== this.authUserId) {
			if (!isUserLiked) {
				this.addLike(this.data.victory.id, award);
			} else {
				this.removeLike(this.data.victory.id, null);
			}
			this.isChoiceLike.next(false);
		}
	}

	protected cancelEditing() {
		this.notes.setValue(null);
		this.victoryState.activeFuncCommentEdit$.next(false);
		this.updateComment$.next(null);
	}

	private removeLike(id: number, award: number | null) {
		this.victoryService
			.removeLikeVictory({
				awardId: award,
				type: IObjectType.WINS,
				objectId: id,
			})
			.subscribe(() => {
				this.victoryRootService.event$.next({ type: VictoryEventEnum.victoryUpdated });
			});
	}

	private addLike(id: number, award: number | null) {
		this.victoryService
			.addLikeVictory({
				awardId: award,
				type: IObjectType.WINS,
				objectId: id,
			})
			.subscribe(() => {
				this.victoryRootService.event$.next({ type: VictoryEventEnum.victoryUpdated });
			});
	}

	protected openChoiceLike(victory: IWinsItemDto) {
		if (this.isExtendedMode$.value && !victory.isUserLiked) {
			this.isChoiceLike.next(!this.isChoiceLike.value);
		} else if (this.isExtendedMode$.value && victory.isUserLiked) {
			this.removeLike(victory.id, null);
		}
	}

	protected getLike(isUserLiked: boolean, event: LikeStateEnum) {
		switch (event) {
			case LikeStateEnum.copper:
				this.changeLike(isUserLiked, Awards.Copper);

				return;
			case LikeStateEnum.gold:
				this.changeLike(isUserLiked, Awards.Gold);

				return;
			case LikeStateEnum.silver:
				this.changeLike(isUserLiked, Awards.Silver);
		}
	}

	private getStateLike(widget: IWinsItemDto) {
		if (widget.award === Awards.Gold) {
			this.typeLike$.next(LikeStateEnum.gold);
		} else if (widget.award === Awards.Silver) {
			this.typeLike$.next(LikeStateEnum.silver);
		} else if (widget.award === Awards.Copper) {
			this.typeLike$.next(LikeStateEnum.copper);
		} else if (widget.award === 0 && widget.isUserLiked) {
			this.typeLike$.next(LikeStateEnum.usual);
		} else if (widget.award === 0 && !widget.isUserLiked) {
			this.typeLike$.next(LikeStateEnum.default);
		}
	}

	protected readonly TooltipPosition = TooltipPosition;
	protected readonly TooltipTheme = TooltipTheme;
}
