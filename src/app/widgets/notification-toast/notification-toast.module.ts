import { NgModule } from '@angular/core';
import { NotificationToastComponent } from '@app/widgets/notification-toast/notification-toast.component';
import { AsyncPipe, NgClass, NgForOf, NgIf } from '@angular/common';
import { NoticeModule } from '@app/components/notice/notice.module';

@NgModule({
	declarations: [NotificationToastComponent],
	exports: [NotificationToastComponent],
	imports: [AsyncPipe, NgForOf, NgIf, NgClass, NoticeModule],
})
export class NotificationToastModule {}
