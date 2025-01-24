import { NgModule } from '@angular/core';

import { ClientCardManagersComponent } from '@app/pages/client-card/client-card-basic/client-card-managers/client-card-managers.component';
import { ClientCardBasicComponent } from '@app/pages/client-card/client-card-basic/client-card-basic.component';
import { ClientCardInfoComponent } from '@app/pages/client-card/client-card-basic/client-card-info/client-card-info.component';
import { ClientCardContractorsComponent } from '@app/pages/client-card/client-card-basic/client-card-contractors/client-card-contractors.component';
import { ClientsListPageRoutingModule } from '@app/pages/clients-list-page/clients-list-page-routing.module';
import { ClientSaleRequestsComponent } from '@app/pages/client-card/client-sale-requests/client-sale-requests.component';
import { ClientRequestSamplesComponent } from '@app/pages/client-card/client-request-samples/client-request-samples.component';
import { ClientCardReturnRequestsComponent } from '@app/pages/client-card/client-card-return-requests/client-card-return-requests.component';
import { ClientCardBusinessTripsComponent } from '@app/pages/client-card/client-card-bisiness-trips/client-card-business-trips.component';
import { ClientCardComponent } from './client-card.component';
import { ClientCardBirthdaysComponent } from './client-card-birthdays/client-card-birthdays.component';
import { ClientCardNewProductsComponent } from './client-card-new-products/client-card-new-products.component';
import { ClientCardLostProductsComponent } from './client-card-lost-products/client-card-lost-products.component';
import { ClientCardContractsComponent } from './client-card-contracts/client-card-contracts.component';

@NgModule({
	declarations: [ ],
	imports: [
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
		ClientCardBusinessTripsComponent,
		ClientsListPageRoutingModule,
	],
    exports: [ClientCardComponent],
})
export class ClientCardModule {}
