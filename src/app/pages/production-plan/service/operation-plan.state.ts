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

	constructor() {}
}
