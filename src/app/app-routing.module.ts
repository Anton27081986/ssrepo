import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@app/core/guards/auth.guard';
import { FullLayoutComponent } from '@app/shared/layouts/full-layout/full-layout.component';
import { EmptyLayoutComponent } from '@app/shared/layouts/empty-layout/empty-layout.component';
import { WithoutFooterLayoutComponent } from '@app/shared/layouts/without-footer-layout/without-footer-layout.component';
import { NewLayoutComponent } from '@app/shared/layouts/new-layout/new-layout.component';
import { PermissionsGuard } from '@app/core/guards/permissions.guard';

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
				path: 'client-request-samples',
				loadChildren: () =>
					import('@app/pages/samples-page/samples-page.module').then(
						m => m.SamplesPageModule,
					),
			},
			{
				path: 'invite',
				loadChildren: () =>
					import('./pages/invite/invite.module').then(m => m.InviteModule),
			},
		],
	},
	{
		path: '',
		component: NewLayoutComponent,
		canActivate: [AuthGuard, PermissionsGuard],
		children: [
			{
				path: 'client-tpr-page',
				loadChildren: () =>
					import('@app/pages/client-tpr-page/client-tpr-page.module').then(
						m => m.ClientTprPageModule,
					),
			},
		],
	},
	{
		path: '',
		component: NewLayoutComponent,
		canActivate: [AuthGuard],
		children: [
			{
				path: 'not-permission',
				loadChildren: () =>
					import('./pages/not-permission-page/not-permission-page.module').then(
						m => m.NotPermissionPageModule,
					),
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
