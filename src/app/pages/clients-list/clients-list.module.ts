import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientsListRoutingModule } from './clients-list-routing.module';
import { ClientsListComponent } from './clients-list/clients-list.component';
import {ButtonModule} from "@app/shared/components/buttons/button/button-module";
import {CaptionModule} from "@app/shared/components/typography/caption/caption.module";
import {CardModule} from "@app/shared/components/card/card.module";
import {HeadlineModule} from "@app/shared/components/typography/headline/headline.module";
import {NzPaginationModule} from "ng-zorro-antd/pagination";
import {TableModule} from "@app/shared/components/table/table.module";

@NgModule({
	declarations: [ClientsListComponent],
	imports: [CommonModule, ClientsListRoutingModule, ButtonModule, CaptionModule, CardModule, HeadlineModule, NzPaginationModule, TableModule],
})
export class ClientsListModule {}
