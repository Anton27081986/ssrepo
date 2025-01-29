import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ComponentsModule } from '@app/components/components.module';
import { FullLayoutModule } from '@app/shared/layouts/full-layout/full-layout.module';
import { SliderComponent } from '@app/widgets/slider/slider.component';
import { NzCarouselModule } from 'ng-zorro-antd/carousel';
import { VictoryService } from '@app/components/victory/victory.service';
import { ManePageRoutingModule } from '@app/pages/main-page/mane-page-routing.module';
import { ExchangeRatesComponent } from '@app/components/exchange-rates/exchange-rates.component';
import { ThanksColleagueModule } from '@app/widgets/thank-colleague/thanks-colleague.module';
import { AddressBookModule } from '@app/widgets/address-book/address-book.module';
import { BirthdayComponent } from '@app/components/birthday/birthday.component';
import { TransportComponent } from '@app/components/transport/transport.component';
import { LoaderModule } from '@app/shared/components/loader/loader.module';
import { EmptyDataPageModule } from '@app/shared/components/empty-data-page/empty-data-page.module';
import { MainPageComponent } from './main-page.component';

@NgModule({
	declarations: [MainPageComponent, SliderComponent],
	imports: [
		CommonModule,
		FullLayoutModule,
		ManePageRoutingModule,
		NzCarouselModule,
		NgOptimizedImage,
		ComponentsModule,
		ThanksColleagueModule,
		ExchangeRatesComponent,
		AddressBookModule,
		BirthdayComponent,
		TransportComponent,
		LoaderModule,
		EmptyDataPageModule,
	],
	providers: [{ provide: VictoryService }],
})
export class MainPageModule {}
