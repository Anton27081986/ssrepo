/**
 * Barrel export для Auth модуля
 * 
 * Экспортирует роуты для lazy loading и основные компоненты модуля
 */

export { AUTH_ROUTES } from './auth.routes';
export { AuthComponent } from './auth.component';

// Экспорт компонентов аутентификации для использования в других частях приложения
export { SignInComponent } from './sign-in/sign-in.component';
export { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
export { ResetPasswordComponent } from './reset-password/reset-password.component';

// Экспорт моделей и типов
export * from './models/reset-password.dto';
export * from './models/role';
export * from './models/user';
export * from './types/auth-state.interface';
