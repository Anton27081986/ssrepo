import { UntilDestroy } from '@ngneat/until-destroy';
import {
	Component,
	EventEmitter, forwardRef,
	Input,
	OnChanges,
	OnInit,
	Output,
	SimpleChanges,
} from '@angular/core';
import { IWinsItemDto } from '@app/core/models/awards/wins-item-dto';
import { ModalService } from '@app/core/modal/modal.service';
import { TooltipPosition, TooltipTheme } from '@app/shared/components/tooltip/tooltip.enums';
import { IUserDto } from '@app/core/models/awards/user-dto';
import { BehaviorSubject, Subscription } from 'rxjs';
import { LikeComponent, LikeStateEnum } from '@app/shared/components/like/like.component';
import { IUserProfile } from '@app/core/models/auth/user-profile';
import { IObjectType } from '@app/core/models/awards/object-type';
import { Awards } from '@app/core/api/awards';
import { CardComponent} from "@app/shared/components/card/card.component";
import { AsyncPipe, CommonModule, DatePipe, NgIf} from "@angular/common";
import { TooltipDirective } from "@app/shared/components/tooltip/tooltip.directive";
import { IconComponent } from "@app/shared/components/icon/icon.component";
import { TextComponent } from "@app/shared/components/typography/text/text.component";
import { ChoiceLikeComponent } from "@app/shared/components/choice-like/choice-like.component";
import { CaptionComponent } from "@app/shared/components/typography/caption/caption.component";
import { VictoryModalComponent } from "@app/widgets/victory/modal/victory-modal/victory-modal.component";
import { VictoryService } from "@app/widgets/victory/victory.service";
import {UserCardComponent} from "@app/shared/components/user-card/user-card.component";

@UntilDestroy()
@Component({
	selector: 'app-user-card-widget',
	templateUrl: './user-card-widget.component.html',
	styleUrls: ['./user-card-widget.component.scss'],
	imports: [
		CommonModule,
		CardComponent,
		AsyncPipe,
		NgIf,
		TooltipDirective,
		IconComponent,
		TextComponent,
		LikeComponent,
		ChoiceLikeComponent,
		CaptionComponent,
		DatePipe,
	    forwardRef(()=>UserCardComponent)
	],
	standalone: true
})
export class UserCardWidgetComponent implements OnInit, OnChanges {
	@Input() widget: IWinsItemDto | null = null;
	@Input() isExtendedMode: boolean = false;
	@Output()
	getPopoverInfo: EventEmitter<IWinsItemDto> = new EventEmitter<IWinsItemDto>();

	protected readonly widget$: BehaviorSubject<IWinsItemDto | null> =
		new BehaviorSubject<IWinsItemDto | null>(null);

	protected readonly authUserId: number | null = null;
	protected isChoiceLike: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

	private readonly subscription: Subscription = new Subscription();

	protected readonly typeLike$: BehaviorSubject<LikeStateEnum> =
		new BehaviorSubject<LikeStateEnum>(LikeStateEnum.default);

	constructor(
		private readonly modalService: ModalService,
		private readonly victoryService: VictoryService,
	) {
		const profile = JSON.parse(localStorage.getItem('userProfile')!) as IUserProfile;

		this.authUserId = profile.id!;
	}

	ngOnInit() {
		if (this.widget) {
			this.getStateLike(this.widget);
		}
	}

	ngOnChanges(changes: SimpleChanges) {
		if (changes.widget) {
			this.widget$.next(this.widget);
		}
	}

	private getStateLike(widget: IWinsItemDto) {
		if (widget.award) {
			this.typeLike$.next(widget.award);
		} else if (widget.isUserLiked) {
			this.typeLike$.next(LikeStateEnum.usual);
		} else {
			this.typeLike$.next(LikeStateEnum.default);
		}
	}

	protected getGroupWinsUser(users: IUserDto[] | null): string {
		if (users) {
			const usersName: string[] = users.map(user => user.name);

			return usersName.join(', ');
		}

		return '';
	}

	protected openPopoverInfo() {
		if (this.widget) {
			this.modalService.open(VictoryModalComponent, {
				data: { victory: this.widget, isExtendedMode: this.isExtendedMode },
			});
		}
	}

	protected goToUrlVictory(url: string) {
		if (url) {
			const link = document.createElement('a');

			link.href = url;
			link.click();
		}
	}

	private removeLike(award: number | null) {
		this.subscription.add(
			this.victoryService
				.removeLikeVictory({
					awardId: award,
					type: IObjectType.WINS,
					objectId: this.widget?.id!,
				})
				.subscribe(() => {
					if (this.widget) {
						this.widget.isUserLiked = false;
						this.subscription.add(
							this.victoryService.getWin(this.widget?.id!).subscribe(widget => {
								this.widget$.next(widget);
								this.getStateLike(widget);
							}),
						);
					}
				}),
		);
	}

	private addLike(award: number | null) {
		this.subscription.add(
			this.victoryService
				.addLikeVictory({
					awardId: award,
					type: IObjectType.WINS,
					objectId: this.widget?.id!,
				})
				.subscribe(() => {
					if (this.widget) {
						this.subscription.add(
							this.victoryService.getWin(this.widget?.id!).subscribe(widget => {
								this.widget$.next(widget);
								this.getStateLike(widget);
							}),
						);
					}
				}),
		);
	}

	protected changeLike(award: number | null = null) {
		if (this.widget$.value?.user?.id !== this.authUserId) {
			if (!this.widget$.value?.isUserLiked) {
				this.addLike(award);
			} else {
				this.removeLike(null);
			}

			this.isChoiceLike.next(false);
		}
	}

	protected openChoiceLike() {
		if (this.isExtendedMode && !this.widget$.value?.isUserLiked) {
			this.isChoiceLike.next(!this.isChoiceLike.value);
		} else if (this.isExtendedMode && this.widget$.value?.isUserLiked) {
			this.removeLike(null);
		}
	}

	protected getLike(event: LikeStateEnum) {
		switch (event) {
			case LikeStateEnum.copper:
				this.changeLike(Awards.Copper);

				return;
			case LikeStateEnum.gold:
				this.changeLike(Awards.Gold);

				return;
			case LikeStateEnum.silver:
				this.changeLike(Awards.Silver);
		}
	}

	protected readonly TooltipPosition = TooltipPosition;
	protected readonly TooltipTheme = TooltipTheme;
}
