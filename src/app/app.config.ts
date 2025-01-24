import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import {AppInitializerProvider} from "@app/app-initializer.service";
import {NZ_I18N, ru_RU} from "ng-zorro-antd/i18n";
import {MAT_DATE_LOCALE} from "@angular/material/core";
import {HTTP_INTERCEPTORS, provideHttpClient} from "@angular/common/http";
import {JwtInterceptor} from "@app/core/interceptors/jwt.interceptor";
import {ErrorInterceptor} from "@app/core/interceptors/error.interceptor";
import {provideNzConfig} from "ng-zorro-antd/core/config";
import {provideAnimations} from "@angular/platform-browser/animations";
import {NzConfig} from "ng-zorro-antd/core/config";

const ngZorroConfig: NzConfig = {
	message: { nzTop: 72 },
	notification: { nzTop: 172 },
};

export const appConfig: ApplicationConfig = {
	providers: [
		// provideZoneChangeDetection({ eventCoalescing: true }),
		provideHttpClient(),
		provideRouter(routes),
		provideClientHydration(withEventReplay()),
		AppInitializerProvider,
		// eslint-disable-next-line camelcase
		{ provide: NZ_I18N, useValue: ru_RU },
		{ provide: MAT_DATE_LOCALE, useValue: 'ru-RU' },
		{ provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
		{ provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
		provideNzConfig(ngZorroConfig),
		provideAnimations(),]
};
