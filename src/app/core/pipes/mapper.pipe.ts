import type { PipeTransform } from '@angular/core';
import { Pipe } from '@angular/core';
import { Mapper } from '@app/core/models/mapper';

@Pipe({
	standalone: true,
	name: 'mapper',
})
export class MapperPipe implements PipeTransform {
	/**
	 * Maps object to an arbitrary result through a mapper function
	 *
	 * @param value an item to transform
	 * @param mapper a mapping function
	 * @param args arbitrary number of additional arguments
	 */
	public transform<T extends unknown[], U, G>(
		value: U,
		mapper: Mapper<[U, ...T], G>,
		...args: T
	): G {
		return mapper(value, ...args);
	}
}
