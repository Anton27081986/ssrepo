import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { RouterOutlet } from '@angular/router';
import { FullLayoutModule } from '@app/shared/layouts/full-layout/full-layout.module';
import { LayoutClientProposalsComponent } from '@app/shared/layouts/layout-client-proposals/layout-client-proposals.component';
import { HeaderModule } from '@app/shared/components/new-header/header.module';

@NgModule({
	declarations: [LayoutClientProposalsComponent],
	imports: [CommonModule, NzLayoutModule, RouterOutlet, FullLayoutModule, HeaderModule],
})
export class LayoutClientProposalsModule {}
