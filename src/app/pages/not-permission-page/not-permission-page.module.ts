import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotPermissionPageRoutingModule } from '@app/pages/not-permission-page/not-permission-page-routing.module';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NotPermissionPageComponent } from './not-permission-page.component';

@NgModule({
	declarations: [],
	imports: [
		NotPermissionPageComponent,
		CommonModule,
		NotPermissionPageRoutingModule,
		NzPaginationModule,
	],
})
export class NotPermissionPageModule {}
