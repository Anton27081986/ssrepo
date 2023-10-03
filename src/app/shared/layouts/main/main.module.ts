import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterLink, RouterOutlet} from '@angular/router';
import {NzIconModule} from 'ng-zorro-antd/icon';
import {NzLayoutModule} from 'ng-zorro-antd/layout';
import {NzMenuModule} from 'ng-zorro-antd/menu';
import {NzBreadCrumbModule} from 'ng-zorro-antd/breadcrumb';
import {NzDrawerModule} from 'ng-zorro-antd/drawer';
import {NzGridModule} from 'ng-zorro-antd/grid';
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
        IconsProviderModule,
        NzBreadCrumbModule,
        NzDrawerModule,
        NzGridModule,
    ],
})
export class MainModule {}
