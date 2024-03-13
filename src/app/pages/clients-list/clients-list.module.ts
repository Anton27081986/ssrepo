import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientsListRoutingModule } from './clients-list-routing.module';
import { ClientsListComponent } from './clients-list/clients-list.component';

@NgModule({
	declarations: [ClientsListComponent],
	imports: [CommonModule, ClientsListRoutingModule],
})
export class ClientsListModule {}
