import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IconModule } from '@app/shared/components/icon/icon.module';
import { CaptionModule } from '@app/shared/components/typography/caption/caption.module';
import { PasswordComponent } from '@app/shared/components/inputs/password/password.component';

@NgModule({
	declarations: [PasswordComponent],
	imports: [CommonModule, FormsModule, ReactiveFormsModule, IconModule, CaptionModule],
	exports: [PasswordComponent],
})
export class PasswordModule {}
