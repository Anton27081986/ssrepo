import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterLink, RouterOutlet} from '@angular/router';
import {NzIconModule} from 'ng-zorro-antd/icon';
import {NzLayoutModule} from 'ng-zorro-antd/layout';
import {NzMenuModule} from 'ng-zorro-antd/menu';
import {NzBreadCrumbModule} from 'ng-zorro-antd/breadcrumb';
import {NzDrawerModule} from 'ng-zorro-antd/drawer';
import {NzGridModule} from 'ng-zorro-antd/grid';
import {NzDropDownModule} from 'ng-zorro-antd/dropdown';
import {NzBadgeModule} from 'ng-zorro-antd/badge';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {NzListModule} from 'ng-zorro-antd/list';
import {NzAvatarModule} from 'ng-zorro-antd/avatar';
import {NgScrollbarModule} from 'ngx-scrollbar';
import {MainComponent} from './main.component';
import {IconsProviderModule} from '../../../icons-provider.module';

@NgModule({
    declarations: [MainComponent],
    imports: [
        CommonModule,
        NzIconModule,
        NzLayoutModule,
        NzMenuModule,
        RouterLink,
        RouterOutlet,
        NzBreadCrumbModule,
        NzDrawerModule,
        NzGridModule,
        NzDropDownModule,
        NzBadgeModule,
        NzButtonModule,
        NzListModule,
        NzAvatarModule,
        NgScrollbarModule,
        IconsProviderModule,
    ],
})
export class MainModule {}
