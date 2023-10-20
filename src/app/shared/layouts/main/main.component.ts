import {ChangeDetectionStrategy, Component} from '@angular/core';
import {AppRoutes} from '@app/common/routes';
import {NzIconService} from 'ng-zorro-antd/icon';
import {ThemeService} from 'src/app/shared/theme/theme.service';

@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainComponent {
    private readonly iconSearch =
        '<svg width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9.64705 18.2941C14.4227 18.2941 18.2941 14.4227 18.2941 9.64705C18.2941 4.87141 14.4227 1 9.64705 1C4.87141 1 1 4.87141 1 9.64705C1 14.4227 4.87141 18.2941 9.64705 18.2941Z" stroke="#22223A" stroke-width="1.5" stroke-miterlimit="10"/><path d="M15.7969 15.8235L21.9733 21.9999" stroke="#22223A" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round"/></svg>';

    private readonly iconRemind =
        '<svg width="18" height="23" viewBox="0 0 18 23" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.87677 2.92944C5.63638 2.92944 3.00294 5.61257 3.00294 8.91412V11.7967C3.00294 12.4052 2.74841 13.3328 2.44493 13.8515L1.31911 15.7566C0.624043 16.9336 1.10374 18.2402 2.3764 18.6791C6.59577 20.1154 11.148 20.1154 15.3673 18.6791C16.5519 18.2801 17.0708 16.8538 16.4246 15.7566L15.2988 13.8515C15.0051 13.3328 14.7506 12.4052 14.7506 11.7967V8.91412C14.7506 5.62255 12.1074 2.92944 8.87677 2.92944Z" stroke="#22223A" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round"/><path d="M12.3072 19.5769C12.3072 20.9096 10.8534 22 9.07647 22C8.1934 22 7.37493 21.7254 6.79339 21.2892C6.21186 20.8531 5.8457 20.2392 5.8457 19.5769" stroke="#22223A" stroke-width="1.5" stroke-miterlimit="10"/><path d="M6.6543 1H11.5005" stroke="#22223A" stroke-width="1.5" stroke-linecap="round"/></svg>';

    private readonly iconBurger =
        '<svg width="20" height="16" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">\n' +
        '<rect width="20" height="2" rx="1" fill="#22223A"/>\n' +
        '<rect y="7" width="20" height="2" rx="1" fill="#22223A"/>\n' +
        '<rect y="14" width="20" height="2" rx="1" fill="#22223A"/>\n' +
        '</svg>';

    private readonly iconMoon =
        '<svg width="19" height="20" viewBox="0 0 19 20" fill="none" xmlns="http://www.w3.org/2000/svg">\n' +
        '<path d="M1.02384 10.38C1.3398 15.0138 5.1752 18.7838 9.76539 18.9907C13.004 19.1347 15.9003 17.5871 17.638 15.1487C18.3577 14.15 17.9716 13.4842 16.7692 13.7091C16.1811 13.8171 15.5755 13.8621 14.9436 13.8351C10.6518 13.6551 7.14117 9.97506 7.12361 5.62917C7.11484 4.45947 7.35181 3.35276 7.78186 2.34501C8.2558 1.2293 7.68532 0.698437 6.58824 1.17531C3.11268 2.67793 0.734208 6.26801 1.02384 10.38Z" stroke="#22223A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>\n' +
        '</svg>';

    private readonly iconSun =
        '<svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">\n' +
        '<path d="M11 17.5C14.5899 17.5 17.5 14.5899 17.5 11C17.5 7.41015 14.5899 4.5 11 4.5C7.41015 4.5 4.5 7.41015 4.5 11C4.5 14.5899 7.41015 17.5 11 17.5Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>\n' +
        '<path d="M18.14 18.14L18.01 18.01M18.01 3.99L18.14 3.86L18.01 3.99ZM3.86 18.14L3.99 18.01L3.86 18.14ZM11 1.08V1V1.08ZM11 21V20.92V21ZM1.08 11H1H1.08ZM21 11H20.92H21ZM3.99 3.99L3.86 3.86L3.99 3.99Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>\n' +
        '</svg>';

    constructor(
        private readonly iconService: NzIconService,
        private readonly themeService: ThemeService,
    ) {
        this.iconService.addIconLiteral('ss:search', this.iconSearch);
        this.iconService.addIconLiteral('ss:remind', this.iconRemind);
        this.iconService.addIconLiteral('ss:burger', this.iconBurger);
        this.iconService.addIconLiteral('ss:moon', this.iconMoon);
        this.iconService.addIconLiteral('ss:sun', this.iconSun);
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

    toggleTheme(): void {
        this.themeService.toggleTheme().then();
    }
}
