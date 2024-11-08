import { NgModule } from '@angular/core';
import { ExcessIncomePageComponent } from '@app/pages/excess-income/excess-income-page/excess-income-page.component';
import { ExcessIncomeRoutingModule } from '@app/pages/excess-income/excess-income.routing.module';
import { CommonModule } from '@angular/common';
import { TextModule } from '@app/shared/components/typography/text/text.module';
import { TableV2Module } from '@app/shared/components/ss-table-v2/ss-table-v2.module';
import { CardModule } from '@app/shared/components/card/card.module';
import { ExcessIncomeClientTrComponent } from '@app/pages/excess-income/excess-income-tr/excess-income-client-tr/excess-income-client-tr.component';
import { EmptyPlaceholderModule } from '@app/shared/components/empty-placeholder/empty-placeholder.module';
import { ComponentsModule } from '@app/components/components.module';
import { DropdownButtonModule } from '@app/shared/components/buttons/dropdown-button/dropdown-button.module';
import { FiltersModule } from '@app/shared/components/filters/filters.module';
import { SelectV2Module } from '@app/shared/components/inputs/select-v2/select-v2.module';
import { IconModule } from '@app/shared/components/icon/icon.module';
import { ExcessIncomeTableComponent } from '@app/pages/excess-income/excess-income-table/excess-income-table.component';
import { ExcessIncomeContractorTrComponent } from '@app/pages/excess-income/excess-income-tr/excess-income-contractor-tr/excess-income-contractor-tr.component';
import { ExcessIncomeTovTrComponent } from '@app/pages/excess-income/excess-income-tr/excess-income-tov-tr/excess-income-tov-tr.component';
import { ExcessIncomeGroupTrComponent } from '@app/pages/excess-income/excess-income-tr/excess-income-group-tr/excess-income-group-tr.component';
import { ChipsSearchModule } from '@app/shared/components/inputs/chips-search/chips-search.module';
import { ChipsSearchV2Module } from '@app/shared/components/inputs/chips-search-v2/chips-search-v2.module';
import { ReactiveFormsModule } from '@angular/forms';
import { DynamicPaginationModule } from '@app/shared/components/dynamic-pagination/dynamic-pagination.module';

@NgModule({
	declarations: [
		ExcessIncomePageComponent,
		ExcessIncomeClientTrComponent,
		ExcessIncomeContractorTrComponent,
		ExcessIncomeTovTrComponent,
		ExcessIncomeGroupTrComponent,
		ExcessIncomeTableComponent,
	],
	imports: [
		ExcessIncomeRoutingModule,
		CommonModule,
		TextModule,
		TableV2Module,
		CardModule,
		EmptyPlaceholderModule,
		ComponentsModule,
		DropdownButtonModule,
		FiltersModule,
		SelectV2Module,
		IconModule,
		ChipsSearchModule,
		ChipsSearchV2Module,
		ReactiveFormsModule,
		DynamicPaginationModule,
	],
})
export class ExcessIncomeModule {}
