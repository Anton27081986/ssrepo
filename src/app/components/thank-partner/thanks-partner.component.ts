import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { BehaviorSubject, map, Observable, Subscription, tap } from 'rxjs';
import { formatDate } from '@angular/common';
import { UntilDestroy } from '@ngneat/until-destroy';
import { ThanksPartnerApiService } from '@app/core/api/thanks-partner-api.service';
import { IPartnerThanksListDto } from '@app/core/models/awards/partner-thanks-list-dto';
import { filterTruthy } from '@app/core/facades/client-proposals-facade.service';
import { FormControl } from '@angular/forms';

@UntilDestroy()
@Component({
	selector: 'app-thanks-partner',
	templateUrl: './thanks-partner.component.html',
	styleUrls: ['./thanks-partner.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThanksPartnerComponent {
	public thankYouList$: Observable<IPartnerThanksListDto>;
	public dateToday: string;

	public pageSize = 8;
	public pageIndex = 1;

	protected isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

	private readonly subscription: Subscription = new Subscription();

	protected date: FormControl<Date | null> = new FormControl<Date | null>(null);

	public constructor(private readonly apiService: ThanksPartnerApiService) {
		let date = new Date(new Date().setDate(new Date().getDate() - 1));
		if (date.getDay() === 0) {
			date = new Date(date.setDate(date.getDate() - 2));
		}

		this.dateToday = formatDate(date, 'yyyy-MM-dd', 'ru-RU');

		this.subscription.add(this.date.valueChanges.subscribe(item => this.onChange(item!)));

		this.thankYouList$ = this.apiService.getPartnerThanks(this.dateToday).pipe(
			filterTruthy(),
			tap(() => {
				this.isLoading$.next(true);
			}),
			map(items => {
				return {
					addNewThanksLink: items.addNewThanksLink,
					totalCount: items.totalCount,
					weekCount: items.weekCount,
					items: items.items ? items.items.slice(0, 8) : [],
					total: items.total,
				};
			}),
			tap(() => {
				this.isLoading$.next(false);
			}),
		);
	}

	public onChange(result: Date): void {
		this.thankYouList$ = this.apiService
			.getPartnerThanks(formatDate(result, 'yyyy-MM-dd', 'ru-RU'))
			.pipe(
				tap(() => {
					this.isLoading$.next(true);
				}),
				map(items => {
					return {
						addNewThanksLink: items.addNewThanksLink,
						totalCount: items.totalCount,
						weekCount: items.weekCount,
						items: items.items ? items.items.slice(0, 8) : [],
						total: items.total,
					};
				}),
				tap(() => {
					this.isLoading$.next(false);
				}),
			);
	}

	public thankToUrl(url: string | undefined) {
		if (url) {
			const link = document.createElement('a');
			link.href = url;
			link.click();
		}
	}
}
