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
import { IconModule } from '@app/shared/components/icon/icon.module';
import { ExcessIncomeContractorTrComponent } from '@app/pages/excess-income/excess-income-tr/excess-income-contractor-tr/excess-income-contractor-tr.component';
import { ExcessIncomeTovTrComponent } from '@app/pages/excess-income/excess-income-tr/excess-income-tov-tr/excess-income-tov-tr.component';
import { ExcessIncomeGroupTrComponent } from '@app/pages/excess-income/excess-income-tr/excess-income-group-tr/excess-income-group-tr.component';
import { ChipsSearchModule } from '@app/shared/components/inputs/chips-search/chips-search.module';
import { ChipsSearchV2Module } from '@app/shared/components/inputs/chips-search-v2/chips-search-v2.module';
import { ReactiveFormsModule } from '@angular/forms';
import { DynamicPaginationModule } from '@app/shared/components/dynamic-pagination/dynamic-pagination.module';
import { ButtonModule } from '@app/shared/components/buttons/button/button-module';
import { ExcessIncomeUpdateSndClientPopoverComponent } from '@app/pages/excess-income/excess-income-update-snd-client-popover/excess-income-update-snd-client-popover.component';
import { LoaderModule } from '@app/shared/components/loader/loader.module';
import { SelectV2Component } from '@app/shared/components/inputs/select-v2/select-v2.component';
import { SearchInputModule } from '@app/shared/components/inputs/search-input/search-input.module';
import { SearchInputV2Component } from '@app/shared/components/inputs/search-input-v2/search-input-v2.component';
import { ExcessIncomeUpdateTovGroupTrComponent } from '@app/pages/excess-income/excess-income-update-snd-client-popover/excess-income-update-tov-group-tr/excess-income-update-tov-group-tr.component';
import { InputV2Component } from '@app/shared/components/inputs/input-v2/input-v2.component';
import { MaskitoDirective } from '@maskito/angular';
import { SsDividerModule } from '@app/shared/components/ss-divider/ss-divider.module';
import { TextareaModule } from '@app/shared/components/textarea/textarea.module';
import { PipesModule } from '@app/core/pipes/pipes.module';
import { ExcessIncomeControlComponent } from '@app/pages/excess-income/excess-income-tr/excess-income-control/excess-income-control.component';
import { NumberInputComponent } from '@app/shared/components/inputs/number-input/number-input.component';

@NgModule({
	declarations: [
		ExcessIncomePageComponent,
		ExcessIncomeClientTrComponent,
		ExcessIncomeContractorTrComponent,
		ExcessIncomeTovTrComponent,
		ExcessIncomeGroupTrComponent,
		ExcessIncomeUpdateSndClientPopoverComponent,
		ExcessIncomeUpdateTovGroupTrComponent,
		ExcessIncomeControlComponent,
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
		IconModule,
		ChipsSearchModule,
		ChipsSearchV2Module,
		ReactiveFormsModule,
		DynamicPaginationModule,
		ButtonModule,
		LoaderModule,
		SelectV2Component,
		SearchInputModule,
		SearchInputV2Component,
		InputV2Component,
		MaskitoDirective,
		SsDividerModule,
		TextareaModule,
		PipesModule,
		NumberInputComponent,
	],
})
export class ExcessIncomeModule {}
