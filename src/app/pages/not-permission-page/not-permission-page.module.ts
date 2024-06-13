import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeadlineModule } from '@app/shared/components/typography/headline/headline.module';
import { TextModule } from '@app/shared/components/typography/text/text.module';
import { ButtonModule } from '@app/shared/components/buttons/button/button-module';
import { NotPermissionPageRoutingModule } from '@app/pages/not-permission-page/not-permission-page-routing.module';
import { NotPermissionPageComponent } from './not-permission-page.component';

@NgModule({
	declarations: [NotPermissionPageComponent],
	imports: [
		CommonModule,
		HeadlineModule,
		TextModule,
		ButtonModule,
		NotPermissionPageRoutingModule,
	],
})
export class NotPermissionPageModule {}
