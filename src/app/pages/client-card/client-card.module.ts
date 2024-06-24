import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HeadlineModule } from '@app/shared/components/typography/headline/headline.module';
import { IconModule } from '@app/shared/components/icon/icon.module';
import { TabsModule } from '@app/shared/components/tabs/tabs.module';
import { ClientCardManagersComponent } from '@app/pages/client-card/client-card-basic/client-card-managers/client-card-managers.component';
import { ClientCardBasicComponent } from '@app/pages/client-card/client-card-basic/client-card-basic.component';
import { CardModule } from '@app/shared/components/card/card.module';
import { AvatarModule } from '@app/shared/components/avatar/avatar.module';
import { CaptionModule } from '@app/shared/components/typography/caption/caption.module';
import { TextModule } from '@app/shared/components/typography/text/text.module';
import { ClientCardInfoComponent } from '@app/pages/client-card/client-card-basic/client-card-info/client-card-info.component';
import { TooltipMenuModule } from '@app/shared/components/tooltip-menu/tooltip-menu.module';
import { CorrespondenceModule } from '@app/widgets/correspondence/correspondence.module';
import { ClientCardContractorsComponent } from '@app/pages/client-card/client-card-basic/client-card-contractors/client-card-contractors.component';
import { TooltipModule } from '@app/shared/components/tooltip/tooltip.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableModule } from '@app/shared/components/table/table.module';
import { SelectModule } from '@app/shared/components/select/select.module';
import { ButtonModule } from '@app/shared/components/buttons/button/button-module';
import { InputModule } from '@app/shared/components/inputs/input/input.module';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { SearchInputModule } from '@app/shared/components/inputs/search-input/search-input.module';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { EmptyPlaceholderModule } from '@app/shared/components/empty-placeholder/empty-placeholder.module';
import { ComponentsModule } from '@app/components/components.module';
import { NzCardModule } from 'ng-zorro-antd/card';
import { ClientsListPageRoutingModule } from '@app/pages/clients-list-page/clients-list-page-routing.module';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { PasswordModule } from '@app/shared/components/inputs/password/password.module';
import { AutocompleteSelectFieldModule } from '@app/shared/components/autocomplete-select-field/autocomplete-select-field.module';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { LinkModule } from '@app/shared/components/link/link.module';
import { ClientSaleRequestsComponent } from '@app/pages/client-card/client-sale-requests/client-sale-requests.component';
import { TagModule } from '@app/shared/components/tag/tag.module';
import { HistoryModule } from '@app/widgets/history/history.module';
import { FiltersModule } from '@app/shared/components/filters/filters.module';
import { DatepickerInputModule } from '@app/shared/components/inputs/datepicker-input/datepicker-input.module';
import { TextareaModule } from '@app/shared/components/textarea/textarea.module';
import { ClientRequestSamplesComponent } from '@app/pages/client-card/client-request-samples/client-request-samples.component';
import { ClientCardReturnRequestsComponent } from '@app/pages/client-card/client-card-return-requests/client-card-return-requests.component';
import { ClientCardComponent } from './client-card.component';
import { ClientCardRoutingModule } from './client-card-routing.module';
import { ClientCardBirthdaysComponent } from './client-card-birthdays/client-card-birthdays.component';
import { ClientCardNewProductsComponent } from './client-card-new-products/client-card-new-products.component';
import { ClientCardLostProductsComponent } from './client-card-lost-products/client-card-lost-products.component';
import { ClientCardContractsComponent } from './client-card-contracts/client-card-contracts.component';
import { ReplacePipe } from '@app/shared/pipe/replace.pipe';
import {LoaderModule} from "@app/shared/components/loader/loader.module";

@NgModule({
	declarations: [
		ClientCardComponent,
		ClientCardManagersComponent,
		ClientCardBasicComponent,
		ClientCardInfoComponent,
		ClientCardContractorsComponent,
		ClientRequestSamplesComponent,
		ClientSaleRequestsComponent,
		ClientCardBirthdaysComponent,
		ClientCardNewProductsComponent,
		ClientCardReturnRequestsComponent,
		ClientCardLostProductsComponent,
		ClientCardContractsComponent,
		ReplacePipe,
	],
	imports: [
		CommonModule,
		ClientCardRoutingModule,
		HeadlineModule,
		IconModule,
		TabsModule,
		CardModule,
		AvatarModule,
		CaptionModule,
		TextModule,
		TooltipMenuModule,
		CorrespondenceModule,
		TooltipModule,
		FormsModule,
		ReactiveFormsModule,
		TableModule,
		HistoryModule,
		SelectModule,
		ButtonModule,
		InputModule,
		CKEditorModule,
		SearchInputModule,
		NzPaginationModule,
		EmptyPlaceholderModule,
		ComponentsModule,
		NzCardModule,
		CommonModule,
		ClientsListPageRoutingModule,
		ButtonModule,
		CaptionModule,
		CardModule,
		HeadlineModule,
		NzPaginationModule,
		TableModule,
		NzFormModule,
		ReactiveFormsModule,
		NzSelectModule,
		NzTypographyModule,
		InputModule,
		PasswordModule,
		NzCardModule,
		AutocompleteSelectFieldModule,
		NzRadioModule,
		FormsModule,
		LinkModule,
		IconModule,
		EmptyPlaceholderModule,
		TextModule,
		ComponentsModule,
		TagModule,
		AutocompleteSelectFieldModule,
		NzPaginationModule,
		DatepickerInputModule,
		FiltersModule,
		TextareaModule,
		LoaderModule,
	],
	exports: [ClientCardComponent],
})
export class ClientCardModule {}
