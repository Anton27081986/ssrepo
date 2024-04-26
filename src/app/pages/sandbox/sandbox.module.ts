import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SandboxRoutingModule } from '@app/pages/sandbox/sandbox-routing.module';

@NgModule({
	declarations: [],
	imports: [SandboxRoutingModule, CommonModule, RouterLink],
})
export class SandboxModule {}
