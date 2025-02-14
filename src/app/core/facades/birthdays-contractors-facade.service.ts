import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { BirthdaysApiService } from '@app/core/api/birthdays-api.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import {IDictionaryItemDto} from "@app/core/models/company/dictionary-item-dto";

@UntilDestroy()
@Injectable({
	providedIn: 'root',
})
export class BirthdaysContractorsFacadeService {
	private readonly birthdaysContractorsSubject = new BehaviorSubject<any[] | null>(null);

	public birthdaysContractors$ = this.birthdaysContractorsSubject.asObservable();

	public constructor(private readonly birthdaysContractorsApiService: BirthdaysApiService) {}

	public getBirthdaysContractorsList(
		clientId?: number,
		contractor?: IDictionaryItemDto,
		dateFrom?: string,
		dateTo?: string,
		pageSize?: number,
		offset?: number,
	) {
		this.birthdaysContractorsApiService
			.getBirthdayContractor(clientId, contractor, dateFrom, dateTo, pageSize, offset)
			.pipe(
				tap(contractors => {
					this.birthdaysContractorsSubject.next(contractors);
				}),
				untilDestroyed(this),
			)
			.subscribe();
	}

	public filterBirthdaysContractorsList(clientId?: number, id?: number) {
		this.birthdaysContractorsApiService
			.searchBirthdayContractor(clientId, id)
			.pipe(
				tap(contractors => {
					this.birthdaysContractorsSubject.next(contractors);
				}),
				untilDestroyed(this),
			)
			.subscribe();
	}
}
