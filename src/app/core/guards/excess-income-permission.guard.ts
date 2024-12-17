import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { map, Observable } from 'rxjs';
import { filterTruthy } from '@app/core/facades/client-proposals-facade.service';
import { Permissions } from '@app/core/constants/permissions.constants';
import { PermissionsFacadeService } from '@app/core/facades/permissions-facade.service';

@Injectable({ providedIn: 'root' })
export class ExcessIncomePermissionsGuard implements CanActivate {
	constructor(
		private readonly permissionsFacadeService: PermissionsFacadeService,
		private readonly router: Router,
	) {}

	public canActivate(): Observable<boolean> {
		return this.permissionsFacadeService.excessIncomePermissions$.pipe(
			filterTruthy(),
			map(permissions => {
				const checkPermission = permissions.find(
					item => item === Permissions.EXCESS_INCOME_READ,
				);

				if (checkPermission) {
					return true;
				}

				this.router.navigate(['not-permission'], {
					queryParams: {
						redirectUrl: 'excess-income-page',
					},
				});

				return false;
			}),
		);
	}
}
