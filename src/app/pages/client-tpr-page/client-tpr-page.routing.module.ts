import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientTprPageComponent } from '@app/pages/client-tpr-page/client-tpr-page.component';
import { PermissionsGuard } from '@app/core/guards/permissions.guard';

const routes: Routes = [
	{
		path: '',
		component: ClientTprPageComponent,
		canActivate: [PermissionsGuard],
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class ClientTprPageRoutingModule {}
