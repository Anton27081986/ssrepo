import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { map, Observable, of, tap } from 'rxjs';
import { PermissionsApiService } from '@app/core/api/permissions-api.service';
import { PermissionType } from '@app/core/constants/permissions.constants';
import { catchError } from 'rxjs/operators';
import { ModulesWithPermissionsEnum } from '@app/core/models/modules-with-permissions';

export enum PermissionsApiEnum {
	proposals = 'Client.Proposals',
	completedWorkActs = 'CompletedWorkAct',
	procurements = 'Contract',
	excessIncome = 'Snd',
	operationPlan = 'OperationalPlan',
}

@Injectable({
	providedIn: 'root',
})
export class PermissionsFacadeService {
	private readonly permissionsApiService = inject(PermissionsApiService);

	private readonly proposalsPermissions: WritableSignal<string[] | null> =
		signal(null);

	private readonly completedWorkActsPermissions: WritableSignal<
		string[] | null
	> = signal(null);

	private readonly procurementsPermissions: WritableSignal<string[] | null> =
		signal(null);

	private readonly excessIncomePermissions: WritableSignal<string[] | null> =
		signal(null);

	private readonly productionPlanPermissions: WritableSignal<
		string[] | null
	> = signal(null);

	private checkPermission(
		permissions: WritableSignal<string[] | null>,
		permissionApi: PermissionsApiEnum,
		permissionType: PermissionType,
	): Observable<boolean> {
		return this.permissionsApiService
			.getPermissionClient(permissionApi)
			.pipe(
				tap((permissionsData) => {
					permissions.set(permissionsData.items);
				}),
				map((permissionsData) =>
					this.checkPermissionType(
						permissionsData.items,
						permissionType,
					),
				),
				catchError(() => {
					return of(false);
				}),
			);
	}

	private checkPermissionType(
		permissions: string[] | null,
		permissionType: string,
	): boolean {
		return permissions?.includes(permissionType) ?? false;
	}

	public checkModulePermissions(
		permissionModule: ModulesWithPermissionsEnum,
		permission: PermissionType,
	): Observable<boolean> {
		switch (permissionModule) {
			case ModulesWithPermissionsEnum.Proposals:
				return this.checkPermission(
					this.proposalsPermissions,
					PermissionsApiEnum.proposals,
					permission,
				);

			case ModulesWithPermissionsEnum.CompletedWorkActs:
				return this.checkPermission(
					this.completedWorkActsPermissions,
					PermissionsApiEnum.completedWorkActs,
					permission,
				);

			case ModulesWithPermissionsEnum.Procurements:
				return this.checkPermission(
					this.procurementsPermissions,
					PermissionsApiEnum.procurements,
					permission,
				);

			case ModulesWithPermissionsEnum.ExcessIncome:
				return this.checkPermission(
					this.excessIncomePermissions,
					PermissionsApiEnum.excessIncome,
					permission,
				);

			case ModulesWithPermissionsEnum.OperationalPlan:
				return this.checkPermission(
					this.productionPlanPermissions,
					PermissionsApiEnum.operationPlan,
					permission,
				);

			default:
				return of(false);
		}
	}

	public hasPermission(
		permissionModule: ModulesWithPermissionsEnum,
		permissionType: PermissionType,
	): boolean {
		switch (permissionModule) {
			case ModulesWithPermissionsEnum.Proposals:
				return this.checkPermissionType(
					this.proposalsPermissions(),
					permissionType,
				);

			case ModulesWithPermissionsEnum.CompletedWorkActs:
				return this.checkPermissionType(
					this.completedWorkActsPermissions(),
					permissionType,
				);

			case ModulesWithPermissionsEnum.Procurements:
				return this.checkPermissionType(
					this.procurementsPermissions(),
					permissionType,
				);

			case ModulesWithPermissionsEnum.ExcessIncome:
				return this.checkPermissionType(
					this.excessIncomePermissions(),
					permissionType,
				);

			case ModulesWithPermissionsEnum.OperationalPlan:
				return this.checkPermissionType(
					this.productionPlanPermissions(),
					permissionType,
				);

			default:
				return false;
		}
	}
}
