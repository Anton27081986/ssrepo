import { NgModule } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { RawMaterialAccountingComponent } from '@app/pages/raw-material-accounting/raw-material-accounting.component';
import { RawMaterialAccountingRoutingModule } from '@app/pages/raw-material-accounting/raw-material-accounting-routing.module';
import { CardModule } from '@app/shared/components/card/card.module';
import { HeadlineModule } from '@app/shared/components/typography/headline/headline.module';
import { ButtonModule } from '@app/shared/components/buttons/button/button-module';
import { IconModule } from '@app/shared/components/icon/icon.module';
import { TableModule } from '@app/shared/components/table/table.module';
import { FiltersModule } from '@app/shared/components/filters/filters.module';
import { ComponentsModule } from '@app/components/components.module';
import { ContractInfoModule } from '@app/pages/raw-material-accounting/modals/contract-info/contract-info.module';
import { ContractNewModule } from '@app/pages/raw-material-accounting/modals/contract-new/contract-new.module';
import { EmptyDataPageModule } from '@app/shared/components/empty-data-page/empty-data-page.module';
import {LoaderModule} from "@app/shared/components/loader/loader.module";
import {CaptionModule} from "@app/shared/components/typography/caption/caption.module";
import {TooltipMenuModule} from "@app/shared/components/tooltip-menu/tooltip-menu.module";

@NgModule({
	declarations: [RawMaterialAccountingComponent],
	exports: [RawMaterialAccountingComponent],
    imports: [
        RawMaterialAccountingRoutingModule,
        CommonModule,
        RouterLink,
        CardModule,
        HeadlineModule,
        ButtonModule,
        IconModule,
        TableModule,
        FiltersModule,
        ComponentsModule,
        ContractInfoModule,
        ContractNewModule,
        EmptyDataPageModule,
        NgIf,
        LoaderModule,
        CaptionModule,
        TooltipMenuModule,
    ],
})
export class RawMaterialAccountingModule {}
