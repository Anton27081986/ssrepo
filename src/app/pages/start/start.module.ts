import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ComponentsModule } from '@app/components/components.module';
import { FullLayoutModule } from '@app/shared/layouts/full-layout/full-layout.module';
import { SliderComponent } from '@app/components/slider/slider.component';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzCarouselModule } from 'ng-zorro-antd/carousel';
import { VictoryService } from '@app/components/victory/victory.service';
import { ExchangeRatesModule } from '@app/components/exchange-rates/exchange-rates.module';
import { StartComponent } from './start.component';
import { StartRoutingModule } from './start-routing.module';

@NgModule({
	declarations: [StartComponent, SliderComponent],
	imports: [
		CommonModule,
		StartRoutingModule,
		FullLayoutModule,
		NzGridModule,
		NzCarouselModule,
		NgOptimizedImage,
		ComponentsModule,
		ExchangeRatesModule,
	],
	providers: [{ provide: VictoryService }],
})
export class StartModule {}
