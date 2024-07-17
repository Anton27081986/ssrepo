import { Component, OnInit } from '@angular/core';
import { from, Observable, tap } from 'rxjs';
import { ClientsCardFacadeService } from '@app/core/facades/client-card-facade.service';
import { Permissions } from '@app/core/constants/permissions.constants';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { IManagerItemDto } from '@app/core/models/company/manager-item-dto';
import { NzMessageService } from 'ng-zorro-antd/message';
import { UserFacadeService } from '@app/core/facades/user-facade.service';
import { IUserProfile } from '@app/core/models/user-profile';

@UntilDestroy()
@Component({
	selector: 'ss-client-card-managers',
	templateUrl: './client-card-managers.component.html',
	styleUrls: ['./client-card-managers.component.scss'],
})
export class ClientCardManagersComponent implements OnInit {
	public managers$: Observable<IManagerItemDto[] | null>;

	public basicManager: IManagerItemDto | undefined;
	public currentUser: IUserProfile | null | undefined;

	public isEditing = false;
	public canAppointMainManager: boolean = false;
	public canAddManagers: boolean = false;
	public canRemoveManagers: boolean = false;

	public changedData: {
		basicManager: number | undefined;
		managersList: Array<{ manager: IManagerItemDto; status: 'add' | 'delete' | 'static' }>;
	} = { basicManager: undefined, managersList: [] };

	public constructor(
		public readonly clientCardListFacade: ClientsCardFacadeService,
		private readonly notificationService: NzMessageService,
		private readonly userFacadeService: UserFacadeService,
	) {
		this.managers$ = this.clientCardListFacade.managers$;
	}

	public ngOnInit() {
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

		this.clientCardListFacade.permissions$.pipe(untilDestroyed(this)).subscribe(permissions => {
			this.canAddManagers = permissions.includes(
				Permissions.CLIENT_MANAGERS_CAN_ADD_MANAGERS,
			);
			this.canRemoveManagers = permissions.includes(
				Permissions.CLIENT_MANAGERS_CAN_REMOVE_MANAGERS,
			);
			this.canAppointMainManager = permissions.includes(
				Permissions.CLIENT_MANAGERS_CAN_APPOINT_BASE_MANAGER,
			);
		});

		this.userFacadeService
			.getUserProfile()
			.pipe(untilDestroyed(this))
			.subscribe(user => {
				this.currentUser = user;
			});
	}

	public onEditing(status: boolean) {
		this.isEditing = status;

		if (status) {
			this.clientCardListFacade.getManagers();
		}
	}

	public onBasicManagerChange(managerId: number) {
		this.changedData.basicManager = managerId;
		this.changedData.managersList.map(item => {
			if (item.manager.id == managerId) {
				item.manager.isBase = true;
			} else {
				item.manager.isBase = false;
			}
		});
	}

	public onSaveChanges() {
		from(this.changedData.managersList)
			.pipe(
				tap(item => {
					if (item.status === 'add') {
						this.clientCardListFacade.addManager(
							item.manager.id,
							this.changedData.basicManager == item.manager.id,
						);
					}

					if (item.status === 'delete') {
						this.clientCardListFacade.deleteManager(item.manager.id);
					}

					if (
						item.status === 'static' &&
						this.changedData.basicManager == item.manager.id
					) {
						this.clientCardListFacade.setBasicManager(this.changedData.basicManager!);
					}
				}),
				untilDestroyed(this),
			)
			.subscribe();

		this.notificationService.success('Сохранено');
		this.isEditing = false;
	}

	public callLocalUser(id: number | undefined) {
		this.clientCardListFacade.callLocalUser(id);
	}

	public selectManager($event: any) {
		if ($event.id) {
			this.changedData.managersList.push({ manager: $event, status: 'add' });
		}
	}
}
