export interface IUser {
	user: {
		id: string;
		name: string;
		email: string;
	};
	refreshToken: string;
	accessToken: string;
}
