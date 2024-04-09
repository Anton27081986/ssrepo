import { NgModule } from '@angular/core';
import { ModalComponent } from '@app/components/modal/modal.component';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { JsonPipe, NgClass } from '@angular/common';

@NgModule({
	declarations: [ModalComponent],
	exports: [ModalComponent],
	imports: [NzIconModule, NgClass, JsonPipe],
})
export class ModalModule {}
