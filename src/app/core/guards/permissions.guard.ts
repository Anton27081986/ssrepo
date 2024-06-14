import { CanActivate, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { PermissionsApiService } from '@app/core/api/permissions-api.service';

@Injectable({ providedIn: 'root' })
export class PermissionsGuard implements CanActivate {
	public constructor(
		private readonly router: Router,
		private readonly permissionsApiService: PermissionsApiService,
	) {}

	public canActivate() {
		const ClientContact: boolean = this.permissionsApiService.getClientsPermissions();

		if (ClientContact) {
			return true;
		}

		this.router.navigate(['not-permission']);

		return false;
	}
}
