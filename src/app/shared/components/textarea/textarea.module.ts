import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TextareaComponent } from '@app/shared/components/textarea/textarea.component';
import { CaptionModule } from '@app/shared/components/typography/caption/caption.module';
import { IconModule } from '@app/shared/components/icon/icon.module';

@NgModule({
	declarations: [TextareaComponent],
	imports: [CommonModule, CaptionModule, IconModule],
	exports: [TextareaComponent],
})
export class TextareaModule {}
