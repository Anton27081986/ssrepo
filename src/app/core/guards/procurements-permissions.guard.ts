import { CanActivate, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Permissions } from '@app/core/constants/permissions.constants';
import { map, Observable } from 'rxjs';
import { PermissionsFacadeService } from '@app/core/facades/permissions-facade.service';

@Injectable({ providedIn: 'root' })
export class ProcurementsPermissionsGuard implements CanActivate {
	public constructor(
		private readonly router: Router,
		private readonly permissionsFacadeService: PermissionsFacadeService,
	) {}

	public canActivate(): Observable<boolean> {
		return this.permissionsFacadeService.procurementsPermissions$.pipe(
			map(permissions => {
				const checkPermission = permissions.items.find(
					item => item === Permissions.CLIENT_PROCUREMENTS_URL_READ,
				);

				if (checkPermission) {
					return true;
				}

				this.router.navigate(['not-permission'], {
					queryParams: {
						redirectUrl: 'raw-material-accounting',
					},
				});

				return false;
			}),
		);
	}
}
