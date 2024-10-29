import { NgModule } from '@angular/core';
import { CompletedWorkActsComponent } from '@app/pages/completed-work-acts/completed-work-acts.component';
import { HeadlineModule } from '@app/shared/components/typography/headline/headline.module';
import { CompletedWorkActsRoutingModule } from '@app/pages/completed-work-acts/completed-work-acts-routing.module';
import { DropdownButtonModule } from '@app/shared/components/buttons/dropdown-button/dropdown-button.module';
import { EmptyDataPageModule } from '@app/shared/components/empty-data-page/empty-data-page.module';
import { NgIf } from '@angular/common';
import { TableModule } from '@app/shared/components/table/table.module';
import { FiltersModule } from '@app/shared/components/filters/filters.module';
import { LoaderModule } from '@app/shared/components/loader/loader.module';
import { CompletedWorkActCardComponent } from '@app/pages/completed-work-acts/completed-work-act-card/completed-work-act-card.component';

@NgModule({
	declarations: [CompletedWorkActsComponent, CompletedWorkActCardComponent],
	exports: [CompletedWorkActsComponent, CompletedWorkActCardComponent],
	imports: [
		CompletedWorkActsRoutingModule,
		HeadlineModule,
		DropdownButtonModule,
		EmptyDataPageModule,
		NgIf,
		TableModule,
		FiltersModule,
		LoaderModule,
	],
})
export class CompletedWorkActsModule {}
