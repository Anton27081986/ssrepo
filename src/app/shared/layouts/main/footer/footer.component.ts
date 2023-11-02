import {ChangeDetectionStrategy, Component} from '@angular/core';
import {AppRoutes} from '@app/common/routes';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
    protected readonly AppRoutes = AppRoutes;
}
