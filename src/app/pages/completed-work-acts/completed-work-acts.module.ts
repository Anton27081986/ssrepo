import { NgModule } from '@angular/core';
import { CompletedWorkActsComponent } from '@app/pages/completed-work-acts/completed-work-acts.component';
import { HeadlineModule } from '@app/shared/components/typography/headline/headline.module';
import { CompletedWorkActsRoutingModule } from '@app/pages/completed-work-acts/completed-work-acts-routing.module';
import { DropdownButtonModule } from '@app/shared/components/buttons/dropdown-button/dropdown-button.module';
import { EmptyDataPageModule } from '@app/shared/components/empty-data-page/empty-data-page.module';
import {
	AsyncPipe,
	DatePipe,
	NgForOf,
	NgIf,
	NgSwitch,
	NgSwitchCase,
	NgSwitchDefault,
} from '@angular/common';
import { TableModule } from '@app/shared/components/table/table.module';
import { FiltersModule } from '@app/shared/components/filters/filters.module';
import { LoaderModule } from '@app/shared/components/loader/loader.module';
import { CompletedWorkActCardComponent } from '@app/pages/completed-work-acts/completed-work-act-card/completed-work-act-card.component';
import { CompletedWorkActInfoComponent } from '@app/pages/completed-work-acts/completed-work-act-card/completed-work-act-info/completed-work-act-info.component';
import { CompletedWorkActSpecificationsComponent } from '@app/pages/completed-work-acts/completed-work-act-card/completed-work-act-specifications/completed-work-act-specifications.component';
import { ButtonModule } from '@app/shared/components/buttons/button/button-module';
import { TextModule } from '@app/shared/components/typography/text/text.module';
import { TagModule } from '@app/shared/components/tag/tag.module';
import { TagV2Module } from '@app/shared/components/tag-v2/tag-v2.module';
import { CardModule } from '@app/shared/components/card/card.module';
import { IconModule } from '@app/shared/components/icon/icon.module';
import { AttachmentModule } from '@app/shared/components/attachment/attachment.module';
import { CaptionModule } from '@app/shared/components/typography/caption/caption.module';
import { PipesModule } from '@app/core/pipes/pipes.module';
import { TableV2Module } from '@app/shared/components/ss-table-v2/ss-table-v2.module';
import { SpecificationRowItemTrComponent } from '@app/pages/completed-work-acts/completed-work-act-card/completed-work-act-specifications/specification-row-item-tr/specification-row-item-tr.component';
import { SpecificationModalComponent } from '@app/pages/completed-work-acts/completed-work-act-card/completed-work-act-specifications/add-specification-modal/specification-modal.component';
import { SelectModule } from '@app/shared/components/select/select.module';
import { TextareaModule } from '@app/shared/components/textarea/textarea.module';
import { InputModule } from '@app/shared/components/inputs/input/input.module';
import { SearchInputModule } from '@app/shared/components/inputs/search-input/search-input.module';
import { ReactiveFormsModule } from '@angular/forms';
import { NumericInputModule } from '@app/shared/components/_deprecated/numeric-input/numeric-input.module';
import { CompletedWorkActEditComponent } from '@app/pages/completed-work-acts/completed-work-act-card/completed-work-act-edit/completed-work-act-edit.component';
import { DatepickerInputModule } from '@app/shared/components/inputs/datepicker-input/datepicker-input.module';
import { MultiselectModule } from '@app/shared/components/multiselect/multiselect.module';
import { ChipsSearchModule } from '@app/shared/components/inputs/chips-search/chips-search.module';
import { ComponentsModule } from '@app/components/components.module';
import { LinkModule } from '@app/shared/components/link/link.module';
import { DateTimePickerComponent } from '@app/shared/components/inputs/date-time-picker/date-time-picker.component';
import { SelectV2Component } from '@app/shared/components/inputs/select-v2/select-v2.component';
import { MapperPipe } from '@app/core/pipes/mapper.pipe';
import {MultiselectV2Module} from "@app/shared/components/multiselect-v2/multiselect-v2.module";
import {ButtonComponent} from "@front-components/components";
import {TooltipModule} from "@app/shared/components/tooltip/tooltip.module";

@NgModule({
	declarations: [
		CompletedWorkActsComponent,
		CompletedWorkActCardComponent,
		CompletedWorkActInfoComponent,
		CompletedWorkActSpecificationsComponent,
		SpecificationRowItemTrComponent,
		SpecificationModalComponent,
		CompletedWorkActEditComponent,
	],
	exports: [
		CompletedWorkActsComponent,
		CompletedWorkActCardComponent,
		CompletedWorkActInfoComponent,
		CompletedWorkActSpecificationsComponent,
		SpecificationRowItemTrComponent,
		SpecificationModalComponent,
		CompletedWorkActEditComponent,
	],
	imports: [
		CompletedWorkActsRoutingModule,
		HeadlineModule,
		DropdownButtonModule,
		EmptyDataPageModule,
		NgIf,
		TableModule,
		FiltersModule,
		LoaderModule,
		ButtonModule,
		TextModule,
		TagModule,
		TagV2Module,
		CardModule,
		IconModule,
		AsyncPipe,
		AttachmentModule,
		NgForOf,
		CaptionModule,
		PipesModule,
		TableV2Module,
		NgSwitch,
		NgSwitchCase,
		NgSwitchDefault,
		DatePipe,
		SelectModule,
		TextareaModule,
		InputModule,
		SearchInputModule,
		ReactiveFormsModule,
		NumericInputModule,
		DatepickerInputModule,
		MultiselectModule,
		ChipsSearchModule,
		ComponentsModule,
		LinkModule,
		SelectV2Component,
		DateTimePickerComponent,
		MapperPipe,
		MultiselectV2Module,
		ButtonComponent,
		TooltipModule,
	],
})
export class CompletedWorkActsModule {}
