import { NgModule } from '@angular/core';
import { NoticeComponent } from '@app/components/notice/notice.component';
import { TextModule } from '@app/shared/components/typography/text/text.module';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NgIf } from '@angular/common';

@NgModule({
	declarations: [NoticeComponent],
	imports: [NzIconModule, TextModule, NgIf],
	exports: [NoticeComponent],
})
export class NoticeModule {}
