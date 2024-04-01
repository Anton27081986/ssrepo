import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from '@app/pages/profile/profile.component';
import { SettingsComponent } from '@app/pages/profile/settings/settings.component';
import { ChangePasswordComponent } from '@app/pages/profile/change-password/change-password.component';
import { OrderWidgetsComponent } from '@app/pages/profile/order-widgets/order-widgets.component';
import { NotificationsComponent } from '@app/pages/profile/notifications/notifications.component';
import { RecoveryPasswordComponent } from '@app/pages/profile/recovery-password/recovery-password.component';
import { MyMenuComponent } from './my-menu/my-menu.component';

const routes: Routes = [
	{
		path: '',
		component: ProfileComponent,
		children: [
			{ path: 'settings', component: SettingsComponent, title: 'Основная информация' },
			{
				path: 'change-password',
				component: ChangePasswordComponent,
				title: 'Основная информация',
			},
			{
				path: 'frendly-accounts',
				loadChildren: () =>
					import('./frendly-accounts/frendly-accounts.module').then(
						m => m.FrendlyAccountsModule,
					),
			},
			{
				path: 'frendly-accounts/invite',
				loadChildren: () =>
					import('./invitation/invitation.module').then(m => m.InvitationModule),
			},
			{ path: 'my-menu', component: MyMenuComponent, title: 'Основная информация' },
			{
				path: 'order-widgets',
				component: OrderWidgetsComponent,
				title: 'Основная информация',
			},
			{
				path: 'notifications',
				component: NotificationsComponent,
				title: 'Основная информация',
			},
			{
				path: 'recovery-password',
				component: RecoveryPasswordComponent,
				title: 'Основная информация',
			},
		],
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class ProfileRoutingModule {}
