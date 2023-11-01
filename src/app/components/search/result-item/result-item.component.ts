import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
    selector: 'app-result-item',
    templateUrl: './result-item.component.html',
    styleUrls: ['./result-item.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResultItemComponent {}
