import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
    selector: 'app-victory',
    templateUrl: './victory.component.html',
    styleUrls: ['./victory.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VictoryComponent {}
