import { BehaviorSubject, map, Observable } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { PermissionsApiService } from '@app/core/api/permissions-api.service';
import { Injectable } from '@angular/core';

@UntilDestroy()
@Injectable({
	providedIn: 'root',
})
export class PermissionsFacadeService {
	public proposalsPermissions$: BehaviorSubject<string[] | null> = new BehaviorSubject<
		string[] | null
	>(null);

	public completedWorkActsPermissions$: BehaviorSubject<string[] | null> = new BehaviorSubject<
		string[] | null
	>(null);

	public procurementsPermissions$: Observable<{ items: string[] }>;

	constructor(private readonly permissionsApiService: PermissionsApiService) {
		this.permissionsApiService
			.getPermissionClient('Client.Proposals')
			.pipe(
				untilDestroyed(this),
				map(items => {
					return items.items;
				}),
			)
			.subscribe(this.proposalsPermissions$);

		this.permissionsApiService
			.getPermissionClient('CompletedWorkAct')
			.pipe(
				untilDestroyed(this),
				map(items => {
					return items.items;
				}),
			)
			.subscribe(this.completedWorkActsPermissions$);

		this.procurementsPermissions$ = this.permissionsApiService.getPermissionClient('Contract');
	}

	public hasPermission(permission: string): boolean {
		return this.proposalsPermissions$.value!.indexOf(permission) !== -1;
	}
}
