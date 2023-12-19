import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
    selector: 'app-birthday',
    templateUrl: './birthday.component.html',
    styleUrls: ['./birthday.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BirthdayComponent {}
