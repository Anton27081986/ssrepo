export interface ITransport {
	canAddNotification: boolean;
	transportList: Array<{
		id: number;
		startRoute: string;
		endRoute: string;
		departureTime: string[];
	}>;
	transportNotify: {
		id: number;
		authorId: number;
		dFrom: string;
		dTo: string;
		note: string;
	};
}
