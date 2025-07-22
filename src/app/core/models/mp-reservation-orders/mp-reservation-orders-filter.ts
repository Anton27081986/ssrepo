export interface MpReservationFilter {
	personificationId?: number;
	authorId?: number;
	tovId?: number;
	managerId?: number;
	statusId?: number;
	dateCreatedFrom?: string;
	dateCreatedTo?: string;
	clientId?: number;
	limit: number;
	offset: number;
	// Индексная сигнатура для динамических полей фильтров
	[key: string]: string | number | number[] | null | undefined;
}
