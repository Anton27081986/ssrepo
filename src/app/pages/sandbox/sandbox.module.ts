import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SandboxComponent } from '@app/pages/sandbox/sandbox.component';
import { SandboxRoutingModule } from '@app/pages/sandbox/sandbox-routing.module';
import { CorrespondenceModule } from '@app/shared/components/correspondence/correspondence.module';
import { TextModule } from '@app/shared/components/typography/text/text.module';

@NgModule({
	declarations: [SandboxComponent],
	imports: [SandboxRoutingModule, CommonModule, RouterLink, CorrespondenceModule, TextModule],
})
export class SandboxModule {}
