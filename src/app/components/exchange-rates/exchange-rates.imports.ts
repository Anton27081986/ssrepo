import { CommonModule, DatePipe } from '@angular/common';
import { HeadlineModule } from '@app/shared/components/typography/headline/headline.module';
import { TextModule } from '@app/shared/components/typography/text/text.module';
import { CardModule } from '@app/shared/components/card/card.module';
import { SsDividerModule } from '@app/shared/components/ss-divider/ss-divider.module';

export const ExchangeRatesImports = [
	CommonModule,
	DatePipe,
	HeadlineModule,
	TextModule,
	CardModule,
	SsDividerModule,
];
