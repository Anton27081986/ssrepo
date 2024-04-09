import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InviteComponent } from '@app/pages/invite/invite.component';
import { InviteRoutingModule } from '@app/pages/invite/invite-routing.module';
import { CardModule } from '@app/shared/components/card/card.module';
import { HeadlineModule } from '@app/shared/components/typography/headline/headline.module';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { ButtonModule } from '@app/shared/components/buttons/button/button-module';
import { IconModule } from '@app/shared/components/icon/icon.module';

@NgModule({
	declarations: [InviteComponent],
	imports: [
		CommonModule,
		InviteRoutingModule,
		CardModule,
		HeadlineModule,
		NzIconModule,
		ButtonModule,
		IconModule,
	],
})
export class InviteModule {}
