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
import { CompletedWorkActsComponent } from '@app/pages/completed-work-acts/completed-work-acts.component';
import { CompletedWorkActCardComponent } from '@app/pages/completed-work-acts/completed-work-act-card/completed-work-act-card.component';
import { ClientsListPageComponent } from '@app/pages/clients-list-page/clients-list-page.component';
import { ClientCardComponent } from '@app/pages/client-card/client-card.component';
import { ClientCardBasicComponent } from '@app/pages/client-card/client-card-basic/client-card-basic.component';
import { ClientSaleRequestsComponent } from '@app/pages/client-card/client-sale-requests/client-sale-requests.component';
import { ClientRequestSamplesComponent } from '@app/pages/client-card/client-request-samples/client-request-samples.component';
import { ClientCardNewProductsComponent } from '@app/pages/client-card/client-card-new-products/client-card-new-products.component';
import { ClientCardReturnRequestsComponent } from '@app/pages/client-card/client-card-return-requests/client-card-return-requests.component';
import { ClientCardLostProductsComponent } from '@app/pages/client-card/client-card-lost-products/client-card-lost-products.component';
import { ClientCardContractsComponent } from '@app/pages/client-card/client-card-contracts/client-card-contracts.component';
import { ClientCardBusinessTripsComponent } from '@app/pages/client-card/client-card-bisiness-trips/client-card-business-trips.component';
import { ClientCardBirthdaysComponent } from '@app/pages/client-card/client-card-birthdays/client-card-birthdays.component';
import { InviteComponent } from '@app/pages/invite/invite.component';
import { ClientProposalsPageComponent } from '@app/pages/client-proposals-page/client-proposals-page/client-proposals-page.component';
import { ClientProposalsInfoComponent } from '@app/pages/client-proposals-page/client-proposals-info/client-proposals-info.component';
import { ClientProposalsBusinessTripsTabComponent } from '@app/pages/client-proposals-page/client-proposals-tabs/client-proposals-bisiness-trips-tab/client-proposals-business-trips-tab.component';
import { ClientProposalsDevelopmentTabComponent } from '@app/pages/client-proposals-page/client-proposals-tabs/client-proposals-development-tab/client-proposals-development-tab.component';
import { ClientProposalsNewsLineTabComponent } from '@app/pages/client-proposals-page/client-proposals-tabs/client-proposals-news-line-tab/client-proposals-news-line-tab.component';
import { ClientProposalsTradeListTabComponent } from '@app/pages/client-proposals-page/client-proposals-tabs/client-proposals-trade-list-tab/client-proposals-trade-list-tab.component';
import { ClientProposalsSamplesTabComponent } from '@app/pages/client-proposals-page/client-proposals-tabs/client-proposals-samples-tab/client-proposals-samples-tab.component';
import { ClientProposalsContractorsTabComponent } from '@app/pages/client-proposals-page/client-proposals-tabs/client-proposals-contractors-tab/client-proposals-contractors-tab.component';
import { ExcessIncomePageComponent } from '@app/pages/excess-income/excess-income-page/excess-income-page.component';
import { NotPermissionPageComponent } from '@app/pages/not-permission-page/not-permission-page.component';
import { AuthComponent } from '@auth/auth.component';
import { AppRoutes } from '@app/common/routes';
import { SignInComponent } from '@auth/sign-in/sign-in.component';
import { ForgotPasswordComponent } from '@auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from '@auth/reset-password/reset-password.component';
import { ProductionPlanComponent } from '@app/pages/production-plan/production-plan.component';
import { OperationalPlanComponent } from '@app/pages/production-plan/operational-plan/operational-plan.component';
import { FrontLibraryLayoutComponent } from '@app/shared/layouts/front-library-layout/front-library-layout.component';
import { operationPlanPermissionGuard } from '@app/core/guards/production-plan-permission.guard';
import { MPReservationOrdersComponent } from '@app/pages/mp-reservation-orders/mp-reservation-orders.component';
import { MpReservationOrderCardComponent } from '@app/pages/mp-reservation-order-card/mp-reservation-order-card.component';
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
			{
				path: 'completed-work-acts',
				children: [
					{
						path: '',
						component: CompletedWorkActsComponent,
						data: {
							animation: 'animation',
						},
					},
					{
						path: ':id',
						component: CompletedWorkActCardComponent,
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
				component: ClientsListPageComponent,
			},
			{
				path: 'client-card',
				children: [
					{
						path: ':id',
						component: ClientCardComponent,
						children: [
							{
								path: 'basic',
								component: ClientCardBasicComponent,
							},
							{
								path: 'sales',
								component: ClientSaleRequestsComponent,
							},
							{
								path: 'samples',
								component: ClientRequestSamplesComponent,
							},
							{
								path: 'gntpr',
								component: ClientCardNewProductsComponent,
							},
							{
								path: 'refund',
								component: ClientCardReturnRequestsComponent,
							},
							{
								path: 'pkp',
								component: ClientCardLostProductsComponent,
							},
							{
								path: 'contracts',
								component: ClientCardContractsComponent,
							},
							{
								path: 'business-trips',
								component: ClientCardBusinessTripsComponent,
							},
							{
								path: 'birthdays',
								component: ClientCardBirthdaysComponent,
							},
							{ path: '**', redirectTo: 'basic' },
						],
					},
				],
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
				component: ClientProposalsPageComponent,
				children: [
					{
						path: ':clientId',
						component: ClientProposalsInfoComponent,
						data: {
							animation: 'animation',
						},
						children: [
							{
								path: 'business-trips',
								component:
									ClientProposalsBusinessTripsTabComponent,
							},
							{
								path: 'development',
								component:
									ClientProposalsDevelopmentTabComponent,
							},
							{
								path: 'news-line',
								component: ClientProposalsNewsLineTabComponent,
							},
							{
								path: 'trade-list',
								component: ClientProposalsTradeListTabComponent,
							},
							{
								path: 'samples',
								component: ClientProposalsSamplesTabComponent,
							},
							{
								path: 'contractors',
								component:
									ClientProposalsContractorsTabComponent,
							},
							{ path: '**', redirectTo: 'contractors' },
						],
					},
				],
			},
		],
	},
	{
		path: '',
		component: FrontLibraryLayoutComponent,
		canActivate: [AuthGuard, operationPlanPermissionGuard],
		data: {
			animation: 'animation',
		},
		children: [
			{
				path: 'production-plan',
				component: ProductionPlanComponent,
				children: [
					{
						path: 'operational-plan',
						component: OperationalPlanComponent,
					},
					{ path: '**', redirectTo: 'operational-plan' },
				],
			},
			{
				path: 'mp-reservation-orders',
				canActivate: [AuthGuard],
				children: [
					{
						path: '',
						component: MPReservationOrdersComponent,
						data: {
							animation: 'animation',
						},
					},
					{
						path: ':id',
						component: MpReservationOrderCardComponent,
						data: {
							animation: 'animation',
						},
					},
				],
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
