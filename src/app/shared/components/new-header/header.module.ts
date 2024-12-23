import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { RouterLink } from '@angular/router';
import { ComponentsModule } from '@app/components/components.module';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { FlyMenuDirective } from '@app/shared/components/new-header/fly-menu.directive';
import { IconModule } from '@app/shared/components/icon/icon.module';
import { TextModule } from '@app/shared/components/typography/text/text.module';
import { AvatarModule } from '@app/shared/components/avatar/avatar.module';
import { SearchInputModule } from '@app/shared/components/inputs/search-input/search-input.module';
import { ButtonModule } from '@app/shared/components/buttons/button/button-module';
import { TooltipModule } from '@app/shared/components/tooltip/tooltip.module';
import { ButtonComponent } from '@front-components/components';
import { HeaderComponent } from './header.component';

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
		IconModule,
		TextModule,
		AvatarModule,
		SearchInputModule,
		ButtonModule,
		TooltipModule,
		ButtonComponent,
	],
	exports: [HeaderComponent, FlyMenuDirective],
})
export class HeaderModule {}
