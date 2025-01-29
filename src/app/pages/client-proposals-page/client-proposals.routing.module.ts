import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientProposalsPageComponent } from '@app/pages/client-proposals-page/client-proposals-page/client-proposals-page.component';
import { ClientProposalsBusinessTripsTabComponent } from '@app/pages/client-proposals-page/client-proposals-tabs/client-proposals-bisiness-trips-tab/client-proposals-business-trips-tab.component';
import { ClientProposalsDevelopmentTabComponent } from '@app/pages/client-proposals-page/client-proposals-tabs/client-proposals-development-tab/client-proposals-development-tab.component';
import { ClientProposalsNewsLineTabComponent } from '@app/pages/client-proposals-page/client-proposals-tabs/client-proposals-news-line-tab/client-proposals-news-line-tab.component';
import { ClientProposalsTradeListTabComponent } from '@app/pages/client-proposals-page/client-proposals-tabs/client-proposals-trade-list-tab/client-proposals-trade-list-tab.component';
import { ClientProposalsSamplesTabComponent } from '@app/pages/client-proposals-page/client-proposals-tabs/client-proposals-samples-tab/client-proposals-samples-tab.component';
import { ClientProposalsContractorsTabComponent } from '@app/pages/client-proposals-page/client-proposals-tabs/client-proposals-contractors-tab/client-proposals-contractors-tab.component';
import { ClientProposalsInfoComponent } from '@app/pages/client-proposals-page/client-proposals-info/client-proposals-info.component';

const routes: Routes = [
	{
		path: '',
		component: ClientProposalsPageComponent,
		data: {
			animation: 'animation',
		},
	},
	{
		path: ':clientId',
		component: ClientProposalsInfoComponent,
		data: {
			animation: 'animation',
		},
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
				path: 'news-line',
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
				path: 'contractors',
				component: ClientProposalsContractorsTabComponent,
			},
			{ path: '**', redirectTo: 'contractors' },
		],
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class ClientProposalsRoutingModule {}
