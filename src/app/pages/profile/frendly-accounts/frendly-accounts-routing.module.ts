import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FrendlyAccountsComponent } from '@app/pages/profile/frendly-accounts/frendly-accounts.component';

const routes: Routes = [
	{
		path: '',
		component: FrendlyAccountsComponent,
		children: [
			{
				path: 'invitation',
				loadChildren: () =>
					import('../invitation/invitation.module').then(m => m.InvitationModule),
			},
		],
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class FrendlyAccountsRoutingModule {}
