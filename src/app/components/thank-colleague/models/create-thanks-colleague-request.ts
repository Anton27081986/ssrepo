export interface ICreateThanksColleagueRequest {
    /** Коллега которому говоорим спасибо */
    userId?: number;
    /** Сообщение */
    note?: string | undefined;
}
