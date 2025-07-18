import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { map } from 'rxjs';
import { Permissions } from '@app/core/constants/permissions.constants';
import { PermissionsFacadeService } from '@app/core/facades/permissions-facade.service';
import { ModulesWithPermissionsEnum } from '@app/core/models/modules-with-permissions';

export const proposalsPermissionsGuard: CanActivateFn = () => {
	const router = inject(Router);
	const permissionsFacadeService = inject(PermissionsFacadeService);

	return permissionsFacadeService
		.checkModulePermissions(
			ModulesWithPermissionsEnum.Proposals,
			Permissions.CLIENT_TPR_URL_READ
		)
		.pipe(
			map((isAllowAccess) => {
				if (isAllowAccess) {
					return true;
				}

				router.navigate(['not-permission'], {
					queryParams: {
						redirectUrl: 'client-proposals-page',
					},
				});

				return false;
			})
		);
};
