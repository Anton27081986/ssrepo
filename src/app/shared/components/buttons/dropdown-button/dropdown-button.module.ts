import { NgModule } from '@angular/core';
import { DropdownButtonComponent } from '@app/shared/components/buttons/dropdown-button/dropdown-button.component';
import { ButtonModule } from '@app/shared/components/buttons/button/button-module';
import { IconModule } from '@app/shared/components/icon/icon.module';
import { CardModule } from '@app/shared/components/card/card.module';
import { NgIf } from '@angular/common';
import { ButtonComponent } from '@front-components/components';

@NgModule({
	declarations: [DropdownButtonComponent],
	exports: [DropdownButtonComponent],
	imports: [ButtonModule, IconModule, CardModule, NgIf, ButtonComponent],
})
export class DropdownButtonModule {}
