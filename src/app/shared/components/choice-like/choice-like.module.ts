import { NgModule } from '@angular/core';
import { ChoiceLikeComponent } from '@app/shared/components/choice-like/choice-like.component';
import { IconModule } from '@app/shared/components/icon/icon.module';

@NgModule({
	declarations: [ChoiceLikeComponent],
	exports: [ChoiceLikeComponent],
	imports: [IconModule],
})
export class ChoiceLikeModule {}
