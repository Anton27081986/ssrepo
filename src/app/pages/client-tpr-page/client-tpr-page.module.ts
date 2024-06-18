import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeadlineModule } from '@app/shared/components/typography/headline/headline.module';
import { SearchInputModule } from '@app/shared/components/inputs/search-input/search-input.module';
import { AccordionModule } from '@app/shared/components/accordion/accordion.module';
import { ReactiveFormsModule } from '@angular/forms';
import { TableModule } from '@app/shared/components/table/table.module';
import { ClientTprDevelopmentTabComponent } from '@app/pages/client-tpr-page/client-tpr-tabs/client-tpr-development-tab/client-tpr-development-tab.component';
import { ClientTprEncodingsTabComponent } from '@app/pages/client-tpr-page/client-tpr-tabs/client-tpr-encodings-tab/client-tpr-encodings-tab.component';
import { ClientTprNewsLineTabComponent } from '@app/pages/client-tpr-page/client-tpr-tabs/client-tpr-newsline-tab/client-tpr-news-line-tab.component';
import { ClientTprTradeTabComponent } from '@app/pages/client-tpr-page/client-tpr-tabs/client-tpr-trade-list-tab/client-tpr-trade-list-tab.component';
import { ClientTprSamplesTabComponent } from '@app/pages/client-tpr-page/client-tpr-tabs/client-trp-samples-tab/client-tpr-samples-tab.component';
import { TabsModule } from '@app/shared/components/tabs/tabs.module';
import { ClientTprLoyaltyTabComponent } from '@app/pages/client-tpr-page/client-tpr-tabs/client-trp-loyalty-tab/client-tpr-loyalty-tab.component';
import { CardModule } from '@app/shared/components/card/card.module';
import { ClientTprInfoComponent } from '@app/pages/client-tpr-page/client-tpr-info/client-tpr-info.component';
import { ClientTprBusinessTripsTabComponent } from '@app/pages/client-tpr-page/client-tpr-tabs/client-trp-bisiness-trips-tab/client-tpr-business-trips-tab.component';
import { MultiselectModule } from '@app/shared/components/multiselect/multiselect.module';
import { ButtonModule } from '@app/shared/components/buttons/button/button-module';
import { ClientTprPageRoutingModule } from './client-tpr-page.routing.module';
import { ClientTprPageComponent } from '@app/pages/client-tpr-page/client-tpr-page.component';

@NgModule({
	declarations: [
		ClientTprPageComponent,
		ClientTprDevelopmentTabComponent,
		ClientTprEncodingsTabComponent,
		ClientTprNewsLineTabComponent,
		ClientTprTradeTabComponent,
		ClientTprSamplesTabComponent,
		ClientTprLoyaltyTabComponent,
		ClientTprInfoComponent,
		ClientTprBusinessTripsTabComponent,
	],
	imports: [
		CommonModule,
		ClientTprPageRoutingModule,
		HeadlineModule,
		SearchInputModule,
		AccordionModule,
		ReactiveFormsModule,
		TableModule,
		TabsModule,
		CardModule,
		MultiselectModule,
		ButtonModule,
	],
})
export class ClientTprPageModule {}
