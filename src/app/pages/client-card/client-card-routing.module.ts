import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientCardComponent } from '@app/pages/client-card/client-card.component';
import { ClientCardBasicComponent } from '@app/pages/client-card/client-card-basic/client-card-basic.component';
import { ClientSaleRequestsComponent } from '@app/pages/client-card/client-sale-requests/client-sale-requests.component';
import { ClientCardBirthdaysComponent } from '@app/pages/client-card/client-card-birthdays/client-card-birthdays.component';
import { ClientRequestSamplesComponent } from '@app/pages/client-card/client-request-samples/client-request-samples.component';

const routes: Routes = [
	{
		path: '',
		component: ClientCardComponent,
	},
	{
		path: ':id',
		component: ClientCardComponent,
		children: [
			{
				path: 'basic',
				component: ClientCardBasicComponent,
			},
			{
				path: 'sales',
				component: ClientSaleRequestsComponent,
			},
			{
				path: 'samples',
				component: ClientRequestSamplesComponent,
			},
			{
				path: 'birthdays',
				component: ClientCardBirthdaysComponent,
			},
			{ path: '**', redirectTo: 'basic' },
		],
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class ClientCardRoutingModule {}
