import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { map } from 'rxjs';
import { Permissions } from '@app/core/constants/permissions.constants';
import { PermissionsFacadeService } from '@app/core/facades/permissions-facade.service';
import { ModulesWithPermissionsEnum } from '@app/core/models/modules-with-permissions';

export const operationPlanPermissionGuard: CanActivateFn = () => {
	const router = inject(Router);
	const permissionsFacadeService = inject(PermissionsFacadeService);

	return permissionsFacadeService
		.checkModulePermissions(
			ModulesWithPermissionsEnum.OperationalPlan,
			Permissions.OPERATIONAL_PLAN_ACCESS
		)
		.pipe(
			map((isAllowAccess) => {
				if (isAllowAccess) {
					return true;
				}

				router.navigate(['not-permission'], {
					queryParams: {
						redirectUrl: 'production-plan/operational-plan',
					},
				});

				return false;
			})
		);
};
