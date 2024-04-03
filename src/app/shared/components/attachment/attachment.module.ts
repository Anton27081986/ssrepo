import { NgModule } from '@angular/core';
import { AttachmentComponent } from '@app/shared/components/attachment/attachment.component';
import { CaptionModule } from '@app/shared/components/typography/caption/caption.module';
import { IconModule } from '@app/shared/components/icon/icon.module';
import { NgIf } from '@angular/common';
import { PipesModule } from '@app/core/pipes/pipes.module';

@NgModule({
	declarations: [AttachmentComponent],
	exports: [AttachmentComponent],
	imports: [CaptionModule, IconModule, NgIf, PipesModule],
})
export class AttachmentModule {}
