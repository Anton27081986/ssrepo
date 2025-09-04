import { AsyncPipe, DatePipe } from '@angular/common';
import { CardComponent } from '@app/shared/components/card/card.component';
import { TextComponent } from '@app/shared/components/typography/text/text.component';
import { SsDividerComponent } from '@app/shared/components/ss-divider/ss-divider.component';
import { HeadlineComponent } from '@app/shared/components/typography/headline/headline.component';

export const ExchangeRatesImports = [
	DatePipe,
	CardComponent,
	TextComponent,
	SsDividerComponent,
	HeadlineComponent,
	AsyncPipe,
];
