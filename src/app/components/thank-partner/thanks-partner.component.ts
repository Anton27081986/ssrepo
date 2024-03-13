import { ChangeDetectionStrategy, Component, OnInit, ViewContainerRef } from '@angular/core';
import { map, Observable } from 'rxjs';
import { formatDate } from '@angular/common';
import { ModalInfoComponent } from '@app/components/modal/modal-info/modal-info.component';
import { NzModalService } from 'ng-zorro-antd/modal';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ThanksPartnerApiService } from '@app/core/api/thanks-partner-api.service';

@UntilDestroy()
@Component({
	selector: 'app-thanks-partner',
	templateUrl: './thanks-partner.component.html',
	styleUrls: ['./thanks-partner.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThanksPartnerComponent implements OnInit {
	public thankYouList$!: Observable<any>;
	public date: any;
	public dateToday: any;
	private yesterday: any;

	public pageSize = 6;
	public pageIndex = 1;
	protected thankYouUrl$!: Observable<any>;

	public constructor(
		private readonly apiService: ThanksPartnerApiService,
		public modalCreate: NzModalService,
		private readonly viewContainerRef: ViewContainerRef,
	) {}

	public ngOnInit(): any {
		this.yesterday = new Date(new Date().setDate(new Date().getDate() - 1));
		this.dateToday = formatDate(this.yesterday, 'yyyy-MM-dd', 'ru-RU');

		this.thankYouUrl$ = this.apiService.getPartnerThanks(this.dateToday);

		this.thankYouList$ = this.apiService
			.getPartnerThanks(this.dateToday)
			.pipe(map(({ items }) => items.slice(0, 9)));
	}

	public showModalOpenOut(item: any): void {
		this.modalCreate
			.create({
				nzClosable: true,
				nzFooter: null,
				nzTitle: 'Информация о пользователе',
				nzNoAnimation: false,
				nzWidth: '365px',
				nzContent: ModalInfoComponent,
				nzViewContainerRef: this.viewContainerRef,
				nzData: {
					data: item,
				},
			})
			.afterClose.pipe(untilDestroyed(this))
			.subscribe();
	}

	public onChange(result: Date): void {
		this.thankYouList$ = this.apiService
			.getPartnerThanks(formatDate(result, 'yyyy-MM-dd', 'ru-RU'))
			.pipe(map(({ items }) => items.slice(0, 9)));
	}
}
