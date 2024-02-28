import { NgModule } from '@angular/core';
import { TransportComponent } from '@app/components/transport/transport.component';
import { ButtonModule } from '@app/shared/components/buttons/button/button-module';
import { NoticeComponent } from '@app/components/notice/notice.component';
import { CommonModule, DatePipe } from '@angular/common';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { TitleMainModule } from '@app/shared/components/typography/title/main/title-main.module';
import { TagModule } from '@app/shared/components/tag/tag.module';

@NgModule({
	declarations: [TransportComponent, NoticeComponent],
	imports: [CommonModule, ButtonModule, NzIconModule, DatePipe, TitleMainModule, TagModule],
	exports: [TransportComponent, NoticeComponent],
})
export class TransportModule {}
