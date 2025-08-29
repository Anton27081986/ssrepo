import { Routes } from '@angular/router';
import { ClientCardComponent } from './client-card.component';
import { ClientCardBasicComponent } from './client-card-basic/client-card-basic.component';
import { ClientSaleRequestsComponent } from './client-sale-requests/client-sale-requests.component';
import { ClientRequestSamplesComponent } from './client-request-samples/client-request-samples.component';
import { ClientCardNewProductsComponent } from './client-card-new-products/client-card-new-products.component';
import { ClientCardReturnRequestsComponent } from './client-card-return-requests/client-card-return-requests.component';
import { ClientCardLostProductsComponent } from './client-card-lost-products/client-card-lost-products.component';
import { ClientCardContractsComponent } from './client-card-contracts/client-card-contracts.component';
import { ClientCardBusinessTripsComponent } from './client-card-bisiness-trips/client-card-business-trips.component';
import { ClientCardBirthdaysComponent } from './client-card-birthdays/client-card-birthdays.component';

export const CLIENT_CARD_ROUTES: Routes = [
  {
    path: ':id',
    component: ClientCardComponent,
    children: [
      {
        path: 'basic',
        component: ClientCardBasicComponent,
        title: 'Основная информация'
      },
      {
        path: 'sales',
        component: ClientSaleRequestsComponent,
        title: 'Заявки на продажу'
      },
      {
        path: 'samples',
        component: ClientRequestSamplesComponent,
        title: 'Образцы'
      },
      {
        path: 'gntpr',
        component: ClientCardNewProductsComponent,
        title: 'Новые товары'
      },
      {
        path: 'refund',
        component: ClientCardReturnRequestsComponent,
        title: 'Возвраты'
      },
      {
        path: 'pkp',
        component: ClientCardLostProductsComponent,
        title: 'ПКП'
      },
      {
        path: 'contracts',
        component: ClientCardContractsComponent,
        title: 'Договоры'
      },
      {
        path: 'business-trips',
        component: ClientCardBusinessTripsComponent,
        title: 'Командировки'
      },
      {
        path: 'birthdays',
        component: ClientCardBirthdaysComponent,
        title: 'Дни рождения'
      },
      { 
        path: '', 
        redirectTo: 'basic', 
        pathMatch: 'full' 
      },
      { 
        path: '**', 
        redirectTo: 'basic' 
      }
    ]
  }
];
