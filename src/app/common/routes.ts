export class AppRoutes {
	public static root = '';
	public static signIn = 'sign-in';
	public static signUp = 'sign-up';
	public static forgotPassword = 'forgot-password';
	public static resetPassword = 'reset-password';

	public static start = 'start';

	public static subRoot(route: string): string {
		return `/${route}`;
	}
}
