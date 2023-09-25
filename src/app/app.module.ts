import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

// eslint-disable-next-line camelcase
import {NZ_I18N, ru_RU} from 'ng-zorro-antd/i18n';
import {registerLocaleData} from '@angular/common';
// eslint-disable-next-line import/extensions
import ru from '@angular/common/locales/ru';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NzLayoutModule} from 'ng-zorro-antd/layout';
import {NzMenuModule} from 'ng-zorro-antd/menu';
import {IconsProviderModule} from './icons-provider.module';
import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {PagesModule} from './pages/pages.module';



registerLocaleData(ru);

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        HttpClientModule,
        BrowserAnimationsModule,
        IconsProviderModule,
        NzLayoutModule,
        NzMenuModule,
        PagesModule
    ],
    // eslint-disable-next-line camelcase
    providers: [{provide: NZ_I18N, useValue: ru_RU}],
    bootstrap: [AppComponent],
})
export class AppModule {}
