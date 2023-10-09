import {ChangeDetectionStrategy, Component} from '@angular/core';
import {AppRoutes} from '../../constants/routes';

@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainComponent {
    protected readonly AppRoutes = AppRoutes;
    quickViewVisible = false;

    notificationList = [
        {
            title: 'You received a new message',
            time: '8 min',
            icon: 'mail',
            color: 'ant-avatar',
        },
    ];

    quickViewToggle(): void {
        // this.quickViewVisible = !this.quickViewVisible;
    }
}
