import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TextModule } from '@app/shared/components/typography/text/text.module';
import { IconModule } from '@app/shared/components/icon/icon.module';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { CaptionModule } from '@app/shared/components/typography/caption/caption.module';
import { FilePickerComponent } from './file-picker.component';

@NgModule({
	declarations: [FilePickerComponent],
	imports: [CommonModule, TextModule, IconModule, NzIconModule, CaptionModule],
	exports: [FilePickerComponent],
})
export class FilePickerModule {}
