import {ChangeDetectionStrategy, Component, Input} from '@angular/core';

@Component({
    selector: 'app-main-menu',
    templateUrl: './main-menu.component.html',
    styleUrls: ['./main-menu.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainMenuComponent {
    @Input() menu: any;

    identify(index: any, item: any): any {
        return item.id;
    }
}
