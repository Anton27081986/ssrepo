import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NzIconModule} from 'ng-zorro-antd/icon';
import {NzLayoutModule} from 'ng-zorro-antd/layout';
import {NzMenuModule} from 'ng-zorro-antd/menu';
import {RouterLink, RouterOutlet} from '@angular/router';
import {LeftMenuTmplComponent} from './left-menu-tmpl.component';
import {IconsProviderModule} from '../../../icons-provider.module';

@NgModule({
    declarations: [LeftMenuTmplComponent],
    imports: [
        CommonModule,
        NzIconModule,
        NzLayoutModule,
        NzMenuModule,
        RouterLink,
        RouterOutlet,
        IconsProviderModule,
    ],
})
export class LeftMenuTmplModule {}
