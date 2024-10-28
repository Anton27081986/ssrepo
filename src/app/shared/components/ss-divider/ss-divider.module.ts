import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TextModule } from '@app/shared/components/typography/text/text.module';
import { SsDividerComponent } from '@app/shared/components/ss-divider/ss-divider.component';

const components = [SsDividerComponent];

// Export only in shared
@NgModule({
	imports: [CommonModule, TextModule],
	declarations: [...components],
	providers: [],
	exports: [...components],
})
export class SsDividerModule {}
