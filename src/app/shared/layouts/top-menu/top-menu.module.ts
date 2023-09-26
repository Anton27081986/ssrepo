import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {TopMenuRoutingModule} from './top-menu-routing.module';
import {TopMenuComponent} from './top-menu.component';

@NgModule({
    declarations: [TopMenuComponent],
    imports: [CommonModule, TopMenuRoutingModule],
})
export class TopMenuModule {}
