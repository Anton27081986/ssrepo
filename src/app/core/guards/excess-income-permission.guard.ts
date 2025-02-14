import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Permissions } from '@app/core/constants/permissions.constants';
import { PermissionsFacadeService } from '@app/core/facades/permissions-facade.service';
import { map } from 'rxjs';
import { ModulesWithPermissionsEnum } from '@app/core/models/modules-with-permissions';

export const excessIncomePermissionsGuard: CanActivateFn = () => {
	const router = inject(Router);
	const permissionsFacadeService = inject(PermissionsFacadeService);

	return permissionsFacadeService
		.checkModulePermissions(
			ModulesWithPermissionsEnum.ExcessIncome,
			Permissions.EXCESS_INCOME_READ,
		)
		.pipe(
			map(isAllowAccess => {
				if (isAllowAccess) {
					return true;
				}

				router.navigate(['not-permission'], {
					queryParams: {
						redirectUrl: 'excess-income-page',
					},
				});

				return false;
			}),
		);
};
