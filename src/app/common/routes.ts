export class AppRoutes {
    static root = '';
    static signIn = 'sign-in';
    static signUp = 'sign-up';
    static forgotPassword = 'forgot-password';
    static resetPassword = 'reset-password';

    static start = 'start';

    static subRoot(route: string): string {
        return `/${route}`;
    }
}
