import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Injectable } from '@angular/core';
import { ClientApiService } from '@app/core/api/client-api.service';
import { BehaviorSubject, tap } from 'rxjs';
import { IClientDto } from '@app/core/models/company/client-dto';
import { IManagerItemDto } from '@app/core/models/company/manager-item-dto';
import { IContractorItemDto } from '@app/core/models/company/contractor-item-dto';
import { IClientEditRequest } from '@app/core/models/company/client-edit-request';
import { CallPhoneService } from '@app/core/services/call-phone.service';
import { IDictionaryItemDto } from '@app/core/models/company/dictionary-item-dto';

@UntilDestroy()
@Injectable({
	providedIn: 'root',
})
export class ClientsCardFacadeService {
	public methodFileLink =
		'https://erp-dev.ssnab.it/api/static/general/2024/04/10/Методика_расчета_категории_Дистрибьюторов_5f544e66-24fb-417d-8a0e-a71dd2010ba5.xlsx';

	public instructionFileLink =
		'https://erp.ssnab.ru/api/static/general/2024/07/19/Инструкция_Карточка_клиента_8297f84a-348f-4a8b-a889-f5febc111134.docx';

	public notInitPermission = 'not-init';

	private readonly clientIdSubject = new BehaviorSubject<number | null>(null);
	public clientId$ = this.clientIdSubject.asObservable();

	private readonly clientSubject = new BehaviorSubject<IClientDto>({});
	public client$ = this.clientSubject.asObservable();

	private readonly managersSubject = new BehaviorSubject<IManagerItemDto[]>([]);
	public managers$ = this.managersSubject.asObservable();

	private readonly contractorsSubject = new BehaviorSubject<IContractorItemDto[]>([]);
	public contractors$ = this.contractorsSubject.asObservable();

	private readonly clientCardPermissionsSubject = new BehaviorSubject<string[]>([
		this.notInitPermission,
	]);

	public permissions$ = this.clientCardPermissionsSubject.asObservable();

	private readonly clientStatusesSubject = new BehaviorSubject<IDictionaryItemDto[]>([]);
	public statuses$ = this.clientStatusesSubject.asObservable();

	public constructor(
		private readonly clientApiService: ClientApiService,
		private readonly callPhoneService: CallPhoneService,
	) {}

	public setClientId(id: number | null) {
		this.clientIdSubject.next(id);
	}

	public getClientCardById(id: number) {
		if (this.clientIdSubject.value) {
			this.clientApiService
				.getClientCardById(id)
				.pipe(
					tap(client => {
						this.clientSubject.next(client.data);
						this.clientCardPermissionsSubject.next(client.permissions);
					}),
					untilDestroyed(this),
				)
				.subscribe();
		}
	}

	public refreshClientCard() {
		if (this.clientIdSubject.value) {
			this.getClientCardById(this.clientIdSubject.value);
		}
	}

	public getManagers() {
		if (this.clientIdSubject.value) {
			this.clientApiService
				.getManagers(this.clientIdSubject.value!)
				.pipe(
					tap(managers => {
						this.managersSubject.next(managers);
					}),
					untilDestroyed(this),
				)
				.subscribe();
		}
	}

	public getStatuses() {
		this.clientApiService
			.getClientStatuses()
			.pipe(
				tap(statuses => {
					this.clientStatusesSubject.next(statuses.items);
				}),
				untilDestroyed(this),
			)
			.subscribe();
	}

	public getContractors(id: number, isActiveOnly = true) {
		this.clientApiService
			.getContractors(id, isActiveOnly)
			.pipe(
				tap(contractors => {
					this.contractorsSubject.next(contractors);
				}),
				untilDestroyed(this),
			)
			.subscribe();
	}

	public setBasicManager(managerId?: number) {
		return this.clientApiService
			.setBasicManager(this.clientIdSubject.value, managerId)
	}

	public addManager(managerId?: number) {
		return this.clientApiService
			.addManager(this.clientIdSubject.value, managerId)
	}

	public deleteManager(managerId?: number) {
		return this.clientApiService
			.deleteManager(this.clientIdSubject.value, managerId)
	}

	public saveInfo(body: IClientEditRequest) {
		if (this.clientIdSubject.value) {
			this.clientApiService
				.saveInfo(this.clientIdSubject.value!, body)
				.pipe(untilDestroyed(this))
				.subscribe(() => {
					this.refreshClientCard();
				});
		}
	}

	public callLocalUser(id: number | undefined) {
		this.callPhoneService.toggleCallForUser(id);
	}
}
