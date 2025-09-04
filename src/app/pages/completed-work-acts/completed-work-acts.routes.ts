import { Routes } from '@angular/router';
import { CompletedWorkActsComponent } from './completed-work-acts.component';
import { CompletedWorkActCardComponent } from './completed-work-act-card/completed-work-act-card.component';

/**
 * Роуты для модуля "Акты выполненных работ"
 *
 * Структура модуля:
 * - Список актов выполненных работ (CompletedWorkActsComponent)
 * - Карточка акта выполненных работ (CompletedWorkActCardComponent)
 *
 * URL структура:
 * /completed-work-acts - Список актов выполненных работ
 * /completed-work-acts/:id - Карточка конкретного акта
 *
 * Модуль включает:
 * - Фильтрацию и поиск актов
 * - Просмотр и редактирование актов
 * - Управление спецификациями
 * - История изменений актов
 */
export const COMPLETED_WORK_ACTS_ROUTES: Routes = [
	{
		path: '',
		component: CompletedWorkActsComponent,
		data: {
			animation: 'animation',
		},
		title: 'Акты выполненных работ',
	},
	{
		path: ':id',
		component: CompletedWorkActCardComponent,
		data: {
			animation: 'animation',
		},
		title: 'Карточка акта выполненных работ',
	},
];
