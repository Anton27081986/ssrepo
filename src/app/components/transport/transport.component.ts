import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { ITransport } from '@app/core/models/transport';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ModalTransportNoticeComponent } from '@app/components/modal/modal-transport-notice/modal-transport-notice.component';
import { map } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TransportApiService } from '@app/core/api/transport-api.service';

const NO_TIME = '--:--';

@UntilDestroy()
@Component({
	selector: 'app-transport',
	templateUrl: './transport.component.html',
	styleUrls: ['./transport.component.scss'],
})
export class TransportComponent implements OnInit {
	protected transport: ITransport | undefined;
	public constructor(
		private readonly apiService: TransportApiService,
		public modalCreateService: NzModalService,
		private readonly viewContainerRef: ViewContainerRef,
	) {}

	public ngOnInit() {
		this.apiService
			.getTransport()
			.pipe(
				map(transport => {
					return {
						...transport,
						transportList: transport.transportList.map(bus => {
							return {
								...bus,
								departureTime: new Array(6 - bus.departureTime.length)
									.fill(NO_TIME)
									.concat(bus.departureTime),
							};
						}),
					};
				}),
				untilDestroyed(this),
			)
			.subscribe(
				transport => {
					this.transport = transport;
				},
				(error: unknown) => {
					console.error('Расписание не загружено', error);
				},
			);
	}

	public isPast(time: string): boolean {
		if (time === NO_TIME) {
			return true;
		}

		const formattedTime = time.split(':');
		const calculatedTime = new Date().setHours(
			Number.parseInt(formattedTime[0], 10),
			Number.parseInt(formattedTime[1], 10),
		);

		return calculatedTime < Date.now();
	}

	public showModalNotice(): void {
		this.modalCreateService
			.create({
				nzClosable: true,
				nzFooter: null,
				nzTitle: `Изменение расписания корпоративного транспорта`,
				nzNoAnimation: false,
				nzWidth: '560px',
				nzContent: ModalTransportNoticeComponent,
				nzViewContainerRef: this.viewContainerRef,
			})
			.afterClose.pipe(untilDestroyed(this))
			.subscribe((res: { dTo: string; dFrom: string; note: string }) => {
				if (this.transport && res) {
					this.transport.transportNotify = { ...this.transport?.transportNotify, ...res };
				}
			});
	}
}
