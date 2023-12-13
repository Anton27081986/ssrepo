import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
    selector: 'app-thankyou',
    templateUrl: './thankyou.component.html',
    styleUrls: ['./thankyou.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThankyouComponent {}
