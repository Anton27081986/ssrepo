import { NgModule } from '@angular/core';
import { NewLayoutComponent } from '@app/shared/layouts/new-layout/new-layout.component';
import { CommonModule } from '@angular/common';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { RouterOutlet } from '@angular/router';
import { FullLayoutModule } from '@app/shared/layouts/full-layout/full-layout.module';
import { HeaderModule } from '@app/shared/components/new-header/header.module';
import { FooterModule } from '@app/shared/components/footer/footer.module';

@NgModule({
	declarations: [NewLayoutComponent],
	imports: [
		CommonModule,
		NzLayoutModule,
		RouterOutlet,
		FullLayoutModule,
		HeaderModule,
		FooterModule,
	],
})
export class NewLayoutModule {}
