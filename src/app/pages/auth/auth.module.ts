import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {AuthRoutingModule} from './auth-routing.module';
import {SignInComponent} from '@auth/sign-in/sign-in.component';
import {ForgotPasswordComponent} from '@auth/forgot-password/forgot-password.component';
import {NzCardModule} from 'ng-zorro-antd/card';
import {NzFormModule} from 'ng-zorro-antd/form';
import {NzInputModule} from 'ng-zorro-antd/input';
import {NzButtonModule} from 'ng-zorro-antd/button';

@NgModule({
    declarations: [SignInComponent, ForgotPasswordComponent],
    imports: [
        CommonModule,
        FormsModule,
        AuthRoutingModule,
        NzCardModule,
        NzFormModule,
        NzInputModule,
        ReactiveFormsModule,
        NzButtonModule,
    ],
})
export class AuthModule {}
