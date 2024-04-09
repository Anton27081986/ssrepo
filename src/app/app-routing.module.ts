import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@app/core/guards/auth.guard';
import { FullLayoutComponent } from '@app/shared/layouts/full-layout/full-layout.component';
import { EmptyLayoutComponent } from '@app/shared/layouts/empty-layout/empty-layout.component';
import { WithoutFooterLayoutComponent } from '@app/shared/layouts/without-footer-layout/without-footer-layout.component';

const routes: Routes = [
	{ path: '', pathMatch: 'full', redirectTo: '' },
	{
		path: '',
		component: FullLayoutComponent,
		canActivate: [AuthGuard],
		children: [
			{
				path: '',
				loadChildren: () => import('./pages/start/start.module').then(m => m.StartModule),
			},
			{
				path: '',
				component: EmptyLayoutComponent,
				children: [
					{
						path: 'partners',
						// canActivate: [AuthGuards],
						loadChildren: () =>
							import('./pages/partners/partners.module').then(m => m.PartnersModule),
					},
					{
						path: 'profile',
						canActivate: [AuthGuard],
						loadChildren: () =>
							import('./pages/profile/profile.module').then(m => m.ProfileModule),
					},
				],
			},
		],
	},
	{
		path: '',
		component: WithoutFooterLayoutComponent,
		canActivate: [AuthGuard],
		children: [
			{
				path: 'clients-list',
				loadChildren: () =>
					import('@app/pages/clients-list-page/clients-list-page.module').then(
						m => m.ClientsListPageModule,
					),
			},
			{
				path: 'client-card',
				loadChildren: () =>
					import('./pages/client-card/client-card.module').then(m => m.ClientCardModule),
			},
			{
				path: 'invite',
				loadChildren: () =>
					import('./pages/invite/invite.module').then(m => m.InviteModule),
			},
		],
	},
	{
		path: 'auth',
		loadChildren: () => import('./pages/auth/auth.module').then(m => m.AuthModule),
	},
	{
		path: 'sandbox',
		loadChildren: () => import('./pages/sandbox/sandbox.module').then(m => m.SandboxModule),
	},
	{ path: '**', redirectTo: '' },
];

@NgModule({
	imports: [
		RouterModule.forRoot(routes, {
			preloadingStrategy: PreloadAllModules,
		}),
	],
	exports: [RouterModule],
})
export class AppRoutingModule {}
