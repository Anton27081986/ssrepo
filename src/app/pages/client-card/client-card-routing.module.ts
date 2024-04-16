import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientCardComponent } from '@app/pages/client-card/client-card.component';
import { ClientCardBasicComponent } from '@app/pages/client-card/client-card-basic/client-card-basic.component';
import { SamplesComponent } from '@app/pages/client-card/samples/samples.component';
import { SaleRequestsComponent } from '@app/pages/client-card/sales-request/sale-requests.component';

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
				component: SaleRequestsComponent,
			},
			{
				path: 'samples',
				component: SamplesComponent,
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
