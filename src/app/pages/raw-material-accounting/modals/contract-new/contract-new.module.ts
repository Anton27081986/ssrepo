import { NgModule } from '@angular/core';
import { CardModule } from '@app/shared/components/card/card.module';
import { NgIf } from '@angular/common';
import { HeadlineModule } from '@app/shared/components/typography/headline/headline.module';
import { IconModule } from '@app/shared/components/icon/icon.module';
import { TextModule } from '@app/shared/components/typography/text/text.module';
import { ButtonModule } from '@app/shared/components/buttons/button/button-module';
import { ContractNewComponent } from '@app/pages/raw-material-accounting/modals/contract-new/contract-new.component';
import { InputModule } from '@app/shared/components/inputs/input/input.module';
import { ReactiveFormsModule } from '@angular/forms';
import { SearchInputModule } from '@app/shared/components/inputs/search-input/search-input.module';
import { DateRangeModule } from '@app/shared/components/inputs/date-range/date-range.module';
import { TextareaModule } from '@app/shared/components/textarea/textarea.module';
import { DatepickerInputModule } from '@app/shared/components/inputs/datepicker-input/datepicker-input.module';
import { ConfirmationModalModule } from '@app/components/modal/confirmation-modal/confirmation-modal.module';

@NgModule({
	declarations: [ContractNewComponent],
	exports: [ContractNewComponent],
	imports: [
		CardModule,
		NgIf,
		HeadlineModule,
		IconModule,
		TextModule,
		ButtonModule,
		InputModule,
		ReactiveFormsModule,
		SearchInputModule,
		DateRangeModule,
		TextareaModule,
		DatepickerInputModule,
		ConfirmationModalModule,
	],
})
export class ContractNewModule {}
