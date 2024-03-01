import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

// eslint-disable-next-line camelcase
import { NZ_I18N, ru_RU } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
// eslint-disable-next-line import/extensions
import ru from '@angular/common/locales/ru';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { JwtInterceptor } from '@app/core/interceptors/jwt.interceptor';
import { ErrorInterceptor } from '@app/core/interceptors/error.interceptor';
import { ComponentsModule } from '@app/components/components.module';
import { CoreModule } from '@app/core/core.module';
import { NzConfig, provideNzConfig } from 'ng-zorro-antd/core/config';
import { LayoutsModule } from './shared/layouts/layouts.module';
import { WrapperComponent } from './shared/layouts/wrapper/wrapper.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppInitializerProvider } from './app-initializer.service';

registerLocaleData(ru);

const ngZorroConfig: NzConfig = {
	message: { nzTop: 72 },
	notification: { nzTop: 172 },
};

@NgModule({
	declarations: [AppComponent, WrapperComponent],
	imports: [
		BrowserModule,
		AppRoutingModule,
		FormsModule,
		HttpClientModule,
		BrowserAnimationsModule,
		LayoutsModule,
		NzCardModule,
		ReactiveFormsModule,
		NzFormModule,
		NzInputModule,
		NzButtonModule,
		NzIconModule,
		ComponentsModule,
		CoreModule,
	],
	providers: [
		AppInitializerProvider,
		// eslint-disable-next-line camelcase
		{ provide: NZ_I18N, useValue: ru_RU },
		{ provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
		{ provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
		provideNzConfig(ngZorroConfig),
	],
	bootstrap: [AppComponent],
})
export class AppModule {}
