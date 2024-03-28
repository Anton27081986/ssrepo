import { NgModule } from '@angular/core';
import { CardDropdownComponent } from '@app/shared/components/card-dropdown/card-dropdown.component';
import { CardModule } from '@app/shared/components/card/card.module';
import { IconModule } from '@app/shared/components/icon/icon.module';
import {NgClass, NgStyle} from '@angular/common';
import {HeadlineModule} from "@app/shared/components/typography/headline/headline.module";
import {ButtonModule} from "@app/shared/components/buttons/button/button-module";
import {TextModule} from "@app/shared/components/typography/text/text.module";

@NgModule({
	declarations: [CardDropdownComponent],
	exports: [CardDropdownComponent],
	imports: [CardModule, IconModule, NgClass, HeadlineModule, ButtonModule, NgStyle, TextModule],
})
export class CardDropdownModule {}
