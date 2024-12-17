import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RawMaterialAccountingComponent } from '@app/pages/raw-material-accounting/raw-material-accounting.component';

const routes: Routes = [
	{
		path: ':id',
		component: RawMaterialAccountingComponent,
	},
	{
		path: '',
		component: RawMaterialAccountingComponent,
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class RawMaterialAccountingRoutingModule {}
