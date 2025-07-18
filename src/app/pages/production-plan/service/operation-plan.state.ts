import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {
	OperationPlanRequest,
	Pagination,
} from '@app/core/models/production-plan/operation-plan';
import { PermissionsFacadeService } from '@app/core/facades/permissions-facade.service';
import { ModulesWithPermissionsEnum } from '@app/core/models/modules-with-permissions';
import { Permissions } from '@app/core/constants/permissions.constants';

@Injectable({ providedIn: 'root' })
export class OperationPlanState {
	public weekId$: BehaviorSubject<number | null> = new BehaviorSubject<
		number | null
	>(null);

	public filterValueStore$: BehaviorSubject<
		(OperationPlanRequest & Pagination) | null
	> = new BehaviorSubject<(OperationPlanRequest & Pagination) | null>(null);

	public permissionsFacadeService = inject(PermissionsFacadeService);

	public get getHasPermissionEdit(): boolean {
		return this.permissionsFacadeService.hasPermission(
			ModulesWithPermissionsEnum.OperationalPlan,
			Permissions.OPERATIONAL_PLAN_EDIT
		);
	}

	public get getHasPermissionCalcRowMaterials(): boolean {
		return this.permissionsFacadeService.hasPermission(
			ModulesWithPermissionsEnum.OperationalPlan,
			Permissions.OPERATIONAL_PLAN_CALC_ROW_MATERIALS
		);
	}

	public get getHasPermissionApproveMaterials(): boolean {
		return this.permissionsFacadeService.hasPermission(
			ModulesWithPermissionsEnum.OperationalPlan,
			Permissions.OPERATIONAL_PLAN_APPROVE_MATERIALS
		);
	}
}
