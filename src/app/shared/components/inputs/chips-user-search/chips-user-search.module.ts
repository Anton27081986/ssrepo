import { NgModule } from '@angular/core';
import { ChipsUserSearchComponent } from '@app/shared/components/inputs/chips-user-search/chips-user-search.component';
import {CaptionModule} from "@app/shared/components/typography/caption/caption.module";
import {IconModule} from "@app/shared/components/icon/icon.module";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {AvatarModule} from "@app/shared/components/avatar/avatar.module";
import {TextModule} from "@app/shared/components/typography/text/text.module";

@NgModule({
	declarations: [ChipsUserSearchComponent],
	exports: [ChipsUserSearchComponent],
	imports: [
		CaptionModule,
		IconModule,
		NgIf,
		AvatarModule,
		TextModule,
		NgForOf,
		NgClass
	]
})
export class ChipsUserSearchModule {}
