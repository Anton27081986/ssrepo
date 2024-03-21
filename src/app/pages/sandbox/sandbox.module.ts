import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SandboxComponent } from '@app/pages/sandbox/sandbox.component';
import { SandboxRoutingModule } from '@app/pages/sandbox/sandbox-routing.module';
import { MailModule } from '@app/components/mail/mail.module';
import { CardModule } from '@app/shared/components/card/card.module';
import { AvatarModule } from '@app/shared/components/avatar/avatar.module';

@NgModule({
	declarations: [SandboxComponent],
	imports: [SandboxRoutingModule, CommonModule, RouterLink, MailModule, CardModule, AvatarModule],
})
export class SandboxModule {}
