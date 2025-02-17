import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompletedWorkActsComponent } from '@app/pages/completed-work-acts/completed-work-acts.component';
import { CompletedWorkActCardComponent } from '@app/pages/completed-work-acts/completed-work-act-card/completed-work-act-card.component';

const routes: Routes = [
	{
		path: '',
		component: CompletedWorkActsComponent,
		data: {
			animation: 'animation',
		},
	},
	{
		path: ':id',
		component: CompletedWorkActCardComponent,
		data: {
			animation: 'animation',
		},
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class CompletedWorkActsRoutingModule {}
