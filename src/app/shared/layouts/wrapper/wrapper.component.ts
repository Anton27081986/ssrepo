import {ChangeDetectionStrategy, Component} from '@angular/core';
import {AppRoutes} from '@app/common/routes';

@Component({
    selector: 'app-wrapper',
    templateUrl: './wrapper.component.html',
    styleUrls: ['./wrapper.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WrapperComponent {
    protected readonly AppRoutes = AppRoutes;
}
