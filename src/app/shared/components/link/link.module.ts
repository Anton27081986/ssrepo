import { NgModule } from '@angular/core';
import { LinkComponent } from '@app/shared/components/link/link.component';
import { NgIf } from '@angular/common';
import { CaptionModule } from '@app/shared/components/typography/caption/caption.module';

@NgModule({
	declarations: [LinkComponent],
	exports: [LinkComponent],
	imports: [NgIf, CaptionModule],
})
export class LinkModule {}
