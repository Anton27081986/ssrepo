import { Routes } from '@angular/router';
import { AuthGuard } from '@app/core/guards/auth.guard';
import { WithoutFooterLayoutComponent } from '@app/shared/layouts/without-footer-layout/without-footer-layout.component';
import { FullWidthWithoutFooterLayoutComponent } from '@app/shared/layouts/full-width-without-footer-layout/full-width-without-footer-layout.component';
import { FullLayoutComponent } from '@app/shared/layouts/new-layout/full-layout.component';
import {
	procurementsPermissionsGuard,
	proposalsPermissionsGuard,
} from '@app/core/guards';
import { MainPageComponent } from '@app/pages/main-page/main-page.component';
import { NotPermissionPageComponent } from '@app/pages/not-permission-page/not-permission-page.component';
import { FrontLibraryLayoutComponent } from '@app/shared/layouts/front-library-layout/front-library-layout.component';
import { operationPlanPermissionGuard } from '@app/core/guards/production-plan-permission.guard';

export const routes: Routes = [
	{ path: '', pathMatch: 'full', redirectTo: '' },
	{
		path: '',
		component: FullLayoutComponent,
		canActivate: [AuthGuard],
		data: {
			animation: 'animation',
		},
		children: [
			{
				path: '',
				component: MainPageComponent,
			},
			{
				path: 'profile',
				canActivate: [AuthGuard],
				loadChildren: async () =>
					import('./pages/profile').then((m) => m.PROFILE_ROUTES),
				data: {
					preload: false, // Загружается только при необходимости
				},
			},
			{
				path: 'raw-material-accounting',
				canActivate: [procurementsPermissionsGuard],
				loadChildren: async () =>
					import('./pages/raw-material-accounting').then(
						(m) => m.RAW_MATERIAL_ACCOUNTING_ROUTES
					),
				data: {
					preload: false, // Загружается только при необходимости
				},
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
				path: 'clients-dictionary',
				loadChildren: async () =>
					import('@app/pages/clients-dictionary').then(
						(m) => m.CLIENTS_DICTIONARY_ROUTES
					),
				data: {
					preload: true, // Предзагрузка для часто используемого модуля
				},
			},
			// Редиректы для обратной совместимости
			{
				path: 'clients-list',
				redirectTo: 'clients-dictionary/list',
			},
			{
				path: 'client-card/:id',
				redirectTo: 'clients-dictionary/card/:id',
			},
			{
				path: 'invite',
				loadChildren: async () =>
					import('./pages/invite').then((m) => m.INVITE_ROUTES),
				data: {
					preload: false, // Загружается только при необходимости
				},
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
				loadChildren: async () =>
					import('@app/pages/client-proposals-page').then(
						(m) => m.CLIENT_PROPOSALS_PAGE_ROUTES
					),
				data: {
					preload: false, // Загружается по требованию
				},
			},
		],
	},
	{
		path: '',
		component: FrontLibraryLayoutComponent,
		canActivate: [AuthGuard],
		data: {
			animation: 'animation',
		},
		children: [
			{
				path: 'production-plan',
				canActivate: [operationPlanPermissionGuard],
				loadChildren: async () =>
					import('@app/pages/production-plan').then(
						(m) => m.PRODUCTION_PLAN_ROUTES
					),
				data: {
					preload: false,
				},
			},
			{
				path: 'mp-reservation-orders',
				loadChildren: async () =>
					import('@app/pages/mp-reservation').then(
						(m) => m.MP_RESERVATION_ROUTES
					),
				data: {
					preload: false, // Загружается только при необходимости
				},
			},
			{
				path: 'completed-work-acts',
				loadChildren: async () =>
					import('@app/pages/completed-work-acts').then(
						(m) => m.COMPLETED_WORK_ACTS_ROUTES
					),
				data: {
					preload: false,
				},
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
				loadChildren: async () =>
					import('./pages/excess-income').then(
						(m) => m.EXCESS_INCOME_ROUTES
					),
				data: {
					preload: false, // Загружается только при необходимости
				},
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
				component: NotPermissionPageComponent,
			},
		],
	},
	{
		path: 'auth',
		loadChildren: async () =>
			import('./pages/auth').then((m) => m.AUTH_ROUTES),
		data: {
			preload: false, // Загружается только при необходимости
		},
	},
	{ path: '**', redirectTo: '' },
];
