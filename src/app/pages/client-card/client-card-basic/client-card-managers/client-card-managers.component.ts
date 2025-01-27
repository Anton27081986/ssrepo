import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ClientsCardFacadeService } from '@app/core/facades/client-card-facade.service';
import { Permissions } from '@app/core/constants/permissions.constants';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { IManagerItemDto } from '@app/core/models/company/manager-item-dto';
import { NzMessageService } from 'ng-zorro-antd/message';
import { UserFacadeService } from '@app/core/facades/user-facade.service';
import { IUserProfile } from '@app/core/models/user-profile';
import { UserInfoPopupComponent } from '@app/components/user-info-popup/user-info-popup.component';
import { ModalService } from '@app/core/modal/modal.service';
import {CaptionComponent} from "@app/shared/components/typography/caption/caption.component";
import {TextComponent} from "@app/shared/components/typography/text/text.component";
import {LoaderComponent} from "@app/shared/components/loader/loader.component";
import {HeadlineComponent} from "@app/shared/components/typography/headline/headline.component";
import {AsyncPipe, CommonModule, DatePipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {IconComponent} from "@app/shared/components/icon/icon.component";
import {AvatarComponent} from "@app/shared/components/avatar/avatar.component";
import {TagComponent} from "@app/shared/components/tag/tag.component";
import {SelectComponent} from "@app/shared/components/select/select.component";
import {SearchInputComponent} from "@app/shared/components/inputs/search-input/search-input.component";
import {ButtonComponent} from "@app/shared/components/buttons/button/button.component";

enum OperationStatuses {
	Add,
	Static,
	Delete,
}

@UntilDestroy()
@Component({
	selector: 'ss-client-card-managers',
	templateUrl: './client-card-managers.component.html',
	styleUrls: ['./client-card-managers.component.scss'],
	imports: [
		CommonModule,
		CaptionComponent,
		TextComponent,
		LoaderComponent,
		HeadlineComponent,
		AsyncPipe,
		NgIf,
		IconComponent,
		AvatarComponent,
		TagComponent,
		DatePipe,
		SelectComponent,
		SearchInputComponent,
		NgForOf,
		NgClass,
		ButtonComponent
	],
	standalone: true
})
export class ClientCardManagersComponent implements OnInit {
	public managers$: Observable<IManagerItemDto[] | null>;

	public basicManager: IManagerItemDto | undefined;
	public currentUser: IUserProfile | null | undefined;

	public isEditing = false;
	public canAppointMainManager: boolean = false;
	public canAddManagers: boolean = false;
	public canRemoveManagers: boolean = false;

	public operationStatuses = OperationStatuses;

	public isLoading$: Observable<boolean>;

	public changedData: {
		basicManager: number | undefined;
		managersList: Array<{ manager: IManagerItemDto; status: OperationStatuses }>;
	} = { basicManager: undefined, managersList: [] };

	public constructor(
		public readonly clientCardListFacade: ClientsCardFacadeService,
		private readonly notificationService: NzMessageService,
		private readonly userFacadeService: UserFacadeService,
		private readonly cdr: ChangeDetectorRef,
		private readonly modalService: ModalService,
	) {
		this.managers$ = this.clientCardListFacade.managers$;
		this.isLoading$ = this.clientCardListFacade.isManagersLoading$;
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
				return { manager, status: OperationStatuses.Static };
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

	public async onSaveChanges() {
		for (const operation of this.changedData.managersList.sort((a, b) => a.status - b.status)) {
			if (operation.status === OperationStatuses.Add) {
				await this.clientCardListFacade.addManager(operation.manager.id).toPromise();
			}

			if (
				operation.status === OperationStatuses.Static &&
				this.changedData.basicManager == operation.manager.id
			) {
				await this.clientCardListFacade
					.setBasicManager(this.changedData.basicManager!)
					.toPromise();
			}

			if (operation.status === OperationStatuses.Delete) {
				await this.clientCardListFacade.deleteManager(operation.manager.id).toPromise();
			}
		}

		this.clientCardListFacade.getManagers();

		this.notificationService.success('Сохранено');
		this.isEditing = false;
	}

	public callLocalUser(id: number | undefined) {
		this.clientCardListFacade.callLocalUser(id);
	}

	public selectManager($event: any) {
		if ($event.id) {
			this.clientCardListFacade
				.getUserById($event.id)
				.pipe(untilDestroyed(this))
				.subscribe(user => {
					this.changedData.managersList.push({
						manager: user,
						status: OperationStatuses.Add,
					});
					this.cdr.detectChanges();
				});
		}
	}

	protected openModalInfoUser(id: number | undefined) {
		if (id) {
			this.modalService.open(UserInfoPopupComponent, { data: id });
		}
	}
}
