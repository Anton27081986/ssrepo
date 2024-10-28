export interface ISamples {
	/**
	 *  Идентификатор
	 */
	id: number;
	/**
	 * Кол-во
	 */
	quantity: number | null;
	/**
	 * вес
	 */
	weight: number | null;
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
	/**
	 *  Стоимость образца, руб.
	 */
	price: number;
	/**
	 *  Продажи, руб.
	 */
	sales: number;
}
