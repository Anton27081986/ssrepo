import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientCardRoutingModule } from './client-card-routing.module';
import { ClientCardComponent } from './client-card/client-card.component';

@NgModule({
	declarations: [ClientCardComponent],
	imports: [CommonModule, ClientCardRoutingModule],
})
export class ClientCardModule {}
