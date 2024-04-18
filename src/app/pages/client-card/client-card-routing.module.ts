import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientCardComponent } from '@app/pages/client-card/client-card.component';
import { ClientCardBasicComponent } from '@app/pages/client-card/client-card-basic/client-card-basic.component';
import { ClientCardBirthdaysComponent } from '@app/pages/client-card/client-card-birthdays/client-card-birthdays.component';

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
