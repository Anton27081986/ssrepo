import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
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
import { ClientProposalsFilterComponent } from '@app/pages/client-proposals-page/client-proposals-filter/client-proposals-filter.component';
import { ClientProposalsSendCloudPopoverComponent } from '@app/pages/client-proposals-page/client-proposals-send-cloud-popover/client-proposals-send-cloud-popover.component';
import { ClientProposalsDoneProductionComponent } from '@app/pages/client-proposals-page/client-proposals-done-production/client-proposals-done-production.component';
import { ClientProposalsTabsCanvasComponent } from '@app/pages/client-proposals-page/client-proposals-tabs/client-proposals-tabs-canvas/client-proposals-tabs-canvas.component';
import { ClientProposalsViewFilesPopoverComponent } from '@app/pages/client-proposals-page/client-proposals-view-files-popover/client-proposals-view-files-popover.component';
import { AtWorkModalComponent } from '@app/pages/client-proposals-page/at-work-modal/at-work-modal.component';
import { AtWorkRowItemTrComponent } from '@app/pages/client-proposals-page/at-work-modal/at-work-row-item-tr/at-work-row-item-tr.component';

@NgModule({
    declarations: [
    ],
	imports: [
		ClientProposalsPageComponent,
		ClientProposalsDevelopmentTabComponent,
		ClientProposalsNewsLineTabComponent,
		ClientProposalsTradeListTabComponent,
		ClientProposalsSamplesTabComponent,
		ClientProposalsContractorsTabComponent,
		ClientProposalsInfoComponent,
		ClientProposalsBusinessTripsTabComponent,
		ClientProposalsRowItemTrComponent,
		ClientProposalsFilterComponent,
		ClientProposalsSendCloudPopoverComponent,
		ClientProposalsDoneProductionComponent,
		ClientProposalsTabsCanvasComponent,
		ClientProposalsRowItemTrComponent,
		ClientProposalsViewFilesPopoverComponent,
		AtWorkModalComponent,
		AtWorkRowItemTrComponent,
		CommonModule,
		ClientProposalsRoutingModule,
	],
    exports: [
        ClientProposalsRowItemTrComponent
    ]
})
export class ClientProposalsModule {}
