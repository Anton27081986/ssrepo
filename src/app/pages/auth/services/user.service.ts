import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '@environments/environment';

@Injectable({
    providedIn: 'root',
})
export class UserService {
    constructor(private readonly http: HttpClient) {}

    getAll() {
        return this.http.get<any[]>(`${environment.apiUrl}/api/company/users`);
    }

    getById(id: number) {
        return this.http.get<any>(`${environment.apiUrl}/api/company/users/${id}`);
    }

    getProfile() {
        return this.http.get<any>(`${environment.apiUrl}/api/auth/Profile`);
    }
}
