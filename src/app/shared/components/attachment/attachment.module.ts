import { NgModule } from '@angular/core';
import { AttachmentComponent } from '@app/shared/components/attachment/attachment.component';
import { CaptionModule } from '@app/shared/components/typography/caption/caption.module';
import { IconModule } from '@app/shared/components/icon/icon.module';
import { FileSizePipe } from '@app/shared/components/attachment/size.pipe';
import {NgIf} from "@angular/common";

@NgModule({
	declarations: [AttachmentComponent, FileSizePipe],
	exports: [AttachmentComponent],
    imports: [CaptionModule, IconModule, NgIf],
})
export class AttachmentModule {}
