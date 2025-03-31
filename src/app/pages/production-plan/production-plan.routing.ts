import { Routes } from '@angular/router';

export const productionPlanRoutes: Routes = [
	{
		path: '',
		loadComponent: async () =>
			import('./production-plan.component').then(
				(m) => m.ProductionPlanComponent,
			),

		children: [
			{
				path: 'plan-days',
				loadComponent: async () =>
					import('./plan-days/plan-days.component').then(
						(m) => m.PlanDaysComponent,
					),
			},
			{
				path: 'mtmz',
				loadComponent: async () =>
					import('./plan-mtmz/plan-mtmz.component').then(
						(m) => m.PlanMtmzComponent,
					),
			},
			{
				path: 'gp',
				loadComponent: async () =>
					import('./plan-gp/plan-gp.component').then(
						(m) => m.PlanGpComponent,
					),
			},
			{
				path: '**',
				redirectTo: 'plan-days',
			},
		],
	},
];
