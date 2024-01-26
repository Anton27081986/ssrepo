import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {AuthGuard} from '@auth/auth.guard';
import {MainComponent} from './shared/layouts/main/main.component';
import {WrapperComponent} from './shared/layouts/wrapper/wrapper.component';

const routes: Routes = [
    {path: '', pathMatch: 'full', redirectTo: ''},
    {
        path: '',
        component: MainComponent,
        canActivate: [AuthGuard],
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
                        canActivate: [AuthGuard],
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
    imports: [
        RouterModule.forRoot(routes, {
            preloadingStrategy: PreloadAllModules,
        }),
    ],
    exports: [RouterModule],
})
export class AppRoutingModule {}
