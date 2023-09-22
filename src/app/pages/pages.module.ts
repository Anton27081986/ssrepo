import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MainComponent} from './main/main.component';
import {DevComponent} from './dev/dev.component';

@NgModule({
    declarations: [MainComponent, DevComponent],
    imports: [CommonModule],
})
export class PagesModule {}
