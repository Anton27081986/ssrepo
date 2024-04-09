import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IconModule } from '@app/shared/components/icon/icon.module';
import { HeadlineModule } from '@app/shared/components/typography/headline/headline.module';
import { InputModule } from '@app/shared/components/inputs/input/input.module';
import { PasswordModule } from '@app/shared/components/inputs/password/password.module';
import { LinkModule } from '@app/shared/components/link/link.module';
import { ButtonModule } from '@app/shared/components/buttons/button/button-module';
import { CardModule } from '../../../shared/components/card/card.module';
import { FrendlyAccountsRoutingModule } from './frendly-accounts-routing.module';

@NgModule({
	declarations: [],
	imports: [
		CommonModule,
		FrendlyAccountsRoutingModule,
		CardModule,
		IconModule,
		HeadlineModule,
		InputModule,
		PasswordModule,
		LinkModule,
		ButtonModule,
	],
})
export class FrendlyAccountsModule {}
