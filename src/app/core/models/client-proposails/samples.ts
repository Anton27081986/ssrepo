export interface ISamples {
	/**
	 *  Идентификатор
	 */
	id: number;
	/**
	 * Кол-во
	 */
	quantity: number;
	/**
	 * вес
	 */
	weight: number;
	/**
	 *  Ссылка на детальную страницу
	 */
	linkToDetail: string;
	/**
	 *  Наименование ТП
	 */
	tov: {
		id: number;
		name: string;
	};
}
