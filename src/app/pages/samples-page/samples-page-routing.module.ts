import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SamplesPageComponent } from '@app/pages/samples-page/samples-page.component';

const routes: Routes = [
	{
		path: '',
		component: SamplesPageComponent,
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class SamplesPageRoutingModule {}
