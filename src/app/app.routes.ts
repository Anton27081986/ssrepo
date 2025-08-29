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
import { ProfileComponent } from '@app/pages/profile/profile.component';
import { SettingsComponent } from '@app/pages/profile/settings/settings.component';
import { ChangePasswordComponent } from '@app/pages/profile/change-password/change-password.component';
import { MyMenuComponent } from '@app/pages/profile/my-menu/my-menu.component';
import { OrderWidgetsComponent } from '@app/pages/profile/order-widgets/order-widgets.component';
import { NotificationsComponent } from '@app/pages/profile/notifications/notifications.component';
import { FriendlyAccountsPageComponent } from '@app/pages/profile/friendly-accounts-page/friendly-accounts-page.component';
import { RawMaterialAccountingComponent } from '@app/pages/raw-material-accounting/raw-material-accounting.component';
// Completed work acts components загружаются через lazy loading
// Clients dictionary components загружаются через lazy loading
import { InviteComponent } from '@app/pages/invite/invite.component';
// Client proposals components загружаются через lazy loading
import { ExcessIncomePageComponent } from '@app/pages/excess-income/excess-income-page/excess-income-page.component';
import { NotPermissionPageComponent } from '@app/pages/not-permission-page/not-permission-page.component';
import { AuthComponent } from '@auth/auth.component';
import { AppRoutes } from '@app/common/routes';
import { SignInComponent } from '@auth/sign-in/sign-in.component';
import { ForgotPasswordComponent } from '@auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from '@auth/reset-password/reset-password.component';
// Production plan components загружаются через lazy loading
import { FrontLibraryLayoutComponent } from '@app/shared/layouts/front-library-layout/front-library-layout.component';
import { operationPlanPermissionGuard } from '@app/core/guards/production-plan-permission.guard';
// MP reservation components загружаются через lazy loading
import { mpReservationOrdersPermissionsGuard } from '@app/core/guards/mp-reservation-orders';

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
				component: ProfileComponent,
				children: [
					{
						path: 'settings',
						component: SettingsComponent,
						title: 'Основная информация',
					},
					{
						path: 'change-password',
						component: ChangePasswordComponent,
						title: 'Основная информация',
					},
					{
						path: 'friendly-accounts',
						component: FriendlyAccountsPageComponent,
					},
					{
						path: 'my-menu',
						component: MyMenuComponent,
						title: 'Основная информация',
					},
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
					// {
					// 	path: 'recovery-password',
					// 	component: RecoveryPasswordComponent,
					// 	title: 'Основная информация',
					// },
				],
			},
			{
				path: 'raw-material-accounting',
				canActivate: [procurementsPermissionsGuard],
				children: [
					{
						path: ':id',
						component: RawMaterialAccountingComponent,
					},
					{
						path: '',
						component: RawMaterialAccountingComponent,
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
				component: InviteComponent,
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
				canActivate: [mpReservationOrdersPermissionsGuard],
				loadChildren: async () =>
					import('@app/pages/mp-reservation').then(
						(m) => m.MP_RESERVATION_ROUTES
					),
				data: {
					preload: false,
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
				component: ExcessIncomePageComponent,
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
		data: {
			animation: 'animation',
		},
		component: AuthComponent,
		children: [
			{
				path: AppRoutes.signIn,
				component: SignInComponent,
				pathMatch: 'full',
			},
			{
				path: AppRoutes.forgotPassword,
				component: ForgotPasswordComponent,
				pathMatch: 'full',
			},
			{
				path: AppRoutes.resetPassword,
				component: ResetPasswordComponent,
				pathMatch: 'full',
			},
			{ path: '**', redirectTo: AppRoutes.signIn },
		],
	},
	{ path: '**', redirectTo: '' },
];
