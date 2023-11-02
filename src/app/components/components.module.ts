import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
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

@NgModule({
    declarations: [SearchComponent, ResultItemComponent, MainMenuComponent, MobileMenuComponent],
    imports: [
        CommonModule,
        NzFormModule,
        NzInputModule,
        ReactiveFormsModule,
        NzIconModule,
        NzMenuModule,
        NzTabsModule,
    ],
    exports: [SearchComponent, MainMenuComponent, MobileMenuComponent],
})
export class ComponentsModule {}
