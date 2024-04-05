import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FriendlyAccountsPageComponent } from './friendly-accounts-page.component';

const routes: Routes = [
	{
		path: '',
		component: FriendlyAccountsPageComponent,
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
export class FriendlyAccountsRoutingModule {}
