import { IFilter } from '@app/shared/components/filters/filters.component';
import { MpReservationFilter } from '@app/core/models/mp-reservation-orders/mp-reservation-orders-filter';
import { SafeNumberConversion } from './safe-number-conversion.util';

type FilterValue = string | number | Array<{ id: number }> | null | undefined;

type NumericFilterValue = string | number | null | undefined;

export class FilterBuilder {
	/**
	 * Строит объект фильтра для MP Reservation Orders на основе конфигурации фильтров
	 */
	public static buildMpReservationFilter(
		filters: IFilter[],
		pagination: { limit: number; offset: number }
	): MpReservationFilter {
		const preparedFilter: MpReservationFilter = {
			limit: pagination.limit,
			offset: pagination.offset,
		};

		for (const filter of filters) {
			if (!filter.value || !filter.type) {
				continue;
			}

			switch (filter.name) {
				case 'personificationId':
					preparedFilter.personificationId =
						this.processNumericFilter(
							filter.value as NumericFilterValue
						);
					break;

				case 'authorId':
					preparedFilter.authorIds =
						this.processSearchSelectArrayFilter(filter.value);
					break;

				case 'tovId':
					preparedFilter.tovIds = this.processSearchSelectArrayFilter(
						filter.value
					);
					break;

				case 'managerId':
					preparedFilter.managerIds =
						this.processSearchSelectArrayFilter(filter.value);
					break;

				case 'statusId':
					preparedFilter.statusIds =
						this.processSearchSelectArrayFilter(filter.value);
					break;

				case 'clientId':
					preparedFilter.clientIds =
						this.processSearchSelectArrayFilter(filter.value);
					break;

				case 'dateCreatedFrom-dateCreatedTo':
					this.processDateRangeFilterForMpReservation(
						filter,
						preparedFilter
					);
					break;

				default:
					// Handle any other filters by their name directly
					if (filter.type === 'search-select') {
						const key = filter.name as keyof MpReservationFilter;

						// eslint-disable-next-line @typescript-eslint/no-explicit-any
						(preparedFilter as any)[key] =
							this.processSearchSelectArrayFilter(filter.value);
					} else if (
						filter.type === 'number' ||
						filter.type === 'int-number'
					) {
						const key = filter.name as keyof MpReservationFilter;

						// eslint-disable-next-line @typescript-eslint/no-explicit-any
						(preparedFilter as any)[key] =
							this.processNumericFilter(
								filter.value as NumericFilterValue
							);
					}
			}
		}

		return preparedFilter;
	}

	private static processSearchSelectFilter(
		value: FilterValue
	): number | null {
		if (Array.isArray(value) && value.length > 0) {
			return SafeNumberConversion.toId(value[0].id, {
				fieldName: 'searchSelectFilter',
				required: false,
			});
		}

		return null;
	}

	private static processSearchSelectArrayFilter(
		value: FilterValue
	): number[] | undefined {
		if (Array.isArray(value) && value.length > 0) {
			return value.map((item) =>
				SafeNumberConversion.toId(item.id, {
					fieldName: 'searchSelectArrayFilter',
					required: false,
				})
			);
		}

		return undefined;
	}

	private static processDateRangeFilter(
		filter: IFilter,
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		preparedFilter: any
	): void {
		if (typeof filter.value === 'string') {
			const [fromDate, toDate] = filter.value.split('-');
			const [fromName, toName] = filter.name.split('-');

			if (fromDate && fromName) {
				preparedFilter[fromName] = this.formatDateForApi(
					fromDate.trim()
				);
			}

			if (toDate && toName) {
				preparedFilter[toName] = this.formatDateForApi(
					toDate.trim(),
					true
				);
			}
		}
	}

	private static processDateRangeFilterForMpReservation(
		filter: IFilter,
		preparedFilter: MpReservationFilter
	): void {
		if (typeof filter.value === 'string') {
			const [fromDate, toDate] = filter.value.split('-');

			if (fromDate) {
				preparedFilter.dateFrom = this.formatDateForApi(
					fromDate.trim()
				);
			}

			if (toDate) {
				preparedFilter.dateTo = this.formatDateForApi(
					toDate.trim(),
					true
				);
			}
		}
	}

	private static formatDateForApi(
		dateString: string,
		isEndDate = false
	): string {
		const parts = dateString.split('.');

		if (parts.length === 3) {
			const [day, month, year] = parts;
			const time = isEndDate ? 'T23:59:59.999Z' : 'T00:00:00.000Z';

			return `${year}-${month.padStart(2, '0')}-${day.padStart(
				2,
				'0'
			)}${time}`;
		}

		return dateString;
	}

	private static processNumericFilter(
		value: NumericFilterValue
	): number | undefined {
		if (value === null || value === undefined) {
			return undefined;
		}

		return SafeNumberConversion.toNumber(value, {
			fieldName: 'numericFilter',
			defaultValue: undefined,
			throwOnError: false,
		});
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	private static processDefaultFilter(value: FilterValue): any {
		return value;
	}
}
