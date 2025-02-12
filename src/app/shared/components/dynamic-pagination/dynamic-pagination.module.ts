import { NgModule } from '@angular/core';
import { DynamicPaginationComponent } from '@app/shared/components/dynamic-pagination/dynamic-pagination.component';
import { TextModule } from '@app/shared/components/typography/text/text.module';
import { NgIf } from '@angular/common';

@NgModule({
	declarations: [DynamicPaginationComponent],
	exports: [DynamicPaginationComponent],
	imports: [TextModule, NgIf],
})
export class DynamicPaginationModule {}
