import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {MainComponent} from './shared/layouts/main/main.component';

const routes: Routes = [
    {path: '', pathMatch: 'full', redirectTo: '/main'},
    {
        path: '',
        component: MainComponent,
        children: [
            {
                path: 'main',
                loadChildren: () =>
                    import('./shared/layouts/top-menu/top-menu.module').then(m => m.TopMenuModule),
            },
        ],
    },
    {path: '**', redirectTo: ''},
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
