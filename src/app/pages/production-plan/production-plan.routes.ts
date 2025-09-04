import { Routes } from '@angular/router';
import { ProductionPlanComponent } from './production-plan.component';
import { OperationalPlanComponent } from './operational-plan/operational-plan.component';

/**
 * Роуты для модуля "План производства"
 *
 * Структура модуля:
 * - Главная страница планирования (ProductionPlanComponent)
 * - Операционный план (OperationalPlanComponent)
 *
 * URL структура:
 * /production-plan/operational-plan - Операционный план производства
 *
 * Все роуты защищены operationPlanPermissionGuard
 */
export const PRODUCTION_PLAN_ROUTES: Routes = [
	{
		path: '',
		component: ProductionPlanComponent,
		children: [
			{
				path: 'operational-plan',
				component: OperationalPlanComponent,
				title: 'Операционный план',
			},
			{
				path: '',
				redirectTo: 'operational-plan',
				pathMatch: 'full',
			},
			{
				path: '**',
				redirectTo: 'operational-plan',
			},
		],
	},
];
