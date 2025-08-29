// Barrel export для модуля "Справочник клиентов"
export { CLIENTS_DICTIONARY_ROUTES } from './clients-dictionary.routes';

// Компоненты списка клиентов
export { ClientsListPageComponent } from './clients-list-page/clients-list-page.component';
export type { IClientTableItem, TableState } from './clients-list-page/clients-list-page.component';

// Компоненты карточки клиента
export { ClientCardComponent } from './client-card/client-card.component';
export { CLIENT_CARD_ROUTES } from './client-card/client-card.routes';

// Re-export всех компонентов карточки клиента
export { ClientCardBasicComponent } from './client-card/client-card-basic/client-card-basic.component';
export { ClientSaleRequestsComponent } from './client-card/client-sale-requests/client-sale-requests.component';
export { ClientRequestSamplesComponent } from './client-card/client-request-samples/client-request-samples.component';
export { ClientCardNewProductsComponent } from './client-card/client-card-new-products/client-card-new-products.component';
export { ClientCardReturnRequestsComponent } from './client-card/client-card-return-requests/client-card-return-requests.component';
export { ClientCardLostProductsComponent } from './client-card/client-card-lost-products/client-card-lost-products.component';
export { ClientCardContractsComponent } from './client-card/client-card-contracts/client-card-contracts.component';
export { ClientCardBusinessTripsComponent } from './client-card/client-card-bisiness-trips/client-card-business-trips.component';
export { ClientCardBirthdaysComponent } from './client-card/client-card-birthdays/client-card-birthdays.component';

// Re-export типов (с префиксом I согласно соглашениям проекта)
export type { ISaleTableItem } from './client-card/client-sale-requests/sale-table-item';
export type { ISamplesTableItem } from './client-card/client-request-samples/samples-table-item';
export type { INewProductsTableItem } from './client-card/client-card-new-products/new-products-table-item';
export type { IReturnRequestsTableItem } from './client-card/client-card-return-requests/return-requests-table-item';
export type { ILostProductsTableItem } from './client-card/client-card-lost-products/lost-products-table-item';
export type { IContractsTableItem } from './client-card/client-card-contracts/contracts-table-item';
export type { IClientBusinessTripsTableItem } from './client-card/client-card-bisiness-trips/client-card-business-trips-table-item';
