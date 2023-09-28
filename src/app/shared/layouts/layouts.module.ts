import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MainModule} from './main/main.module';
import {TopMenuModule} from './top-menu/top-menu.module';
import {LeftMenuTmplModule} from './left-menu-tmpl/left-menu-tmpl.module';

@NgModule({
    declarations: [],
    imports: [CommonModule, MainModule, TopMenuModule, LeftMenuTmplModule],
})
export class LayoutsModule {}
