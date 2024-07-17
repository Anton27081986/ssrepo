import { NgModule } from '@angular/core';
import { DateRangeComponent } from '@app/shared/components/inputs/date-range/date-range.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { IconModule } from '@app/shared/components/icon/icon.module';
import { TextModule } from '@app/shared/components/typography/text/text.module';
import {MAT_DATE_LOCALE, MatNativeDateModule} from '@angular/material/core';
import {NgIf} from "@angular/common";
import {CaptionModule} from "@app/shared/components/typography/caption/caption.module";

@NgModule({
	declarations: [DateRangeComponent],
	exports: [DateRangeComponent],
	imports: [
		MatNativeDateModule,
		MatButtonModule,
		MatDatepickerModule,
		MatFormFieldModule,
		IconModule,
		TextModule,
		NgIf,
		CaptionModule,
	], providers: [{provide: MAT_DATE_LOCALE, useValue: 'ru-RU'}]
})
export class DateRangeModule {}
