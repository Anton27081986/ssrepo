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
import { CorrespondenceModule } from '@app/shared/components/correspondence/correspondence.module';
import { ClientCardContragentsComponent } from '@app/pages/client-card/client-card-basic/client-card-contragents/client-card-contragents.component';
import { TooltipModule } from '@app/shared/components/tooltip/tooltip.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableModule } from '@app/shared/components/table/table.module';
import { HistoryModule } from '@app/widgets/history/history.module';
import { SelectModule } from '@app/shared/components/select/select.module';
import { ButtonModule } from '@app/shared/components/buttons/button/button-module';
import { InputModule } from '@app/shared/components/inputs/input/input.module';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { SearchInputModule } from '@app/shared/components/inputs/search-input/search-input.module';
import { ClientCardRoutingModule } from './client-card-routing.module';
import { ClientCardComponent } from './client-card.component';

@NgModule({
	declarations: [
		ClientCardComponent,
		ClientCardManagersComponent,
		ClientCardBasicComponent,
		ClientCardInfoComponent,
		ClientCardContragentsComponent,
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
	],
})
export class ClientCardModule {}
