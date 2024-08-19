import { NgModule } from '@angular/core';
import { ContractInfoComponent } from '@app/pages/raw-material-accounting/modals/contract-info/contract-info.component';
import { CardModule } from '@app/shared/components/card/card.module';
import { NgIf } from '@angular/common';
import { HeadlineModule } from '@app/shared/components/typography/headline/headline.module';
import { IconModule } from '@app/shared/components/icon/icon.module';
import { TextModule } from '@app/shared/components/typography/text/text.module';
import { ButtonModule } from '@app/shared/components/buttons/button/button-module';
import { InputModule } from '@app/shared/components/inputs/input/input.module';
import { DateRangeModule } from '@app/shared/components/inputs/date-range/date-range.module';
import { ReactiveFormsModule } from '@angular/forms';
import { DatepickerInputModule } from '@app/shared/components/inputs/datepicker-input/datepicker-input.module';
import {MatDatepickerModule} from "@angular/material/datepicker";

@NgModule({
	declarations: [ContractInfoComponent],
	exports: [ContractInfoComponent],
	imports: [
		CardModule,
		NgIf,
		HeadlineModule,
		IconModule,
		TextModule,
		ButtonModule,
		InputModule,
		DatepickerInputModule,
		DateRangeModule,
		ReactiveFormsModule,
		MatDatepickerModule
	],
})
export class ContractInfoModule {}
