import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeadlineModule } from '@app/shared/components/typography/headline/headline.module';
import { TextModule } from '@app/shared/components/typography/text/text.module';
import { ButtonModule } from '@app/shared/components/buttons/button/button-module';
import { NotPermissionPageRoutingModule } from '@app/pages/not-permission-page/not-permission-page-routing.module';
import { CaptionModule } from '@app/shared/components/typography/caption/caption.module';
import { CardModule } from '@app/shared/components/card/card.module';
import { ComponentsModule } from '@app/components/components.module';
import { EmptyPlaceholderModule } from '@app/shared/components/empty-placeholder/empty-placeholder.module';
import { FiltersModule } from '@app/shared/components/filters/filters.module';
import { IconModule } from '@app/shared/components/icon/icon.module';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { TableModule } from '@app/shared/components/table/table.module';
import { AvatarModule } from '@app/shared/components/avatar/avatar.module';
import { NotPermissionPageComponent } from './not-permission-page.component';

@NgModule({
	declarations: [NotPermissionPageComponent],
	imports: [
		CommonModule,
		HeadlineModule,
		TextModule,
		ButtonModule,
		NotPermissionPageRoutingModule,
		CaptionModule,
		CardModule,
		ComponentsModule,
		EmptyPlaceholderModule,
		FiltersModule,
		IconModule,
		NzPaginationModule,
		TableModule,
		AvatarModule,
	],
})
export class NotPermissionPageModule {}
