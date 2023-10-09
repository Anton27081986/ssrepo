import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SignInComponent} from './sign-in/sign-in.component';
import {AppRoutes} from '../../shared/constants/routes';
import {SignUpComponent} from './sign-up/sign-up.component';
import {ForgotPasswordComponent} from './forgot-password/forgot-password.component';
import {ResetPasswordComponent} from './reset-password/reset-password.component';

const routes: Routes = [
    {path: '', pathMatch: 'full', redirectTo: AppRoutes.signIn},
    {path: AppRoutes.signIn, component: SignInComponent, pathMatch: 'full'},
    {path: AppRoutes.signUp, component: SignUpComponent, pathMatch: 'full'},
    {path: AppRoutes.forgotPassword, component: ForgotPasswordComponent, pathMatch: 'full'},
    {path: AppRoutes.resetPassword, component: ResetPasswordComponent, pathMatch: 'full'},
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AuthRoutingModule {}
