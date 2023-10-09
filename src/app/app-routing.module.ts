import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {WrapperComponent} from './shared/layouts/wrapper/wrapper.component';
import {MainComponent} from './shared/layouts/main/main.component';
import {AppRoutes} from './shared/constants/routes';

const routes: Routes = [
    {path: '', pathMatch: 'full', redirectTo: ''},
    {
        path: '',
        component: MainComponent,
        children: [
            {
                path: AppRoutes.start,
                loadChildren: () => import('./pages/start/start.module').then(m => m.StartModule),
            },
            {
                path: '',
                component: WrapperComponent,
                children: [
                    {
                        path: 'partners',
                        // canActivate: [AuthGuards],
                        loadChildren: () =>
                            import('./pages/partners/partners.module').then(m => m.PartnersModule),
                    },
                ],
            },
        ],
    },
    {
        path: 'auth',
        loadChildren: () => import('./pages/auth/auth.module').then(m => m.AuthModule),
    },
    {path: '**', redirectTo: ''},
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
