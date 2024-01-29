import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from '@environments/environment.development';
import {HttpClient} from '@angular/common/http';

@Injectable({
    providedIn: 'root',
})
export class ProfileService {
    constructor(private readonly http: HttpClient) {}

    /** Theme */
    getTheme(): Observable<any> {
        return this.http.get<any[]>(`${environment.apiUrl}/api/company/theme`);
    }
}
