import { NgModule } from '@angular/core';
import { CaptionModule } from '@app/shared/components/typography/caption/caption.module';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { InputModule } from '@app/shared/components/inputs/input/input.module';
import { TextModule } from '@app/shared/components/typography/text/text.module';
import { IconModule } from '@app/shared/components/icon/icon.module';
import { MultiselectComponent } from '@app/shared/components/multiselect/multiselect.component';

@NgModule({
	declarations: [MultiselectComponent],
	exports: [MultiselectComponent],
	imports: [CaptionModule, NgIf, InputModule, TextModule, NgForOf, IconModule, NgClass],
})
export class MultiselectModule {}
