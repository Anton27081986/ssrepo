// Barrel export для модуля "Акты выполненных работ"
export { COMPLETED_WORK_ACTS_ROUTES } from './completed-work-acts.routes';

// Основные компоненты
export { CompletedWorkActsComponent } from './completed-work-acts.component';
export { CompletedWorkActCardComponent } from './completed-work-act-card/completed-work-act-card.component';

// Подкомпоненты карточки акта
export { CompletedWorkActInfoComponent } from './completed-work-act-card/completed-work-act-info/completed-work-act-info.component';
export { CompletedWorkActEditComponent } from './completed-work-act-card/completed-work-act-edit/completed-work-act-edit.component';
export { CompletedWorkActSpecificationsComponent } from './completed-work-act-card/completed-work-act-specifications/completed-work-act-specifications.component';

// Компоненты таблиц и фильтров
export { CompletedWorkActsTableComponent } from './completed-work-acts-table/completed-work-acts-table.component';
export { CompletedWorkActHistoryComponent } from './completed-work-act-history/completed-work-act-history.component';

// Сервисы модуля
export { CompletedWorkActsApiService } from './services/completed-work-acts-api.service';
export { CompletedWorkActsFacadeService } from './services/completed-work-acts-facade.service';
export { CompletedWorkActsFiltersApiService } from './services/completed-work-acts-filters-api.service';

// Модальные окна
export { ReturnToApplicantModalComponent } from './completed-work-act-card/return-to-applicant-modal/return-to-applicant-modal.component';

// Типы и интерфейсы
export type { ICompletedWorkActTableItem } from './completed-work-act-table-item';

// Re-export моделей из core (для удобства)
export type { ICompletedWorkAct } from '@app/core/models/completed-work-acts/completed-work-act';
export type { ICompletedActsFilter } from '@app/core/models/completed-work-acts/completed-acts-filter';
export type { ICompletedWorkActSpecification } from '@app/core/models/completed-work-acts/specification';
export type { IAddSpecification } from '@app/core/models/completed-work-acts/add-specification';
export type { IUpdateAct } from '@app/core/models/completed-work-acts/update-act';
