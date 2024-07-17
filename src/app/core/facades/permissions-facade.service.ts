import { Observable } from 'rxjs';
import { UntilDestroy } from '@ngneat/until-destroy';
import { PermissionsApiService } from '@app/core/api/permissions-api.service';
import { Injectable } from '@angular/core';

@UntilDestroy()
@Injectable({
	providedIn: 'root',
})
export class PermissionsFacadeService {
	public permissions$: Observable<{ items: string[] }>;

	constructor(private readonly permissionsApiService: PermissionsApiService) {
		this.permissions$ = this.permissionsApiService.getPermissionClientTpr();
	}
}
