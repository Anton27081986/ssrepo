import {NgModule} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {RouterLink, RouterOutlet} from '@angular/router';
import {NzIconModule} from 'ng-zorro-antd/icon';
import {NzLayoutModule} from 'ng-zorro-antd/layout';
import {NzMenuModule} from 'ng-zorro-antd/menu';
import {NzBreadCrumbModule} from 'ng-zorro-antd/breadcrumb';
import {NzDrawerModule} from 'ng-zorro-antd/drawer';
import {NzGridModule} from 'ng-zorro-antd/grid';
import {NzDropDownModule} from 'ng-zorro-antd/dropdown';
import {NzBadgeModule} from 'ng-zorro-antd/badge';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {NzListModule} from 'ng-zorro-antd/list';
import {NzAvatarModule} from 'ng-zorro-antd/avatar';
import {NgScrollbarModule} from 'ngx-scrollbar';
import {IconsProviderModule} from '@app/icons-provider.module';
import {MainComponent} from './main.component';
import {NzCarouselModule} from 'ng-zorro-antd/carousel';
import {FooterComponent} from '@app/shared/layouts/main/footer/footer.component';
import {HeaderComponent} from '@app/shared/layouts/main/header/header.component';
import {PagesModule} from '@app/pages/pages.module';
import {ComponentsModule} from '@app/components/components.module';

@NgModule({
    declarations: [MainComponent, HeaderComponent, FooterComponent, HeaderComponent],
    imports: [
        CommonModule,
        NzIconModule,
        NzLayoutModule,
        NzMenuModule,
        RouterLink,
        RouterOutlet,
        NzBreadCrumbModule,
        NzDrawerModule,
        NzGridModule,
        NzDropDownModule,
        NzBadgeModule,
        NzButtonModule,
        NzListModule,
        NzAvatarModule,
        NgScrollbarModule,
        IconsProviderModule,
        NgOptimizedImage,
        NzCarouselModule,
        PagesModule,
        ComponentsModule,
    ],
    exports: [],
})
export class MainModule {}
