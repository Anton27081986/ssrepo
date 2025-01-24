import { NgModule } from '@angular/core';
import { ExcessIncomePageComponent } from '@app/pages/excess-income/excess-income-page/excess-income-page.component';
import { ExcessIncomeRoutingModule } from '@app/pages/excess-income/excess-income.routing.module';
import { ExcessIncomeClientTrComponent } from '@app/pages/excess-income/excess-income-tr/excess-income-client-tr/excess-income-client-tr.component';
import { ExcessIncomeContractorTrComponent } from '@app/pages/excess-income/excess-income-tr/excess-income-contractor-tr/excess-income-contractor-tr.component';
import { ExcessIncomeTovTrComponent } from '@app/pages/excess-income/excess-income-tr/excess-income-tov-tr/excess-income-tov-tr.component';
import { ExcessIncomeGroupTrComponent } from '@app/pages/excess-income/excess-income-tr/excess-income-group-tr/excess-income-group-tr.component';
import { ExcessIncomeUpdateSndClientPopoverComponent } from '@app/pages/excess-income/excess-income-update-snd-client-popover/excess-income-update-snd-client-popover.component';
import { ExcessIncomeUpdateTovGroupTrComponent } from '@app/pages/excess-income/excess-income-update-snd-client-popover/excess-income-update-tov-group-tr/excess-income-update-tov-group-tr.component';
import { ExcessIncomeEditCommentPopoverComponent } from '@app/pages/excess-income/excess-income-edit-comment-card/excess-income-edit-comment-popover.component';

@NgModule({
	declarations: [
	],
	imports: [
		ExcessIncomePageComponent,
		ExcessIncomeClientTrComponent,
		ExcessIncomeContractorTrComponent,
		ExcessIncomeTovTrComponent,
		ExcessIncomeGroupTrComponent,
		ExcessIncomeUpdateSndClientPopoverComponent,
		ExcessIncomeUpdateTovGroupTrComponent,
		ExcessIncomeEditCommentPopoverComponent,
		ExcessIncomeRoutingModule,
	],
})
export class ExcessIncomeModule {}
