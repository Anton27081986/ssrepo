import {ChangeDetectionStrategy, Component, OnInit, Signal} from '@angular/core';
import { AppRoutes } from '@app/common/routes';
import { Observable } from 'rxjs';
import { IMenuItemDto } from '@app/core/models/company/menu-item-dto';
import { IUserProfile } from '@app/core/models/user-profile';
import { MainMenuFacadeService } from '@app/core/facades/main-menu-facade.service';
import { Router } from '@angular/router';
import { UserProfileStoreService } from '@app/core/states/user-profile-store.service';
import { IDictionaryItemDto } from '@app/core/models/company/dictionary-item-dto';
import { TooltipPosition, TooltipTheme } from '@app/shared/components/tooltip/tooltip.enums';
import {ButtonType, IconPosition, IconType, Size} from "@front-components/components";
import {ModalService} from "@app/core/modal/modal.service";
import {ChatBotComponent} from "@app/widgets/chat-bot/chat-bot.component";
import {toSignal} from "@angular/core/rxjs-interop";

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnInit {
	public listMenu$?: Observable<IMenuItemDto[] | null>;
	public userProfile$?: Observable<IUserProfile | null>;
	public profilePopup$?: Observable<boolean | null>;
	public statusBurger = false;

	public aiPermission: Signal<boolean> = toSignal(this.mainMenuFacade.aiPermission$, {
		initialValue: false,
	});

	protected readonly AppRoutes = AppRoutes;
	public route: string | undefined;
	public constructor(
		private readonly mainMenuFacade: MainMenuFacadeService,
		private readonly userStateService: UserProfileStoreService,
		public readonly _router: Router,
		private readonly modalService: ModalService,
	) {}

	public ngOnInit(): any {
		this.listMenu$ = this.mainMenuFacade.getMainMenu();
		this.userProfile$ = this.mainMenuFacade.getUserProfile();

		this.route = String(this._router.routerState.snapshot.url);
		this.profilePopup$ = this.userStateService.windowProfile$;
	}

	protected getSearchGlobal(found: IDictionaryItemDto) {
		if (found.linkToDetail) {
			const link = document.createElement('a');

			link.href = found.linkToDetail!;
			link.click();
		}
	}

	public openChatBot(): void {
		this.modalService.open(ChatBotComponent);
	}

	protected readonly TooltipPosition = TooltipPosition;
	protected readonly TooltipTheme = TooltipTheme;
	protected readonly ButtonType = ButtonType;
	protected readonly Size = Size;
	protected readonly IconType = IconType;
	protected readonly IconPosition = IconPosition;
}
