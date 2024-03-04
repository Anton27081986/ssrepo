import { NgModule } from '@angular/core';
import { CardComponent } from '@app/shared/components/card/card.component';

@NgModule({
	declarations: [CardComponent],
	exports: [CardComponent],
})
export class CardModule {}
