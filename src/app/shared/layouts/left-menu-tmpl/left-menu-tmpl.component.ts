import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
    selector: 'app-left-menu-tmpl',
    templateUrl: './left-menu-tmpl.component.html',
    styleUrls: ['./left-menu-tmpl.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LeftMenuTmplComponent {
    isCollapsed = false;
}
