import { Component, OnInit } from '@angular/core';
import { from, mergeMap, Observable } from 'rxjs';
import { ClientsCardFacadeService } from '@app/core/facades/client-card-facade.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { IManagerItemDto } from '@app/core/models/company/manager-item-dto';

@UntilDestroy()
@Component({
	selector: 'ss-client-card-managers',
	templateUrl: './client-card-managers.component.html',
	styleUrls: ['./client-card-managers.component.scss'],
})
export class ClientCardManagersComponent implements OnInit {
	public managers$: Observable<IManagerItemDto[] | null>;

	public basicManager: IManagerItemDto | undefined;

	public isEditing = false;

	public changedData: {
		basicManager: number | undefined;
		managersList: Array<{ manager: IManagerItemDto; status: 'add' | 'delete' | 'static' }>;
	} = { basicManager: undefined, managersList: [] };

	public constructor(public readonly clientCardListFacade: ClientsCardFacadeService) {
		this.managers$ = this.clientCardListFacade.managers$;
	}

	ngOnInit() {
		this.clientCardListFacade.clientId$.pipe(untilDestroyed(this)).subscribe(clientId => {
			if (clientId) {
				this.clientCardListFacade.getManagers();
			}
		});

		this.clientCardListFacade.managers$.pipe(untilDestroyed(this)).subscribe(managers => {
			this.basicManager = managers.find(manager => manager.isBase);
			this.changedData.managersList = managers.map(manager => {
				return { manager, status: 'static' };
			});
		});
	}

	public onEditing(status: boolean) {
		this.isEditing = status;
	}

	public onBasicManagerChange(managerId: number) {
		this.changedData.basicManager = managerId;
	}

	public onSaveChanges() {
		if (this.changedData.basicManager) {
			this.clientCardListFacade.setBasicManager(this.changedData.basicManager);
		}

		from(this.changedData.managersList.filter(manager => manager.status !== 'static'))
			.pipe(
				mergeMap(manager => {
					if (manager.status === 'add') {
						return this.clientCardListFacade.addManager(manager.manager.id!);
					}

					return this.clientCardListFacade.deleteManager(manager.manager.id!);
				}),
				untilDestroyed(this),
			)
			.subscribe(() => {
				this.clientCardListFacade.getManagers();
			});
	}
}
