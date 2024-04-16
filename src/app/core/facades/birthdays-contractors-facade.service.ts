import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { BirthdaysApiService } from '@app/core/api/birthdays-api.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Injectable({
	providedIn: 'root',
})
export class BirthdaysContractorsFacadeService {
	private readonly birthdaysContractorsSubject = new BehaviorSubject<any[] | null>(null);

	public birthdaysContractors$ = this.birthdaysContractorsSubject.asObservable();

	public constructor(private readonly birthdaysContractorsApiService: BirthdaysApiService) {}

	public getBirthdaysContractorsList(pageSize?: number, offset?: number) {
		this.birthdaysContractorsApiService
			.getBirthdayContractor(pageSize, offset)
			.pipe(
				tap(contractors => {
					this.birthdaysContractorsSubject.next(contractors);
				}),
				untilDestroyed(this),
			)
			.subscribe();
	}

	public filterBirthdaysContractorsList(id?: number) {
		this.birthdaysContractorsApiService
			.searchBirthdayContractor(id)
			.pipe(
				tap(contractors => {
					this.birthdaysContractorsSubject.next(contractors);
				}),
				untilDestroyed(this),
			)
			.subscribe();
	}
}
