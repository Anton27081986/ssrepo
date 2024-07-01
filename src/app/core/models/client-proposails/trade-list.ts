export interface ITradeList {
	/**
	 *  Название
	 */
	name: string;
	/**
	 * Дата
	 */
	date: string;
	/**
	 *  Цена
	 */
	price: number;
	/**
	 *  Кол-во
	 */
	quantity: number;
	/**
	 * Сумма
	 */
	amount: number;
	/**
	 * Валюта
	 */
	currency: string;
}
