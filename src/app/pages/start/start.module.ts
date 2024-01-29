import {NgModule} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';

import {StartRoutingModule} from './start-routing.module';
import {ComponentsModule} from '@app/components/components.module';
import {MainModule} from '@app/shared/layouts/main/main.module';
import {SliderComponent} from '@app/components/slider/slider.component';
import {NzGridModule} from 'ng-zorro-antd/grid';
import {NzCarouselModule} from 'ng-zorro-antd/carousel';
import {StartComponent} from './start.component';
import {VictoryService} from '@app/components/victory/victory.service';

@NgModule({
    declarations: [StartComponent, SliderComponent],
    imports: [
        CommonModule,
        StartRoutingModule,
        MainModule,
        NzGridModule,
        NzCarouselModule,
        NgOptimizedImage,
        ComponentsModule,
    ],
    providers: [{provide: VictoryService}],
})
export class StartModule {}
