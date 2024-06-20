import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientProposalsPageComponent } from '@app/pages/client-proposals-page/client-proposals-page/client-proposals-page.component';
import { ClientProposalsBusinessTripsTabComponent } from '@app/pages/client-proposals-page/client-proposals-tabs/client-proposals-bisiness-trips-tab/client-proposals-business-trips-tab.component';
import { ClientProposalsDevelopmentTabComponent } from '@app/pages/client-proposals-page/client-proposals-tabs/client-proposals-development-tab/client-proposals-development-tab.component';
import { ClientProposalsEncodingsTabComponent } from '@app/pages/client-proposals-page/client-proposals-tabs/client-proposals-encodings-tab/client-proposals-encodings-tab.component';
import { ClientProposalsNewsLineTabComponent } from '@app/pages/client-proposals-page/client-proposals-tabs/client-proposals-news-line-tab/client-proposals-news-line-tab.component';
import { ClientProposalsTradeListTabComponent } from '@app/pages/client-proposals-page/client-proposals-tabs/client-proposals-trade-list-tab/client-proposals-trade-list-tab.component';
import { ClientProposalsSamplesTabComponent } from '@app/pages/client-proposals-page/client-proposals-tabs/client-proposals-samples-tab/client-proposals-samples-tab.component';
import { ClientProposalsLoyaltyTabComponent } from '@app/pages/client-proposals-page/client-proposals-tabs/client-proposals-loyalty-tab/client-proposals-loyalty-tab.component';
import { ClientProposalsInfoComponent } from '@app/pages/client-proposals-page/client-proposals-info/client-proposals-info.component';

const routes: Routes = [
	{
		path: '',
		component: ClientProposalsPageComponent,
	},
	{
		path: ':clientId',
		component: ClientProposalsInfoComponent,
		children: [
			{
				path: 'business-trips',
				component: ClientProposalsBusinessTripsTabComponent,
			},
			{
				path: 'development',
				component: ClientProposalsDevelopmentTabComponent,
			},
			{
				path: 'encodings',
				component: ClientProposalsEncodingsTabComponent,
			},
			{
				path: 'newsLine',
				component: ClientProposalsNewsLineTabComponent,
			},
			{
				path: 'trade-list',
				component: ClientProposalsTradeListTabComponent,
			},
			{
				path: 'samples',
				component: ClientProposalsSamplesTabComponent,
			},
			{
				path: 'news-line',
				component: ClientProposalsNewsLineTabComponent,
			},
			{
				path: 'loyalty',
				component: ClientProposalsLoyaltyTabComponent,
			},
			{ path: '**', redirectTo: 'business-trips' },
		],
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class ClientProposalsRoutingModule {}
