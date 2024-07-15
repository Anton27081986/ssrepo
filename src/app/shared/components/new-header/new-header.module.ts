import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { RouterLink } from '@angular/router';
import { ComponentsModule } from '@app/components/components.module';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { HeaderModule } from '@app/shared/components/header/header.module';
import { FlyMenuDirective } from '@app/shared/components/new-header/fly-menu.directive';
import { IconModule } from '@app/shared/components/icon/icon.module';
import { TextModule } from '@app/shared/components/typography/text/text.module';
import { NewHeaderComponent } from './new-header.component';

@NgModule({
	declarations: [NewHeaderComponent, FlyMenuDirective],
	imports: [
		CommonModule,
		NzLayoutModule,
		RouterLink,
		ComponentsModule,
		NzDropDownModule,
		NgOptimizedImage,
		NzIconModule,
		HeaderModule,
		IconModule,
		TextModule,
	],
	exports: [NewHeaderComponent, FlyMenuDirective],
})
export class NewHeaderModule {}
