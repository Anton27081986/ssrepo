import { IFilter } from '@app/shared/components/filters/filters.component';
import { MpReservationFilter } from '@app/core/models/mp-reservation-orders/mp-reservation-orders-filter';

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
				preparedFilter[filter.name] = null;
				continue;
			}

			switch (filter.type) {
				case 'search-select':
					preparedFilter[filter.name] =
						this.processSearchSelectFilter(filter.value);
					break;

				case 'date-range':
					this.processDateRangeFilter(filter, preparedFilter);
					break;

				case 'number':
				case 'int-number':
					preparedFilter[filter.name] = this.processNumericFilter(
						filter.value as NumericFilterValue
					);
					break;

				default:
					preparedFilter[filter.name] = this.processDefaultFilter(
						filter.value
					);
			}
		}

		return preparedFilter;
	}

	private static processSearchSelectFilter(
		value: FilterValue
	): number[] | null {
		return Array.isArray(value) ? value.map((item) => item.id) : null;
	}

	private static processDateRangeFilter(
		filter: IFilter,
		preparedFilter: MpReservationFilter
	): void {
		if (typeof filter.value !== 'string') {
			return;
		}

		const [fromDateStr, toDateStr] = filter.value.split('-');
		const [fromField, toField] = filter.name.split('-');

		if (fromDateStr) {
			const fromParts = fromDateStr.split('.');

			if (fromParts.length === 3) {
				preparedFilter[fromField] = this.formatDateToISO(
					fromParts,
					true
				);
			}
		}

		if (toDateStr) {
			const toParts = toDateStr.split('.');

			if (toParts.length === 3) {
				preparedFilter[toField] = this.formatDateToISO(toParts, false);
			}
		}
	}

	private static formatDateToISO(
		dateParts: string[],
		isStartOfDay: boolean
	): string {
		const [day, month, year] = dateParts;
		const time = isStartOfDay ? '00:00:00.000Z' : '23:59:59.999Z';

		return `${year}-${month}-${parseInt(day, 10).toString().padStart(2, '0')}T${time}`;
	}

	private static processNumericFilter(
		value: NumericFilterValue
	): number | null {
		if (value === null || value === undefined) {
			return null;
		}

		const numValue =
			typeof value === 'string'
				? parseFloat(value.replace(',', '.'))
				: value;

		return Number.isNaN(numValue) ? null : numValue;
	}

	private static processDefaultFilter(value: FilterValue): string | null {
		return value?.toString().replace(',', '.') || null;
	}
} 