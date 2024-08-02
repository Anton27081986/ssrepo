import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { RouterOutlet } from '@angular/router';
import { FullLayoutModule } from '@app/shared/layouts/full-layout/full-layout.module';
import { HeaderModule } from '@app/shared/components/new-header/header.module';
import { WithoutFooterLayoutComponent } from './without-footer-layout.component';

@NgModule({
	declarations: [WithoutFooterLayoutComponent],
	imports: [CommonModule, NzLayoutModule, RouterOutlet, FullLayoutModule, HeaderModule],
})
export class WithoutFooterLayoutModule {}
