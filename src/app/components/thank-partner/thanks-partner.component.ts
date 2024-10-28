import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { filter, map, of, startWith, switchMap, tap } from 'rxjs';
import { formatDate } from '@angular/common';
import { ThanksPartnerApiService } from '@app/core/api/thanks-partner-api.service';
import { FormControl } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { IPartnerThanksListDto } from '@app/core/models/awards/partner-thanks-list-dto';
import { catchError } from 'rxjs/operators';

@Component({
	selector: 'app-thanks-partner',
	templateUrl: './thanks-partner.component.html',
	styleUrls: ['./thanks-partner.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThanksPartnerComponent {
	private readonly apiService = inject(ThanksPartnerApiService);

	protected dateCtrl: FormControl<string | null> = new FormControl<string>(this.getDate());
	protected loading = signal(false);

	public thankYouList = toSignal(
		this.dateCtrl.valueChanges.pipe(
			startWith(this.getDate()),
			tap(() => this.loading.set(true)),
			filter(Boolean),
			switchMap(date => {
				return this.apiService.getPartnerThanks(date).pipe(
					map(items => {
						return {
							addNewThanksLink: items.addNewThanksLink,
							totalCount: items.totalCount,
							weekCount: items.weekCount,
							items: items.items ? items.items.slice(0, 8) : [],
							total: items.total,
						};
					}),
					tap(() => this.loading.set(false)),
					catchError(() => {
						this.loading.set(false);

						return of({} as IPartnerThanksListDto);
					}),
				);
			}),
		),
		{ initialValue: {} as IPartnerThanksListDto },
	);

	public thankToUrl(url?: string): void {
		if (!url) {
			return;
		}

		const link = document.createElement('a');

		link.href = url;
		link.click();
	}

	public isAddCardItemPaddings(count: number): boolean {
		return count > 4;
	}

	private getDate(): string {
		const date = new Date();

		// Устанавливаем на вчерашний день
		date.setDate(date.getDate() - 1);

		// Если вчера было воскресенье (0), отнимаем 2 дня, если понедельник (1), отнимаем 3 дня
		if (date.getDay() === 0) {
			date.setDate(date.getDate() - 2);
		} else if (date.getDay() === 1) {
			date.setDate(date.getDate() - 3);
		}

		return formatDate(date, 'yyyy-MM-dd', 'ru-RU');
	}
}
