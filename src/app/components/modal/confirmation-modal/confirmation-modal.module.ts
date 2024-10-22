import { NgModule } from '@angular/core';
import { HeadlineModule } from '@app/shared/components/typography/headline/headline.module';
import { TextModule } from '@app/shared/components/typography/text/text.module';
import { ButtonModule } from '@app/shared/components/buttons/button/button-module';
import { NgIf } from '@angular/common';
import { CardModule } from '@app/shared/components/card/card.module';
import { IconModule } from '@app/shared/components/icon/icon.module';
import { ConfirmationModalComponent } from '@app/components/modal/confirmation-modal/confirmation-modal.component';

@NgModule({
	declarations: [ConfirmationModalComponent],
	exports: [ConfirmationModalComponent],
	imports: [TextModule, ButtonModule, NgIf, CardModule, IconModule, HeadlineModule],
})
export class ConfirmationModalModule {}
