import { Routes } from '@angular/router';

export const productionPlanRoutes: Routes = [
	{
		path: '',
		loadComponent: () =>
			import('./production-plan.component').then(m => m.ProductionPlanComponent),

		children: [
			{
				path: 'plan-days',
				loadComponent: () =>
					import('./plan-days/plan-days.component').then(m => m.PlanDaysComponent),
			},
			{
				path: 'mtmz',
				loadComponent: () =>
					import('./plan-mtmz/plan-mtmz.component').then(m => m.PlanMtmzComponent),
			},
			{
				path: 'gp',
				loadComponent: () =>
					import('./plan-gp/plan-gp.component').then(m => m.PlanGpComponent),
			},
			{
				path: '**',
				redirectTo: 'plan-days',
			},
		],
	},
];
