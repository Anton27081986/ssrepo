import { NgModule } from '@angular/core';
import { ToggleComponent } from '@app/shared/components/toggle/toggle.component';
import {NgClass} from "@angular/common";
import {CaptionModule} from "@app/shared/components/typography/caption/caption.module";

@NgModule({
	declarations: [ToggleComponent],
	exports: [ToggleComponent],
	imports: [
		NgClass,
		CaptionModule
	]
})
export class ToggleModule {}
