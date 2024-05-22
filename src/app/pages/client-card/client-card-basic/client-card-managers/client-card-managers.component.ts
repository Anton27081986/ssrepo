import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { from, Observable, tap } from 'rxjs';
import { ClientsCardFacadeService } from '@app/core/facades/client-card-facade.service';
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
		private readonly cd: ChangeDetectorRef,
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
			this.canAddManagers = permissions.includes('Client.Managers.Add');
			this.canRemoveManagers = permissions.includes('Client.Managers.Remove');
			this.canAppointMainManager = permissions.includes('Client.Managers.AppointMainManager');
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
	}

	public onBasicManagerChange(managerId: number) {
		this.changedData.basicManager = managerId;

		this.clientCardListFacade.managers$.pipe(untilDestroyed(this)).subscribe(managers => {
			this.basicManager = managers.find(manager => manager.id === Number(managerId));
		});
	}

	public onSaveChanges() {
		if (this.changedData.basicManager) {
			this.clientCardListFacade.setBasicManager(this.changedData.basicManager);

			setTimeout(() => {
				this.clientCardListFacade.getManagers();
				this.clientCardListFacade.refreshClientCard();

				this.cd.detectChanges();
			}, 200);
		}

		from(this.changedData.managersList.filter(manager => manager.status !== 'static'))
			.pipe(
				tap(manager => {
					if (manager.status === 'add') {
						this.clientCardListFacade.addManager(manager.manager.id);
					}

					this.clientCardListFacade.deleteManager(manager.manager.id);
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
		this.clientCardListFacade.addManager($event?.id);
	}
}
