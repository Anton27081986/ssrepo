import { CanActivate, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Permissions } from '@app/core/constants/permissions.constants';
import { map, Observable } from 'rxjs';
import { PermissionsFacadeService } from '@app/core/facades/permissions-facade.service';
import { filterTruthy } from '@app/core/facades/client-proposals-facade.service';

@Injectable({ providedIn: 'root' })
export class ProposalsPermissionsGuard implements CanActivate {
	public constructor(
		private readonly router: Router,
		private readonly permissionsFacadeService: PermissionsFacadeService,
	) {}

	public canActivate(): Observable<boolean> {
		return this.permissionsFacadeService.proposalsPermissions$.pipe(
			filterTruthy(),
			map(permissions => {
				const checkPermission = permissions.find(
					item => item === Permissions.CLIENT_TPR_URL_READ,
				);
				if (checkPermission) {
					return true;
				}

				this.router.navigate(['not-permission'], {
					queryParams: {
						redirectUrl: 'client-proposals-page',
					},
				});

				return false;
			}),
		);
	}
}
