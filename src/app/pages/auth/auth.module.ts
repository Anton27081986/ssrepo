import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SignInComponent } from '@auth/sign-in/sign-in.component';
import { ForgotPasswordComponent } from '@auth/forgot-password/forgot-password.component';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { ResetPasswordComponent } from '@auth/reset-password/reset-password.component';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { CardModule } from '@app/shared/components/card/card.module';
import { HeadlineModule } from '@app/shared/components/typography/headline/headline.module';
import { IconModule } from '@app/shared/components/icon/icon.module';
import { ButtonModule } from '@app/shared/components/buttons/button/button-module';
import { InputModule } from '@app/shared/components/inputs/input/input.module';
import { PasswordModule } from '@app/shared/components/_deprecated/password/password.module';
import { LinkModule } from '@app/shared/components/link/link.module';
import { AuthComponent } from '@auth/auth.component';
import { AuthRoutingModule } from './auth-routing.module';
import {TextModule} from "@app/shared/components/typography/text/text.module";
import {CaptionModule} from "@app/shared/components/typography/caption/caption.module";

@NgModule({
	declarations: [AuthComponent, SignInComponent, ForgotPasswordComponent, ResetPasswordComponent],
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
		NzToolTipModule,
		CardModule,
		HeadlineModule,
		IconModule,
		ButtonModule,
		InputModule,
		PasswordModule,
		LinkModule,
		CardModule,
		IconModule,
		TextModule,
		CaptionModule,
	],
})
export class AuthModule {}
