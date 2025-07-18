import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
	filter,
	map,
	Observable,
	of,
	repeat,
	Subject,
	switchMap,
	tap,
} from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TransportApiService } from '@app/core/api/transport-api.service';
import { ITransportDto } from '@app/core/models/company/transport-dto';
import { ModalService } from '@app/core/modal/modal.service';
import { dateTimeFromIsoString } from '@app/core/utils/date';
import { IRouteDto } from '@app/core/models/company/route-dto';
import { fadeInDown } from '@app/core/animations';
import { TransportImports } from '@app/widgets/transport/transport.imports';
import { ModalTransportNoticeComponent } from '@app/widgets/transport/modal-transport-notice/modal-transport-notice.component';

const NO_TIME = '--:--';

@UntilDestroy()
@Component({
	selector: 'app-transport',
	templateUrl: './transport.component.html',
	styleUrls: ['./transport.component.scss'],
	standalone: true,
	animations: [fadeInDown],
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: TransportImports,
})
export class TransportComponent {
	private readonly apiService = inject(TransportApiService);
	private readonly modalService = inject(ModalService);

	private readonly transportRefresh$ = new Subject<void>();

	protected nearestDepartureTimeForBuses: Map<number, string> = new Map();
	protected transport$: Observable<ITransportDto> = this.apiService
		.getTransport()
		.pipe(
			map((transport) => {
				return {
					...transport,
					transportList: transport.transportList?.map((bus) => {
						return {
							...bus,
							departureTime: new Array(
								6 -
									(bus.departureTime
										? bus.departureTime.length
										: 0)
							)
								.fill(NO_TIME)
								.concat(bus.departureTime),
						};
					}),
				};
			}),
			tap((transportList) => this.nearestDepartureTime(transportList)),
			repeat({ delay: () => this.transportRefresh$ })
		);

	public noticeText(transport: ITransportDto): string {
		return `В период с ${dateTimeFromIsoString(transport.transportNotify!.dateFrom)}
		до ${dateTimeFromIsoString(transport.transportNotify!.dateTo)}
		${transport.transportNotify!.note}`;
	}

	public currentTimeClass(
		time: string,
		busID: number,
		nearestDepartureTimeForBuses: Map<number, string>
	): string {
		if (time === NO_TIME) {
			return 'gone';
		}

		const [hours, minutes] = time.split(':').map(Number);
		const calculatedTime = new Date().setHours(hours, minutes);

		if (calculatedTime < Date.now()) {
			return 'gone';
		}

		if (nearestDepartureTimeForBuses.get(busID) === time) {
			return 'nearest';
		}

		return 'next';
	}

	public nearestDepartureTime(transport: ITransportDto): void {
		const now = new Date();
		const [hoursNow, minutesNow] = [now.getHours(), now.getMinutes()];

		this.nearestDepartureTimeForBuses.clear();

		transport.transportList?.forEach((bus) => {
			if (bus.departureTime) {
				this.getNearestTime(hoursNow, minutesNow, bus);
			}
		});
	}

	public getNearestTime(
		hoursNow: number,
		minutesNow: number,
		bus: IRouteDto
	): void {
		for (const departure of bus.departureTime as string[]) {
			if (departure === NO_TIME) {
				continue;
			}

			const [hoursDeparture, minutesDeparture] = departure
				.split(':')
				.map(Number);

			if (
				hoursNow < hoursDeparture ||
				(hoursNow === hoursDeparture && minutesNow < minutesDeparture)
			) {
				this.nearestDepartureTimeForBuses.set(bus.id, departure);

				return;
			}
		}
	}

	public showModalNotice(): void {
		this.modalService
			.open(ModalTransportNoticeComponent, {})
			.afterClosed()
			.pipe(
				filter(Boolean),

				switchMap((transportNotify) =>
					this.apiService
						.sendTransportNote(transportNotify)
						.pipe(catchError(() => of(null)))
				),

				filter(Boolean),

				untilDestroyed(this)
			)
			.subscribe(() => {
				this.transportRefresh$.next();
			});
	}
}
