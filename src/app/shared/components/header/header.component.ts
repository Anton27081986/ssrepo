import { ChangeDetectionStrategy, Component, OnInit, Signal } from '@angular/core';
import { AppRoutes } from '@app/common/routes';
import { Observable } from 'rxjs';
import { IMenuItemDto } from '@app/core/models/company/menu-item-dto';
import { IUserProfile } from '@app/core/models/user-profile';
import { MainMenuFacadeService } from '@app/core/facades/main-menu-facade.service';
import {Router, RouterLink} from '@angular/router';
import { UserProfileStoreService } from '@app/core/states/user-profile-store.service';
import { IDictionaryItemDto } from '@app/core/models/company/dictionary-item-dto';
import { TooltipPosition, TooltipTheme } from '@app/shared/components/tooltip/tooltip.enums';
import { ButtonType, IconPosition, IconType, Size } from '@front-components/components';
import { toSignal } from '@angular/core/rxjs-interop';
import { ChatBotFacadeService } from '@app/core/facades/chat-bot-facade.service';
import {IconComponent} from "@app/shared/components/icon/icon.component";
import {MainMenuComponent} from "@app/shared/components/main-menu/main-menu.component";
import {SearchInputComponent} from "@app/shared/components/inputs/search-input/search-input.component";
import {NotificationComponent} from "@app/shared/components/notification/notification.component";
import {ButtonComponent} from "@app/shared/components/buttons/button/button.component";
import {ChatBotComponent} from "@app/widgets/chat-bot/chat-bot.component";
import {DropdownButtonComponent} from "@app/shared/components/buttons/dropdown-button/dropdown-button.component";
import {ProfilePopupComponent} from "@app/shared/components/profile-popup/profile-popup.component";
import {AsyncPipe} from "@angular/common";

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [
		IconComponent,
		RouterLink,
		MainMenuComponent,
		SearchInputComponent,
		NotificationComponent,
		ButtonComponent,
		ChatBotComponent,
		DropdownButtonComponent,
		ProfilePopupComponent,
		AsyncPipe
	]
})
export class HeaderComponent implements OnInit {
	public listMenu$?: Observable<IMenuItemDto[] | null>;
	public userProfile$?: Observable<IUserProfile | null>;
	public profilePopup$?: Observable<boolean | null>;

	public aiPermission: Signal<boolean> = toSignal(this.mainMenuFacade.aiPermission$, {
		initialValue: false,
	});

	public isBotOpened: Signal<boolean> = toSignal(this.chatBotFacade.isOpened$, {
		initialValue: false,
	});

	protected readonly AppRoutes = AppRoutes;
	public route: string | undefined;
	public constructor(
		private readonly mainMenuFacade: MainMenuFacadeService,
		private readonly userStateService: UserProfileStoreService,
		public readonly _router: Router,
		public readonly chatBotFacade: ChatBotFacadeService,
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
		this.chatBotFacade.toggleBot();
	}

	protected readonly TooltipPosition = TooltipPosition;
	protected readonly TooltipTheme = TooltipTheme;
	protected readonly ButtonType = ButtonType;
	protected readonly Size = Size;
	protected readonly IconType = IconType;
	protected readonly IconPosition = IconPosition;
}
