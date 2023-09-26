import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
    selector: 'app-top-menu',
    templateUrl: './top-menu.component.html',
    styleUrls: ['./top-menu.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopMenuComponent {}
