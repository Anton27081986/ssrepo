import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotPermissionPageComponent } from '@app/pages/not-permission-page/not-permission-page.component';

const routes: Routes = [{ path: '', component: NotPermissionPageComponent }];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class NotPermissionPageRoutingModule {}
