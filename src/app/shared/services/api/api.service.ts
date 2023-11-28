import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {IMainMenu} from '@app/components/main-menu/main-menu.interface';

@Injectable({
    providedIn: 'root',
})
export class ApiService {
    constructor(private readonly http: HttpClient) {}

    public getMenuListJson(): Observable<IMainMenu[]> {
        // return this.http.get<IMainMenu[]>('./assets/data/menu.json');
        return this.http.get<IMainMenu[]>('https://erp-dev.ssnab.it/api/company/menu');
    }
}
