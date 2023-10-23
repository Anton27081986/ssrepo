import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MainModule} from './main/main.module';
import {TopMenuModule} from './top-menu/top-menu.module';
import {LeftMenuTmplModule} from './left-menu-tmpl/left-menu-tmpl.module';
import {NzLayoutModule} from 'ng-zorro-antd/layout';
import {RouterLink} from '@angular/router';

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        MainModule,
        TopMenuModule,
        LeftMenuTmplModule,
        NzLayoutModule,
        RouterLink,
    ],
    exports: [],
})
export class LayoutsModule {}
