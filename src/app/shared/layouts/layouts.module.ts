import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { RouterLink } from '@angular/router';
import { WithoutFooterLayoutModule } from '@app/shared/layouts/without-footer-layout/without-footer-layout.module';
import { FullLayoutModule } from '@app/shared/layouts/full-layout/full-layout.module';
import { LeftMenuLayoutModule } from '@app/shared/layouts/left-menu-layout/left-menu-layout.module';
import { FullWidthWithoutFooterLayoutModule } from '@app/shared/layouts/full-width-without-footer-layout/full-width-without-footer-layout.module';
import { NewLayoutModule } from '@app/shared/layouts/new-layout/new-layout.module';

@NgModule({
	declarations: [],
	imports: [
		CommonModule,
		FullLayoutModule,
		LeftMenuLayoutModule,
		NzLayoutModule,
		RouterLink,
		WithoutFooterLayoutModule,
		FullWidthWithoutFooterLayoutModule,
		NewLayoutModule,
	],
	exports: [],
})
export class LayoutsModule {}
