import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SandboxRoutingModule } from '@app/pages/sandbox/sandbox-routing.module';
import { SandboxComponent } from '@app/pages/sandbox/sandbox.component';

@NgModule({
	declarations: [SandboxComponent],
	exports: [SandboxComponent],
	imports: [SandboxRoutingModule, CommonModule, RouterLink],
})
export class SandboxModule {}
