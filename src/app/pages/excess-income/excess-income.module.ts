import { NgModule } from '@angular/core';
import { ExcessIncomePageComponent } from '@app/pages/excess-income/excess-income-page/excess-income-page.component';
import { ExcessIncomeRoutingModule } from '@app/pages/excess-income/excess-income.routing.module';
import { CommonModule } from '@angular/common';
import { TextModule } from '@app/shared/components/typography/text/text.module';

@NgModule({
	declarations: [ExcessIncomePageComponent],
	imports: [ExcessIncomeRoutingModule, CommonModule, TextModule],
})
export class ExcessIncomeModule {}
