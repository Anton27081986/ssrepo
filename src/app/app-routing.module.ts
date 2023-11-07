import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {WrapperComponent} from './shared/layouts/wrapper/wrapper.component';
import {MainComponent} from './shared/layouts/main/main.component';

const routes: Routes = [
    {path: '', pathMatch: 'full', redirectTo: ''},
    {
        path: '',
        component: MainComponent,
        children: [
            {
                path: '',
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
                    {
                        path: 'profile',
                        // canActivate: [AuthGuards],
                        loadChildren: () =>
                            import('./pages/profile/profile.module').then(m => m.ProfileModule),
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
