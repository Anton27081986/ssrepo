import { NgModule } from '@angular/core';
import { AvatarComponent } from '@app/shared/components/avatar/avatar.component';
import { IconModule } from '@app/shared/components/icon/icon.module';
import { NgIf } from '@angular/common';

@NgModule({
	declarations: [AvatarComponent],
	exports: [AvatarComponent],
	imports: [IconModule, NgIf],
})
export class AvatarModule {}
