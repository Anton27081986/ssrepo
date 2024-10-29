import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment.development';
import { CompletedWorkAct } from '@app/core/models/completed-work-acts/completed-work-act';
import {IResponse} from "@app/core/utils/response";
import {ICompletedActsFilter} from "@app/core/models/completed-acts-filter";

@Injectable({
	providedIn: 'root',
})
export class CompletedWorkActsApiService {
	public constructor(private readonly http: HttpClient) {}
	public getWorkActs(filters: ICompletedActsFilter): Observable<IResponse<CompletedWorkAct>> {
		return this.http.get<IResponse<CompletedWorkAct>>(
			`${environment.apiUrl}/api/company/CompletedWorkAct`,
		);
	}
}
