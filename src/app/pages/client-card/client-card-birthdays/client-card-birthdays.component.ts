import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { IClientDto } from '@app/core/models/company/client-dto';
import { ClientsListFacadeService } from '@app/core/facades/clients-list-facade.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { IResponse } from '@app/core/utils/response';
import { IClientItemDto } from '@app/core/models/company/client-item-dto';
import { BirthdaysContractorsFacadeService } from '@app/core/facades/birthdays-contractors-facade.service';
import { formatDate } from '@angular/common';
import { ClientsCardFacadeService } from '@app/core/facades/client-card-facade.service';

@UntilDestroy()
@Component({
	selector: 'app-client-card-birthdays',
	templateUrl: './client-card-birthdays.component.html',
	styleUrls: ['./client-card-birthdays.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientCardBirthdaysComponent implements OnInit {
	public pageSize = 6;
	public pageIndex = 1;
	public offset = 0;
	public total!: number;
	public firstDate!: string;
	public lastDate!: string;
	public periodDate!: string;

	protected newContractor: number | undefined;

	public contractor$: Observable<IClientDto | null> | undefined;
	public clients$: Observable<IResponse<IClientItemDto> | null>;
	public birthdaysContractors$: Observable<any>;
	public clientId: number | undefined;

	public constructor(
		public readonly clientsListFacade: ClientsListFacadeService,
		public readonly clientCardListFacade: ClientsCardFacadeService,
		public readonly birthdaysContractorsFacade: BirthdaysContractorsFacadeService,
	) {
		this.clients$ = this.clientsListFacade.clients$;
		this.birthdaysContractors$ = this.birthdaysContractorsFacade.birthdaysContractors$;
	}

	public ngOnInit() {
		this.firstDate = String(
			formatDate(
				new Date(new Date().setDate(new Date().getDate() - 3)),
				'dd.MM.yyyy',
				'ru-RU',
			),
		);

		this.lastDate = String(
			formatDate(
				new Date(new Date().setDate(new Date().getDate() + 3)),
				'dd.MM.yyyy',
				'ru-RU',
			),
		);

		this.periodDate = `${this.firstDate}-${this.lastDate}`;

		this.birthdaysContractors$
			.pipe(
				tap(value => {
					this.total = value?.total;
				}),
				untilDestroyed(this),
			)
			.subscribe();

		this.clientCardListFacade.clientId$.pipe(untilDestroyed(this)).subscribe(clientId => {
			if (clientId) {
				this.clientId = Number(clientId);
			}
		});

		this.birthdaysContractorsFacade.getBirthdaysContractorsList(
			this.clientId,
			this.pageSize,
			this.offset,
		);
	}

	public filterbirthdaysContractors(contractor: { id: number; date?: string }) {
		this.birthdaysContractorsFacade.filterBirthdaysContractorsList(
			this.clientId,
			contractor.id,
		);
	}

	public trackBy(_index: number, item: any) {
		return item.id;
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
			this.pageSize,
			this.offset,
		);
	}

	public clearFilter(value: string) {
		if (value.length < 1) {
			this.birthdaysContractorsFacade.getBirthdaysContractorsList(
				this.clientId,
				this.pageSize,
				this.offset,
			);
		}
	}
}
