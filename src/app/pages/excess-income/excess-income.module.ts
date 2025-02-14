import { NgModule } from '@angular/core';
import { ExcessIncomePageComponent } from '@app/pages/excess-income/excess-income-page/excess-income-page.component';
import { ExcessIncomeRoutingModule } from '@app/pages/excess-income/excess-income.routing.module';
import { CommonModule } from '@angular/common';
import { TableV2Module } from '@app/shared/components/ss-table-v2/ss-table-v2.module';
import { CardModule } from '@app/shared/components/card/card.module';
import { ExcessIncomeClientTrComponent } from '@app/pages/excess-income/excess-income-tr/excess-income-client-tr/excess-income-client-tr.component';
import { EmptyPlaceholderModule } from '@app/shared/components/empty-placeholder/empty-placeholder.module';
import { ComponentsModule } from '@app/components/components.module';
import { DropdownButtonModule } from '@app/shared/components/buttons/dropdown-button/dropdown-button.module';
import { FiltersModule } from '@app/shared/components/filters/filters.module';
import { ExcessIncomeContractorTrComponent } from '@app/pages/excess-income/excess-income-tr/excess-income-contractor-tr/excess-income-contractor-tr.component';
import { ExcessIncomeTovTrComponent } from '@app/pages/excess-income/excess-income-tr/excess-income-tov-tr/excess-income-tov-tr.component';
import { ExcessIncomeGroupTrComponent } from '@app/pages/excess-income/excess-income-tr/excess-income-group-tr/excess-income-group-tr.component';
import { ChipsSearchModule } from '@app/shared/components/inputs/chips-search/chips-search.module';
import { ChipsSearchV2Module } from '@app/shared/components/inputs/chips-search-v2/chips-search-v2.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ExcessIncomeUpdateSndClientPopoverComponent } from '@app/pages/excess-income/excess-income-update-snd-client-popover/excess-income-update-snd-client-popover.component';
import { SelectV2Component } from '@app/shared/components/inputs/select-v2/select-v2.component';
import { SearchInputModule } from '@app/shared/components/inputs/search-input/search-input.module';
import { SearchInputV2Component } from '@app/shared/components/inputs/search-input-v2/search-input-v2.component';
import { ExcessIncomeUpdateTovGroupTrComponent } from '@app/pages/excess-income/excess-income-update-snd-client-popover/excess-income-update-tov-group-tr/excess-income-update-tov-group-tr.component';
import { MaskitoDirective } from '@maskito/angular';
import { SsDividerModule } from '@app/shared/components/ss-divider/ss-divider.module';
import { TextareaModule } from '@app/shared/components/textarea/textarea.module';
import { PipesModule } from '@app/core/pipes/pipes.module';
import { NumberInputComponent } from '@app/shared/components/inputs/number-input/number-input.component';
import {
	ButtonComponent,
	CardComponent,
	ClickOutsideDirective,
	DividerComponent,
	DropdownButtonComponent,
	DropdownItemComponent,
	FieldCtrlDirective,
	FormFieldComponent,
	IconComponent,
	InputComponent,
	LabelComponent,
	LinkComponent,
	TextComponent,
	TooltipDirective,
} from '@front-components/components';
import { NoticeModule } from '@app/components/notice/notice.module';
import { LoaderModule } from '@app/shared/components/loader/loader.module';
import { NzTableCellDirective, NzThMeasureDirective } from 'ng-zorro-antd/table';
import { LoaderTrComponent } from '@app/shared/components/loader-tr/loader-tr.component';
import { PaginationTrComponent } from '@app/shared/components/pagination-tr/pagination-tr.component';
import { CaptionModule } from '@app/shared/components/typography/caption/caption.module';
import { TooltipMenuModule } from '@app/shared/components/tooltip-menu/tooltip-menu.module';
import { ExcessIncomeEditCommentPopoverComponent } from '@app/pages/excess-income/excess-income-edit-comment-card/excess-income-edit-comment-popover.component';
import { FormControlInputWithFuncEditModule } from '@app/shared/components/inputs/form-control-input-with-func-edit/form-control-input-with-func-edit.module';
import { TooltipModule } from '@app/shared/components/tooltip/tooltip.module';

@NgModule({
	declarations: [
		ExcessIncomePageComponent,
		ExcessIncomeClientTrComponent,
		ExcessIncomeContractorTrComponent,
		ExcessIncomeTovTrComponent,
		ExcessIncomeGroupTrComponent,
		ExcessIncomeUpdateSndClientPopoverComponent,
		ExcessIncomeUpdateTovGroupTrComponent,
		ExcessIncomeEditCommentPopoverComponent,
	],
	imports: [
		ExcessIncomeRoutingModule,
		CommonModule,
		TableV2Module,
		CardModule,
		EmptyPlaceholderModule,
		ComponentsModule,
		DropdownButtonModule,
		FiltersModule,
		ChipsSearchModule,
		ChipsSearchV2Module,
		ReactiveFormsModule,
		SelectV2Component,
		SearchInputModule,
		SearchInputV2Component,
		MaskitoDirective,
		SsDividerModule,
		TextareaModule,
		PipesModule,
		NumberInputComponent,
		ButtonComponent,
		TextComponent,
		NoticeModule,
		InputComponent,
		IconComponent,
		CardComponent,
		LoaderModule,
		NzTableCellDirective,
		NzThMeasureDirective,
		LoaderTrComponent,
		LinkComponent,
		TooltipDirective,
		PaginationTrComponent,
		ClickOutsideDirective,
		LabelComponent,
		CaptionModule,
		TooltipMenuModule,
		DividerComponent,
		FormControlInputWithFuncEditModule,
		FormFieldComponent,
		FieldCtrlDirective,
		DropdownButtonComponent,
		DropdownItemComponent,
		TooltipModule,
	],
})
export class ExcessIncomeModule {}
