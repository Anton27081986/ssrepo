import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppRoutes } from '@app/common/routes';
import { AuthComponent } from '@auth/auth.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

const routes: Routes = [
	{
		path: '',
		component: AuthComponent,
		children: [
			{ path: AppRoutes.signIn, component: SignInComponent, pathMatch: 'full' },
			{
				path: AppRoutes.forgotPassword,
				component: ForgotPasswordComponent,
				pathMatch: 'full',
			},
			{ path: AppRoutes.resetPassword, component: ResetPasswordComponent, pathMatch: 'full' },
			{ path: '**', redirectTo: AppRoutes.signIn },
		],
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class AuthRoutingModule {}
