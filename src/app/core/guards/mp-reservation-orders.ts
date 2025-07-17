import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { PermissionsFacadeService } from '@app/core/facades/permissions-facade.service';
import { ModulesWithPermissionsEnum } from '@app/core/models/modules-with-permissions';
import { Permissions } from '@app/core/constants/permissions.constants';
import { map } from 'rxjs';

export const mpReservationOrdersPermissionsGuard: CanActivateFn = () => {
	const router = inject(Router);
	const permissionsFacadeService = inject(PermissionsFacadeService);

	return permissionsFacadeService
		.checkModulePermissions(
			ModulesWithPermissionsEnum.MpReservationOrders,
			Permissions.PERSONIFICATION_ORDER_AUTHOR_VIEW_DATA,
		)
		.pipe(
			map((isAllowAccess) => {
				if (isAllowAccess) {
					return true;
				}

				router.navigate(['not-permission'], {
					queryParams: {
						redirectUrl: 'mp-reservation-orders',
					},
				});

				return false;
			}),
		);
};
