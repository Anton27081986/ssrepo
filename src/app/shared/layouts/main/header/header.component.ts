import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {AppRoutes} from '@app/common/routes';
import {NzIconService} from 'ng-zorro-antd/icon';
import {ApiService} from '@app/shared/services/api/api.service';
import {AppIcons} from '@app/common/icons';
import {UserService} from '@auth/services/user.service';
import {Observable} from 'rxjs';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    changeDetection: ChangeDetectionStrategy.Default,
})
export class HeaderComponent implements OnInit {
    // @ts-ignore
    public statusInputSearch = false;
    public statusInputSearchMobile = true;
    public statusBurger = false;
    public listMenu!: any; // IMainMenu[]

    public profileData!: any;
    public profile!: Observable<any>;
    // public favoritemenu!: Observable<any>;
    public favoritemenu!: any; // IMainMenu[]

    typeIcon!: 'ss:search';

    constructor(
        private readonly apiService: ApiService,
        private readonly iconService: NzIconService,
        private readonly userService: UserService,
    ) {
        this.iconService.addIconLiteral('ss:search', AppIcons.iconSearch);
        this.iconService.addIconLiteral('ss:remind', AppIcons.iconRemind);
        this.iconService.addIconLiteral('ss:burger', AppIcons.iconBurger);
        this.iconService.addIconLiteral('ss:moon', AppIcons.iconMoon);
        this.iconService.addIconLiteral('ss:sun', AppIcons.iconSun);
        this.iconService.addIconLiteral('ss:logo', AppIcons.iconLogoHeader);
        this.iconService.addIconLiteral('ss:logofooter', AppIcons.iconLogoFooter);
        this.iconService.addIconLiteral('ss:close', AppIcons.iconClose);
        this.iconService.addIconLiteral('ss:closeLight', AppIcons.iconCloseLight);

        this.iconService.addIconLiteral('ss:phone', AppIcons.phone);
        this.iconService.addIconLiteral('ss:mail', AppIcons.mail);
    }

    ngOnInit(): any {
        this.apiService.getFavoriteMenu().subscribe(item => {
            this.favoritemenu = item.menu;

            console.log('favoritemenu', this.favoritemenu);
        });

        this.apiService.getMenuListJson().subscribe(item => {
            this.listMenu = item.menu;
            this.listMenu.unshift({link: '', name: 'Избранное', items: this.favoritemenu});

            console.log('this.listMenu', this.listMenu);
        });

        // this.favoritemenu = this.apiService.getFavoriteMenu().pipe(map(({menu}) => menu));

        this.profile = this.userService.getProfile();
        // this.profile = this.userService.getProfile().pipe(map(console.log));
    }

    protected readonly AppRoutes = AppRoutes;

    notificationList = [
        {
            title: 'You received a new message',
            time: '8 min',
            icon: 'mail',
            color: 'ant-avatar',
        },
    ];

    openSearch(event: Event) {
        event.stopPropagation();
        this.statusInputSearch = !this.statusInputSearch;
    }

    openSearchMobile(event: Event) {
        event.stopPropagation();
        this.statusInputSearchMobile = !this.statusInputSearchMobile;
    }

    menuToggle(event: Event) {
        event.stopPropagation();
        this.statusBurger = !this.statusBurger;
    }
}
