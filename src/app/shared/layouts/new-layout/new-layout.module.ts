import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { RouterOutlet } from '@angular/router';
import { FullLayoutModule } from '@app/shared/layouts/full-layout/full-layout.module';
import { HeaderModule } from '@app/shared/components/header/header.module';
import { NewLayoutComponent } from '@app/shared/layouts/new-layout/new-layout.component';

@NgModule({
	declarations: [NewLayoutComponent],
	imports: [CommonModule, NzLayoutModule, RouterOutlet, FullLayoutModule, HeaderModule],
})
export class NewLayoutModule {}
