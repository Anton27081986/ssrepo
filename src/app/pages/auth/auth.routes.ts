import { Routes } from '@angular/router';
import { AppRoutes } from '@app/common/routes';
import { AuthComponent } from './auth.component';

/**
 * Роуты для модуля "Аутентификация"
 *
 * Структура модуля:
 * - Основной компонент аутентификации (AuthComponent) - контейнер для auth форм
 * - Вход в систему (SignInComponent) - форма входа с логином и паролем
 * - Забыли пароль (ForgotPasswordComponent) - форма восстановления пароля
 * - Сброс пароля (ResetPasswordComponent) - форма установки нового пароля
 *
 * URL структура:
 * /auth/sign-in - Форма входа в систему (по умолчанию)
 * /auth/forgot-password - Форма восстановления пароля
 * /auth/reset-password - Форма сброса пароля
 *
 * Модуль включает:
 * - Аутентификацию пользователей
 * - Восстановление забытых паролей
 * - Сброс паролей по токену
 * - Валидацию форм и обработку ошибок
 * - Перенаправления после успешной аутентификации
 *
 * Все компоненты загружаются через lazy loading для оптимизации производительности
 * Модуль не требует авторизации (доступен для неавторизованных пользователей)
 */
export const AUTH_ROUTES: Routes = [
	{
		path: '',
		component: AuthComponent,
		data: {
			animation: 'animation',
		},
		children: [
			{
				path: AppRoutes.signIn,
				loadComponent: async () =>
					import('./sign-in/sign-in.component').then(
						(c) => c.SignInComponent
					),
				pathMatch: 'full',
				title: 'Вход в систему',
			},
			{
				path: AppRoutes.forgotPassword,
				loadComponent: async () =>
					import('./forgot-password/forgot-password.component').then(
						(c) => c.ForgotPasswordComponent
					),
				pathMatch: 'full',
				title: 'Восстановление пароля',
			},
			{
				path: AppRoutes.resetPassword,
				loadComponent: async () =>
					import('./reset-password/reset-password.component').then(
						(c) => c.ResetPasswordComponent
					),
				pathMatch: 'full',
				title: 'Сброс пароля',
			},
			// Редирект на sign-in по умолчанию
			{
				path: '**',
				redirectTo: AppRoutes.signIn,
			},
		],
	},
];
