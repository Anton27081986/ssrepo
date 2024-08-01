export interface IUser {
	/** Айди пользователя */
	id?: number;
	/** Ссылка на аватарку пользователя */
	avatarUrl?: string | undefined;
	/** ФИО */
	name?: string | undefined;
	/** Фамилия */
	lastName?: string | undefined;
	/** Имя */
	firstName?: string | undefined;
	/** Отчество */
	surName?: string | undefined;
	/** Подразделение */
	department?: string | undefined;
	/** Должность */
	position?: string | undefined;
	/** На испытательном сроке */
	onProbation?: boolean;
}
