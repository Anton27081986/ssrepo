import {Injectable} from '@angular/core';
import {CanActivate} from '@angular/router';
import {AuthService} from './services/auth.service';

@Injectable({providedIn: 'root'})
export class AuthGuards implements CanActivate {
    constructor(private readonly auth: AuthService) {}

    canActivate() {
        const currentUser = this.auth.currentUserValue;

        if (currentUser && currentUser?.accessToken) {
            return true;
        }

        this.auth.logout();

        return false;
    }
}
