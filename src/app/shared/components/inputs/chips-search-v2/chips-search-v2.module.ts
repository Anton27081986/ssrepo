import { NgModule } from '@angular/core';
import { CaptionModule } from '@app/shared/components/typography/caption/caption.module';
import { IconModule } from '@app/shared/components/icon/icon.module';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { AvatarModule } from '@app/shared/components/avatar/avatar.module';
import { TextModule } from '@app/shared/components/typography/text/text.module';
import { ChipsSearchV2Component } from '@app/shared/components/inputs/chips-search-v2/chips-search-v2.component';

@NgModule({
	declarations: [ChipsSearchV2Component],
	exports: [ChipsSearchV2Component],
	imports: [CaptionModule, IconModule, NgIf, AvatarModule, TextModule, NgForOf, NgClass],
})
export class ChipsSearchV2Module {}
