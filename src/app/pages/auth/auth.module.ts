import { NgModule } from '@angular/core';
import { SignInComponent } from '@auth/sign-in/sign-in.component';
import { ForgotPasswordComponent } from '@auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from '@auth/reset-password/reset-password.component';
import { AuthRoutingModule } from './auth-routing.module';
import {AuthComponent} from "@auth/auth.component";

@NgModule({
	declarations: [],
	imports: [
		AuthComponent,
		SignInComponent,
		ForgotPasswordComponent,
		ResetPasswordComponent,
		AuthRoutingModule,
	],
})
export class AuthModule {}
