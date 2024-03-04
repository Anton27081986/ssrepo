import { NgModule } from '@angular/core';
import { ButtonModule } from '@app/shared/components/buttons/button/button-module';
import { CommonModule, DatePipe } from '@angular/common';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { HeadlineModule } from '@app/shared/components/typography/headline/headline.module';
import { TextModule } from '@app/shared/components/typography/text/text.module';
import { ModalModule } from '@app/components/modal/modal.module';
import { ExchangeRatesComponent } from '@app/components/exchange-rates/exchange-rates.component';
import {CardModule} from "@app/shared/components/card/card.module";

@NgModule({
	declarations: [ExchangeRatesComponent],
	imports: [
		CommonModule,
		ButtonModule,
		NzIconModule,
		DatePipe,
		HeadlineModule,
		TextModule,
		ModalModule,
		CardModule,
	],
	exports: [ExchangeRatesComponent],
})
export class ExchangeRatesModule {}
