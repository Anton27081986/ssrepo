import { NgModule } from '@angular/core';
import { LikeComponent } from '@app/shared/components/like/like.component';
import { TooltipModule } from '@app/shared/components/tooltip/tooltip.module';
import { AsyncPipe, NgForOf, NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault } from '@angular/common';
import { IconModule } from '@app/shared/components/icon/icon.module';
import { TextModule } from '@app/shared/components/typography/text/text.module';
import { UserListMoreComponent } from '@app/shared/components/like/user-list-more/user-list-more.component';
import { AvatarModule } from '@app/shared/components/avatar/avatar.module';

@NgModule({
	declarations: [LikeComponent, UserListMoreComponent],
	exports: [LikeComponent],
	imports: [
		TooltipModule,
		NgSwitch,
		IconModule,
		NgSwitchCase,
		TextModule,
		AvatarModule,
		NgIf,
		NgForOf,
		AsyncPipe,
		NgSwitchDefault,
	],
})
export class LikeModule {}
