import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExcessIncomePageComponent } from '@app/pages/excess-income/excess-income-page/excess-income-page.component';

const routes: Routes = [
	{
		path: '',
		component: ExcessIncomePageComponent,
		data: {
			animation: 'animation',
		},
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class ExcessIncomeRoutingModule {}
