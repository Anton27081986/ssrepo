import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {WrapperComponent} from './shared/layouts/wrapper/wrapper.component';
import {MainComponent} from './shared/layouts/main/main.component';
import {AppRoutes} from './shared/constants/routes';
import {SignInComponent} from './pages/auth/sign-in/sign-in.component';
import {SignUpComponent} from './pages/auth/sign-up/sign-up.component';
import {ForgotPasswordComponent} from './pages/auth/forgot-password/forgot-password.component';
import {ResetPasswordComponent} from './pages/auth/reset-password/reset-password.component';

const routes: Routes = [
    {path: '', pathMatch: 'full', redirectTo: ''},
    {
        path: '',
        component: MainComponent,
        children: [
            {
                path: AppRoutes.signIn,
                component: SignInComponent,
            },
            {
                path: AppRoutes.signUp,
                component: SignUpComponent,
            },
            {
                path: AppRoutes.forgotPassword,
                component: ForgotPasswordComponent,
            },
            {
                path: AppRoutes.resetPassword,
                component: ResetPasswordComponent,
            },
            {
                path: AppRoutes.start,
                loadChildren: () => import('./pages/start/start.module').then(m => m.StartModule),
            },
            {
                path: '',
                component: WrapperComponent,
                children: [
                    {
                        path: 'partners',
                        loadChildren: () =>
                            import('./pages/partners/partners.module').then(m => m.PartnersModule),
                    },
                ],
            },
        ],
    },
    {path: '**', redirectTo: ''},
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
