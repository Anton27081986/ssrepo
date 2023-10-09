import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

// eslint-disable-next-line camelcase
import {NZ_I18N, ru_RU} from 'ng-zorro-antd/i18n';
import {registerLocaleData} from '@angular/common';
// eslint-disable-next-line import/extensions
import ru from '@angular/common/locales/ru';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NzCardModule} from 'ng-zorro-antd/card';
import {NzFormModule} from 'ng-zorro-antd/form';
import {NzInputModule} from 'ng-zorro-antd/input';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {NzIconModule} from 'ng-zorro-antd/icon';
import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {WrapperComponent} from './shared/layouts/wrapper/wrapper.component';
import {LayoutsModule} from './shared/layouts/layouts.module';
import {AuthModule} from './pages/auth/auth.module';
import {SignInComponent} from './pages/auth/sign-in/sign-in.component';

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
    // eslint-disable-next-line camelcase
    providers: [{provide: NZ_I18N, useValue: ru_RU}],
    bootstrap: [AppComponent],
})
export class AppModule {}
