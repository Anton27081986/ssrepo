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
import { NzFormModule } from "ng-zorro-antd/form";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { NzSelectModule } from "ng-zorro-antd/select";
import { NzTypographyModule } from "ng-zorro-antd/typography";
import { InputModule } from "@app/shared/components/inputs/input/input.module";
import { PasswordModule } from "@app/shared/components/inputs/password/password.module";
import {NzCardModule} from "ng-zorro-antd/card";
import {
	AutocompleteSelectFieldModule
} from "@app/shared/components/autocomplete-select-field/autocomplete-select-field.module";
import {NzRadioModule} from "ng-zorro-antd/radio";

@NgModule({
	declarations: [ClientsListComponent],
	imports: [CommonModule, ClientsListRoutingModule, ButtonModule, CaptionModule, CardModule, HeadlineModule, NzPaginationModule, TableModule, NzFormModule, ReactiveFormsModule, NzSelectModule, NzTypographyModule, InputModule, PasswordModule, NzCardModule, AutocompleteSelectFieldModule, NzRadioModule, FormsModule]
})
export class ClientsListModule {}
