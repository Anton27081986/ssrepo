import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
	providedIn: 'root',
})
export class PermissionsApiService {
	public constructor(private readonly http: HttpClient) {}

	public getClientsPermissions() {
		return true;
	}
}
