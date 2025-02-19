import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { Permissions } from '@app/core/constants/permissions.constants';
import { PermissionsFacadeService } from '@app/core/facades/permissions-facade.service';
import { map } from 'rxjs';
import { ModulesWithPermissionsEnum } from '@app/core/models/modules-with-permissions';

export const completedWorkActPermissionsGuard: CanActivateFn = () => {
	const router = inject(Router);
	const permissionsFacadeService = inject(PermissionsFacadeService);

	return permissionsFacadeService
		.checkModulePermissions(
			ModulesWithPermissionsEnum.CompletedWorkActs,
			Permissions.COMPLETED_WORK_ACTS,
		)
		.pipe(
			map(isAllowAccess => {
				if (isAllowAccess) {
					return true;
				}

				router.navigate(['not-permission'], {
					queryParams: {
						redirectUrl: 'completed-work-acts',
					},
				});

				return false;
			}),
		);
};
