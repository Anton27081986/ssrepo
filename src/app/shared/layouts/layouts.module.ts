import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { RouterLink } from '@angular/router';
import { MainModule } from './main/main.module';
import { LeftMenuTmplModule } from './left-menu-tmpl/left-menu-tmpl.module';

@NgModule({
	declarations: [],
	imports: [CommonModule, MainModule, LeftMenuTmplModule, NzLayoutModule, RouterLink],
	exports: [],
})
export class LayoutsModule {}
