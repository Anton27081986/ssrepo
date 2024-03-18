import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@app/core/guards/auth.guard';
import { MainComponent } from './shared/layouts/main/main.component';
import { WrapperComponent } from './shared/layouts/wrapper/wrapper.component';

const routes: Routes = [
	{ path: '', pathMatch: 'full', redirectTo: '' },
	{
		path: '',
		component: MainComponent,
		canActivate: [AuthGuard],
		children: [
			{
				path: '',
				loadChildren: () => import('./pages/start/start.module').then(m => m.StartModule),
			},
			{
				path: 'clients-list',
				loadChildren: () =>
					import('./pages/clients-list/clients-list.module').then(
						m => m.ClientsListModule,
					),
			},
			{
				path: 'client-card',
				loadChildren: () =>
					import('./pages/client-card/client-card.module').then(m => m.ClientCardModule),
			},
			{
				path: '',
				component: WrapperComponent,
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
