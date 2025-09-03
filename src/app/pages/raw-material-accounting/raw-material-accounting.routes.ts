import { Routes } from '@angular/router';

/**
 * Роуты для модуля "Учет сырья и материалов"
 *
 * Структура модуля:
 * - Основная страница учета сырья и материалов (RawMaterialAccountingComponent)
 * - Модальные окна для управления договорами
 *   - Информация о договоре (ContractInfoComponent)
 *   - Создание нового договора (ContractNewComponent)
 *
 * URL структура:
 * /raw-material-accounting - Основная страница без ID
 * /raw-material-accounting/:id - Страница с конкретным ID материала/договора
 *
 * Модуль включает:
 * - Учет и управление сырьем и материалами
 * - Управление договорами поставки
 * - Мониторинг остатков и поставок
 * - Отчеты по использованию материалов
 * - Интеграция с системой закупок
 *
 * Доступ к модулю контролируется procurementsPermissionsGuard
 * Все компоненты загружаются через lazy loading для оптимизации производительности
 */
export const RAW_MATERIAL_ACCOUNTING_ROUTES: Routes = [
	{
		path: ':id',
		loadComponent: async () =>
			import('./raw-material-accounting.component').then(
				(c) => c.RawMaterialAccountingComponent
			),
		title: 'Учет сырья и материалов',
		data: {
			animation: 'animation',
		},
	},
	{
		path: '',
		loadComponent: async () =>
			import('./raw-material-accounting.component').then(
				(c) => c.RawMaterialAccountingComponent
			),
		title: 'Учет сырья и материалов',
		data: {
			animation: 'animation',
		},
	},
];
