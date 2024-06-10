import { NgModule } from '@angular/core';
import { FiltersComponent } from '@app/shared/components/filters/filters.component';
import { ButtonModule } from '@app/shared/components/buttons/button/button-module';
import { CaptionModule } from '@app/shared/components/typography/caption/caption.module';
import { CardModule } from '@app/shared/components/card/card.module';
import { HeadlineModule } from '@app/shared/components/typography/headline/headline.module';
import { IconModule } from '@app/shared/components/icon/icon.module';
import { NgForOf, NgIf } from '@angular/common';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { ReactiveFormsModule } from '@angular/forms';
import { InputModule } from '@app/shared/components/inputs/input/input.module';
import { TextModule } from '@app/shared/components/typography/text/text.module';
import { DatepickerInputModule } from '@app/shared/components/inputs/datepicker-input/datepicker-input.module';
import { SelectModule } from '@app/shared/components/select/select.module';
import { SearchInputModule } from '@app/shared/components/inputs/search-input/search-input.module';
import { ToggleModule } from '@app/shared/components/toggle/toggle.module';
import { MultiselectModule } from '@app/shared/components/multiselect/multiselect.module';
import { NumericInputModule } from "@app/shared/components/inputs/numeric-input/numeric-input.module";
import {DateRangeModule} from "@app/shared/components/inputs/date-range/date-range.module";
import {ChipsSearchModule} from "@app/shared/components/inputs/chips-search/chips-search.module";

@NgModule({
	declarations: [FiltersComponent],
	exports: [FiltersComponent],
    imports: [
        ButtonModule,
        CaptionModule,
        CardModule,
        HeadlineModule,
        IconModule,
        NgIf,
        NzFormModule,
        NzGridModule,
        ReactiveFormsModule,
        NgForOf,
        InputModule,
        TextModule,
        DatepickerInputModule,
        SelectModule,
        SearchInputModule,
        ToggleModule,
        MultiselectModule,
        NumericInputModule,
        DateRangeModule,
        ChipsSearchModule
    ]
})
export class FiltersModule {}
