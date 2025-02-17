import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@app/core/guards/auth.guard';
import { EmptyLayoutComponent } from '@app/shared/layouts/empty-layout/empty-layout.component';
import { WithoutFooterLayoutComponent } from '@app/shared/layouts/without-footer-layout/without-footer-layout.component';
import { FullWidthWithoutFooterLayoutComponent } from '@app/shared/layouts/full-width-without-footer-layout/full-width-without-footer-layout.component';
import { NewLayoutComponent } from '@app/shared/layouts/new-layout/new-layout.component';
import { procurementsPermissionsGuard, proposalsPermissionsGuard } from '@app/core/guards';

const routes: Routes = [
	{ path: '', pathMatch: 'full', redirectTo: '' },
	{
		path: '',
		component: NewLayoutComponent,
		canActivate: [AuthGuard],
		data: {
			animation: 'animation',
		},
		children: [
			{
				path: '',
				loadChildren: () =>
					import('@app/pages/main-page/main-page.module').then(m => m.MainPageModule),
			},
			{
				path: '',
				component: EmptyLayoutComponent,
				data: {
					animation: 'animation',
				},
				children: [
					{
						path: 'profile',
						canActivate: [AuthGuard],
						loadChildren: () =>
							import('./pages/profile/profile.module').then(m => m.ProfileModule),
					},
					{
						path: 'raw-material-accounting',
						canActivate: [procurementsPermissionsGuard],
						loadChildren: () =>
							import(
								'./pages/raw-material-accounting/raw-material-accounting.module'
							).then(m => m.RawMaterialAccountingModule),
					},
					{
						path: 'completed-work-acts',
						loadChildren: () =>
							import('./pages/completed-work-acts/completed-work-acts.module').then(
								m => m.CompletedWorkActsModule,
							),
					},
				],
			},
		],
	},
	{
		path: '',
		component: WithoutFooterLayoutComponent,
		canActivate: [AuthGuard],
		data: {
			animation: 'animation',
		},
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
		component: FullWidthWithoutFooterLayoutComponent,
		canActivate: [AuthGuard, proposalsPermissionsGuard],
		data: {
			animation: 'animation',
		},
		children: [
			{
				path: 'client-proposals-page',
				loadChildren: () =>
					import('@app/pages/client-proposals-page/client-proposals.module').then(
						m => m.ClientProposalsModule,
					),
			},
		],
	},
	{
		path: '',
		component: FullWidthWithoutFooterLayoutComponent,
		data: {
			animation: 'animation',
		},
		children: [
			{
				path: 'production-plan',
				loadChildren: () =>
					import('./pages/production-plan/production-plan.routing').then(
						r => r.productionPlanRoutes,
					),
			},
		],
	},
	{
		path: '',
		component: FullWidthWithoutFooterLayoutComponent,
		canActivate: [AuthGuard],
		data: {
			animation: 'animation',
		},
		children: [
			{
				path: 'excess-income-page',
				loadChildren: () =>
					import('@app/pages/excess-income/excess-income.module').then(
						m => m.ExcessIncomeModule,
					),
			},
		],
	},
	{
		path: '',
		component: FullWidthWithoutFooterLayoutComponent,
		canActivate: [AuthGuard],
		data: {
			animation: 'animation',
		},
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
		data: {
			animation: 'animation',
		},
		loadChildren: () => import('./pages/auth/auth.module').then(m => m.AuthModule),
	},
	{
		path: 'sandbox',
		data: {
			animation: 'animation',
		},
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
