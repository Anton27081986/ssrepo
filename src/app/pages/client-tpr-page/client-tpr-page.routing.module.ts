import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientTprPageComponent } from '@app/pages/client-tpr-page/client-tpr-page.component';

const routes: Routes = [
	{
		path: '',
		component: ClientTprPageComponent,
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class ClientTprPageRoutingModule {}
