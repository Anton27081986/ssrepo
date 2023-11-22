import {ChangeDetectionStrategy, Component} from '@angular/core';
import {ThemeService} from '@app/shared/theme/theme.service';
import {NzIconService} from 'ng-zorro-antd/icon';
import {AppIcons} from "@app/common/icons";

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent {
    public switchValue = false;

    private readonly iconMoon =
        '<svg width="19" height="20" viewBox="0 0 19 20" fill="none" xmlns="http://www.w3.org/2000/svg">\n' +
        '<path d="M1.02384 10.38C1.3398 15.0138 5.1752 18.7838 9.76539 18.9907C13.004 19.1347 15.9003 17.5871 17.638 15.1487C18.3577 14.15 17.9716 13.4842 16.7692 13.7091C16.1811 13.8171 15.5755 13.8621 14.9436 13.8351C10.6518 13.6551 7.14117 9.97506 7.12361 5.62917C7.11484 4.45947 7.35181 3.35276 7.78186 2.34501C8.2558 1.2293 7.68532 0.698437 6.58824 1.17531C3.11268 2.67793 0.734208 6.26801 1.02384 10.38Z" stroke="#22223A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>\n' +
        '</svg>';

    constructor(
        private readonly themeService: ThemeService,
        private readonly iconService: NzIconService,
    ) {
        this.iconService.addIconLiteral('ss:moon', this.iconMoon);
        this.iconService.addIconLiteral('ss:settings', AppIcons.settings);
        this.iconService.addIconLiteral('ss:iconRemind', AppIcons.iconRemind);
        this.iconService.addIconLiteral('ss:password', AppIcons.password);
        this.iconService.addIconLiteral('ss:profile', AppIcons.profile);
        this.iconService.addIconLiteral('ss:star', AppIcons.star);
        this.iconService.addIconLiteral('ss:sort', AppIcons.sort);
        this.iconService.addIconLiteral('ss:theme', AppIcons.theme);
    }

    toggleTheme(): void {
        this.themeService.toggleTheme().then();
    }
}
