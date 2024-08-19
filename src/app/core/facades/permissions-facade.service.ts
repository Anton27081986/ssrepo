import { Observable } from 'rxjs';
import { UntilDestroy } from '@ngneat/until-destroy';
import { PermissionsApiService } from '@app/core/api/permissions-api.service';
import { Injectable } from '@angular/core';

@UntilDestroy()
@Injectable({
	providedIn: 'root',
})
export class PermissionsFacadeService {
	public proposalsPermissions$: Observable<{ items: string[] }>;
	public procurementsPermissions$: Observable<{ items: string[] }>;

	constructor(private readonly permissionsApiService: PermissionsApiService) {
		this.proposalsPermissions$ =
			this.permissionsApiService.getPermissionClient('Client.Proposals');
		this.procurementsPermissions$ = this.permissionsApiService.getPermissionClient('Contract');
	}
}
