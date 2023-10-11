import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

// eslint-disable-next-line camelcase
import {NZ_I18N, ru_RU} from 'ng-zorro-antd/i18n';
import {registerLocaleData} from '@angular/common';
// eslint-disable-next-line import/extensions
import ru from '@angular/common/locales/ru';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NzCardModule} from 'ng-zorro-antd/card';
import {NzFormModule} from 'ng-zorro-antd/form';
import {NzInputModule} from 'ng-zorro-antd/input';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {NzIconModule} from 'ng-zorro-antd/icon';
import {AuthModule} from '@auth/auth.module';
import {SignInComponent} from '@auth/sign-in/sign-in.component';
import {JwtInterceptor} from '@app/helpers/jwt.interceptor';
import {fakeBackendProvider} from '@app/helpers/fake-backend';
import {ErrorInterceptor} from '@app/core/error.interceptor';
import {LayoutsModule} from './shared/layouts/layouts.module';
import {WrapperComponent} from './shared/layouts/wrapper/wrapper.component';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';

registerLocaleData(ru);

@NgModule({
    declarations: [AppComponent, WrapperComponent, SignInComponent],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        HttpClientModule,
        BrowserAnimationsModule,
        LayoutsModule,
        AuthModule,
        NzCardModule,
        ReactiveFormsModule,
        NzFormModule,
        NzInputModule,
        NzButtonModule,
        NzIconModule,
    ],
    providers: [
        // eslint-disable-next-line camelcase
        {provide: NZ_I18N, useValue: ru_RU},
        {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
        {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
        fakeBackendProvider,
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
