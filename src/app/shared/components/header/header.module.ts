import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { HeaderComponent } from '@app/shared/components/header/header.component';
import { FlyMenuDirective } from '@app/shared/components/header/fly-menu.directive';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { RouterLink } from '@angular/router';
import { ComponentsModule } from '@app/components/components.module';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';

@NgModule({
	declarations: [HeaderComponent, FlyMenuDirective],
	imports: [
		CommonModule,
		NzLayoutModule,
		RouterLink,
		ComponentsModule,
		NzDropDownModule,
		NgOptimizedImage,
		NzIconModule,
	],
	exports: [HeaderComponent, FlyMenuDirective],
})
export class HeaderModule {}
