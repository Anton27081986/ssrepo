import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientsTprComponent } from '@app/pages/recommendations-vgp/clients-tpr.component';

const routes: Routes = [
	{
		path: '',
		component: ClientsTprComponent,
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class ClientsTprRoutingModule {}
