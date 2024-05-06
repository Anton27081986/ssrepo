import { NgModule } from '@angular/core';
import { SelectComponent } from '@app/shared/components/select/select.component';
import {CaptionModule} from "@app/shared/components/typography/caption/caption.module";
import {NgIf} from "@angular/common";

@NgModule({
    declarations: [SelectComponent],
    exports: [SelectComponent],
	imports: [
		CaptionModule,
		NgIf
	]
})
export class SelectModule {}
