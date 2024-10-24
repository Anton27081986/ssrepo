import { NgModule } from '@angular/core';
import { DateRangeComponent } from '@app/shared/components/inputs/date-range/date-range.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { IconModule } from '@app/shared/components/icon/icon.module';
import { TextModule } from '@app/shared/components/typography/text/text.module';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { DatePipe, NgClass, NgIf } from '@angular/common';
import { CaptionModule } from '@app/shared/components/typography/caption/caption.module';
import { FormsModule } from '@angular/forms';

@NgModule({
	declarations: [DateRangeComponent],
	exports: [DateRangeComponent],
    imports: [
        MatDatepickerModule,
        MatNativeDateModule,
        MatButtonModule,
        MatFormFieldModule,
        IconModule,
        TextModule,
        NgIf,
        CaptionModule,
        NgClass,
        FormsModule,
        DatePipe,
    ],
	providers: [{ provide: MAT_DATE_LOCALE, useValue: 'ru-RU' }],
})
export class DateRangeModule {}
