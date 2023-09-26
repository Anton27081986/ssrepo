import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TopMenuComponent} from './top-menu.component';

const routes: Routes = [
    {
        path: '',
        component: TopMenuComponent,
        data: {breadcrumb: 'Главная'},
        children: [],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class TopMenuRoutingModule {}
