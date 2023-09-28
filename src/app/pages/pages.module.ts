import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ForgotPasswordComponent} from './auth/forgot-password/forgot-password.component';
import {ResetPasswordComponent} from './auth/reset-password/reset-password.component';
import {SignInComponent} from './auth/sign-in/sign-in.component';
import {SignUpComponent} from './auth/sign-up/sign-up.component';

@NgModule({
    declarations: [
        ForgotPasswordComponent,
        ResetPasswordComponent,
        SignInComponent,
        SignUpComponent,
    ],
    imports: [CommonModule],
})
export class PagesModule {}
