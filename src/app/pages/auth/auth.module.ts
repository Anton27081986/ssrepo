import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SignInComponent} from '@auth/sign-in/sign-in.component';
import {ForgotPasswordComponent} from '@auth/forgot-password/forgot-password.component';
import {NzCardModule} from 'ng-zorro-antd/card';
import {NzFormModule} from 'ng-zorro-antd/form';
import {NzInputModule} from 'ng-zorro-antd/input';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {NzIconModule} from 'ng-zorro-antd/icon';
import {ResetPasswordComponent} from '@auth/reset-password/reset-password.component';
import {NzToolTipModule} from 'ng-zorro-antd/tooltip';
import {AuthRoutingModule} from './auth-routing.module';

@NgModule({
    declarations: [SignInComponent, ForgotPasswordComponent, ResetPasswordComponent],
    imports: [
        CommonModule,
        FormsModule,
        AuthRoutingModule,
        NzCardModule,
        NzFormModule,
        NzInputModule,
        ReactiveFormsModule,
        NzButtonModule,
        NzIconModule,
        NzToolTipModule
    ],
})
export class AuthModule {}
