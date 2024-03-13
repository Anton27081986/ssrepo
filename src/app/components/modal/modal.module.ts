import { NgModule } from '@angular/core';
import { ModalComponent } from '@app/components/modal/modal.component';
import { ResultItemComponent } from '@app/shared/components/search/result-item/result-item.component';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { JsonPipe, NgClass } from '@angular/common';

@NgModule({
	declarations: [ModalComponent, ResultItemComponent],
	exports: [ModalComponent, ResultItemComponent],
	imports: [NzIconModule, NgClass, JsonPipe],
})
export class ModalModule {}
