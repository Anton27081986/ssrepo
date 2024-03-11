import { NgModule } from '@angular/core';
import { TransportComponent } from '@app/components/transport/transport.component';
import { ButtonModule } from '@app/shared/components/buttons/button/button-module';
import { CommonModule, DatePipe } from '@angular/common';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { HeadlineModule } from '@app/shared/components/typography/headline/headline.module';
import { TagModule } from '@app/shared/components/tag/tag.module';
import { NoticeModule } from '@app/components/notice/notice.module';
import { TextModule } from '@app/shared/components/typography/text/text.module';
import { ModalModule } from '@app/components/modal/modal.module';

@NgModule({
	declarations: [TransportComponent],
	imports: [
		CommonModule,
		ButtonModule,
		NzIconModule,
		DatePipe,
		HeadlineModule,
		TagModule,
		NoticeModule,
		TextModule,
		ModalModule,
	],
	exports: [TransportComponent],
})
export class TransportModule {}
