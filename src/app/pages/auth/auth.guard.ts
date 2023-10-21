import {Injectable} from '@angular/core';
import {Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';

import {AuthenticationService} from '@app/pages/auth/services/authentication.service';

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate {
    constructor(
        private readonly router: Router,
        private readonly authenticationService: AuthenticationService,
    ) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const user = this.authenticationService.userValue;

        if (user) {
            // check if route is restricted by role
            const {roles} = route.data;

            if (roles && !roles.includes(user.role)) {
                // role not authorized so redirect to home page
                this.router.navigate(['/']);

                return false;
            }

            // authorized so return true
            return true;
        }

        // not logged in so redirect to login page with the return url
        this.router.navigate(['/sign-in'], {queryParams: {returnUrl: state.url}});

        return false;
    }
}
