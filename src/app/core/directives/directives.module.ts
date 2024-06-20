import { LoaderDirective } from '@app/core/directives/loader.directive';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

const DIRECTIVES = [LoaderDirective];

@NgModule({
	imports: [CommonModule],
	providers: DIRECTIVES,
	declarations: DIRECTIVES,
	exports: DIRECTIVES,
})
export class DirectivesModule {}
