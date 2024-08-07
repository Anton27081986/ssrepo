import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeadlineModule } from '@app/shared/components/typography/headline/headline.module';
import { SearchInputModule } from '@app/shared/components/inputs/search-input/search-input.module';
import { AccordionModule } from '@app/shared/components/accordion/accordion.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableModule } from '@app/shared/components/table/table.module';
import { TabsModule } from '@app/shared/components/tabs/tabs.module';
import { CardModule } from '@app/shared/components/card/card.module';
import { MultiselectModule } from '@app/shared/components/multiselect/multiselect.module';
import { ButtonModule } from '@app/shared/components/buttons/button/button-module';
import { SearchClientInputModule } from '@app/shared/components/inputs/search-client-input/search-client-input.module';
import { ClientProposalsRoutingModule } from '@app/pages/client-proposals-page/client-proposals.routing.module';
import { ClientProposalsPageComponent } from '@app/pages/client-proposals-page/client-proposals-page/client-proposals-page.component';
import { ClientProposalsDevelopmentTabComponent } from '@app/pages/client-proposals-page/client-proposals-tabs/client-proposals-development-tab/client-proposals-development-tab.component';
import { ClientProposalsNewsLineTabComponent } from '@app/pages/client-proposals-page/client-proposals-tabs/client-proposals-news-line-tab/client-proposals-news-line-tab.component';
import { ClientProposalsTradeListTabComponent } from '@app/pages/client-proposals-page/client-proposals-tabs/client-proposals-trade-list-tab/client-proposals-trade-list-tab.component';
import { ClientProposalsSamplesTabComponent } from '@app/pages/client-proposals-page/client-proposals-tabs/client-proposals-samples-tab/client-proposals-samples-tab.component';
import { ClientProposalsContractorsTabComponent } from '@app/pages/client-proposals-page/client-proposals-tabs/client-proposals-contractors-tab/client-proposals-contractors-tab.component';
import { ClientProposalsInfoComponent } from '@app/pages/client-proposals-page/client-proposals-info/client-proposals-info.component';
import { ClientProposalsBusinessTripsTabComponent } from '@app/pages/client-proposals-page/client-proposals-tabs/client-proposals-bisiness-trips-tab/client-proposals-business-trips-tab.component';
import { ClientProposalsRowItemTrComponent } from '@app/pages/client-proposals-page/client-proposals-row-item-tr/client-proposals-row-item-tr.component';
import { TableV2Module } from '@app/shared/components/ss-table-v2/ss-table-v2.module';
import { IconModule } from '@app/shared/components/icon/icon.module';
import { FilePickerModule } from '@app/shared/components/file-picker/file-picker.module';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { SettingsViewColumnComponent } from '@app/pages/client-proposals-page/settings-view-column/settings-view-column.component';
import { ClientProposalsFilterComponent } from '@app/pages/client-proposals-page/client-proposals-filter/client-proposals-filter.component';
import { ClientProposalsSendCloudPopoverComponent } from '@app/pages/client-proposals-page/client-proposals-send-cloud-popover/client-proposals-send-cloud-popover.component';
import { ClientProposalsTableVgpComponent } from '@app/pages/client-proposals-page/client-proposals-table-vgp/client-proposals-table-vgp.component';
import { ScrollableBlockModule } from '@app/shared/components/scrollable-block/scrollable-block.module';
import { ChipsSearchModule } from '@app/shared/components/inputs/chips-search/chips-search.module';
import { TextModule } from '@app/shared/components/typography/text/text.module';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { EmptyDataPageModule } from '@app/shared/components/empty-data-page/empty-data-page.module';
import { ClientProposalsDoneProductionComponent } from '@app/pages/client-proposals-page/client-proposals-done-production/client-proposals-done-production.component';
import { ClientProposalsTabsCanvasComponent } from '@app/pages/client-proposals-page/client-proposals-tabs/client-proposals-tabs-canvas/client-proposals-tabs-canvas.component';
import { CaptionModule } from '@app/shared/components/typography/caption/caption.module';
import { ComponentsModule } from '@app/components/components.module';
import { TooltipModule } from '@app/shared/components/tooltip/tooltip.module';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { LoaderModule } from '@app/shared/components/loader/loader.module';
import { InputModule } from '@app/shared/components/inputs/input/input.module';
import { ClientProposalsViewFilesPopoverComponent } from '@app/pages/client-proposals-page/client-proposals-view-files-popover/client-proposals-view-files-popover.component';
import { PipesModule } from '@app/core/pipes/pipes.module';
import { SsMenuModule } from '@app/shared/components/ss-menu/ss-menu.module';
import { SsDividerModule } from '@app/shared/components/ss-divider/ss-divider.module';

@NgModule({
	declarations: [
		ClientProposalsPageComponent,
		ClientProposalsDevelopmentTabComponent,
		ClientProposalsNewsLineTabComponent,
		ClientProposalsTradeListTabComponent,
		ClientProposalsSamplesTabComponent,
		ClientProposalsContractorsTabComponent,
		ClientProposalsInfoComponent,
		ClientProposalsBusinessTripsTabComponent,
		ClientProposalsRowItemTrComponent,
		SettingsViewColumnComponent,
		ClientProposalsFilterComponent,
		ClientProposalsSendCloudPopoverComponent,
		ClientProposalsTableVgpComponent,
		ClientProposalsDoneProductionComponent,
		ClientProposalsTabsCanvasComponent,
		ClientProposalsRowItemTrComponent,
		ClientProposalsViewFilesPopoverComponent,
	],
	imports: [
		CommonModule,
		ClientProposalsRoutingModule,
		HeadlineModule,
		SearchInputModule,
		AccordionModule,
		ReactiveFormsModule,
		TableModule,
		TabsModule,
		CardModule,
		MultiselectModule,
		ButtonModule,
		SearchClientInputModule,
		TableV2Module,
		IconModule,
		FilePickerModule,
		NzDropDownModule,
		ScrollableBlockModule,
		ChipsSearchModule,
		TextModule,
		NzPaginationModule,
		EmptyDataPageModule,
		CaptionModule,
		ComponentsModule,
		CaptionModule,
		TooltipModule,
		FormsModule,
		ClipboardModule,
		LoaderModule,
		InputModule,
		PipesModule,
		SsMenuModule,
		SsDividerModule,
	],
})
export class ClientProposalsModule {}
