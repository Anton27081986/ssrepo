import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmptyPlaceholderComponent } from './empty-placeholder.component';

@NgModule({
	declarations: [EmptyPlaceholderComponent],
	exports: [EmptyPlaceholderComponent],
	imports: [CommonModule],
})
export class EmptyPlaceholderModule {}
