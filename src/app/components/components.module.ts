import {NgModule} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {SearchComponent} from './search/search.component';
import {ResultItemComponent} from './search/result-item/result-item.component';
import {NzFormModule} from 'ng-zorro-antd/form';
import {NzInputModule} from 'ng-zorro-antd/input';
import {ReactiveFormsModule} from '@angular/forms';
import {NzIconModule} from 'ng-zorro-antd/icon';
import {MainMenuComponent} from './main-menu/main-menu.component';
import {NzMenuModule} from 'ng-zorro-antd/menu';
import {MobileMenuComponent} from './mobile-menu/mobile-menu.component';
import {NzTabsModule} from 'ng-zorro-antd/tabs';
import { ProfilePopupComponent } from './profile-popup/profile-popup.component';
import {NzButtonModule} from "ng-zorro-antd/button";
import {RouterLink} from "@angular/router";

@NgModule({
    declarations: [SearchComponent, ResultItemComponent, MainMenuComponent, MobileMenuComponent, ProfilePopupComponent],
    imports: [
        CommonModule,
        NzFormModule,
        NzInputModule,
        ReactiveFormsModule,
        RouterLink,
        NzIconModule,
        NzMenuModule,
        NzTabsModule,
        NzButtonModule,
        NgOptimizedImage,
    ],
    exports: [SearchComponent, MainMenuComponent, MobileMenuComponent, ProfilePopupComponent],
})
export class ComponentsModule {}
