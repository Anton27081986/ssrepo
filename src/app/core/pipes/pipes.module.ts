import { CommonModule } from '@angular/common';
import { FileSizePipe } from '@app/core/pipes/size.pipe';
import { NgModule } from '@angular/core';
import { NumWithSpacesPipe } from '@app/core/pipes/num-with-spaces.pipe';

@NgModule({
	imports: [CommonModule],
	providers: [FileSizePipe],
	declarations: [FileSizePipe, NumWithSpacesPipe],
	exports: [FileSizePipe, NumWithSpacesPipe],
})
export class PipesModule {}
