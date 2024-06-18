import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientTprPageComponent } from '@app/pages/client-tpr-page/client-tpr-page.component';
import { ClientTprDevelopmentTabComponent } from '@app/pages/client-tpr-page/client-tpr-tabs/client-tpr-development-tab/client-tpr-development-tab.component';
import { ClientTprEncodingsTabComponent } from '@app/pages/client-tpr-page/client-tpr-tabs/client-tpr-encodings-tab/client-tpr-encodings-tab.component';
import { ClientTprNewsLineTabComponent } from '@app/pages/client-tpr-page/client-tpr-tabs/client-tpr-newsline-tab/client-tpr-news-line-tab.component';
import { ClientTprTradeTabComponent } from '@app/pages/client-tpr-page/client-tpr-tabs/client-tpr-trade-list-tab/client-tpr-trade-list-tab.component';
import { ClientTprSamplesTabComponent } from '@app/pages/client-tpr-page/client-tpr-tabs/client-trp-samples-tab/client-tpr-samples-tab.component';
import { ClientTprInfoComponent } from '@app/pages/client-tpr-page/client-tpr-info/client-tpr-info.component';
import { ClientTprBusinessTripsTabComponent } from '@app/pages/client-tpr-page/client-tpr-tabs/client-trp-bisiness-trips-tab/client-tpr-business-trips-tab.component';
import { ClientTprLoyaltyTabComponent } from '@app/pages/client-tpr-page/client-tpr-tabs/client-trp-loyalty-tab/client-tpr-loyalty-tab.component';

const routes: Routes = [
	{
		path: '',
		component: ClientTprPageComponent,
	},
	{
		path: ':clientId',
		component: ClientTprInfoComponent,
		children: [
			{
				path: 'business-trips',
				component: ClientTprBusinessTripsTabComponent,
			},
			{
				path: 'development',
				component: ClientTprDevelopmentTabComponent,
			},
			{
				path: 'encodings',
				component: ClientTprEncodingsTabComponent,
			},
			{
				path: 'newsLine',
				component: ClientTprNewsLineTabComponent,
			},
			{
				path: 'trade-list',
				component: ClientTprTradeTabComponent,
			},
			{
				path: 'samples',
				component: ClientTprSamplesTabComponent,
			},
			{
				path: 'news-line',
				component: ClientTprNewsLineTabComponent,
			},
			{
				path: 'loyalty',
				component: ClientTprLoyaltyTabComponent,
			},
			{ path: '**', redirectTo: 'business-trips' },
		],
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class ClientTprPageRoutingModule {}
