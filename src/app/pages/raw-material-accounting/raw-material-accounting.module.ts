import { NgModule } from '@angular/core';
import { RawMaterialAccountingComponent } from '@app/pages/raw-material-accounting/raw-material-accounting.component';
import { RawMaterialAccountingRoutingModule } from '@app/pages/raw-material-accounting/raw-material-accounting-routing.module';
import {HeadlineComponent} from "@app/shared/components/typography/headline/headline.component";
import {TooltipMenuComponent} from "@app/shared/components/tooltip-menu/tooltip-menu.component";
import {CaptionComponent} from "@app/shared/components/typography/caption/caption.component";
import {ButtonComponent} from "@app/shared/components/buttons/button/button.component";
import {IconComponent} from "@app/shared/components/icon/icon.component";
import {CardComponent} from "@app/shared/components/card/card.component";
import {TableComponent} from "@app/shared/components/table/table.component";
import {PaginationComponent} from "@app/shared/components/pagination/pagination.component";
import {EmptyDataPageComponent} from "@app/shared/components/empty-data-page/empty-data-page.component";
import {FiltersComponent} from "@app/shared/components/filters/filters.component";
import {LoaderComponent} from "@app/shared/components/loader/loader.component";
import {AsyncPipe} from "@angular/common";

@NgModule({
	exports: [RawMaterialAccountingComponent],
	imports: [
		RawMaterialAccountingComponent,
		RawMaterialAccountingRoutingModule,
		HeadlineComponent,
		TooltipMenuComponent,
		CaptionComponent,
		ButtonComponent,
		IconComponent,
		CardComponent,
		TableComponent,
		PaginationComponent,
		EmptyDataPageComponent,
		FiltersComponent,
		LoaderComponent,
		AsyncPipe,
	],
})
export class RawMaterialAccountingModule {}
