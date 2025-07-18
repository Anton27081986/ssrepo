import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { ClientsListFacadeService } from '@app/core/facades/clients-list-facade.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { IResponse } from '@app/core/utils/response';
import { IClientItemDto } from '@app/core/models/company/client-item-dto';
import { BirthdaysContractorsFacadeService } from '@app/core/facades/birthdays-contractors-facade.service';
import {
	AsyncPipe,
	CommonModule,
	DatePipe,
	formatDate,
	NgForOf,
} from '@angular/common';
import { ClientsCardFacadeService } from '@app/core/facades/client-card-facade.service';
import { fromPickerDateToIso } from '@app/shared/pipe/from-picker-date-to-iso';
import { IDictionaryItemDto } from '@app/core/models/company/dictionary-item-dto';
import { CardComponent } from '@app/shared/components/card/card.component';
import { HeadlineComponent } from '@app/shared/components/typography/headline/headline.component';
import { DateRangeComponent } from '@app/shared/components/inputs/date-range/date-range.component';
import { SearchInputComponent } from '@app/shared/components/inputs/search-input/search-input.component';
import { TextComponent } from '@app/shared/components/typography/text/text.component';
import { TagComponent } from '@app/shared/components/tag/tag.component';
import { PaginationComponent } from '@app/shared/components/pagination/pagination.component';

@UntilDestroy()
@Component({
	selector: 'app-client-card-birthdays',
	templateUrl: './client-card-birthdays.component.html',
	styleUrls: ['./client-card-birthdays.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		CommonModule,
		CardComponent,
		HeadlineComponent,
		DateRangeComponent,
		SearchInputComponent,
		AsyncPipe,
		NgForOf,
		TextComponent,
		TagComponent,
		DatePipe,
		PaginationComponent,
	],
	standalone: true,
})
export class ClientCardBirthdaysComponent implements OnInit {
	public pageSize = 6;
	public pageIndex = 1;
	public offset = 0;
	public total!: number;
	public firstDate!: string;
	public lastDate!: string;

	public contractor: IDictionaryItemDto | undefined;
	public clients$: Observable<IResponse<IClientItemDto> | null>;
	public birthdaysContractors$: Observable<any>;
	public clientId: number | undefined;

	constructor(
		public readonly clientsListFacade: ClientsListFacadeService,
		public readonly clientCardListFacade: ClientsCardFacadeService,
		public readonly birthdaysContractorsFacade: BirthdaysContractorsFacadeService
	) {
		this.clients$ = this.clientsListFacade.clients$;
		this.birthdaysContractors$ =
			this.birthdaysContractorsFacade.birthdaysContractors$;
	}

	public ngOnInit() {
		this.firstDate = String(
			formatDate(
				new Date(new Date().setDate(new Date().getDate() - 3)),
				'dd.MM.yyyy',
				'ru-RU'
			)
		);

		this.lastDate = String(
			formatDate(
				new Date(new Date().setDate(new Date().getDate() + 3)),
				'dd.MM.yyyy',
				'ru-RU'
			)
		);

		this.birthdaysContractors$
			.pipe(
				tap((value) => {
					this.total = value?.total;
				}),
				untilDestroyed(this)
			)
			.subscribe();

		this.clientCardListFacade.clientId$
			.pipe(untilDestroyed(this))
			.subscribe((clientId) => {
				if (clientId) {
					this.clientId = Number(clientId);
				}
			});

		this.birthdaysContractorsFacade.getBirthdaysContractorsList(
			this.clientId,
			this.contractor,
			fromPickerDateToIso(this.firstDate),
			fromPickerDateToIso(this.lastDate),
			this.pageSize,
			this.offset
		);
	}

	public trackBy(_index: number, item: any) {
		return item.id;
	}

	public onDateRange(dates?: string) {
		this.pageIndex = 1;
		this.offset = 0;

		if (dates) {
			this.firstDate = dates.split('-')[0];
			this.lastDate = dates.split('-')[1];
		} else {
			this.firstDate = String(
				formatDate(
					new Date(new Date().setDate(new Date().getDate() - 3)),
					'dd.MM.yyyy',
					'ru-RU'
				)
			);

			this.lastDate = String(
				formatDate(
					new Date(new Date().setDate(new Date().getDate() + 3)),
					'dd.MM.yyyy',
					'ru-RU'
				)
			);
		}

		this.birthdaysContractorsFacade.getBirthdaysContractorsList(
			this.clientId,
			this.contractor,
			fromPickerDateToIso(this.firstDate),
			fromPickerDateToIso(this.lastDate),
			this.pageSize,
			this.offset
		);
	}

	public onContractor(contractor?: IDictionaryItemDto) {
		if (this.contractor || contractor) {
			this.contractor = contractor;

			this.onDateRange(`${this.firstDate}-${this.lastDate}`);
		}
	}

	public nzPageIndexChange($event: number) {
		if ($event === 1) {
			this.offset = 0;
		} else {
			this.offset = this.pageSize * $event - this.pageSize;
		}

		this.pageIndex = $event;
		this.birthdaysContractorsFacade.getBirthdaysContractorsList(
			this.clientId,
			this.contractor,
			fromPickerDateToIso(this.firstDate),
			fromPickerDateToIso(this.lastDate),
			this.pageSize,
			this.offset
		);
	}
}
