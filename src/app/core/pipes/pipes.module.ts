import { CommonModule } from '@angular/common';
import { FileSizePipe } from '@app/core/pipes/size.pipe';
import { NgModule } from '@angular/core';

@NgModule({
	imports: [CommonModule],
	providers: [FileSizePipe],
	declarations: [FileSizePipe],
	exports: [FileSizePipe],
})
export class PipesModule {}
