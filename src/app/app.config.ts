import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import {
	provideClientHydration,
	withEventReplay,
} from '@angular/platform-browser';
import { AppInitializerProvider } from '@app/app-initializer.service';
import {
	MAT_DATE_LOCALE,
	provideNativeDateAdapter,
} from '@angular/material/core';
import {
	HTTP_INTERCEPTORS,
	provideHttpClient,
	withInterceptorsFromDi,
} from '@angular/common/http';
import { JwtInterceptor } from '@app/core/interceptors/jwt.interceptor';
import { ErrorInterceptor } from '@app/core/interceptors/error.interceptor';
import {
	BrowserAnimationsModule,
	provideAnimations,
} from '@angular/platform-browser/animations';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
	providers: [
		// provideZoneChangeDetection({ eventCoalescing: true }),
		provideHttpClient(),
		provideRouter(routes),
		provideHttpClient(
			// DI-based interceptors must be explicitly enabled.
			withInterceptorsFromDi()
		),
		provideClientHydration(withEventReplay()),
		AppInitializerProvider,
		// eslint-disable-next-line camelcase
		{ provide: MAT_DATE_LOCALE, useValue: 'ru-RU' },
		{ provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
		{ provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
		provideAnimations(),
		importProvidersFrom(BrowserAnimationsModule),
		provideNativeDateAdapter(),
	],
};
