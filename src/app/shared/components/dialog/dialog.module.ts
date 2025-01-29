import { NgModule } from '@angular/core';
import { DialogComponent } from '@app/shared/components/dialog/dialog.component';
import { CardModule } from '@app/shared/components/card/card.module';
import { HeadlineModule } from '@app/shared/components/typography/headline/headline.module';
import { TextModule } from '@app/shared/components/typography/text/text.module';
import { ButtonModule } from '@app/shared/components/buttons/button/button-module';
import { NgIf } from '@angular/common';

@NgModule({
	declarations: [DialogComponent],
	exports: [DialogComponent],
	imports: [CardModule, HeadlineModule, TextModule, ButtonModule, NgIf],
})
export class DialogModule {}
