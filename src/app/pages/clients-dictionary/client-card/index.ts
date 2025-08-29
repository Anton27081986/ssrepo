// Barrel export for client-card feature module
export { CLIENT_CARD_ROUTES } from './client-card.routes';
export { ClientCardComponent } from './client-card.component';

// Re-export all sub-components
export { ClientCardBasicComponent } from './client-card-basic/client-card-basic.component';
export { ClientSaleRequestsComponent } from './client-sale-requests/client-sale-requests.component';
export { ClientRequestSamplesComponent } from './client-request-samples/client-request-samples.component';
export { ClientCardNewProductsComponent } from './client-card-new-products/client-card-new-products.component';
export { ClientCardReturnRequestsComponent } from './client-card-return-requests/client-card-return-requests.component';
export { ClientCardLostProductsComponent } from './client-card-lost-products/client-card-lost-products.component';
export { ClientCardContractsComponent } from './client-card-contracts/client-card-contracts.component';
export { ClientCardBusinessTripsComponent } from './client-card-bisiness-trips/client-card-business-trips.component';
export { ClientCardBirthdaysComponent } from './client-card-birthdays/client-card-birthdays.component';

// Re-export types if needed (исправлены имена типов с префиксом I)
export type { ISaleTableItem } from './client-sale-requests/sale-table-item';
export type { ISamplesTableItem } from './client-request-samples/samples-table-item';
export type { INewProductsTableItem } from './client-card-new-products/new-products-table-item';
export type { IReturnRequestsTableItem } from './client-card-return-requests/return-requests-table-item';
export type { ILostProductsTableItem } from './client-card-lost-products/lost-products-table-item';
export type { IContractsTableItem } from './client-card-contracts/contracts-table-item';
export type { IClientBusinessTripsTableItem } from './client-card-bisiness-trips/client-card-business-trips-table-item';
